import type { PartialKeys } from "./geoSchedule";
import { PrismaAction } from "../../src/prismaQueries/actions";
import { PrismaGeoSchedule } from "../../src/prismaQueries/geoSchedule";
import { getDateNow } from "../../src/utils/common";

const DEFAULT_ACTION: Omit<
    PrismaAction,
    "geoScheduleConfigId" | "geoScheduleConfig" | "id"
> = {
    deletionDateThreshold: getDateNow(),
    executionStatus: null,
    fromDate: getDateNow(),
    toDate: getDateNow(),
};

function getActionMock(
    partialAction: Pick<PrismaAction, "id">,
    {
        geoSchedule,
    }: {
        geoSchedule: Pick<
            PrismaGeoSchedule,
            PartialKeys | "appsToBlock" | "userId" | "id"
        >;
    },
): PrismaAction {
    return {
        ...DEFAULT_ACTION,
        ...partialAction,
        geoScheduleConfig: geoSchedule,
        geoScheduleConfigId: geoSchedule.id,
    };
}

export function getActionsMock(
    partialActions: Partial<PrismaAction>[],
    {
        geoSchedule,
    }: {
        geoSchedule: Pick<
            PrismaGeoSchedule,
            PartialKeys | "appsToBlock" | "userId" | "id"
        >;
    },
): PrismaAction[] {
    return partialActions.map((partialAction, id) =>
        getActionMock(
            {
                ...partialAction,
                id: `action${id}:${geoSchedule.id}`,
            },
            {
                geoSchedule,
            },
        ),
    );
}
