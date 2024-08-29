import type { z } from "zod";

// import type { RouterInputs, RouterOutputs } from "@GeoScheduler/api";
import type { createGeoSchedulePayloadSchema as FullSchema } from "@GeoScheduler/validators";
import {
    // examplePayloadDaily,
    // examplePayloadWeekly,
    actuallyCreateGeoSchedulePayloadSchema as fullPayload,
} from "@GeoScheduler/validators";

import type { GeoTaskScheduleState } from "~/app/_components/geoTaskScheduleReducer";
import { api } from "~/trpc/react";

type createGeoSchedulePayloadType = z.infer<typeof FullSchema>;

function transformReducerStateToPayload(
    reducerState: GeoTaskScheduleState,
): createGeoSchedulePayloadType {
    const { selectedTasks, startTime, endLocation, endTime, commitmentPeriod } =
        reducerState;

    const selectedTasksArr = Object.entries(selectedTasks).reduce<string[]>(
        (acc, [task, enabled]) => (enabled ? [...acc, task] : acc),
        [],
    );

    if (!selectedTasksArr.length) {
        throw new Error("No tasks specified");
    }

    const payload = {
        blocks: selectedTasksArr,
        untilLocation: {
            longitude: 0,
            latitude: 52,
            radius: 100,
        },
        repeatingType: "daily",
        repeatingDaily: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        repeatingTime: {
            startTime: startTime,
            endTime: endTime,
        },
    };

    const { data: validPayload } = fullPayload.safeParse(payload);

    if (!validPayload) {
        throw new Error("");
    }
    return validPayload;
}

export function useCreateGeoSchedule() {
    const utils = api.useUtils();

    const createGeoSchedule = api.geoSchedules.create.useMutation({
        onSuccess: async () => {
            await utils.geoSchedules.invalidate();
        },
    });

    return (reducerState: GeoTaskScheduleState) => {
        const validPayload = transformReducerStateToPayload(reducerState);
        return createGeoSchedule.mutateAsync(validPayload);
    };
}
