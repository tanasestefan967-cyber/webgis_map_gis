import { useEffect, useState, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function GeoJsonSearch() {

  const map = useMap();

  const containerRef = useRef(null);
  const highlightRef = useRef(null);

  // CONFIGURE YOUR SEARCHABLE SOURCES
  const sourcesConfig = {
    cladiri: {
      label: "Clădiri Bistrița",
      url: "/data/cladiri_bistrita.geojson",
      searchProperty: "name",
    },
    drumuri: {
      label: "Drumuri Bistrița",
      url: "/data/drumuri_bistrita.geojson",
      searchProperty: "name",
    },
    biserici: {
      label: "Ape",
      url: "/data/ape_bistrita.geojson",
      searchProperty: "name",
    }
  };

  const [selectedSource, setSelectedSource] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState({});

  // STOP SCROLL PROPAGATION TO MAP
  useEffect(() => {

    if (!containerRef.current) return;

    L.DomEvent.disableClickPropagation(containerRef.current);
    L.DomEvent.disableScrollPropagation(containerRef.current);

  }, []);


  // LOAD GEOJSON WHEN SOURCE SELECTED
  useEffect(() => {

    if (!selectedSource) return;

    async function loadSource() {

      if (data[selectedSource]) return;

      try {

        const res = await fetch(sourcesConfig[selectedSource].url);
        const json = await res.json();

        setData(prev => ({
          ...prev,
          [selectedSource]: json
        }));

      } catch (err) {
        console.error("GeoJSON load error:", err);
      }
    }

    loadSource();

  }, [selectedSource]);


  // FILTER RESULTS
  const results = useMemo(() => {

    if (!selectedSource || !query) return [];

    const sourceData = data[selectedSource];
    if (!sourceData) return [];

    const prop = sourcesConfig[selectedSource].searchProperty;
    const q = query.toLowerCase();

    return sourceData.features
      .filter(feature =>
        feature.properties?.[prop]
          ?.toString()
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 10);

  }, [query, selectedSource, data]);


  // ZOOM AND HIGHLIGHT FEATURE
  function zoomToFeature(feature) {

    // remove old highlight
    if (highlightRef.current) {
      map.removeLayer(highlightRef.current);
    }

    const highlight = L.geoJSON(feature, {
      style: {
        color: "#ff0000",
        weight: 4,
        fillOpacity: 0.5
      }
    }).addTo(map);

    highlightRef.current = highlight;

    map.fitBounds(highlight.getBounds(), {
      padding: [50, 50],
      maxZoom: 19
    });

    const prop = sourcesConfig[selectedSource].searchProperty;
    const name = feature.properties?.[prop] || "No name";

    highlight.bindPopup(name).openPopup();
  }


  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 10,
        left: 50,
        background: "white",
        padding: "12px",
        zIndex: 1000,
        width: "260px",
        borderRadius: "6px",
        boxShadow: "0 0 8px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
        fontFamily: "sans-serif"
      }}
    >

      <div style={{
        fontWeight: "bold",
        marginBottom: "8px"
      }}>
        Search
      </div>


      {/* DROPDOWN */}
      <select
        value={selectedSource}
        onChange={(e) => {
          setSelectedSource(e.target.value);
          setQuery("");
        }}
        style={{
          width: "100%",
          padding: "6px",
          boxSizing: "border-box",
          cursor: "pointer"
        }}
      >
        <option value="" disabled hidden>
          Selectați stratul de căutare...
        </option>

        {Object.entries(sourcesConfig).map(([key, src]) => (
          <option key={key} value={key}>
            {src.label}
          </option>
        ))}
      </select>


      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder={
          selectedSource
            ? "Căutați..."
            : "Selectați un strat..."
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={!selectedSource}
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "8px",
          boxSizing: "border-box"
        }}
      />


      {/* RESULTS LIST */}
      <div
        style={{
          marginTop: "8px",
          maxHeight: "200px",
          overflowY: "auto",
          overflowX: "hidden",
          borderTop: results.length ? "1px solid #eee" : "none"
        }}
      >
        {results.map((feature, index) => {

          const prop = sourcesConfig[selectedSource].searchProperty;

          return (
            <div
              key={index}
              onClick={() => zoomToFeature(feature)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
              onMouseEnter={(e) =>
                e.currentTarget.style.background = "#f5f5f5"
              }
              onMouseLeave={(e) =>
                e.currentTarget.style.background = "white"
              }
            >
              {feature.properties?.[prop] || "Unnamed"}
            </div>
          );
        })}
      </div>

    </div>
  );
}