"use client";

import { useState } from "react";

import { GeoTaskScheduleConfigMUI } from "../_components/mui/GeoTaskScheduleConfigMUI";
import TimeSelector from "../_components/mui/TimeSelector";

function WrappedSchedule() {
    const [count, updateCount] = useState(0);

    return (
        <GeoTaskScheduleConfigMUI
            key={`Schedule_${count}`}
            clearState={() => updateCount(count + 1)}
        />
    );
}

export default function GeoTaskScheduleMUIPage() {
    return <WrappedSchedule />;

    return (
        <TimeSelector
            timeTitle="Start time"
            dispatchTime={(elapsedMS) =>
                console.log(
                    `Time past midnight is ${elapsedMS / 1000 / 60 / 60} ${elapsedMS / 1000 / 60} ${elapsedMS / 1000}`,
                )
            }
        />
    );
}
