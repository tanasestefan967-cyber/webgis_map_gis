import { LayersControl, TileLayer } from "react-leaflet";
import { useState } from "react";

import DownloadLayers from "./DownloadLayers";
import RauriValeaDoftaneiLayer from "./RauriValeaDoftaneiLayer";
import DrumuriValeaDoftaneiLayer from "./DrumuriValeaDoftaneiLayer";
import CladiriValeaDoftaneiLayer from "./CladiriValeaDoftaneiLayer";
import LimitaValeaDoftaneiLayer from "./LimitaValeaDoftaneiLayer";

const { BaseLayer } = LayersControl;

export default function LayerToggle() {
  const [showRauriValeaDoftanei, setShowRauriValeaDoftanei] = useState(false)
  const [showDrumuriValeaDoftanei, setShowDrumuriValeaDoftanei] = useState(false)
  const [showCladiriValeaDoftanei, setShowCladiriValeaDoftanei] = useState(false)
  const [showLimitaValeaDoftanei, setShowLimitaValeaDoftanei] = useState(false)
  

  // Helper to toggle a layer with loading overlay
  const handleLayerToggle = async (setter, value, fetchPromise) => {
    setter(value);             // toggle the checkbox state   
    if (value && fetchPromise) {
      try {
        await fetchPromise();  // wait for layer data to "load"
      } catch (err) {
        console.error("Failed to load layer:", err);
      }
    }
  };

  return (
    <>
      {/* CUSTOM CHECKBOXES */}
      <div style={{
      position: "absolute",
      top: "50%",
      left: 10,
      transform: "translateY(-50%)",
      background: "white",
      padding: "10px",
      zIndex: 1000,
      borderRadius: "5px",
      boxShadow: "0 0 5px rgba(0,0,0,0.2)"
    }}>
      <p style={{margin:'0px', fontSize:'1rem'}}>Straturi</p>
        <label>
          <input
            type="checkbox"
            checked={showRauriValeaDoftanei}
            onChange={(e) =>
              handleLayerToggle(setShowRauriValeaDoftanei, e.target.checked, async () => {
                await fetch("/data/rauri_Valea_Doftanei.geojson");
              })
            }
          />
          Rauri Valea Doftanei
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showDrumuriValeaDoftanei}
            onChange={(e) =>
              handleLayerToggle(setShowDrumuriValeaDoftanei, e.target.checked, async () => {
                await fetch("/data/drumuri_Valea_Doftanei.geojson");
              })
            }
          />
          Drumuri Valea Doftanei
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showCladiriValeaDoftanei}
            onChange={(e) =>
              handleLayerToggle(setShowCladiriValeaDoftanei, e.target.checked, async () => {
                await fetch("/data/cladiri_Valea_Doftanei.geojson");
              })
            }
          />
          Cladiri Valea Doftanei
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showLimitaValeaDoftanei}
            onChange={(e) =>
              handleLayerToggle(setShowLimitaValeaDoftanei, e.target.checked, async () => {
                await fetch("/data/limita_administrativa_Valea_doftanei.geojson");
              })
            }
          />
          Limita Valea Doftanei
              
        </label>

      </div>    

      {/* BASEMAP CONTROL */}
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </BaseLayer>

        <BaseLayer name="Carto Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap © CARTO"
          />
        </BaseLayer>

        <BaseLayer name="Carto Dark Matter">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap © CARTO"
          />
        </BaseLayer>

        <BaseLayer name="Esri World Imagery">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
          />
        </BaseLayer>

        <BaseLayer name="Esri World Street Map">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
          />
        </BaseLayer>

        <BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="© OpenTopoMap contributors"
          />
        </BaseLayer>
      </LayersControl>

       {/* DOWNLOAD LAYERS */}
      <DownloadLayers
        layers={[
          showRauriValeaDoftanei && { url: "/data/rauri_Valea_Doftanei.geojson", filename: "rauri_Valea_Doftanei.geojson" },
          showCladiriValeaDoftanei && { url: "/data/cladiri_Valea_Doftanei.geojson", filename: "cladiri_Valea_Doftanei.geojson" },
          showDrumuriValeaDoftanei && { url: "/data/drumuri_Valea_Doftanei.geojson", filename: "drumuri_Valea_Doftanei.geojson" },
          showLimitaValeaDoftanei && { url: "/data/limita_administrativa_Valea_doftanei.geojson", filename: "limita_administrativa_Valea_doftanei.geojson" },
          
        ].filter(Boolean)}
      />

      {/* LAZY LOADED DATA LAYERS */}
      {showRauriValeaDoftanei && <RauriValeaDoftaneiLayer/>}
      {showDrumuriValeaDoftanei && <DrumuriValeaDoftaneiLayer/>}
      {showCladiriValeaDoftanei && <CladiriValeaDoftaneiLayer/>}
      {showLimitaValeaDoftanei && <LimitaValeaDoftaneiLayer/>}
    </>
  );
}