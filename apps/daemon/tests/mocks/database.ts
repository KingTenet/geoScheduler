export const mockDatabase = {
    getCurrentSchedulerActions: jest.fn().mockResolvedValue([]),
    createActions: jest.fn().mockResolvedValue(undefined),
    getActionsToCancel: jest.fn().mockResolvedValue([]),
};
