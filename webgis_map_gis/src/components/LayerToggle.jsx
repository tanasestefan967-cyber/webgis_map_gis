import { LayersControl, TileLayer } from "react-leaflet";
import BisericiLayer from "./BisericiLayer";
import RoJudeteLayer from "./RoJudeteLayer";
const { BaseLayer, Overlay } = LayersControl;


export default function LayerToggle() {
  return (
    <LayersControl position="topright">

      {/* ===== Light / Standard ===== */}
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

      {/* ===== Dark Mode ===== */}
      <BaseLayer name="Carto Dark Matter">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />
      </BaseLayer>


      {/* ===== Satellite / Hybrid ===== */}
      <BaseLayer name="Esri World Imagery (Satellite)">
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

      {/* ===== Terrain / Topographic ===== */}
      <BaseLayer name="OpenTopoMap">
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution="© OpenTopoMap contributors"
        />
      </BaseLayer>
      
    <Overlay name="Biserici">
    <BisericiLayer />
        </Overlay>

     <Overlay name="Judete">
        <RoJudeteLayer/>
    </Overlay>
    </LayersControl>
  );
}