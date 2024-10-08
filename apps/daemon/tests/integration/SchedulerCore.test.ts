import { ActionSynchronizer } from "../../src/ActionSynchronizer";
import { ApiClient } from "../../src/ApiClient";
import { DatabaseService } from "../../src/DatabaseService";
import { SchedulerCore } from "../../src/SchedulerCore";
import { TaskExecutor } from "../../src/TaskExecutor";
import { TaskScheduler } from "../../src/TaskScheduler";
// import { mockApiClient } from "../mocks/apiClient";
import { mockDatabase } from "../mocks/database";

jest.mock("../../src/ActionSynchronizer");
jest.mock("../../src/ApiClient");
jest.mock("../../src/DatabaseService");
jest.mock("../../src/TaskExecutor");
jest.mock("../../src/TaskScheduler");

describe("SchedulerCore", () => {
    let schedulerCore: SchedulerCore;

    const mockConfig = { getSyncInterval: jest.fn().mockReturnValue(1000) };
    const mockLogger = { info: jest.fn(), error: jest.fn() };
    const mockDatabase = new DatabaseService(mockLogger as any);
    const mockOAuth = {
        getAccessToken: jest.fn().mockReturnValue("fakeToken"),
    };
    const mockApiClient = new ApiClient(
        mockConfig as any,
        mockOAuth as any,
        mockLogger as any,
    );

    const mockActionSynchronizer = new ActionSynchronizer(
        mockDatabase,
        mockApiClient,
        mockLogger as any,
    ) as jest.Mocked<ActionSynchronizer>;
    const mockTaskExecutor = new TaskExecutor(
        mockConfig as any,
        mockLogger as any,
    );

    const mockTaskScheduler = new TaskScheduler(
        mockConfig as any,
        mockTaskExecutor,
        mockDatabase,
        mockLogger as any,
    ) as jest.Mocked<TaskScheduler>;

    beforeEach(() => {
        schedulerCore = new SchedulerCore(
            mockActionSynchronizer,
            mockTaskScheduler,
            mockConfig as any,
            mockLogger as any,
        );
    });

    it("should start and sync actions", async () => {
        const mockNewActions = [{ id: "1" }];
        const mockCancelledActions = [{ id: "2" }];
        mockActionSynchronizer.synchronizeActions.mockResolvedValueOnce({
            newActions: mockNewActions,
            cancelledActions: mockCancelledActions,
        } as any);

        schedulerCore.start();
        await new Promise((resolve) => setTimeout(resolve, 1100)); // Wait for one sync cycle
        schedulerCore.stop();

        expect(mockActionSynchronizer.synchronizeActions).toHaveBeenCalled();
        expect(mockTaskScheduler.cancelTask).toHaveBeenCalledWith("2");
        expect(mockTaskScheduler.scheduleTask).toHaveBeenCalledWith({
            id: "1",
        });
    });

    // Add more tests for error handling, multiple sync cycles, etc.
});
