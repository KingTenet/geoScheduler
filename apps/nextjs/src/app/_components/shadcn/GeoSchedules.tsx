"use client";

import { EditGeoSchedule } from "~/app/_components/EditGeoSchedule";
import { api } from "~/trpc/react";

export function GeoSchedules() {
    const [geoSchedules] = api.geoSchedules.all.useSuspenseQuery();

    if (!geoSchedules.length) {
        return (
            <div className="relative flex w-full flex-col gap-4">
                {/* <PostCardSkeleton pulse={false} />
                <PostCardSkeleton pulse={false} />
                <PostCardSkeleton pulse={false} /> */}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                    <p className="text-2xl font-bold text-white">
                        No posts yet
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            {[geoSchedules[0]].map((geoSchedule) => {
                return (
                    <EditGeoSchedule key={geoSchedule.id} id={geoSchedule.id} />
                );
            })}
        </div>
    );
}
