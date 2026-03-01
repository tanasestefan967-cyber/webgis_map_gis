import { useState } from "react";

export default function DownloadLayers({ layers = [] }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = layers.length;

  async function downloadFile(url, filename) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to download ${filename}`);
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  }

  async function handleDownload() {
    if (!layers || layers.length === 0) {
      alert("No layers selected for download.");
      return;
    }

    setLoading(true);
    setProgress(0);

    let completed = 0;
    let errors = [];

    for (const layer of layers) {
      try {
        await downloadFile(layer.url, layer.filename);
        completed++;
        setProgress(completed);
      } catch (err) {
        console.error(err);
        errors.push(layer.filename);
      }
    }

    setLoading(false);

    if (errors.length > 0) {
      alert(
        `Downloaded ${completed}/${total} layers.\nFailed: ${errors.join(", ")}`
      );
    }
  }

  const buttonText = loading
    ? `Se descarcă ${progress}/${total}...`
    : total > 0
    ? `Descarcă straturile selectate (${total})`
    : "Niciun strat selectat";

  return (
    <button
      onClick={handleDownload}
      disabled={loading || total === 0}
      aria-busy={loading}
      aria-label={buttonText}
      style={{
        position: "absolute",
        bottom: "30px",
        left: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        fontWeight: "600",
        fontSize: "14px",
        color: loading || total === 0 ? "#888" : "#ffffff",
        background:
          loading || total === 0
            ? "#e0e0e0"
            : "linear-gradient(135deg, #292929, #000000)",
        border: "none",
        borderRadius: "8px",
        boxShadow: loading
          ? "none"
          : "0 4px 10px rgba(0,0,0,0.15)",
        cursor:
          loading || total === 0 ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        if (!loading && total > 0)
          e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {loading && (
        <span
          style={{
            width: "14px",
            height: "14px",
            border: "2px solid #fff",
            borderTop: "2px solid transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 1s linear infinite",
          }}
        />
      )}

      {buttonText}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
}