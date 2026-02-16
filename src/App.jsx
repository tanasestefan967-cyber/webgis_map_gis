import React, { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LayerToggle from "./components/LayerToggle";
import SearchComponent from "./components/SearchComponent";
import GeoJSONSearch from "./components/GeoJsonSearch";

export default function App() {
  const mapRef = useRef(null);

  // markerRefs must be state (object), not plain ref.current
  const [markerRefs, setMarkerRefs] = useState({});

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={7}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >

        <LayerToggle />
         <GeoJSONSearch />
      </MapContainer>

      {/* IMPORTANT: SearchComponent must be OUTSIDE MapContainer */}
      <SearchComponent
        mapRef={mapRef}
        markerRefs={markerRefs}
      />
    </div>
  );
}