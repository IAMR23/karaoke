import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDepartamentosPorVerificar } from "../services/departamentServices"; // Asegúrate de que esta ruta sea correcta

function GestionarDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState(null);

  const fetchDepartamentos = async () => {
    try {
      const data = await obtenerDepartamentosPorVerificar();
      setDepartamentos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Función para manejar la aprobación de un arrendador
  const handleAprobar = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token de autenticación si es necesario
      const response = await fetch(
        `http://localhost:5000/aprobar/departamento/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado si es necesario
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los arrendadores pendientes");
      }

      const data = await response.json();
      setDepartamentos(data); // Almacena los datos en el estado
      fetchDepartamentos();
    } catch (err) {
      setError(err.message); // Maneja errores
    }
  };

  // Función para manejar el rechazo de un arrendador
  const handleRechazar = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token de autenticación si es necesario
      const response = await fetch(
        `http://localhost:5000/desaprobar/departamento/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado si es necesario
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los arrendadores pendientes");
      }

      const data = await response.json();
      setDepartamentos(data); // Almacena los datos en el estado
      fetchDepartamentos();
    } catch (err) {
      setError(err.message); // Maneja errores
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}
      <h2 className="text-2xl font-bold mb-6">Mis Departamentos</h2>
      {departamentos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departamentos.map((departamento) => (
            <div
              key={departamento._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Imágenes */}
              <div className="flex overflow-x-auto p-2">
                {departamento.fotos.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`Foto ${index + 1} de ${departamento.titulo}`}
                    className="w-32 h-32 object-cover rounded-lg mr-2"
                  />
                ))}
              </div>

              {/* Contenido de la card */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {departamento.titulo}
                </h3>
                <p className="text-gray-600 mb-2">{departamento.descripcion}</p>
                <p className="text-gray-700 font-bold mb-2">
                  ${departamento.precio}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Ubicación:</strong> {departamento.ubicacion}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Habitaciones:</strong> {departamento.habitaciones}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Características:</strong>
                </p>
                <ul className="list-disc list-inside mb-2">
                  {departamento.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="text-gray-600">
                      {caracteristica}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 mb-2">
                  <strong>Condiciones:</strong> {departamento.condiciones}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Fecha de Publicación:</strong>{" "}
                  {new Date(departamento.fechaPublicacion).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Aprobado:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      departamento.aprobado ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {departamento.aprobado ? "Sí" : "No"}
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Disponible:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      departamento.disponible
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {departamento.disponible ? "Sí" : "No"}
                  </span>
                </p>

                {/* Botón para ver detalles */}
                <button
                  onClick={() => handleAprobar(departamento._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleRechazar(departamento._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tienes departamentos publicados.</p>
      )}
    </div>
  );
}

export default GestionarDepartamentos;
