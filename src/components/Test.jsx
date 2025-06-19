import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/song";

function getYoutubeId({url}) {
    console.log(url)
    if (!url) return null ; 
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/);
  return match ? match[1] : null;
}

function VideoPrincipal({ video }) {
  if (!video) return <p>Selecciona un video</p>;

  const videoId = getYoutubeId(video.videoUrl);
  if (!videoId) return <p>Video inválido</p>;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>{video.titulo} - {video.artista}</h2>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.titulo}
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%"
          }}
        />
      </div>
    </div>
  );
}


function GaleriaVideos({ videos, onSeleccionar }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
      }}
    >
      {videos.map((video) => {
        const videoId = getYoutubeId(video.videoUrl);
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return (
          <div key={video._id} style={{ cursor: "pointer" }} onClick={() => onSeleccionar(video)}>
            <img src={thumbnail} alt={video.titulo} style={{ width: "100%", borderRadius: "8px" }} />
            <p>{video.titulo}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function PaginaGaleriaConVideoPrincipal() {
  const [videos, setVideos] = useState([]);
  const [videoActivo, setVideoActivo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await axios.get(API_URL, { headers });
        console.log(res.data)
        setVideos(res.data.canciones || res.data);
        if (res.data.length > 0) {
          setVideoActivo(res.data[0]); // mostrar primero automáticamente
        }
      } catch (err) {
        console.error("Error al cargar videos", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <VideoPrincipal video={videoActivo} />
      <GaleriaVideos videos={videos} onSeleccionar={setVideoActivo} />
    </div>
  );
}
