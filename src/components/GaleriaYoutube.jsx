import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/song";

function getYoutubeThumbnail(videoUrl) {
  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function GaleriaYoutube() {
  const [videos, setVideos] = useState([]);
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await axios.get(API_URL, { headers });
        setVideos(res.data.canciones || res.data); // ajusta según tu API
      } catch (err) {
        console.error("Error al cargar videos", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-5">
      <h2>Galería de Videos (YouTube)</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {videos.map((video) => {
          const thumbnail = getYoutubeThumbnail(video.videoUrl);
          return (
            <div key={video._id} style={{ cursor: "pointer" }}>
              <img
                src={thumbnail}
                alt={video.titulo}
                style={{ width: "100%", borderRadius: "8px" }}
                onClick={() => setVideoSeleccionado(video)}
              />
              <p>{video.titulo} - {video.artista}</p>
            </div>
          );
        })}
      </div>

      {/* Modal para ver video */}
      {videoSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setVideoSeleccionado(null)}
        >
          <div
            style={{ background: "#fff", padding: 20, borderRadius: 8, maxWidth: "90%", maxHeight: "80%" }}
            onClick={e => e.stopPropagation()}
          >
            <h3>{videoSeleccionado.titulo}</h3>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeThumbnail(videoSeleccionado.videoUrl).split("/")[4]}`}
                title="YouTube Video"
                frameBorder="0"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <button onClick={() => setVideoSeleccionado(null)} style={{ marginTop: 10 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
