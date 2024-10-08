import { DaemonAction } from "@GeoScheduler/daemonDB";

export const mockActions: DaemonAction[] = [
    {
        id: "1",
        appNames: ["Chrome", "Firefox"],
        executionStatus: null,
        fromDate: new Date("2023-01-01T10:00:00Z"),
        toDate: new Date("2023-01-01T12:00:00Z"),
    },
    // Add more mock actions as needed
];
