import { scheduleJob } from "node-schedule";

import type { DatabaseService } from "./DatabaseService";
import type { Action, ScheduledTask } from "./interfaces";
import type { Logger } from "./Logger";
import type { TaskExecutor } from "./TaskExecutor";
import type { PrismaDaemonAction } from "./types/actions";

export class TaskScheduler {
    private scheduledTasks = new Map<string, ScheduledTask>();

    constructor(
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

    async cancelTask(actionId: string): Promise<void> {
        const task = this.scheduledTasks.get(actionId);
        if (!task) {
            return;
        }

        task.startJob.cancel();
        task.endJob.cancel();

        try {
            if (task.startJob.nextInvocation()) {
                await this.db.wontStart(task.action);
            } else if (task.endJob.nextInvocation()) {
                await this.db.wontFinish(task.action);
            } else {
                if (task.process) {
                    task.process.kill();
                }
                await this.db.finishAction(task.action);
            }
            this.scheduledTasks.delete(actionId);
        } catch (error) {
            this.logger.error(
                `Failed to cancel task for action ${actionId}`,
                error,
            );
        }
    }

    private async startTask(action: PrismaDaemonAction): Promise<void> {
        try {
            const task = this.scheduledTasks.get(action.id);
            if (!task) return;

            await this.db.startAction(action);
            task.process = await this.taskExecutor.executeTask(action);
        } catch (error) {
            this.logger.error(
                `Failed to start task for action ${action.id}`,
                error,
            );
            await this.db.failedAction(action);
        }
    }

    private async endTask(action: PrismaDaemonAction): Promise<void> {
        try {
            const task = this.scheduledTasks.get(action.id);
            if (task?.process) {
                task.process.kill();
            }
            await this.db.finishAction(action);
            this.scheduledTasks.delete(action.id);
        } catch (error) {
            this.logger.error(
                `Failed to end task for action ${action.id}`,
                error,
            );
        }
    }
}
