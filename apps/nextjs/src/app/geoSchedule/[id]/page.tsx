"use server";

import { Suspense } from "react";

import { byIdGeoSchedulePayloadSchema } from "@GeoScheduler/validators";

import { GeoSchedules } from "~/app/_components/GeoSchedules";
import { api, HydrateClient } from "~/trpc/server";

export default async function GeoSchedulePage({
    params,
}: {
    params: { id: string };
}) {
    const { data: validPayload } = byIdGeoSchedulePayloadSchema.safeParse({
        id: params.id,
    });

    if (!validPayload) {
        return (
            <>
                <div>{"Failed"}</div>
            </>
        );
    }

    // You can await this here if you don't want to show Suspense fallback below
    void api.geoSchedules.byId(validPayload);

    return (
        <HydrateClient>
            <main className="container h-screen py-16">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        Create <span className="text-primary">T3</span> Turbo
                    </h1>
                    <Suspense>
                        <GeoSchedules />
                    </Suspense>
                </div>
            </main>
        </HydrateClient>
    );
}
