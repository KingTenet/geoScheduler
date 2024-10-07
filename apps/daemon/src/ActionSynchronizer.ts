import type { ApiClient } from "./ApiClient";
import type { DatabaseService } from "./DatabaseService";
import type { Logger } from "./Logger";
import type { PrismaDaemonAction } from "./types/actions";
import { getNewThings } from "./common";

export class ActionSynchronizer {
    constructor(
        private db: DatabaseService,
        private apiClient: ApiClient,
        private logger: Logger,
    ) {}

    async synchronizeActions(): Promise<{
        newActions: PrismaDaemonAction[];
        cancelledActions: PrismaDaemonAction[];
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
        dbActions: PrismaDaemonAction[],
        apiActions: [PrismaDaemonAction, boolean][],
    ): PrismaDaemonAction[] {
        return getNewThings(
            dbActions,
            apiActions.map(([action]) => action),
            (action) => action.id,
        );
    }

    private identifyCancelledActions(
        apiActions: [PrismaDaemonAction, boolean][],
    ): Promise<PrismaDaemonAction[]> {
        const shouldBeExecutedIds = apiActions
            .filter(([_action, shouldBeExecuted]) => shouldBeExecuted)
            .map(([{ id }]) => id);
        return this.db.getActionsToCancel(shouldBeExecutedIds);
    }
}
