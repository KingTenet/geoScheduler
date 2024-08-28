import React from "react";
import { Box, Button, Typography } from "@mui/material";

import { EndTriggers, LocationEndTriggers } from "./geoTaskScheduleReducer";
import TimeSelector from "./TimeSelector";

interface EndTriggerSelectorProps {
    endTrigger?: EndTriggers;
    onSetEndTrigger: (trigger: EndTriggers) => void;
    onSetEndTime: (time: number) => void;
    onSetEndLocation: (location: string) => void;
    endLocation: string;
}

type LocationSelectorProps = {
    locationType: LocationEndTriggers;
    onSetEndLocation: (location: string) => void;
    endLocation: string;
};

const locationOptions = ["London", "Paris", "New York", "Rome"];

function LocationCriteria({
    endLocation,
    onSetEndLocation,
    locationType,
}: LocationSelectorProps) {
    const locationTypeLabel =
        locationType === "enter_location" ? "entering" : "leaving";

    return (
        <>
            <Typography variant="body1" color="text.secondary">
                {`Continue running the task until ${locationTypeLabel}...`}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 4,
                    mt: 4,
                }}
            >
                {locationOptions.map((location) => (
                    <Button
                        key={location}
                        variant={
                            endLocation === location ? "contained" : "outlined"
                        }
                        onClick={() => onSetEndLocation(location)}
                        sx={{ minWidth: "100px" }}
                    >
                        {location}
                    </Button>
                ))}
            </Box>
        </>
    );
}

export function EndTriggerSelector({
    endTrigger,
    onSetEndTrigger,
    onSetEndTime,
    onSetEndLocation,
    endLocation,
}: EndTriggerSelectorProps) {
    if (!endTrigger) {
        return (
            <>
                <Typography variant="body1" color="text.secondary">
                    Continue running the task until...
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onSetEndTrigger("enter_location")}
                >
                    You go somewhere?
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onSetEndTrigger("leave_location")}
                >
                    You leave somewhere?
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
                    onClick={() => onSetEndTrigger("time")}
                >
                    A later time?
                </Button>
            </>
        );
    }

    return (
        <Box>
            {endTrigger === "time" ? (
                <TimeSelector
                    timeTitle="End Time"
                    dispatchTime={onSetEndTime}
                />
            ) : (
                <LocationCriteria
                    onSetEndLocation={onSetEndLocation}
                    endLocation={endLocation}
                    locationType={endTrigger}
                />
            )}
        </Box>
    );
}
