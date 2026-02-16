import { LayersControl, TileLayer } from "react-leaflet";
import { useState } from "react";

import BisericiLayer from "./BisericiLayer";
import RoJudeteLayer from "./RoJudeteLayer";
import RauriLayer from "./RauriLayer";
import DownloadLayers from "./DownloadLayers";
import ApeBistritaLayer from "./ApeBistritaLayer";
import DrumuriBistritaLayer from "./DrumuriBistritaLayer";
import CladiriBistritaLayer from "./CladiriBistritaLayer";


const { BaseLayer } = LayersControl;

export default function LayerToggle() {
  const [showBiserici, setShowBiserici] = useState(false);
  const [showJudete, setShowJudete] = useState(false);
  const [showRauri, setShowRauri] = useState(false);
  const [showApeBistrita, setShowApeBistrita] = useState(false)
  const [showDrumuriBistrita, setShowDrumuriBistrita] = useState(false)
  const [showCladiriBistrita, setShowCladiriBistrita] = useState(false)


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
            checked={showBiserici}
            onChange={(e) =>
              handleLayerToggle(setShowBiserici, e.target.checked, async () => {
                await fetch("/data/biserici_RO.geojson"); // simulate load
              })
            }
          />
          Biserici
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={showJudete}
            onChange={(e) =>
              handleLayerToggle(setShowJudete, e.target.checked, async () => {
                await fetch("/data/ro_judete_poligon.geojson");
              })
            }
          />
          Judete
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={showRauri}
            onChange={(e) =>
              handleLayerToggle(setShowRauri, e.target.checked, async () => {
                await fetch("/data/rauri.geojson");
              })
            }
          />
          Rauri
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showApeBistrita}
            onChange={(e) =>
              handleLayerToggle(setShowApeBistrita, e.target.checked, async () => {
                await fetch("/data/ape_bistrita.geojson");
              })
            }
          />
          Rauri Bistrita
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showDrumuriBistrita}
            onChange={(e) =>
              handleLayerToggle(setShowDrumuriBistrita, e.target.checked, async () => {
                await fetch("/data/drumuri_bistrita.geojson");
              })
            }
          />
          Drumuri Bistrita
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showCladiriBistrita}
            onChange={(e) =>
              handleLayerToggle(setShowCladiriBistrita, e.target.checked, async () => {
                await fetch("/data/cladiri_bistrita.geojson");
              })
            }
          />
          Cladiri Bistrita
        </label>

      </div>

      {/* DOWNLOAD LAYERS */}
      <DownloadLayers
        layers={[
          showBiserici && { url: "/data/biserici_RO.geojson", filename: "biserici_RO.geojson" },
          showJudete && { url: "/data/ro_judete_poligon.geojson", filename: "judete.geojson" },
          showRauri && { url: "/data/rauri.geojson", filename: "rauri.geojson" },
        ].filter(Boolean)}
      />

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

      {/* LAZY LOADED DATA LAYERS */}
      {showBiserici && <BisericiLayer />}
      {showJudete && <RoJudeteLayer />}
      {showRauri && <RauriLayer />}
      {showApeBistrita && <ApeBistritaLayer/>}
      {showDrumuriBistrita && <DrumuriBistritaLayer/>}
      {showCladiriBistrita && <CladiriBistritaLayer/>}

    </>
  );
}