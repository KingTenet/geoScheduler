"use client";

import { useState } from "react";

import { Button } from "@GeoScheduler/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@GeoScheduler/ui/card";

import { CommitmentPeriod } from "./CommitmentPeriod";
import { EndTrigger } from "./EndTrigger";
import { TaskSelector } from "./TaskSelector";
import { TimeSelector } from "./TimeSelector";

export function GeoTaskScheduleConfig() {
    const [selectedTask, setSelectedTask] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTrigger, setEndTrigger] = useState<"time" | "location">("time");
    const [endTime, setEndTime] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [commitmentPeriod, setCommitmentPeriod] = useState(0);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Configure GeoTask Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Start a new task trigger to run daily...
                </p>

                <TaskSelector
                    selectedTask={selectedTask}
                    onSelectTask={setSelectedTask}
                />

                {selectedTask && (
                    <TimeSelector
                        label="Start Time"
                        selectedTime={startTime}
                        onSelectTime={setStartTime}
                    />
                )}

                {startTime && (
                    <EndTrigger
                        endTrigger={endTrigger}
                        onSelectEndTrigger={setEndTrigger}
                        endTime={endTime}
                        onSelectEndTime={setEndTime}
                        endLocation={endLocation}
                        onSelectEndLocation={setEndLocation}
                    />
                )}

                {(endTime || endLocation) && (
                    <CommitmentPeriod
                        commitmentPeriod={commitmentPeriod}
                        onSetCommitmentPeriod={setCommitmentPeriod}
                    />
                )}

                {commitmentPeriod > 0 && (
                    <Button
                        className="w-full"
                        onClick={() => console.log("Schedule submitted")}
                    >
                        Submit Schedule
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
