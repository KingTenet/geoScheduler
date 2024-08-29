"use client";

import React, { useReducer } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import CommitmentSlider from "../../_components/CommitmentSlider";
import { EndTriggerSelector } from "../../_components/EndTriggerSelector";
import {
    geoTaskScheduleReducer,
    initialState,
} from "../../_components/geoTaskScheduleReducer";
import { Spinner } from "../../_components/Spinner";
import { TaskSelector } from "../../_components/TaskSelector";
import TimeSelector from "../../_components/TimeSelector";
import { ToggleNextActionButton } from "../../_components/ToggleNextAction";
import { useCreateGeoSchedule } from "../lib/createGeoSchedule";

export default function GeoTaskScheduleConfig() {
    const [state, dispatch] = useReducer(geoTaskScheduleReducer, initialState);
    const [formSubmitting, updateFormSubmitting] = React.useState(false);
    const router = useRouter();

    const taskOptions = [
        "Facebook",
        "Instagram",
        "Chrome",
        "VSCode",
        "Youtube",
    ];

    const createGeoSchedule = useCreateGeoSchedule();

    const handleSubmit = async () => {
        updateFormSubmitting(true);
        try {
            await createGeoSchedule(state);
            // Redirect to the home page after successful submission
            router.push("/geoSchedule/");
        } catch (error) {
            // Handle error here (e.g., show an error message)
            console.error("Error submitting form:", error);
            updateFormSubmitting(false);
        }
    };

    if (formSubmitting) {
        return <Spinner label="Submitting..." />;
    }

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
                        <TaskSelector
                            taskOptions={taskOptions}
                            selectedTasks={state.selectedTasks}
                            onToggleTask={(task) =>
                                dispatch({ type: "TOGGLE_TASK", task })
                            }
                        />

                        <ToggleNextActionButton
                            label={"Set a start time for the task.."}
                            showButton={
                                Object.values(state.selectedTasks).some(
                                    Boolean,
                                ) && state.startTime === undefined
                            }
                            showChildren={(clicked) =>
                                clicked || state.startTime !== undefined
                            }
                        >
                            <Typography variant="body1" color="text.secondary">
                                Start the task from...
                            </Typography>
                            <TimeSelector
                                timeTitle="Start Time"
                                dispatchTime={(time) =>
                                    dispatch({
                                        type: "SET_START_TIME",
                                        time,
                                    })
                                }
                            />
                        </ToggleNextActionButton>

                        {state.startTime !== undefined && (
                            <EndTriggerSelector
                                endTrigger={state.endTrigger}
                                onSetEndTrigger={(trigger) =>
                                    dispatch({
                                        type: "SET_END_TRIGGER",
                                        trigger,
                                    })
                                }
                                onSetEndTime={(time) =>
                                    dispatch({ type: "SET_END_TIME", time })
                                }
                                onSetEndLocation={(location) =>
                                    dispatch({
                                        type: "SET_END_LOCATION",
                                        location,
                                    })
                                }
                                endLocation={state.endLocation || ""}
                            />
                        )}

                        {(state.endTime || state.endLocation) && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        color="text.secondary"
                                    >
                                        Can you commit?
                                    </Typography>
                                </Box>

                                <CommitmentSlider
                                    onChange={(period) =>
                                        dispatch({
                                            type: "SET_COMMITMENT_PERIOD",
                                            period,
                                        })
                                    }
                                />
                            </>
                        )}

                        <Box sx={{ flexGrow: 1 }} />
                        {(state.endTime || state.endLocation) && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleSubmit()}
                                sx={{ mt: 2 }}
                            >
                                Submit Schedule
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            onClick={() => dispatch({ type: "RESET_STATE" })}
                        >
                            Start again
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
