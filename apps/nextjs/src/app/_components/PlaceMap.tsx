"use client";

import React from "react";
import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

// Fix for the default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PlaceMapProps {
    place: {
        latitude: number;
        longitude: number;
        radius: number;
    };
}

const PlaceMap: React.FC<PlaceMapProps> = ({ place }) => {
    const initialZoom = Math.log2((156543 * 150) / place.radius) / Math.log2(2);
    return (
        <MapContainer
            center={[place.latitude, place.longitude]}
            zoom={Math.floor(initialZoom - 1)}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[place.latitude, place.longitude]} />
            <Circle
                center={[place.latitude, place.longitude]}
                radius={place.radius}
                pathOptions={{ color: "blue", fillColor: "blue" }}
            />
        </MapContainer>
    );
};

export default PlaceMap;
