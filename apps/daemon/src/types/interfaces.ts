import type { ChildProcess } from "child_process";
import type { Job } from "node-schedule";
import type z from "zod";

import type { DaemonAction } from "@GeoScheduler/daemonDB";
import type { actionPayloadSchema } from "@GeoScheduler/validators";

export type ApiAction = z.infer<typeof actionPayloadSchema>;
export type { DaemonAction };

export interface ActionExecutionConfig {
    script: string;
    args: string[];
}

export interface ScheduledTask {
    action: DaemonAction;
    startJob: Job;
    endJob: Job;
    process?: ChildProcess;
    abort?: () => Promise<void>;
    exit?: Promise<void>;
}
