import React, { useState, useEffect } from "react";
import "../styles/inicial.css";
import GaleriaYoutube from "../components/GaleriaYoutube";
import AnunciosVisibles from "../components/AnunciosVisibles";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/botones.css";
import VideoPlayer from "../components/VideoPlayer";
import PlaylistModal from "../components/PlaylistModal";

export default function Inicial() {
  const [cola, setCola] = useState([]);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Crear nuevo playlist
  const handleAddPlaylist = async (name) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/t/playlist",
        { nombre: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nuevaPlaylist = res.data;

      setPlaylists((prev) =>
        Array.isArray(prev) ? [...prev, nuevaPlaylist] : [nuevaPlaylist]
      );
    } catch (err) {
      console.error(
        "Error al crear playlist:",
        err.response?.data || err.message
      );
      alert("No se pudo crear el playlist. Quizás ya existe.");
    }
  };

  // Cargar token y datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userIdDecoded = decoded.userId;
        setUserId(userIdDecoded);
        const cargarPlaylists = async () => {
          try {
            const res = await axios.get(
              `http://localhost:5000/t/playlist/${userIdDecoded}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setPlaylists(Array.isArray(res.data) ? res.data : []);
          } catch (error) {
            console.error("Error al cargar playlists", error);
            setPlaylists([]);
          }
        };

        const cargarCola = async () => {
          try {
            const res = await axios.get(
              `http://localhost:5000/t/cola/${userIdDecoded}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setCola(res.data?.canciones || []);
          } catch (error) {
            console.error("Error al cargar la cola", error);
          }
        };

        cargarCola();
        cargarPlaylists();
      } catch (err) {
        console.error("Token inválido", err);
      }
    }
  }, []);

  const cargarPlaylistACola = async (playlistId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/t/playlist/canciones/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const canciones = res.data.canciones || [];
      setCola(canciones);
    } catch (err) {
      console.error("Error al cargar canciones del playlist", err);
    }
  };

  return (
    <>
      <div className="fondo container-fluid px-4 py-3 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-row justify-content-center align-items-center w-100">
          <img src="./icono.png" alt="" width="100rem" />
          <img
            src="./logo.png"
            alt=""
            className="img-fluid w-40 w-sm-75 w-md-30 w-lg-25"
          />
        </div>

        <div className="d-flex flex-row justify-content-center align-items-center w-100 flex-wrap gap-2">
          <div className="d-flex flex-row flex-md-column flex-wrap justify-content-center gap-1">
            <button className="boton-personalizado rojo">Buscador</button>
            <button
              className="boton-personalizado verde"
              onClick={() => setShowModal(true)}
            >
              PlayList
            </button>
            <button className="boton-personalizado rojo">Lo más cantado</button>
            <button className="boton-personalizado verde">Favoritos</button>
            <button className="boton-personalizado rojo">
              Lista de Canciones
            </button>
            <button className="boton-personalizado verde">
              Sugerir Canciones
            </button>
            <button className="boton-personalizado rojo">
              Scanner a Celular
            </button>
          </div>

          <div className="flex-grow-1">
            <VideoPlayer />
          </div>

          <div className="d-flex flex-row flex-md-column flex-wrap justify-content-center gap-2">
            <button className="boton-personalizado rojo">Ingresar</button>
            <button className="boton-personalizado verde">Listado PDF</button>
            <button className="boton-personalizado rojo">Calificación</button>
            <button className="boton-personalizado verde">Suscribir</button>
            <button className="boton-personalizado rojo">Ayuda</button>
            <button className="boton-personalizado verde">Galería Otros</button>
            <button className="boton-personalizado rojo">TV Smart</button>
          </div>
        </div>

        {/* Cola dinámica */}
        <div className="m-2 d-flex flex-row gap-2 justify-content-center align-items-center p-2 mt-3">
          {cola.map((cancion, index) => (
            <div key={index} className="text-center bg-dark text-white p-2">
              🎵 {cancion.titulo}
            </div>
          ))}
        </div>

        <AnunciosVisibles />
        <GaleriaYoutube
          setCola={setCola}
          cola={cola}
          cargarCola={() => {}} // puedes ajustar si necesitas recargar desde hijo
        />
      </div>

      {showModal && (
        <PlaylistModal
          playlists={playlists}
          onSelect={(playlist) => {
            setSelectedPlaylist(playlist);
            cargarPlaylistACola(playlist._id);
            setShowModal(false);
          }}
          onAdd={handleAddPlaylist}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
