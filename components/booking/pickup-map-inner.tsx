"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Branch } from "@/content/site";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ branches }: { branches: Branch[] }) {
  const map = useMap();
  useEffect(() => {
    if (!branches.length) return;
    const bounds = L.latLngBounds(branches.map((b) => [b.lat, b.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [branches, map]);
  return null;
}

export default function PickupMapInner({
  branches,
  selectedId,
  onSelectId,
  onError,
}: {
  branches: Branch[];
  selectedId: string;
  onSelectId: (id: string) => void;
  onError: () => void;
}) {
  useEffect(() => {
    // Soft fail if tiles blocked
    const t = window.setTimeout(() => {
      /* map mounts; errors handled by browser network */
    }, 0);
    return () => window.clearTimeout(t);
  }, [onError]);

  const center: [number, number] = [10.0, 76.3];

  try {
    return (
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        className="h-[320px] w-full rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds branches={branches} />
        {branches.map((b) => (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectId(b.id),
            }}
            opacity={selectedId && selectedId !== b.id ? 0.65 : 1}
          >
            <Popup>
              <strong>{b.name}</strong>
              <br />
              {b.city} · {b.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  } catch {
    onError();
    return null;
  }
}
