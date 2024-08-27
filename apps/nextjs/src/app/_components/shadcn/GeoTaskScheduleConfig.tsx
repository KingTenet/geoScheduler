"use client";

// ~/apps/nextjs/src/app/_components/GeoTaskScheduleConfig.tsx
import { useState } from "react";

import { Button } from "@GeoScheduler/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@GeoScheduler/ui/Card";

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
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardContent className="p-6">
                        <CardTitle className="mb-4 text-2xl font-bold">
                            Configure GeoTask Schedule
                        </CardTitle>
                        <CardDescription className="mb-6 text-gray-500">
                            Start a new task trigger to run daily...
                        </CardDescription>

                        <div className="space-y-8">
                            <TaskSelector
                                selectedTask={selectedTask}
                                onSelectTask={setSelectedTask}
                            />

                            <div className="min-h-[80px]">
                                {" "}
                                {/* Minimum height to prevent layout shift */}
                                {selectedTask && (
                                    <TimeSelector
                                        label="Start Time"
                                        selectedTime={startTime}
                                        onSelectTime={setStartTime}
                                    />
                                )}
                            </div>

                            <div className="min-h-[120px]">
                                {" "}
                                {/* Minimum height to prevent layout shift */}
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
                            </div>

                            <div className="min-h-[80px]">
                                {" "}
                                {/* Minimum height to prevent layout shift */}
                                {(endTime || endLocation) && (
                                    <CommitmentPeriod
                                        commitmentPeriod={commitmentPeriod}
                                        onSetCommitmentPeriod={
                                            setCommitmentPeriod
                                        }
                                    />
                                )}
                            </div>

                            <div className="pt-4">
                                {commitmentPeriod > 0 ? (
                                    <Button
                                        className="w-full py-2 text-lg"
                                        onClick={() =>
                                            console.log("Schedule submitted")
                                        }
                                    >
                                        Submit Schedule
                                    </Button>
                                ) : (
                                    <div className="h-10" />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
