// DatabaseService.ts

import type { DaemonAction } from "@GeoScheduler/daemonDB";
import { db } from "@GeoScheduler/daemonDB";

import type { Logger } from "./Logger";

export class DatabaseService {
    constructor(private logger: Logger) {}

    async resetDB(): Promise<void> {
        try {
            await db.daemonAction.updateMany({
                where: {
                    executionStatus: "STARTED",
                    toDate: { lt: new Date() },
                },
                data: { executionStatus: "WONT_FINISH" },
            });

            await db.daemonAction.updateMany({
                where: { executionStatus: "STARTED" },
                data: { executionStatus: null },
            });

            this.logger.info("Database reset completed");
        } catch (error) {
            this.logger.error("Failed to reset database", error);
            throw error;
        }
    }

    async createActions(actions: Omit<DaemonAction, "id">[]): Promise<void> {
        try {
            await db.daemonAction.createMany({ data: actions });
            this.logger.info(`Created ${actions.length} new actions`);
        } catch (error) {
            this.logger.error("Failed to create new actions", error);
            throw error;
        }
    }

    async getCurrentSchedulerActions(): Promise<DaemonAction[]> {
        try {
            return await db.daemonAction.findMany();
        } catch (error) {
            this.logger.error("Failed to get current scheduler actions", error);
            throw error;
        }
    }

    async wontStart(action: DaemonAction): Promise<void> {
        try {
            await db.daemonAction.update({
                where: { id: action.id, executionStatus: null },
                data: { executionStatus: "WONT_START" },
            });
            this.logger.info(`Set action ${action.id} to WONT_START`);
        } catch (error) {
            this.logger.error("Failed to update action to WONT_START", error);
            throw error;
        }
    }

    async wontFinish(action: DaemonAction): Promise<void> {
        try {
            await db.daemonAction.update({
                where: { id: action.id, executionStatus: "STARTED" },
                data: { executionStatus: "WONT_FINISH" },
            });
            this.logger.info(`Set action ${action.id} to WONT_FINISH`);
        } catch (error) {
            this.logger.error(
                `Failed to set action ${action.id} to WONT_FINISH`,
                error,
            );
            throw error;
        }
    }

    async getActionsToCancel(
        shouldBeExecutedIds: string[],
    ): Promise<DaemonAction[]> {
        try {
            return await db.daemonAction.findMany({
                where: {
                    executionStatus: "STARTED",
                    id: { notIn: shouldBeExecutedIds },
                },
            });
        } catch (error) {
            this.logger.error("Failed to get actions to cancel", error);
            throw error;
        }
    }

    async getActionsReadyToSchedule(
        shouldBeExecutedIds: string[],
    ): Promise<DaemonAction[]> {
        try {
            return await db.daemonAction.findMany({
                where: {
                    executionStatus: null,
                    id: { in: shouldBeExecutedIds },
                },
            });
        } catch (error) {
            this.logger.error("Failed to get actions ready to schedule", error);
            throw error;
        }
    }

    async getActionExecStatus(actionId: string): Promise<string | null> {
        try {
            const action = await db.daemonAction.findUnique({
                where: { id: actionId },
                select: { executionStatus: true },
            });
            return action?.executionStatus ?? null;
        } catch (error) {
            this.logger.error(
                `Failed to get execution status for action ${actionId}`,
                error,
            );
            throw error;
        }
    }

    async startAction(action: DaemonAction): Promise<void> {
        try {
            await db.daemonAction.update({
                where: { id: action.id, executionStatus: null },
                data: { executionStatus: "FINISHED" },
            });
            this.logger.info(`Started action ${action.id}`);
        } catch (error) {
            this.logger.error(`Failed to start action ${action.id}`, error);
            throw error;
        }
    }

    async finishAction(action: DaemonAction): Promise<void> {
        try {
            await db.daemonAction.update({
                where: { id: action.id, executionStatus: "STARTED" },
                data: { executionStatus: "FINISHED" },
            });
            this.logger.info(`Finished action ${action.id}`);
        } catch (error) {
            this.logger.error(`Failed to finish action ${action.id}`, error);
            throw error;
        }
    }

    async failedAction(action: DaemonAction): Promise<void> {
        try {
            await db.daemonAction.update({
                where: { id: action.id, executionStatus: "STARTED" },
                data: { executionStatus: "FAILED" },
            });
            this.logger.info(`Set action ${action.id} to FAILED`);
        } catch (error) {
            this.logger.error(
                `Failed to set action ${action.id} to FAILED`,
                error,
            );
            throw error;
        }
    }
}
