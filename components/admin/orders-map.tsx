"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import { RESTAURANT_LOCATION } from "@/lib/constants"

// Dynamic imports for react-leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false })

type Order = { id: number; lat: number; lng: number }

export default function OrdersMap({
  orders,
  height = 360,
}: {
  orders: Order[]
  height?: number | string
}) {
  const [L, setL] = useState<any>(null)
  const [icon, setIcon] = useState<any>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      import("leaflet/dist/leaflet.css")
      setL(leaflet)
      setIcon(
        new leaflet.Icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      )
    })
    // 🧹 Cleanup: destroy map if it exists
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const center = useMemo(() => [RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng] as [number, number], [])

  if (!L || !icon) {
    return <div className="p-4 text-center">Loading map...</div>
  }

  //return (
    // <div className="overflow-hidden rounded-lg border">
    //   {/* <MapContainer
    //     whenCreated={(mapInstance) => {
    //       mapRef.current = mapInstance
    //     }}
    //     center={center}
    //     zoom={12}
    //     style={{ height, width: "100%" }}
    //   >
    //     <TileLayer
    //       attribution="&copy; OpenStreetMap"
    //       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     />
    //     {/* Restaurant marker */}
    //     <Marker position={center} icon={icon} />
    //     {/* Orders markers */}
    //     {orders.map((o) => (
    //       <Marker key={o.id} position={[o.lat, o.lng]} icon={icon} />
    //     ))}
    //   </MapContainer> */}
    // </div>
  // )
}
