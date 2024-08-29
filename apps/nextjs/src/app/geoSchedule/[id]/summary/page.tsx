"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { z } from "zod";

import { createGeoSchedulePayloadSchema } from "@GeoScheduler/validators";

import { Spinner } from "~/app/_components/Spinner";
import { api } from "~/trpc/react";

type GeoSchedule = z.infer<typeof createGeoSchedulePayloadSchema>;

export default function GeoScheduleSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const {
        data: geoSchedule,
        isLoading,
    }: { data: GeoSchedule; isLoading: boolean } =
        api.geoSchedules.byId.useQuery({
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
                    {/* <Typography variant="body1" gutterBottom>
                        ID: {geoSchedule.id}
                    </Typography> */}
                    <Typography variant="body1" gutterBottom>
                        Blocks: {geoSchedule.blocks.join(", ")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Start Time:{" "}
                        {new Date(
                            geoSchedule.repeatingTime.startTime * 1000,
                        ).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        End Time:{" "}
                        {geoSchedule.repeatingTime.endTime
                            ? new Date(
                                  geoSchedule.repeatingTime.endTime * 1000,
                              ).toLocaleTimeString()
                            : "N/A"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Recurrence: {geoSchedule.repeatingType}
                    </Typography>
                    {geoSchedule.repeatingType === "daily" && (
                        <Typography variant="body1" gutterBottom>
                            Days: {geoSchedule.repeatingDaily.join(", ")}
                        </Typography>
                    )}
                    {geoSchedule.repeatingType === "weekly" && (
                        <Typography variant="body1" gutterBottom>
                            From: {geoSchedule.repeatingWeekly.startDay} To:{" "}
                            {geoSchedule.repeatingWeekly.endDay}
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
