"use client";

import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import CommitmentSlider from "./CommitmentSlider";
import TimeSelector from "./TimeSelector";

export function GeoTaskScheduleConfigMUI({
    clearState,
    taskOptions = ["Facebook", "Instagram", "Chrome", "VSCode", "Youtube"],
}: {
    clearState: () => void;
    taskOptions: string[];
}) {










    
    const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>(
        {},
    );
    const [selectStartTimeButtonClicked, updateSelectStartTimeButtonClicked] =
        useState(false);
    const [startTime, setStartTime] = useState<number | undefined>();
    const [endTrigger, setEndTrigger] = useState<
        "time" | "location" | undefined
    >();
    const [endTime, setEndTime] = useState<number | undefined>();
    const [endLocation, setEndLocation] = useState("");
    const [commitmentPeriod, setCommitmentPeriod] = useState();

    const toggleTask = (task: string) => {
        setSelectedTasks((prev) => ({
            ...prev,
            [task]: !prev[task],
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "top",
                minHeight: "90vh",
                bgcolor: "background.default",
            }}
        >
            <Card sx={{ maxWidth: 600, width: "100%", m: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Configure GeoTask Schedule
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Start a new task trigger to run daily...
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 2,
                                mb: 4,
                            }}
                        >
                            {taskOptions.map((task) => (
                                <Button
                                    key={task}
                                    variant={
                                        selectedTasks[task]
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() => toggleTask(task)}
                                    sx={{ minWidth: "100px" }}
                                >
                                    {task}
                                </Button>
                            ))}
                        </Box>

                        {Object.values(selectedTasks).some(Boolean) &&
                            startTime === undefined && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() =>
                                        updateSelectStartTimeButtonClicked(true)
                                    }
                                    sx={{ mt: 2 }}
                                >
                                    Set a start time for the task..
                                </Button>
                            )}
                        {Boolean(selectStartTimeButtonClicked) && (
                            <TimeSelector
                                timeTitle="Start Time"
                                dispatchTime={(time) => setStartTime(time)}
                            />
                        )}
                        {Boolean(startTime) && !Boolean(endTrigger) && (
                            <>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Continue running the task until...
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => setEndTrigger("location")}
                                >
                                    You go somewhere?
                                </Button>

                                <Typography variant="h5" color="text.secondary">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        Or
                                    </Box>
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => setEndTrigger("time")}
                                >
                                    A later time?
                                </Button>
                            </>
                        )}
                        {Boolean(endTrigger) && (
                            <Box>
                                {endTrigger === "time" ? (
                                    <TimeSelector
                                        timeTitle="End Time"
                                        dispatchTime={(time) =>
                                            setEndTime(time)
                                        }
                                    />
                                ) : (
                                    <TextField
                                        label="End Location"
                                        value={endLocation}
                                        onChange={(e) =>
                                            setEndLocation(e.target.value)
                                        }
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                )}
                            </Box>
                        )}

                        {(endTime || endLocation) && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                    }}
                                >
                                    <>
                                        <Typography
                                            variant="h5"
                                            color="text.secondary"
                                        >
                                            {"Can you commit?"}
                                        </Typography>
                                    </>
                                </Box>

                                <CommitmentSlider />
                            </>
                        )}

                        {commitmentPeriod > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() =>
                                    console.log("Schedule submitted")
                                }
                                sx={{ mt: 2 }}
                            >
                                Submit Schedule
                            </Button>
                        )}
                        {commitmentPeriod === undefined && (
                            <>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    onClick={() => clearState()}
                                >
                                    Start again
                                </Button>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
