import React, { useEffect, useState } from "react";
import axios from "axios";

const ListaCanciones = () => {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/song"; // ajusta la URL según tu backend

  useEffect(() => {
    const fetchCanciones = async () => {
      try {
        const res = await axios.get(API_URL);
        setCanciones(res.data);
      } catch (err) {
        setError("Error al cargar las canciones");
      } finally {
        setLoading(false);
      }
    };

    fetchCanciones();
  }, []);

  if (loading) return <p>Cargando canciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      <h2>Lista de Canciones</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Artista</th>
            <th>Géneros</th>
          </tr>
        </thead>
        <tbody>
          {canciones.map((cancion) => (
            <tr key={cancion._id}>
              <td>{cancion.titulo}</td>
              <td>{cancion.artista}</td>
              <td>
                {cancion.generos && cancion.generos.length > 0
                  ? cancion.generos.map((g) => g.nombre).join(", ")
                  : "Sin géneros"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCanciones;
