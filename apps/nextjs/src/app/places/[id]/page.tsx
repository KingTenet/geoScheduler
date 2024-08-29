"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { Spinner } from "~/app/_components/Spinner";
import { api } from "~/trpc/react";

// Dynamically import the PlaceMap component
const PlaceMap = dynamic(() => import("../../_components/PlaceMap"), {
    ssr: false,
});

export default function PlaceSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { data: place, isLoading } = api.places.byId.useQuery({
        id: id as string,
    });

    if (isLoading) {
        return <Spinner label="Loading place details..." />;
    }

    if (!place) {
        return <Typography>Place not found</Typography>;
    }

    const handleBack = () => {
        router.push("/places");
    };

    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: "auto" }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {place.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Latitude: {place.latitude.toFixed(6)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Longitude: {place.longitude.toFixed(6)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Radius: {place.radius.toFixed(2)}m
                    </Typography>
                    <Box sx={{ height: 300, width: "100%", mt: 2, mb: 2 }}>
                        <PlaceMap place={place} />
                    </Box>
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
