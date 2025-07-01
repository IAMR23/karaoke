import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BsTrash, BsXCircle } from "react-icons/bs";

const API_URL = "http://localhost:5000/t/favoritos"; // ajusta según tu backend

function getYoutubeThumbnail(url) {
  if (!url) return "";
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
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
      console.log();
    } catch (err) {
      setCanciones(res.data?.canciones || []);
      console.error("Error al obtener favoritos:", err);
    } finally {
      setCargando(false);
    }
  };

  const eliminarCancion = async (songId) => {
    try {
      await axios.delete(`${API_URL}/remove`, {
        data: { songId },
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
    <div className="container mt-4 ">
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

          <table className="table table-hover table-dark ">
            <thead>
              <tr>
                <th>Título y Artista</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody >
              {canciones.map((video) => {
                const thumbnail = getYoutubeThumbnail(video.videoUrl);
                return (
                  <tr
                    key={video._id}
                    style={{ cursor: "pointer" }}
                  >              
                    <td>
                      <div className="fw-bold">{video.titulo}</div>
                      <small className="text-muted">{video.artista}</small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Evitar que se active el 
                          eliminarCancion(video._id);
                        }}
                        title="Quitar de favoritos"
                      >
                        <BsTrash size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        
        </>
      )}
    </div>
  );
};

export default FavoritosPage;
