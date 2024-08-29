"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Chip as BrokenChip,
    Card,
    CardContent,
    Fab,
    List,
    ListItem,
    Typography,
} from "@mui/material";
import { z } from "zod";

import { createGeoSchedulePayloadSchema } from "@GeoScheduler/validators";

import { api } from "~/trpc/react";
import { Spinner } from "../_components/Spinner";

const Chip = ({ children, ...props }) => {
    return <BrokenChip {...props}>{children}</BrokenChip>;
};

function formatTime(seconds: number | undefined | null): string {
    if (seconds === undefined || seconds === null) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type GeoSchedule = z.infer<typeof createGeoSchedulePayloadSchema>;

export function GeoScheduleSummary() {
    const { isLoading, data: geoSchedules } =
        api.geoSchedules.getAll.useQuery();

    const router = useRouter();

    if (isLoading) {
        return <Spinner label="Loading..." />;
    }

    const handleAddClick = () => {
        router.push("/geoSchedule/create");
    };

    return (
        <Box sx={{ p: 2, position: "relative", minHeight: "100vh" }}>
            <List>
                {geoSchedules?.map((schedule: GeoSchedule) => (
                    <ListItem key={schedule.id} sx={{ px: 0, py: 2 }}>
                        <Link
                            href={`/geoSchedule/${schedule.id}/summary`}
                            passHref
                            style={{ textDecoration: "none", width: "100%" }}
                        >
                            <Card sx={{ width: "100%" }}>
                                <CardContent>
                                    {/* <Typography variant="body1" gutterBottom> */}
                                    Blocks{" "}
                                    {schedule.blocks.map((app) => (
                                        <Chip
                                            key={app}
                                            label={app}
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}{" "}
                                    from{" "}
                                    <Chip
                                        label={formatTime(
                                            schedule.repeatingTime.startTime,
                                        )}
                                        color="secondary"
                                        size="small"
                                    />
                                    until{" "}
                                    {schedule.repeatingTime.endTime ? (
                                        <Chip
                                            label={formatTime(
                                                schedule.repeatingTime.endTime,
                                            )}
                                            color="secondary"
                                            size="small"
                                        />
                                    ) : (
                                        "a location is reached"
                                    )}
                                    {/* </Typography> */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                            mt: 1,
                                            mb: 1,
                                        }}
                                    >
                                        {daysOfWeek.map((day, index) => {
                                            const isActive =
                                                (schedule.repeatingType ===
                                                    "daily" &&
                                                    schedule.repeatingDaily.includes(
                                                        day as any,
                                                    )) ||
                                                (schedule.repeatingType ===
                                                    "weekly" &&
                                                    index >=
                                                        daysOfWeek.indexOf(
                                                            schedule
                                                                .repeatingWeekly
                                                                .startDay as any,
                                                        ) &&
                                                    index <=
                                                        daysOfWeek.indexOf(
                                                            schedule
                                                                .repeatingWeekly
                                                                .endDay as any,
                                                        ));
                                            return (
                                                <Chip
                                                    key={day}
                                                    label={day}
                                                    color={
                                                        isActive
                                                            ? "success"
                                                            : "default"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        borderRadius: "50%",
                                                        width: 28,
                                                        height: 28,
                                                        "& .MuiChip-label": {
                                                            p: 0,
                                                            fontSize: "0.7rem",
                                                        },
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Link>
                    </ListItem>
                ))}
            </List>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={handleAddClick}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}