import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BsXCircle } from "react-icons/bs";

const API_URL = "http://localhost:5000/t/favoritos"; // ajusta según tu backend

function getYoutubeThumbnail(url) {
  if (!url) return "";
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]{11})/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "";
}

const FavoritosPage = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const [canciones, setCanciones] = useState([]);
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const cargarFavoritos = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/${userId}`, { headers });
      setCanciones(res.data?.canciones || []);
      console.log()
    } catch (err) { setCanciones(res.data?.canciones || []);
      console.error("Error al obtener favoritos:", err);
    } finally {
      setCargando(false);
    }
  };

  const eliminarCancion = async (songId) => {
    try {
      await axios.delete(`${API_URL}/remove`, {
        data: {songId},
        headers,
      });
      cargarFavoritos();
    } catch (err) {
      console.error("Error al eliminar canción:", err);
    }
  };

  const vaciarFavoritos = async () => {
    try {
      await axios.delete(`${API_URL}/clear/${userId}`, { headers });
      cargarFavoritos();
    } catch (err) {
      console.error("Error al vaciar favoritos:", err);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  if (cargando) return <p>Cargando favoritos...</p>;

  return (
    <div className="container mt-4">
      <h2>Mis Favoritos</h2>

      {canciones.length === 0 ? (
        <p>No tienes canciones favoritas.</p>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-danger" onClick={vaciarFavoritos}>
              Vaciar lista
            </button>
          </div>

          <div className="row">
            {canciones.map((video) => {
              const thumbnail = getYoutubeThumbnail(video.videoUrl);
              return (
                <div
                  key={video._id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={thumbnail}
                    alt={video.titulo}
                    className="img-fluid rounded"
                    onClick={() => setVideoSeleccionado(video)}
                  />
                  <div className="d-flex flex-column mt-1">
                    <span className="fw-bold">{video.titulo}</span>
                    <div className="d-flex justify-content-between align-items-center">
                      <small>
                        {video.artista} - 
                      </small>
                      <div>
                        <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-1"
                          onClick={() => eliminarCancion(video._id)}
                          title="Quitar de favoritos"
                        >
  <BsXCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {videoSeleccionado && (
            <div className="mt-4">
              <h4>{videoSeleccionado.titulo}</h4>
              <div className="ratio ratio-16x9">
                <iframe
                  src={videoSeleccionado.videoUrl}
                  title="Video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritosPage;
