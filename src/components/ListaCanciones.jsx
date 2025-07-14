import React, { useState, useEffect } from "react";
import "../styles/inicial.css";
import GaleriaYoutube from "../components/GaleriaYoutube";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/botones.css";
import "../styles/disco.css";
import { API_URL } from "../config"


import { useNavigate } from "react-router-dom";

export default function ListaCanciones() {

  const [cola, setCola] = useState([]);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  // Renderizado
  const [seccionActiva, setSeccionActiva] = useState("video");
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0); // Añadir esto

  const [modoReproduccion, setModoReproduccion] = useState("cola"); // "cola" o "playlist"
  const [playlistActualId, setPlaylistActualId] = useState(null);

  const insertarEnColaDespuesActual = (nuevaCancion) => {
    setCola((prevCola) => {
      const nuevaCola = [...prevCola];
      nuevaCola.splice(currentIndex + 1, 0, nuevaCancion);
      return nuevaCola;
    });
  };

  const dirigir = (ubicacion) => {
    navigate(ubicacion);
  };

  // Crear nuevo playlist
  const handleAddPlaylist = async (name) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/t/playlist`,
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

        cargarCola();
        cargarPlaylists();
      } catch (err) {
        console.error("Token inválido", err);
      }
    }
  }, [userId]);

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
      setModoReproduccion("playlist");
      setPlaylistActualId(playlistId);
    } catch (err) {
      console.error("Error al cargar canciones del playlist", err);
    }
  };

  const insertarCancion = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/song/${songId}`);
      const nuevaCancion = res.data;

      if (modoReproduccion === "cola") {
        await axios.post(
          `${API_URL}/t/cola/add`,
          { songId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Inserta localmente en ambos casos
      insertarEnColaDespuesActual(nuevaCancion);
      alert("🎵 Canción agregada correctamente");
    } catch (err) {
      console.error("Error al insertar canción", err);
      alert("No se pudo agregar la canción");
    }
  };

  const cargarCola = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/t/cola/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCola(res.data?.canciones || []);
      setModoReproduccion("cola");
      setPlaylistActualId(null);
    } catch (error) {
      console.error("Error al cargar la cola", error);
    }
  };

  return (
    <>
      <div className="p-3 fondo">
        <GaleriaYoutube
          setCola={setCola}
          cola={cola}
          cargarCola={cargarCola} // puedes ajustar si necesitas recargar desde hijo
          onAgregarCancion={insertarCancion}
        />
      </div>
    </>
  );
}
