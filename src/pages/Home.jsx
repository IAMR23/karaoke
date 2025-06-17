import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { obtenerDepartamentos } from "../services/departamentServices";
import { useNavigate } from "react-router-dom";

function Home() {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtener filtros desde la URL
  const filtros = {
    precioMax: searchParams.get("precioMax") || "",
    ubicacion: searchParams.get("ubicacion") || "",
    habitaciones: searchParams.get("habitaciones") || "",
  };

  const navigate = useNavigate();

  const fetchDepartamentos = async () => {
    try {
      const data = await obtenerDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Función para actualizar los filtros en la URL
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Filtrar departamentos según los valores de la URL
  const departamentosFiltrados = departamentos.filter((departamento) => {
    return (
      (filtros.precioMax === "" ||
        departamento.precio <= Number(filtros.precioMax)) &&
      (filtros.ubicacion === "" ||
        departamento.ubicacion
          .toLowerCase()
          .includes(filtros.ubicacion.toLowerCase())) &&
      (filtros.habitaciones === "" ||
        departamento.habitaciones === Number(filtros.habitaciones))
    );
  });

  const handleVerDetalles = (id) => {
    navigate(`/verdepartamento/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Filtros */}
      <aside className="w-64 bg-blue-200 p-6 shadow-md">
        <div className="flex flex-col gap-4">
          <label className="font-medium">Precio máximo:</label>
          <input
            type="number"
            placeholder="Ej: 500"
            className="p-2 border border-blue-400 rounded-md bg-white"
            value={filtros.precioMax}
            onChange={(e) => handleFilterChange("precioMax", e.target.value)}
          />

          <label className="font-medium">Ubicación:</label>
          <input
            type="text"
            placeholder="Ej: Quito"
            className="p-2 border border-blue-400 rounded-md bg-white"
            value={filtros.ubicacion}
            onChange={(e) => handleFilterChange("ubicacion", e.target.value)}
          />

          <label className="font-medium">N° de habitaciones:</label>
          <input
            type="number"
            placeholder="Ej: 3"
            className="p-2 border border-blue-400 rounded-md bg-white"
            value={filtros.habitaciones}
            onChange={(e) => handleFilterChange("habitaciones", e.target.value)}
          />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {error && <p className="text-red-500">{error}</p>}
        {departamentosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departamentosFiltrados.map((departamento) => (
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
                  <p className="text-gray-600 mb-2">
                    {departamento.descripcion}
                  </p>
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
                    {departamento.caracteristicas.map(
                      (caracteristica, index) => (
                        <li key={index} className="text-gray-600">
                          {caracteristica}
                        </li>
                      )
                    )}
                  </ul>
                  <p className="text-gray-600 mb-2">
                    <strong>Condiciones:</strong> {departamento.condiciones}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Fecha de Publicación:</strong>{" "}
                    {new Date(
                      departamento.fechaPublicacion
                    ).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleVerDetalles(departamento._id)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No hay departamentos que coincidan con los filtros.
          </p>
        )}
      </main>
    </div>
  );
}

export default Home;
