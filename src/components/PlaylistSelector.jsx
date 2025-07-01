import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { BsMusicNote } from "react-icons/bs";

const PlaylistSelector = ({ playlists, onSelect, onAdd, onClose }) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const isValidArray = Array.isArray(playlists);

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que recargue la página
    if (newPlaylistName.trim()) {
      onAdd(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  return (
    <div
      className="bg-white p-4 rounded shadow-sm w-100"
      style={{ maxWidth: "100%" }}
    >
      <div className="d-flex align-items-center mb-3">
        <BsMusicNote size={24} className="me-2 text-primary" />
        <h3 className="mb-0">Tus Playlists</h3>
      </div>

      <form className="input-group mb-3" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del nuevo playlist"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          aria-label="Nuevo playlist"
          autoFocus
        />
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center"
          type="submit"
          title="Crear nuevo playlist"
        >
          <FaPlus />
        </button>
      </form>

      {!isValidArray || playlists.length === 0 ? (
        <p className="text-muted text-center">No tienes playlists aún.</p>
      ) : (
        <ul
          className="list-group"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {playlists.map((playlist, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(playlist)}
            >
              <BsMusicNote className="text-primary" />
              {playlist.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistSelector;
