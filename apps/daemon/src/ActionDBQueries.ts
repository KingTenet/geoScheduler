import { db } from "@GeoScheduler/daemonDB";

import type { PrismaDaemonAction } from "./types/actions";

export async function getAction(actionId: string): Promise<PrismaDaemonAction> {
    try {
        const action = await db.daemonAction.findUnique({
            where: {
                id: actionId,
            },
        });
        if (!action) {
            throw new Error(`Action ${actionId} does not exist`);
        }
        return action;
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to get action:${actionId} from daemonDB`);
    }
}

export async function getActionExecStatus(
    actionId: string,
): Promise<PrismaDaemonAction["executionStatus"]> {
    const action = await getAction(actionId);
    return action.executionStatus;
}

export async function updateActionExecStatus(
    actionId: string,
    executionStatus: PrismaDaemonAction["executionStatus"],
) {
    try {
        await db.daemonAction.update({
            where: {
                id: actionId,
            },
            data: {
                executionStatus: executionStatus,
            },
        });
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to update action:${actionId} from daemonDB`);
    }
}

export async function getActionsReadyToSchedule(
    shouldBeExecutedIds: string[],
): Promise<PrismaDaemonAction[]> {
    return await db.daemonAction.findMany({
        where: {
            executionStatus: null,
            id: {
                in: shouldBeExecutedIds,
            },
        },
    });
}

export async function wontFinishAction(action: PrismaDaemonAction) {
    await db.daemonAction.update({
        data: {
            executionStatus: "WONT_FINISH",
        },
        where: {
            executionStatus: "STARTED",
            id: action.id,
        },
    });
}

export async function finishAction(action: PrismaDaemonAction) {
    await db.daemonAction.update({
        data: {
            executionStatus: "FINISHED",
        },
        where: {
            executionStatus: "STARTED",
            id: action.id,
        },
    });
}

export async function failedAction(action: PrismaDaemonAction) {
    await db.daemonAction.update({
        data: {
            executionStatus: "FAILED",
        },
        where: {
            executionStatus: "STARTED",
            id: action.id,
        },
    });
}

export async function wontStartActions(shouldBeExecutedIds: string[]) {
    await db.daemonAction.updateMany({
        data: {
            executionStatus: "WONT_START",
        },
        where: {
            executionStatus: null,
            id: {
                notIn: shouldBeExecutedIds,
            },
        },
    });
}

export async function getActionsToCancel(
    shouldBeExecutedIds: string[],
): Promise<PrismaDaemonAction[]> {
    return await db.daemonAction.findMany({
        where: {
            executionStatus: "STARTED",
            id: {
                notIn: shouldBeExecutedIds,
            },
        },
    });
}

export async function resetDB() {
    await db.daemonAction.updateMany({
        data: {
            executionStatus: "WONT_FINISH",
        },
        where: {
            executionStatus: "STARTED",
            toDate: {
                lt: new Date(),
            },
        },
    });

    await db.daemonAction.updateMany({
        data: {
            executionStatus: null,
        },
        where: {
            executionStatus: "STARTED",
        },
    });
}

export async function getCurrentSchedulerActions(): Promise<
    PrismaDaemonAction[]
> {
    return await db.daemonAction.findMany();
}

export async function createActions(newActions: PrismaDaemonAction[]) {
    await db.daemonAction.createMany({
        data: newActions.map((newAction) => ({
            ...newAction,
            executionStatus: null,
        })),
    });
}
