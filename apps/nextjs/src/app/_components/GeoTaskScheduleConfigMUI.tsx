import React, { useReducer } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import CommitmentSlider from "./CommitmentSlider";
import { EndTriggerSelector } from "./EndTriggerSelector";
import { geoTaskScheduleReducer, initialState } from "./geoTaskScheduleReducer";
import { TaskSelector } from "./TaskSelector";
import TimeSelector from "./TimeSelector";

interface GeoTaskScheduleConfigMUIProps {
    clearState: () => void;
    taskOptions?: string[];
}

const ToggleNextActionButton = ({
    label,
    showButton,
    showChildren,
    children,
}: {
    showButton: Boolean;
    showChildren: (clicked: Boolean) => Boolean;
    label: string;
    children: React.ReactNode;
}) => {
    const [clicked, updateClicked] = React.useState(false);

    if (showChildren(clicked)) {
        return <>{children}</>;
    }

    if (!showButton) {
        return <></>;
    }

    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => updateClicked(true)}
            sx={{ mt: 2 }}
        >
            {label}
        </Button>
    );
};

export function GeoTaskScheduleConfigMUI({
    clearState,
    taskOptions = ["Facebook", "Instagram", "Chrome", "VSCode", "Youtube"],
}: GeoTaskScheduleConfigMUIProps) {
    const [state, dispatch] = useReducer(geoTaskScheduleReducer, initialState);

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
                                onClick={() =>
                                    console.log("Schedule submitted")
                                }
                                sx={{ mt: 2 }}
                            >
                                Submit Schedule
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            onClick={() => {
                                dispatch({ type: "RESET_STATE" });
                                clearState();
                            }}
                        >
                            Start again
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
