import { ActionSynchronizer } from "../../src/ActionSynchronizer";
import { mockActions } from "../mocks/actions";
import { mockApiClient } from "../mocks/apiClient";
import { mockDatabase } from "../mocks/database";

describe("ActionSynchronizer", () => {
    let actionSynchronizer: ActionSynchronizer;
    const mockLogger = { info: jest.fn(), error: jest.fn() };

    beforeEach(() => {
        actionSynchronizer = new ActionSynchronizer(
            mockDatabase as any,
            mockApiClient as any,
            mockLogger as any,
        );
    });

    it("should synchronize actions correctly", async () => {
        mockApiClient.getActions.mockResolvedValueOnce(
            mockActions.map((action) => [action, true]),
        );
        mockDatabase.getCurrentSchedulerActions.mockResolvedValueOnce([]);

        const result = await actionSynchronizer.synchronizeActions();

        expect(result.newActions).toHaveLength(mockActions.length);
        expect(result.cancelledActions).toHaveLength(0);
        expect(mockDatabase.createActions).toHaveBeenCalledWith(mockActions);
    });

    // Add more tests for different scenarios
});
