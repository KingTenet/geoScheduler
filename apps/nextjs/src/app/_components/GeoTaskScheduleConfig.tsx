import React, { useReducer } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { useCreateGeoSchedule } from "../geoSchedule/lib/createGeoSchedule";
import CommitmentSlider from "./CommitmentSlider";
import { EndTriggerSelector } from "./EndTriggerSelector";
import { geoTaskScheduleReducer, initialState } from "./geoTaskScheduleReducer";
import { Spinner } from "./Spinner";
import { TaskSelector } from "./TaskSelector";
import TimeSelector from "./TimeSelector";
import { ToggleNextActionButton } from "./ToggleNextAction";

interface GeoTaskScheduleConfigMUIProps {
    clearState: () => void;
    taskOptions?: string[];
}

export function GeoTaskScheduleConfig({
    taskOptions = ["Facebook", "Instagram", "Chrome", "VSCode", "Youtube"],
}: GeoTaskScheduleConfigMUIProps) {
    const [state, dispatch] = useReducer(geoTaskScheduleReducer, initialState);
    const [formSubmitting, updateFormSubmitting] = React.useState(false);
    const router = useRouter();

    const createGeoSchedule = useCreateGeoSchedule();

    const handleSubmit = async () => {
        updateFormSubmitting(true);
        try {
            await createGeoSchedule(state);
            // Redirect to the home page after successful submission
            router.push("/");
        } catch (error) {
            // Handle error here (e.g., show an error message)
            console.error("Error submitting form:", error);
            updateFormSubmitting(false);
        }
    };

    if (formSubmitting) {
        return <Spinner />;
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
