"use client";

import React from "react";
import Link from "next/link";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";

import { api } from "~/trpc/react";
import { Spinner } from "../_components/Spinner";

export default function PlacesPage() {
    const { data: places, isLoading } = api.places.getAll.useQuery();

    if (isLoading) {
        return <Spinner label="Loading places..." />;
    }

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Your Places
            </Typography>
            <List>
                {places?.map((place) => (
                    <ListItem key={place.id} component={Paper} sx={{ mb: 2 }}>
                        <ListItemButton
                            component={Link}
                            href={`/places/${place.id}`}
                        >
                            <ListItemText
                                primary={place.name}
                                secondary={`Lat: ${place.latitude.toFixed(6)}, Long: ${place.longitude.toFixed(6)}, Radius: ${place.radius.toFixed(2)}m`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 2 }}>
                <Link href="/places/create" passHref>
                    <Button variant="contained" color="primary">
                        Add New Place
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
