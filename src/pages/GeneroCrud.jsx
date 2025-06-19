import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/genero";

export default function GeneroCRUD() {
  const [generos, setGeneros] = useState([]);
  const [form, setForm] = useState({ nombre: "", description: "" });
  const [editId, setEditId] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const fetchGeneros = async () => {
    try {
      const res = await axios.get(API_URL, { headers });
      setGeneros(res.data.genero);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  const handleOpenModal = (genero = null) => {
    if (genero) {
      setEditId(genero._id);
      setForm({ nombre: genero.nombre, description: genero.description });
    } else {
      setEditId(null);
      setForm({ nombre: "", description: "" });
    }
    const modal = new window.bootstrap.Modal(document.getElementById("generoModal"));
    modal.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("description", form.description);

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, { headers });
      } else {
        await axios.post(API_URL, formData, { headers });
        console.log(formData);
      }
      setForm({ nombre: "", description: "" });
      setEditId(null);
      fetchGeneros();
      document.getElementById("closeModalBtn").click();
    } catch (error) {
      console.error("Error al guardar género:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este género?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers });
      fetchGeneros();
    } catch (error) {
      console.error("Error al eliminar género:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2>Gestión de Géneros</h2>
      <button className="btn btn-primary mb-3" onClick={() => handleOpenModal()}>
        + Crear Género
      </button>

      {generos.length === 0 && <p>No hay géneros registrados.</p>}
      <div className="row">
        {generos.map((genero) => (
          <div className="col-md-4 mb-3" key={genero._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{genero.nombre}</h5>
                <p className="card-text">{genero.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-warning btn-sm" onClick={() => handleOpenModal(genero)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(genero._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de creación/edición */}
      <div className="modal fade" id="generoModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editId ? "Editar Género" : "Crear Género"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" id="closeModalBtn"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                {editId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
