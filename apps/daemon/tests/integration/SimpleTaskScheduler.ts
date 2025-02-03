import { scheduleJob } from "node-schedule";

import { SimpleTaskExecutor } from "./SimpleTaskExecutor";

export class SimpleTaskScheduler {
    constructor(private taskExecutor: SimpleTaskExecutor) {}

    async scheduleAndAbortTask(date: Date) {
        scheduleJob(date, () => this.startTask());
    }

    async startTask() {
        const { abort } = await this.taskExecutor.executeTask();
        await abort();
    }
}
