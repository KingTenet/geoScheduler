import { execFile } from "node:child_process";
import type { Job } from "node-schedule";
import type { ChildProcess } from "node:child_process";
import schedule from "node-schedule";

import type ApiClient from "./api/ApiClient";
import type {
    DaemonActionShouldBeExecuted,
    PrismaDaemonAction,
} from "./types/actions";
import { getDateNow } from "../../../packages/api/src/utils/common";
import {
    createActions,
    failedAction,
    finishAction,
    getActionExecStatus,
    getActionsReadyToSchedule,
    getActionsToCancel,
    getCurrentSchedulerActions,
    resetDB,
    updateActionExecStatus,
    wontFinishAction,
    wontStartActions,
} from "./ActionDBQueries";
import { getNewThings, promiseTimeout } from "./common";

async function promiseProc(
    scriptName: string,
    scriptArgs: string[],
    onProcessStarted: (childProcessDetails: ChildProcessDetails) => void,
    onFinished: () => void,
    onAborted: () => Promise<void>,
) {
    return new Promise((resolve, reject) => {
        const childProcessDetails = exec(
            scriptName,
            scriptArgs,
            () => resolve(onFinished()),
            () => resolve(onAborted()),
            (error: Error) => reject(error),
        );
        onProcessStarted(childProcessDetails);
    });
}

function exec(
    scriptName: string,
    scriptArgs: string[],
    onFinished: () => void,
    onAborted: () => void,
    onError: (error: Error) => void,
): ChildProcessDetails {
    const abortController = new AbortController();
    const childProcess = execFile(
        scriptName,
        scriptArgs,
        {
            signal: abortController.signal,
        },
        (error, stdout, stderr) => {
            console.log(`Child process: ${childProcess.pid} has terminated`);

            if (stderr) {
                console.log(stderr);
            }

            if (stdout) {
                console.log(stdout);
            }

            if (!error) {
                onFinished();
            }

            if (error?.code === "ABORT_ERR") {
                onAborted();
                return;
            }

            console.error(error);
            onError(new Error(error?.message));
        },
    );
    return {
        proc: childProcess,
        abortController,
    };
}

type PromiseDameonActionsFn = () => Promise<DaemonActionShouldBeExecuted[]>;
interface ChildProcessDetails {
    proc: ChildProcess;
    abortController: AbortController;
}

interface JobDetails {
    action: PrismaDaemonAction;
    startJob: JobHandler;
    endJob: JobHandler;
    childProcess?: ChildProcessDetails;
}

class JobHandler {
    jobSchedule: Job;
    wasStarted: boolean;
    isRunning: boolean;

    constructor(startDate: Date, callback: (...args: any[]) => Promise<void>) {
        this.wasStarted = false;
        this.isRunning = false;
        this.jobSchedule = schedule.scheduleJob(startDate, async (...args) => {
            this.wasStarted = true;
            this.isRunning = true;
            const result = await callback(...args);
            this.isRunning = false;
            return result;
        });
    }

    cancel() {
        schedule.cancelJob(this.jobSchedule);
    }
}

class Jobs {
    jobs: Map<string, JobDetails>;

    constructor() {
        this.jobs = new Map();
    }

    add(
        action: PrismaDaemonAction,
        onStartJobStarted: (action: PrismaDaemonAction) => Promise<void>,
        onEndJobStarted: (action: PrismaDaemonAction) => Promise<void>,
    ) {
        if (this.jobs.has(action.id)) {
            return;
        }

        const startJob = new JobHandler(
            action.fromDate,
            onStartJobStarted.bind(this, action),
        );
        const endJob = new JobHandler(
            action.toDate,
            onEndJobStarted.bind(this, action),
        );
        this.jobs.set(action.id, {
            action,
            startJob,
            endJob,
        });
    }

    delete(action: PrismaDaemonAction) {
        this.jobs.delete(action.id);
    }

    cancelAll(action: PrismaDaemonAction) {
        const job = this.getDetails(action.id);
        job.startJob.cancel();
        job.endJob.cancel();
    }

    getDetails(actionId: string): JobDetails {
        const jobDetails = this.jobs.get(actionId);
        if (!jobDetails) {
            throw new Error(
                "Failed to get job details for action: " + actionId,
            );
        }
        return jobDetails;
    }

    isRunning(action: PrismaDaemonAction) {
        const job = this.getDetails(action.id);
        return Boolean(job.childProcess?.proc.pid);
    }

    stopProcess(action: PrismaDaemonAction) {
        const job = this.getDetails(action.id);
        if (job.childProcess?.abortController) {
            job.childProcess.abortController.abort();
        }
    }

    attachProcess(
        action: PrismaDaemonAction,
        childProcess: ChildProcessDetails,
    ) {
        this.jobs.set(action.id, {
            ...this.getDetails(action.id),
            childProcess,
        });
    }

    replaceStartSchedule(
        action: PrismaDaemonAction,
        newStartTime: Date,
        newStartJobSchedule: (action: PrismaDaemonAction) => Promise<void>,
    ) {
        const job = this.getDetails(action.id);
        if (job.endJob.wasStarted) {
            return;
        }

        job.startJob.cancel();
        job.startJob = new JobHandler(
            newStartTime,
            newStartJobSchedule.bind(this, action),
        );
    }
}

export class ScheduleState {
    getAllActions: PromiseDameonActionsFn;
    shouldBeExecutedIds: PrismaDaemonAction["id"][];
    jobs: Jobs;

    /***
     Upon daemon process startup assume no actions running and therefore assume DB may be inconsistent (`STARTED` actions are not running)
        - update where `executionStatus` = `STARTED`
        - if `endDate` in past, set `executionStatus` = `WONT_FINISH`
        - else set `executionStatus` = `NULL`
     */
    constructor(getAllActions: PromiseDameonActionsFn) {
        this.getAllActions = getAllActions;
        this.shouldBeExecutedIds = [];
        this.jobs = new Jobs();
    }

    async resetDB() {
        await resetDB();
    }

    /**
    Pull new actions and update DB
        - add all new actions to daemonDB
        - pull to get local state, actions with truthy `shouldBeExecuted` and:
        - if `executionStatus` = `NULL`, set `executionStatus` = `WONT_START` (**AVOID SCHEDULER RACE:** Ensure DB update is conditional on `executionStatus`=`NULL`)
        - if `executionStatus` = `STARTED`, attempt to stop action, set `executionStatus` = `WONT_FINISH` if successfully stopped, else do nothing
        - if `executionStatus` is (`WONT_START` or `WONT_FINISH` or `FINISHED` or `FAILED`)
        - Add all actions to scheduler if `executionStatus`=`NULL`
     * 
     */
    async syncLatestActions() {
        const allActions = await this.getAllActions();

        const existingActions = await getCurrentSchedulerActions();

        await createActions(
            getNewThings(
                existingActions,
                allActions.map(([action]) => action),
                ({ id }) => id,
            ),
        );

        this.shouldBeExecutedIds = allActions
            .filter(([_action, shouldBeExecuted]) => shouldBeExecuted)
            .map(([{ id }]) => id);
    }

    async wontStartActions() {
        // Actions that are not running
        await wontStartActions(this.shouldBeExecutedIds);
    }

    async getActionsToCancel(): Promise<PrismaDaemonAction[]> {
        return getActionsToCancel(this.shouldBeExecutedIds);
    }

    async getActionsReadyToSchedule(): Promise<PrismaDaemonAction[]> {
        return getActionsReadyToSchedule(this.shouldBeExecutedIds);
    }

    async handlePendingActions() {
        // Cancel running actions that should no longer be run
        for (const actionToCancel of await this.getActionsToCancel()) {
            await this.cancelAction(actionToCancel);
        }

        // Schedule actions
        for (const actionToSchedule of await this.getActionsReadyToSchedule()) {
            this.scheduleAction(actionToSchedule);
        }
    }

    /**
     * Trigger cancellation for a possibly running action.
     * Scheduled start/end jobs may or may not exist
     * Child process may or may not exist and be running
     * @param action - action to cancel
     * @returns
     */
    async cancelAction(action: PrismaDaemonAction) {
        if (this.jobs.isRunning(action)) {
            this.jobs.stopProcess(action);
            return;
        }
        return this.onProcessAborted(action);
    }

    async onProcessAborted(action: PrismaDaemonAction) {
        console.log(`Child process was aborted`);
        this.jobs.cancelAll(action);
        if (getDateNow() >= action.toDate) {
            await finishAction(action);
        } else {
            await wontFinishAction(action);
        }
        this.jobs.delete(action);
    }

    // TODO - handle "keep-alive" processes better
    onProcessFinished(action: PrismaDaemonAction) {
        console.log(`Child process finished`);
        // TODO - for now just rescheduling processes 10 seconds after completion
        this.rescheduleAction(action, new Date(getDateNow().getTime() + 10000));
    }

    onProcessStarted(
        action: PrismaDaemonAction,
        childProcessDetails: ChildProcessDetails,
    ) {
        this.jobs.attachProcess(action, childProcessDetails);
    }

    async onStartJobStarted(action: PrismaDaemonAction): Promise<void> {
        const execStatus = await getActionExecStatus(action.id);
        if (execStatus !== null) {
            console.log(`Action: ${action.id} is no longer executable`);
            return;
        }

        const promiseExec = promiseProc(
            "node",
            ["./scripts/saySomething.js", "split", action.appNames.join(",")],
            (proc) => this.onProcessStarted(action, proc),
            () => this.onProcessFinished(action),
            () => this.onProcessAborted(action),
        );

        await updateActionExecStatus(action.id, "STARTED");

        try {
            await promiseExec;
        } catch (error) {
            console.error(`Execution failed for action: ${action.id}`);
            console.error(error);
            await failedAction(action);
        }
    }

    scheduleAction(action: PrismaDaemonAction) {
        this.jobs.add(
            action,
            (action: PrismaDaemonAction) => this.onStartJobStarted(action),
            (action: PrismaDaemonAction) => this.cancelAction(action),
        );
    }

    rescheduleAction(action: PrismaDaemonAction, rescheduleTime: Date) {
        // Don't reschedule if later than end time
        if (rescheduleTime >= action.toDate) {
            return;
        }

        this.jobs.replaceStartSchedule(
            action,
            rescheduleTime,
            (action: PrismaDaemonAction) => this.onStartJobStarted(action),
        );
    }
}

const POLL_INTERVAL = 10000; // 10 seconds
export class ScheduleHandler {
    stopped: boolean;
    scheduleState: ScheduleState;

    constructor(apiClient: ApiClient) {
        this.scheduleState = new ScheduleState(() => apiClient.getActions());
        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    async start() {
        await this.scheduleState.resetDB();
        while (!this.stopped) {
            await this.scheduleState.syncLatestActions();
            await promiseTimeout(POLL_INTERVAL);
        }
    }
}
