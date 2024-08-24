"use client";

import type { z } from "zod";
import { useReducer } from "react";

import type {
    createGeoScheduleBasePayloadSchema as BaseSchema,
    createGeoSchedulePayloadSchema as FullSchema,
    createPartialGeoSchedulePayloadSchema as PartialSchema,
} from "@GeoScheduler/validators";
import { Button } from "@GeoScheduler/ui/button";
import {
    examplePayloadDaily,
    examplePayloadWeekly,
    createGeoSchedulePayloadSchema as fullPayload,
} from "@GeoScheduler/validators";

import { api } from "~/trpc/react";

type PartialCreateGeoSchedulePayloadType = z.infer<typeof PartialSchema>;

type createGeoSchedulePayloadType = z.infer<typeof FullSchema>;

type ReducerAction =
    | {
          type: "blocks";
          payload: z.infer<typeof BaseSchema.shape.blocks>;
      }
    | {
          type: "all";
          payload: createGeoSchedulePayloadType;
      };

function reducer(
    state: PartialCreateGeoSchedulePayloadType,
    { type, payload }: ReducerAction,
): PartialCreateGeoSchedulePayloadType {
    switch (type) {
        case "blocks": {
            return {
                ...state,
                blocks: payload,
            };
        }
        case "all": {
            return {
                ...payload,
            };
        }
    }
}

export function CreateGeoSchedule() {
    const [state, dispatch] = useReducer(reducer, examplePayloadDaily);

    // TODO - add debounce
    const { data: validPayload } = fullPayload.safeParse(state);

    // dispatch({
    //     type: "blocks",
    //     payload: ["Facebook"],
    // });

    // const dispatchAction = () => {
    //     dispatch({
    //         type: "blocks",
    //         payload: ["Facebook"],
    //     });
    // };

    const utils = api.useUtils();
    const createGeoSchedule = api.geoSchedules.create.useMutation({
        onSuccess: async () => {
            await utils.geoSchedules.invalidate();
        },
    });

    const handleSubmit = () => {
        if (validPayload) {
            createGeoSchedule.mutate(validPayload);
        }
    };

    return (
        <>
            {/* Use the blocks [selected blocks] */}
            <div>Use the blocks...</div>
            <Input
            <Button onClick={() => handleSubmit()}>Submit new schedule</Button>
            {/* From [fromtime] to [totime] */}
        </>
    );
}
