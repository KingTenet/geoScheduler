import { DaemonAction } from "@GeoScheduler/daemonDB";

import { ConfigurationManager } from "../../src/ConfigurationManager";
import { DatabaseService } from "../../src/DatabaseService";
import { Logger } from "../../src/Logger";
import { TaskExecutor } from "../../src/TaskExecutor";
import { TaskScheduler } from "../../src/TaskScheduler";

jest.mock("../../src/TaskExecutor");
jest.mock("../../src/DatabaseService");
jest.mock("../../src/ConfigurationManager");
jest.mock("../../src/Logger");

async function flushJestTimers(timer, flushCount = 10) {
    const flush = async (n = flushCount) => {
        while (n) {
            await Promise.resolve();
            n = n - 1;
        }
    };

    await flush();
    jest.advanceTimersByTime(timer);
    await flush();
    // jest.runAllTimers();
    await flush();
}

function getTimers() {
    const now = new Date();

    return {
        startedAt: now.getTime(),
        advance: async (advanceBy) => {
            await flushJestTimers(advanceBy);
            console.log(
                `Advanced by ${advanceBy} to elapsed: ${new Date().getTime() - now.getTime()}`,
            );
        },
    };
}

describe("TaskScheduler Integration Tests", () => {
    let taskScheduler: TaskScheduler;
    let mockTaskExecutor: jest.Mocked<TaskExecutor>;
    let mockDatabaseService: jest.Mocked<DatabaseService>;
    let mockConfigManager: jest.Mocked<ConfigurationManager>;
    let mockLogger: jest.Mocked<Logger>;

    let executeTask: jest.Mock;
    let mockAbort: jest.Mock;
    let attemptAbortProcess: jest.Mock;
    let endTask: jest.Mock;
    let cancelTask: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();

        mockConfigManager = new ConfigurationManager();
        mockLogger = new Logger(mockConfigManager);
        mockDatabaseService = new DatabaseService(mockLogger);

        attemptAbortProcess = jest.spyOn(
            TaskScheduler.prototype,
            "attemptAbortProcess",
        );

        endTask = jest.spyOn(TaskScheduler.prototype, "endTask");
        cancelTask = jest.spyOn(TaskScheduler.prototype, "cancelTask");

        mockAbort = jest.fn().mockResolvedValue(undefined);
        executeTask = jest
            .spyOn(TaskExecutor.prototype, "executeTask")
            .mockImplementation(() => ({
                process: { exitCode: null },
                abort: mockAbort,
                exit: Promise.resolve(),
            }));

        mockTaskExecutor = new TaskExecutor(mockConfigManager, mockLogger);

        taskScheduler = new TaskScheduler(
            mockConfigManager,
            mockTaskExecutor,
            mockDatabaseService,
            mockLogger,
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should start a task at the scheduled start time", async () => {
        const timers = getTimers();
        const startTime = new Date(timers.startedAt + 1000);
        const endTime = new Date(timers.startedAt + 2000);

        const action: DaemonAction = {
            id: "1",
            appNames: ["TestApp"],
            fromDate: startTime,
            toDate: endTime,
            executionStatus: null,
        };

        taskScheduler.scheduleTask(action);

        await timers.advance(999);
        expect(executeTask).not.toHaveBeenCalled();

        await timers.advance(2);

        expect(mockDatabaseService.startAction).toHaveBeenCalledWith(action);
        expect(executeTask).toHaveBeenCalledWith(action);
        expect(mockDatabaseService.startAction).toHaveBeenCalledTimes(1);
        expect(executeTask).toHaveBeenCalledTimes(1);
    });

    it("should end a task at the scheduled end time", async () => {
        const timers = getTimers();
        const startTime = new Date(timers.startedAt + 1000);
        const endTime = new Date(timers.startedAt + 2000);

        const action: DaemonAction = {
            id: "1",
            appNames: ["TestApp"],
            fromDate: startTime,
            toDate: endTime,
            executionStatus: null,
        };

        taskScheduler.scheduleTask(action);

        await timers.advance(199);
        expect(executeTask).toHaveBeenCalled();
        expect(endTask).not.toHaveBeenCalled();
        expect(mockDatabaseService.finishAction).not.toHaveBeenCalledWith(
            action,
        );

        await timers.advance(2);
        expect(endTask).toHaveBeenCalled();
        expect(attemptAbortProcess).not.toHaveBeenCalled();
        expect(mockAbort).not.toHaveBeenCalled();
    });

    it("should abort a running task if cancelled after start time but before end time", async () => {
        const timers = getTimers();
        const startTime = new Date(timers.startedAt + 1000);
        const endTime = new Date(timers.startedAt + 2000);

        const action: DaemonAction = {
            id: "1",
            appNames: ["TestApp"],
            fromDate: startTime,
            toDate: endTime,
            executionStatus: null,
        };

        taskScheduler.scheduleTask(action);

        await timers.advance(1010);
        expect(mockDatabaseService.wontFinish).not.toHaveBeenCalledWith(action);
        expect(attemptAbortProcess).not.toHaveBeenCalled();
        expect(mockAbort).not.toHaveBeenCalled();
        expect(cancelTask).not.toHaveBeenCalled();

        await taskScheduler.cancelTask(action.id);

        expect(endTask).not.toHaveBeenCalled();
        expect(mockDatabaseService.wontFinish).toHaveBeenCalledWith(action);
        expect(attemptAbortProcess).toHaveBeenCalled();
        expect(mockAbort).toHaveBeenCalled();
    });
});
