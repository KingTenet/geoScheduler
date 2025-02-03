// SimpleTaskScheduler.test.ts
import { SimpleTaskExecutor } from "./SimpleTaskExecutor";
import { SimpleTaskScheduler } from "./SimpleTaskScheduler";

jest.mock("./SimpleTaskExecutor");

const USE_FAKE_TIMERS = true;

describe("SimpleTaskScheduler", () => {
    let simpleTaskScheduler: SimpleTaskScheduler;
    let mockSimpleTaskExecutor: jest.Mocked<SimpleTaskExecutor>;
    let mockAbort: jest.Mock;

    beforeEach(() => {
        if (USE_FAKE_TIMERS) {
            jest.useFakeTimers();
        }
        jest.clearAllMocks();

        mockAbort = jest.fn().mockResolvedValue("cheesy chips");

        mockSimpleTaskExecutor = {
            executeTask: jest.fn().mockResolvedValue({ abort: mockAbort }),
        } as unknown as jest.Mocked<SimpleTaskExecutor>;

        simpleTaskScheduler = new SimpleTaskScheduler(mockSimpleTaskExecutor);
    });

    it("should call abort when scheduling and aborting a task", async () => {
        const now = new Date();
        const startTime = new Date(now.getTime() + 1000); // 1 second from now
        const endTime = new Date(now.getTime() + 2000); // 3 seconds from now

        await simpleTaskScheduler.scheduleAndAbortTask(startTime);

        if (USE_FAKE_TIMERS) {
            jest.advanceTimersByTime(1500); // Advance to after start time
            jest.runAllTimers();
            await Promise.resolve();
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        expect(mockSimpleTaskExecutor.executeTask).toHaveBeenCalled();
        expect(mockAbort).toHaveBeenCalled();
    });
});
