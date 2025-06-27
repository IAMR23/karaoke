import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PlaylistSelectorModal({ 
  userId, 
  songId, 
  show, 
  onClose, 
  onAddToPlaylistSuccess 
}) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!show) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/t/playlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(res.data || []);
      } catch (err) {
        setError("Error cargando playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [show, userId]);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      alert("Selecciona una playlist");
      return;
    }

    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/t/playlist/${selectedPlaylistId}/addSong/`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Canción agregada a la playlist!");
      onAddToPlaylistSuccess && onAddToPlaylistSuccess();
      onClose();
    } catch (err) {
      alert("Error al agregar la canción");
    } finally {
      setAdding(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h3>Selecciona un playlist</h3>

        {loading && <p>Cargando playlists...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && playlists.length === 0 && <p>No tienes playlists.</p>}

        <ul style={{ listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" }}>
          {playlists.map((playlist) => (
            <li key={playlist._id} style={{ marginBottom: "10px" }}>
              <label style={{ cursor: "pointer", userSelect: "none" }}>
                <input
                  type="radio"
                  name="playlist"
                  value={playlist._id}
                  checked={selectedPlaylistId === playlist._id}
                  onChange={() => setSelectedPlaylistId(playlist._id)}
                  style={{ marginRight: "8px" }}
                />
                🎵 {playlist.nombre}
              </label>
            </li>
          ))}
        </ul>

        <button
          disabled={adding}
          onClick={handleAddToPlaylist}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: adding ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: adding ? "not-allowed" : "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          {adding ? "Guardando..." : "Guardar en playlist"}
        </button>
      </div>
    </div>
  );
}
