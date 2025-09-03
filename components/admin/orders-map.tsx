"use client"

import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useMemo } from "react"
type LatLng = { lat: number; lng: number }
import { RESTAURANT_LOCATION } from "@/lib/constants"

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false })
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, { ssr: false })
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false })

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type Order = {
  id: number
  lat: number
  lng: number
}

export default function OrdersMap({
  orders,
  height = 360,
}: {
  orders: Order[]
  height?: number | string
}) {
  const center = useMemo<LatLng>(() => RESTAURANT_LOCATION, [])
  return (
    <div className="overflow-hidden rounded-lg border">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height, width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[center.lat, center.lng]} icon={icon} />
        {orders.map((o) => (
          <Marker key={o.id} position={[o.lat, o.lng]} icon={icon} />
        ))}
      </MapContainer>
    </div>
  )
}
