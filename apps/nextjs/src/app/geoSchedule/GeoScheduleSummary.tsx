"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Fab,
    List,
    ListItem,
    Typography,
} from "@mui/material";

import { api } from "~/trpc/react";
import { Spinner } from "../_components/Spinner";

function formatTime(seconds: number | undefined | null): string {
    if (seconds === undefined || seconds === null) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
                {geoSchedules?.map((schedule) => (
                    <ListItem key={schedule.id} sx={{ px: 0, py: 2 }}>
                        <Link
                            href={`/geoSchedule/${schedule.id}/summary`}
                            passHref
                            style={{ textDecoration: "none", width: "100%" }}
                        >
                            <Card sx={{ width: "100%" }}>
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>
                                        Blocks{" "}
                                        {schedule.appsToBlock?.apps.map(
                                            (app) => (
                                                <Chip
                                                    key={app.id}
                                                    label={app.appName}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                            ),
                                        )}{" "}
                                        from{" "}
                                        <Chip
                                            label={formatTime(
                                                schedule.fromTime,
                                            )}
                                            color="secondary"
                                            size="small"
                                        />
                                        until{" "}
                                        {schedule.toTime ? (
                                            <Chip
                                                label={formatTime(
                                                    schedule.toTime,
                                                )}
                                                color="secondary"
                                                size="small"
                                            />
                                        ) : (
                                            "a location is reached"
                                        )}
                                    </Typography>
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
                                                schedule.dailyRecurrence?.repeatDays.includes(
                                                    day as any,
                                                ) ||
                                                (schedule.weeklyRecurrence &&
                                                    index >=
                                                        daysOfWeek.indexOf(
                                                            schedule
                                                                .weeklyRecurrence
                                                                .fromDay as any,
                                                        ) &&
                                                    index <=
                                                        daysOfWeek.indexOf(
                                                            schedule
                                                                .weeklyRecurrence
                                                                .toDay as any,
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
