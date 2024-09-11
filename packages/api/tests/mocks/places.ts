import {
    PrismaGeometryCriteria,
    PrismaGeoSchedule,
} from "../../src/prismaQueries/geoSchedule";
import { PrismaPlace } from "../../src/prismaQueries/place";
import { PrismaUser } from "../../src/prismaQueries/user";
import { getDateNow } from "../../src/utils/common";

const DEFAULT_GEOMETRY_CRITERIA: Pick<
    PrismaGeometryCriteria,
    "geometryBlockType"
> = {
    geometryBlockType: "UNTIL_LEAVING",
};

export function getGeometryCriteriaMock(
    partialGeometryCriteria: Partial<PrismaGeometryCriteria>,
    {
        geoSchedule,
        place,
    }: {
        geoSchedule: Pick<PrismaGeoSchedule, "id">;
        place: PrismaPlace;
    },
): PrismaGeometryCriteria[] {
    return [
        {
            ...DEFAULT_GEOMETRY_CRITERIA,
            ...partialGeometryCriteria,
            geoScheduleConfigId: geoSchedule.id,
            id: `geometryCriteria:${geoSchedule.id}`,
            placeId: place.id,
            place,
        },
    ];
}

const DEFAULT_PLACE: Omit<PrismaPlace, "id" | "userId"> = {
    createdAt: getDateNow(),
    latitude: 32,
    longitude: 423,
    name: "fdas",
    radius: 432,
    updatedAt: getDateNow(),
};

export function getPlaceMock(
    partialPlace: Partial<PrismaPlace>,
    {
        user,
    }: {
        user: Pick<PrismaUser, "id">;
    },
): PrismaPlace {
    return {
        ...DEFAULT_PLACE,
        ...partialPlace,
        id: `placeId:${user.id}`,
        userId: user.id,
    };
}
