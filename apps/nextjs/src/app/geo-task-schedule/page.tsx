// ~/apps/nextjs/src/app/geo-task-schedule/page.tsx
import { GeoTaskScheduleConfig } from "../_components/GeoTaskScheduleConfig";

export default function GeoTaskSchedulePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">
                Configure GeoTask Schedule
            </h1>
            <GeoTaskScheduleConfig />
        </div>
    );
}
