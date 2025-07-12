import React, { useState, useEffect } from "react";
import "../styles/inicial.css";
import GaleriaYoutube from "../components/GaleriaYoutube";
import AnunciosVisibles from "../components/AnunciosVisibles";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/botones.css";
import "../styles/disco.css";
import VideoPlayer from "../components/VideoPlayer";
import PlaylistModal from "../components/PlaylistSelector";
import { FaCompactDisc } from "react-icons/fa";
import BuscadorCanciones from "../components/BuscadorCanciones";
import PlaylistSelector from "../components/PlaylistSelector";
import FavoritosPage from "./FavoritosPage";
import { useNavigate } from "react-router-dom";
import SolicitudesCancion from "./SolicitudCancion";
import LoginForm from "../components/LoginForm";
import ListadoPDFCanciones from "../components/ListadoPDFCanciones";
import AyudaPage from "./AyudaPage";

export default function Inicial() {
  const [cola, setCola] = useState([]);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Renderizado
  const [seccionActiva, setSeccionActiva] = useState("video");
  const navigate = useNavigate();

  const renderContenido = () => {
    switch (seccionActiva) {
      case "buscador":
        return (
          <BuscadorCanciones
            setCola={setCola}
            cola={cola}
            cargarCola={cargarCola} // puedes ajustar si necesitas recargar desde hijo
            onAgregarCancion={insertarCancion}
          />
        );
      case "playlist":
        return (
          <PlaylistSelector
            playlists={playlists}
            onSelect={(playlist) => {
              setSelectedPlaylist(playlist);
              cargarPlaylistACola(playlist._id);
              setShowModal(false);
            }}
            onAdd={handleAddPlaylist}
            onClose={() => setShowModal(false)}
          />
        );
      case "masCantado":
        return <MasCantado />;

      case "favoritos":
        return <FavoritosPage />;
      case "listaCanciones":
        return dirigir("/listaCanciones");
      case "sugerirCanciones":
        return <SolicitudesCancion />;
      case "scanner":
        return <ScannerCelular />; 

      case "ingresar":
        return <LoginForm />;
      case "listadoPdf":
        return <ListadoPDFCanciones />;
      case "calificacion":
        return <MasCantado />;
      case "suscribir":
        return <ListaCanciones />;
      case "ayuda":
        return <AyudaPage />;
      case "galeriaOtros":
        return <ScannerCelular />;
      case "tv":
        return <ScannerCelular />;

      case "video":
      default:
        return (
          <VideoPlayer
            cola={cola}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        );
    }
  };

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
      const res = await axios.get(`http://localhost:5000/song/${songId}`);
      const nuevaCancion = res.data;

      if (modoReproduccion === "cola") {
        await axios.post(
          "http://localhost:5000/t/cola/add",
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
      <div className="fondo container-fluid px-4 py-3 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-row justify-content-center align-items-center w-100">
          <img src="./icono.png" alt="" width="100rem" />
          <img
            onClick={() => setSeccionActiva("video")}
            src="./logo.png"
            alt=""
            className="img-fluid w-40 w-sm-75 w-md-30 w-lg-25"
          />
        </div>

        <div className="d-flex flex-row justify-content-center align-items-center w-100 flex-wrap gap-2">
          <div className="d-flex flex-row flex-md-column flex-wrap justify-content-center gap-1">
            <button
              className="boton-personalizado rojo"
              onClick={() => setSeccionActiva("buscador")}
            >
              Buscador
            </button>
            <button
              className="boton-personalizado verde"
              onClick={() => setSeccionActiva("playlist")}
            >
              PlayList
            </button>
            <button className="boton-personalizado rojo">Lo más cantado</button>
            <button
              className="boton-personalizado verde"
              onClick={() => setSeccionActiva("favoritos")}
            >
              Favoritos
            </button>
            <button
              onClick={() => setSeccionActiva("listaCanciones")}
              className="boton-personalizado rojo"
            >
              Lista de Canciones
            </button>
            <button
              className="boton-personalizado verde"
              onClick={() => setSeccionActiva("sugerirCanciones")}
            >
              Sugerir Canciones
            </button>
            <button className="boton-personalizado rojo">
              Scanner a Celular
            </button>
          </div>

          <div className="flex-grow-1"> {renderContenido()}</div>

          <div className="d-flex flex-row flex-md-column flex-wrap justify-content-center gap-2">
            <button
              className="boton-personalizado rojo"
              onClick={() => setSeccionActiva("ingresar")}
            >
              Ingresar
            </button>
            <button className="boton-personalizado verde"
                            onClick={() => setSeccionActiva("listadoPdf")} > 
Listado PDF</button>


            

            <button className="boton-personalizado rojo">Calificación</button>
            <button className="boton-personalizado verde">Suscribir</button>
            <button className="boton-personalizado rojo"
                                        onClick={() => setSeccionActiva("ayuda")} > 

Ayuda</button>
            <button className="boton-personalizado verde">Galería Otros</button>
          </div>
        </div>

        {/* Cola dinámica */}

        <div className="d-flex flex-wrap justify-content-center gap-3 m-3">
          {cola.map((cancion, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="song-icon position-relative"
              style={{ cursor: "pointer" }}
              
            >
              <FaCompactDisc size={40} className="mb-1 text-primary" />
              <div className="custom-tooltip">
                <strong>{cancion.titulo}</strong>
                <br />
                <small>{cancion.artista}</small>
              </div>
            </div>
          ))}
        </div>

        <AnunciosVisibles />
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
