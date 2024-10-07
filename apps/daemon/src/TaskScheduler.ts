import { scheduleJob } from "node-schedule";

import { MS_IN_SECOND, SECONDS_IN_MINUTE } from "@GeoScheduler/validators";

import type { ConfigurationManager } from "./ConfigurationManager";
import type { DatabaseService } from "./DatabaseService";
import type { ScheduledTask } from "./interfaces";
import type { Logger } from "./Logger";
import type { TaskExecutor } from "./TaskExecutor";
import type { PrismaDaemonAction } from "./types/actions";
import { getDateNow } from "../../../packages/api/src/utils/common";
import { execOrThrowOnTimeout } from "./common";

const RETRY_STOP_PROCESS_INTERVAL_MS = MS_IN_SECOND * SECONDS_IN_MINUTE;
const ABORT_PROCESS_TIMEOUT_MS = 10 * MS_IN_SECOND;
export class TaskScheduler {
    private scheduledTasks = new Map<string, ScheduledTask>();

    constructor(
        private config: ConfigurationManager,
        private taskExecutor: TaskExecutor,
        private db: DatabaseService,
        private logger: Logger,
    ) {}

    scheduleTask(action: PrismaDaemonAction): void {
        const startJob = scheduleJob(action.fromDate, () =>
            this.startTask(action),
        );
        const endJob = scheduleJob(action.toDate, () => this.endTask(action));

        this.scheduledTasks.set(action.id, { action, startJob, endJob });
    }

    private async startTask(action: PrismaDaemonAction): Promise<void> {
        try {
            const task = this.scheduledTasks.get(action.id);
            if (!task) return;

            await this.db.startAction(action);
            const { process, abort, exit } =
                await this.taskExecutor.executeTask(action);
            this.scheduledTasks.set(action.id, {
                ...task,
                process,
                abort,
                exit,
            });
        } catch (error) {
            this.logger.error(
                `Failed to start task for action ${action.id}`,
                error,
            );
            await this.db.failedAction(action);
        }
    }

    async cancelTask(actionId: string): Promise<void> {
        try {
            const task = this.scheduledTasks.get(actionId);
            if (!task) {
                return;
            }
            if (task.startJob.nextInvocation()) {
                task.startJob.cancel();
                await this.db.wontStart(task.action);
                task.endJob.cancel();
            } else if (task.endJob.nextInvocation()) {
                if (task.process?.exitCode === null && task.abort) {
                    await execOrThrowOnTimeout(
                        task.abort(),
                        ABORT_PROCESS_TIMEOUT_MS,
                    );
                }
                await this.db.wontFinish(task.action);
                task.endJob.cancel();
            }
            this.scheduledTasks.delete(actionId);
        } catch (error) {
            this.logger.error(
                `Failed to cancel task for action ${actionId}`,
                error,
            );
        }
    }

    private async endTask(action: PrismaDaemonAction): Promise<void> {
        const task = this.scheduledTasks.get(action.id);
        if (!task) {
            return;
        }

        try {
            if (task.process?.exitCode === null && task.abort) {
                await execOrThrowOnTimeout(task.abort(), 10 * MS_IN_SECOND);
            }
            await this.db.finishAction(task.action);
            this.scheduledTasks.delete(action.id);
        } catch (error) {
            this.logger.error(
                `Failed to end task for action ${action.id}`,
                error,
            );
            task.endJob = scheduleJob(
                new Date(
                    getDateNow().getTime() + RETRY_STOP_PROCESS_INTERVAL_MS,
                ),
                () => this.endTask(action),
            );
        }
    }
}
