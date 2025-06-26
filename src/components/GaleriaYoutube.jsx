import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsHeart, BsList } from "react-icons/bs";

const API_URL = "http://localhost:5000/song";
const FILTRO_URL = "http://localhost:5000/song/filtrar";

function getYoutubeThumbnail(videoUrl) {
  const match = videoUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function GaleriaYoutube({ setCola, cola, cargarCola }) {
  const [videos, setVideos] = useState([]);
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);

  const [filtros, setFiltros] = useState({
    busqueda: "",
    ordenFecha: "desc",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const fetchVideos = async (usarFiltro = false) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const url = usarFiltro ? FILTRO_URL : API_URL;

      const params = usarFiltro
        ? {
            busqueda: filtros.busqueda,
            ordenFecha: filtros.ordenFecha,
          }
        : {};

      const res = await axios.get(url, { headers, params });
      setVideos(res.data.canciones || res.data);
    } catch (err) {
      console.error("Error al cargar videos", err);
    }
  };

  // 👇 Fetch inicial
  useEffect(() => {
    fetchVideos();
  }, []);

  // 👇 Búsqueda automática con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (filtros.busqueda.trim() !== "") {
        fetchVideos(true); // con filtro
      } else {
        fetchVideos(); // sin filtro
      }
    }, 500); // espera 500ms tras escribir

    return () => clearTimeout(delayDebounce);
  }, [filtros.busqueda, filtros.ordenFecha]);



  const agregarAFavoritos = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/t/favoritos/add",
        { songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Canción agregada a favoritos");
    } catch (error) {
      console.error("Error al agregar a favoritos", error);
      alert("Ocurrió un error al agregar a favoritos");
    }
  };


  const agregarACola = async (songId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/t/cola/add",
      { songId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Aquí llamamos para recargar la cola actualizada
    if (cargarCola) cargarCola();

  } catch (error) {
    console.error("Error al agregar a cola", error);
  }
};


  return (
    <div className="">
      <div className="flex flex-wrap items-end mb-4">
        <input
          type="text"
          name="busqueda"
          placeholder="Buscar por título, artista o género"
          value={filtros.busqueda}
          onChange={handleChange}
          className="p-2 m-2 border rounded w-full md:w-64"
        />
              
      </div>

      <div className="row">
        {videos.map((video) => {
          const thumbnail = getYoutubeThumbnail(video.videoUrl);
          return (
            <div
              key={video._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2"
              style={{ cursor: "pointer" }}
            >
              <img
                src={thumbnail}
                alt={video.titulo}
                className="img-fluid rounded"
                onClick={() => setVideoSeleccionado(video)}
              />
              <div className="d-flex flex-column">
                <span className="fw-bold text-light fw-bold">{video.titulo}</span>
                <div className="d-flex justify-content-between align-items-center text-light">
                  <small>
                    {video.artista} -{" "}
                    {(video.generos || []).map((g) => g.nombre).join(", ")}
                  </small>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-1"
                      onClick={() => agregarAFavoritos(video._id)}
                      title="Agregar a favoritos"
                    >
                      <BsHeart size={18} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center p-1"
                      onClick={() => agregarACola(video._id)}
                      title="Agregar a cola"
                    >
                      <BsList size={18} />
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
