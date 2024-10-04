import type { ApiAction, DaemonAction} from "../types/actions";

export function transformActionToDaemonAction(action: ApiAction): DaemonAction {
    const { id, appNames, fromDate, toDate, executionStatus } = action;

    return {
        appNames,
        fromDate,
        toDate,
        id,
        executionStatus: executionStatus ?? null,
    };
}
