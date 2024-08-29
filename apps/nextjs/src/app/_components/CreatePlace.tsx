"use client";

import React, {
    KeyboardEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";

import "leaflet/dist/leaflet.css";
import "../places/create/leaflet.css";

import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import L from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { api } from "~/trpc/react";
import { LeafletCircleOverlay } from "./LeafletCircleOverlay";

interface LongLat {
    longitude: number;
    latitude: number;
}

const startLocation: LongLat = {
    longitude: -0.09,
    latitude: 51.505,
};

const initialRadius = 2863;
// This is only accurate at equator, so radius should always be inferred from map
const initialZoom = Math.log2((156543 * 150) / initialRadius) / Math.log2(2);

function getMapRadiusMetres(map: L.Map) {
    const center = map.getCenter();
    const northBound = map.getBounds().getNorth();
    const centerNorth = L.latLng(northBound, center.lng);

    return center.distanceTo(centerNorth);
}

const CreatePlace = () => {
    const [userLonLat, setUserLocation] = useState<LongLat | undefined>();

    const [
        { longitude: selectedLongitude, latitude: selectedLatitude },
        setPosition,
    ] = useState<LongLat>(startLocation);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                console.log(`Setting user location ${latitude} + ${longitude}`);
                setUserLocation({ longitude, latitude });
            },

            (error) => {
                // TODO - Display error to user
                console.error("Error get user location: ", error);
            },
        );
    }, []);

    const [name, setName] = useState("");
    const [radius, setRadius] = useState<number | undefined>();
    const router = useRouter();
    const createPlace = api.places.create.useMutation({
        onSuccess: () => {
            router.push("/places");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        if (!radius) {
            throw new Error();
        }
        e.preventDefault();
        createPlace.mutate({
            name,
            latitude: selectedLatitude,
            longitude: selectedLongitude,
            radius,
        });
    };

    const [mapMoved, setMapMoved] = useState(false);
    const MapEvents = ({ longLat }: { longLat: LongLat | undefined }) => {
        const map = useMap();

        useEffect(() => {
            if (!mapMoved && longLat) {
                const { longitude: userLongitude, latitude: userLatitude } =
                    longLat;
                setMapMoved(true);
                setPosition({
                    longitude: userLongitude,
                    latitude: userLatitude,
                });
                map.setView([userLatitude, userLongitude]);
            }
        }, [map, longLat]);

        useEffect(() => {
            if (!radius) {
                setRadius(getMapRadiusMetres(map));
            }
        }, [map]);

        useMapEvents({
            zoom() {
                setRadius(getMapRadiusMetres(map));
            },
            move() {
                const longLat = map.getCenter();
                setRadius(getMapRadiusMetres(map));
                setPosition({ longitude: longLat.lng, latitude: longLat.lat });
            },
        });
        return null;
    };

    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = (
        e: React.KeyboardEvent,
    ) => {
        if (e.key === "Enter") {
            buttonRef.current?.focus();
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                maxWidth: 600,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "80vh",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Add to your places
            </Typography>
            <TextField
                fullWidth
                label="Place Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                onKeyUp={handleKeyPress}
            />
            <Box className={"map-wrapper"}>
                <MapContainer
                    center={
                        new L.LatLng(
                            startLocation.latitude,
                            startLocation.longitude,
                        )
                    }
                    zoom={initialZoom}
                    attributionControl={false}
                    zoomControl={false}
                    className={"map-container"}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents longLat={userLonLat} />
                    <LeafletCircleOverlay />
                </MapContainer>
            </Box>
            <Typography>
                Latitude: {selectedLatitude.toFixed(6)}, Longitude:{" "}
                {selectedLongitude.toFixed(6)}, Radius: {radius?.toFixed(2)}m
            </Typography>

            <Button
                type="button"
                variant="contained"
                disabled={!(radius && name)}
                color="primary"
                fullWidth
                ref={buttonRef}
                onClick={handleSubmit}
                sx={{ mt: 2 }}
            >
                Add Place
            </Button>
        </Box>
    );
};

export default CreatePlace;
