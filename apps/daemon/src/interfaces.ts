import type { ChildProcess } from "child_process";
import type { Job } from "node-schedule";

import { PrismaDaemonAction } from "./types/actions";

// import { PrismaDaemonAction } from "./types/actions";

// type Blah = {
//     id: string;
//     appNames: string[];
//     executionStatus: PrismaDaemonAction["executionStatus"];
//     fromDate: Date;
//     toDate: Date;
// };

export interface Action {
    id: string;
    type: string;
    config: Record<string, any>;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "FAILED";
}

export interface ActionExecutionConfig {
    script: string;
    args: string[];
}

export interface ScheduledTask {
    action: PrismaDaemonAction;
    startJob: Job;
    endJob: Job;
    process?: ChildProcess;
}
