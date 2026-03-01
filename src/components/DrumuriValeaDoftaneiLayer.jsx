import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

export default function DrumuriValeaDoftaneiLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadGeoJSON() {
      try {
        const res = await fetch("/data/drumuri_Valea_Doftanei.geojson");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load GeoJSON:", err);
      }
    }

    loadGeoJSON();
  }, []);

  if (!data) return null;

  // Function to style features based on highway type
  const styleFeature = (feature) => {
    const type = feature.properties.highway;

    const styles = {
      motorway: { color: "#ff0000", weight: 4, fillOpacity: 0.6 },   // red
      trunk: { color: "#ff0000", weight: 4, fillOpacity: 0.6 },   // red
      primary: { color: "#ff7f00", weight: 4, fillOpacity: 0.5 },    // orange
      secondary: { color: "#ffff00", weight: 4, fillOpacity: 0.4 },  // yellow
      tertiary: { color: "#00ff00", weight: 4, fillOpacity: 0.4 },   // green
      residential: { color: "#7c7c7c", weight: 3, fillOpacity: 0.3 }, // blue
      footway: { color: "#8e44ad", weight: 1, fillOpacity: 0.3 },    // purple
      default: { color: "#999999", weight: 1, fillOpacity: 0.2 },    // grey
    };

    return styles[type] || styles.default;
  };

  const onEachFeature = (feature, layer) => {
    layer.bindPopup(
     `${feature.properties.ref || ""} 
      ${feature.properties.name || ""}
       
       ${feature.properties.addr_street || ""} ${feature.properties.addr_housenumber || ""}<br>
       <i>${feature.properties.highway || "Unknown type"}</i>`
    );

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 5,
          color: "#ff1493", // hotpink highlight
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        e.target.setStyle(styleFeature(feature));
      },
    });
  };

  return <GeoJSON data={data} style={styleFeature} onEachFeature={onEachFeature} />;
}