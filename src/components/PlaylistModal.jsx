import React, { useState } from "react";

const PlaylistModal = ({ playlists, onSelect, onAdd, onClose }) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const isValidArray = Array.isArray(playlists);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Tus Playlists</h2>

        {!isValidArray || playlists.length === 0 ? (
          <p>No tienes playlists aún.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {playlists.map((playlist, i) => (
              <li
                key={i}
                style={{
                  padding: "10px",
                  background: "#f0f0f0",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSelect(playlist);
                  onClose();
                }}
              >
                🎵 {playlist.nombre}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          placeholder="Nombre del nuevo playlist"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <button
          onClick={() => {
            if (newPlaylistName.trim()) {
              onAdd(newPlaylistName.trim());
              setNewPlaylistName("");
            }
          }}
          style={{
            marginTop: "10px",
            padding: "10px",
            width: "100%",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ➕ Crear nuevo playlist
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "10px",
            width: "100%",
            background: "#ccc",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;
