import { useState } from "react";

export default function DownloadLayers({ layers }) {
  const [loading, setLoading] = useState(false);

  async function downloadFile(url, filename) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to download " + filename);

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(blobUrl);
  }

  async function handleDownload() {
    if (!layers || layers.length === 0) {
      alert("No layers selected for download");
      return;
    }

    setLoading(true);

    try {
      const promises = layers.map(layer =>
        downloadFile(layer.url, layer.filename)
      );

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        marginTop: "10px",
        position: 'absolute',
        bottom:'30px',
        left:'10px',
        display:'flex',
        padding: "10px 15px",
        fontWeight: "600",
        fontSize: "14px",
        color: "#1c1c1c",
        background: "#ffffff",
        border: "none",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
        zIndex: 1000,
      }}
      onMouseEnter={e => {
        if (!loading) e.currentTarget.style.background = "#ffffff";
      }}
      onMouseLeave={e => {
        if (!loading) e.currentTarget.style.background = "#ffffff";
      }}
    >
      {loading ? "Se descarcă..." : "Descarcă straturile selectate"}
    </button>
  );
}