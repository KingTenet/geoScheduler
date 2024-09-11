import { PrismaAction } from "../../src/prismaQueries/actions";
import {
    PrismaApp,
    PrismaAppsToBlock,
    PrismaGeoSchedule,
} from "../../src/prismaQueries/geoSchedule";

const DEFAULT_APP: Omit<PrismaApp, "appsToBlockId" | "id"> = {
    appName: "appName",
};

function getAppsMock(
    partialApp: Pick<PrismaApp, "id">,
    {
        prismaAppsToBlock,
    }: {
        prismaAppsToBlock: Pick<PrismaAppsToBlock, "id">;
    },
): PrismaApp {
    return {
        ...DEFAULT_APP,
        ...partialApp,
        appsToBlockId: prismaAppsToBlock.id,
    };
}

export function getAppsToBlockMock(
    partialAppsToBlock: Partial<PrismaAppsToBlock>,
    {
        geoSchedule,
        apps = [],
    }: {
        actions?: Pick<PrismaAction, "id">;
        geoSchedule: Pick<PrismaGeoSchedule, "id">;
        apps?: Partial<PrismaApp>[];
    },
): PrismaAppsToBlock {
    const prismaAppsToBlock: Pick<
        PrismaAppsToBlock,
        "geoScheduleConfigId" | "id"
    > = {
        ...partialAppsToBlock,
        geoScheduleConfigId: geoSchedule.id,
        id: `appsToBlock:${geoSchedule.id}`,
    };

    return {
        ...prismaAppsToBlock,
        apps: apps.map((app, id) =>
            getAppsMock(
                {
                    id: `apps${id}:${prismaAppsToBlock}`,
                    ...app,
                },
                { prismaAppsToBlock },
            ),
        ),
    };
}
