import type { ActionSynchronizer } from "./ActionSynchronizer";
import type { ConfigurationManager } from "./ConfigurationManager";
import type { Logger } from "./Logger";
import type { TaskScheduler } from "./TaskScheduler";

export class SchedulerCore {
    private isRunning = false;

    constructor(
        private actionSynchronizer: ActionSynchronizer,
        private taskScheduler: TaskScheduler,
        private config: ConfigurationManager,
        private logger: Logger,
    ) {}

    async start(): Promise<void> {
        this.isRunning = true;
        while (this.isRunning) {
            await this.syncAndSchedule();
            await this.sleep(this.config.getSyncInterval());
        }
    }

    stop(): void {
        this.isRunning = false;
    }

    private async syncAndSchedule(): Promise<void> {
        try {
            const { newActions, cancelledActions } =
                await this.actionSynchronizer.synchronizeActions();

            for (const action of cancelledActions) {
                await this.taskScheduler.cancelTask(action.id);
            }

            for (const action of newActions) {
                this.taskScheduler.scheduleTask(action);
            }
        } catch (error) {
            this.logger.error("Failed to sync and schedule actions", error);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
