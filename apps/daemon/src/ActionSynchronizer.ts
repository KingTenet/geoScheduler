import type { ApiClient } from "./ApiClient";
import type { DatabaseService } from "./DatabaseService";
import type { Logger } from "./Logger";
import type { DaemonAction } from "./types/interfaces";
import { getNewThings } from "./common";

export class ActionSynchronizer {
    constructor(
        private db: DatabaseService,
        private apiClient: ApiClient,
        private logger: Logger,
    ) {}

    async synchronizeActions(): Promise<{
        newActions: DaemonAction[];
        cancelledActions: DaemonAction[];
    }> {
        try {
            const apiActions = await this.apiClient.getActions();
            const dbActions = await this.db.getCurrentSchedulerActions();

            const newActions = this.identifyNewActions(dbActions, apiActions);
            const cancelledActions =
                await this.identifyCancelledActions(apiActions);

            await this.db.createActions(newActions);

            return { newActions, cancelledActions };
        } catch (error) {
            this.logger.error("Failed to synchronize actions", error);
            throw error;
        }
    }

    private identifyNewActions(
        dbActions: DaemonAction[],
        apiActions: [DaemonAction, boolean][],
    ): DaemonAction[] {
        return getNewThings(
            dbActions,
            apiActions.map(([action]) => action),
            (action) => action.id,
        );
    }

    private identifyCancelledActions(
        apiActions: [DaemonAction, boolean][],
    ): Promise<DaemonAction[]> {
        const shouldBeExecutedIds = apiActions
            .filter(([_action, shouldBeExecuted]) => shouldBeExecuted)
            .map(([{ id }]) => id);
        return this.db.getActionsToCancel(shouldBeExecutedIds);
    }
}
