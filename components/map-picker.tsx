"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false })
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, { ssr: false })
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false })

import "leaflet/dist/leaflet.css"
import L from "leaflet"

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export type LatLng = { lat: number; lng: number }

export default function MapPicker({
  value,
  onChange,
  height = 280,
}: {
  value?: LatLng | null
  onChange?: (latlng: LatLng) => void
  height?: number
}) {
  const [pos, setPos] = useState<LatLng>(value || { lat: 40.72, lng: -73.98 })

  useEffect(() => {
    if (value) setPos(value)
  }, [value])

  const style = useMemo(() => ({ height }), [height])

  return (
    <div className="overflow-hidden rounded-lg border">
      <MapContainer
        center={[pos.lat, pos.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={style}
        className="z-0"
        whenReady={(m) => {
          const map = m.target
          map.on("click", (e: any) => {
            const latlng = { lat: e.latlng.lat, lng: e.latlng.lng }
            setPos(latlng)
            onChange?.(latlng)
          })
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[pos.lat, pos.lng]} icon={icon} />
      </MapContainer>
    </div>
  )
}
