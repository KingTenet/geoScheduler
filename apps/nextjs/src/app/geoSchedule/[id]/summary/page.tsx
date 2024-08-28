"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { Spinner } from "~/app/_components/Spinner";
import { api } from "~/trpc/react";

export default function GeoScheduleSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { data: geoSchedule, isLoading } = api.geoSchedules.byId.useQuery({
        id: id as string,
    });

    if (isLoading) {
        return <Spinner label="Loading..." />;
    }

    if (!geoSchedule) {
        return <Typography>Geoschedule not found</Typography>;
    }

    const handleBack = () => {
        router.push("/geoSchedule");
    };

    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: "auto" }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Geoschedule Summary
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        ID: {geoSchedule.id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Blocks:{" "}
                        {geoSchedule.appsToBlock?.apps
                            .map((app) => app.appName)
                            .join(", ")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Start Time:{" "}
                        {geoSchedule.fromTime
                            ? new Date(
                                  geoSchedule.fromTime * 1000,
                              ).toLocaleTimeString()
                            : "N/A"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        End Time:{" "}
                        {geoSchedule.toTime
                            ? new Date(
                                  geoSchedule.toTime * 1000,
                              ).toLocaleTimeString()
                            : "N/A"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Recurrence:{" "}
                        {geoSchedule.dailyRecurrence ? "Daily" : "Weekly"}
                    </Typography>
                    {geoSchedule.dailyRecurrence && (
                        <Typography variant="body1" gutterBottom>
                            Days:{" "}
                            {geoSchedule.dailyRecurrence.repeatDays.join(", ")}
                        </Typography>
                    )}
                    {geoSchedule.weeklyRecurrence && (
                        <Typography variant="body1" gutterBottom>
                            From: {geoSchedule.weeklyRecurrence.fromDay} To:{" "}
                            {geoSchedule.weeklyRecurrence.toDay}
                        </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            Back to List
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
