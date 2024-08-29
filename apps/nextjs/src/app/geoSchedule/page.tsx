"use server";

import React from "react";

import { api } from "~/trpc/server";
import { GeoScheduleSummary } from "./GeoScheduleSummaries";

// export default async function GeoSchedulesSummaryPage() {

export default async function HomePage() {
    // You can await this here if you don't want to show Suspense fallback below
    void api.geoSchedules.getAllPlaces.prefetch();

    return (
        <main className="container h-screen py-16">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full max-w-2xl overflow-y-scroll">
                    <GeoScheduleSummary />
                </div>
            </div>
        </main>
    );
}
