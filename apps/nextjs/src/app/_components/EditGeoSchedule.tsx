"use client";

import type { z } from "zod";
import { useReducer } from "react";
import { FontBoldIcon } from "@radix-ui/react-icons";

import type { RouterInputs, RouterOutputs } from "@GeoScheduler/api";
import type {
    createGeoScheduleBasePayloadSchema as BaseSchema,
    createGeoSchedulePayloadSchema as FullSchema,
    createPartialGeoSchedulePayloadSchema as PartialSchema,
} from "@GeoScheduler/validators";
import { Button } from "@GeoScheduler/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@GeoScheduler/ui/toggle-group";
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

export function EditGeoSchedule({
    id,
}: {
    id: RouterInputs["geoSchedules"]["byId"]["id"];
}) {
    // const [geoSchedule] = api.geoSchedules.byId.useSuspenseQuery({ id });

    const [state, dispatch] = useReducer(reducer, examplePayloadDaily);

    // TODO - add debounce
    const { data: validPayload } = fullPayload.safeParse(state);

    const allBlocks = [
        "Facebook",
        "Instagram",
        "WhatsApp",
        "YouTube",
        "Netflix",
    ];

    const dispatchNewBlocks = (
        payload: z.infer<typeof BaseSchema.shape.blocks>,
    ) => {
        dispatch({
            type: "blocks",
            payload,
        });
    };

    const onToggle = (name: string) => {
        if (!state.blocks?.length) {
            dispatchNewBlocks([name]);
        } else if (state.blocks.includes(name)) {
            dispatchNewBlocks(state.blocks.filter((block) => block !== name));
        } else {
            dispatchNewBlocks([...state.blocks, name]);
        }
    };

    const dispatchDaily = () =>
        dispatch({ type: "all", payload: examplePayloadDaily });

    const dispatchWeekly = () =>
        dispatch({ type: "all", payload: examplePayloadWeekly });

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

            <div className="h-50 w-50 p-10">
                <ToggleGroup type="multiple" variant="outline">
                    {allBlocks.map((name) => (
                        <div className="h-50 w-50" key={name}>
                            <ToggleGroupItem
                                key={name}
                                value={name}
                                onClick={() => onToggle(name)}
                                className="h-50 w-50"
                            >
                                <FontBoldIcon className="h-4 w-4" />
                                {name}
                            </ToggleGroupItem>
                        </div>
                    ))}
                </ToggleGroup>
            </div>

            <Button onClick={() => dispatchWeekly()}>
                Add weekly to local state
            </Button>
            <Button onClick={() => dispatchDaily()}>Add daily instead</Button>
            <Button onClick={() => handleSubmit()}>Submit new schedule</Button>
            {/* From [fromtime] to [totime] */}
        </>
    );
}
