import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/anuncio';

export default function AnunciosCRUD() {
    const [anuncios, setAnuncios] = useState([]);
    const [form, setForm] = useState({ titulo: '', contenido: '', visible: true });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchAnuncios();
    }, []);

    const fetchAnuncios = async () => {
        try {
            const res = await axios.get('http://localhost:5000/anuncio');
            setAnuncios(res.data);
        } catch (err) {
            console.error('Error al obtener anuncios', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json", // o application/json si no usas archivos
            };

            if (editId) {
                await axios.put(`${API_URL}/${editId}`, form, { headers });
            } else {
                console.log(headers, form);
                console.log("CP1");
                await axios.post(API_URL, form, { headers });
                console.log("CP2");

            }

            setForm({ titulo: '', contenido: '', visible: true });
            setEditId(null);
            fetchAnuncios();
        } catch (err) {
            console.error('Error al guardar el anuncio', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };
            await axios.delete(`${API_URL}/${id}`, { headers });
            fetchAnuncios();
        } catch (err) {
            console.error('Error al eliminar el anuncio', err);
        }
    };

    const toggleVisible = async (anuncio) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };
            await axios.put(`${API_URL}/${anuncio._id}`, {
                ...anuncio,
                visible: !anuncio.visible,
            }, { headers });
            fetchAnuncios();
        } catch (err) {
            console.error("Error al cambiar visibilidad", err);
        }
    };



    return (
        <div className="">
            <h1 className="text-center">Gestión de Anuncios</h1>

            {/* Botón para abrir el modal */}
            <div className="text-end mb-3">
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#anuncioModal"
                    onClick={() => {
                        setForm({ titulo: "", contenido: "", visible: false });
                        setEditId(null);
                    }}
                >
                    Crear Anuncio
                </button>
            </div>

            {/* Modal de Bootstrap */}
            <div
                className="modal fade"
                id="anuncioModal"
                tabIndex="-1"
                aria-labelledby="anuncioModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="anuncioModalLabel">
                                    {editId ? "Editar Anuncio" : "Nuevo Anuncio"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.titulo}
                                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contenido</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={form.contenido}
                                        onChange={(e) =>
                                            setForm({ ...form, contenido: e.target.value })
                                        }
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={form.visible}
                                        onChange={(e) =>
                                            setForm({ ...form, visible: e.target.checked })
                                        }
                                    />
                                    <label className="form-check-label">Visible</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {editId ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Lista de anuncios */}
            <div className="mt-5">
                <h4 className="mb-3">Lista de Anuncios</h4>
                {anuncios.map((anuncio) => (
                    <div key={anuncio._id} className={`card mb-3 shadow-sm border-danger `}>
                        <div className="card-body">
                            <h5 className="card-title">{anuncio.titulo}</h5>
                            <p className="card-text">{anuncio.contenido}</p>
                            <p className={`card-text small fw-bold ${anuncio.visible ? 'text-success' : 'text-danger'}`}>
                                {anuncio.visible ? 'Activo' : 'Desactivado'}
                            </p>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                        setEditId(anuncio._id);
                                        setForm({
                                            titulo: anuncio.titulo,
                                            contenido: anuncio.contenido,
                                            visible: anuncio.visible,
                                        });
                                        const modal = new bootstrap.Modal(document.getElementById("anuncioModal"));
                                        modal.show();
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(anuncio._id)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className={`btn btn-sm ${anuncio.visible ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                    onClick={() => toggleVisible(anuncio)}
                                >
                                    {anuncio.visible ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>

    );
}
