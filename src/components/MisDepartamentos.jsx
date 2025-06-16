import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDepartamentosPorArrendador } from "../services/departamentServices";
import { jwtDecode } from "jwt-decode";

function MisDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Obtener el userId del token una sola vez al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.userId); // Asegúrate de que 'userId' es correcto en el payload
        console.log("Usuario ID:", decodedToken.userId);
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // Obtener los departamentos cuando user tenga un valor válido
  useEffect(() => {
    const fetchDepartamentos = async () => {
      if (!user) return; // Evitar llamadas con user null
      try {
        const data = await obtenerDepartamentosPorArrendador(user);

        // Normalizar los datos para evitar problemas con disponibilidad
        const departamentosConDisponibilidad = data.map((dept) => ({
          ...dept,
          disponible: dept.disponible ? "Sí" : "No", // Convertimos booleano a string para UI
        }));

        setDepartamentos(departamentosConDisponibilidad);
      } catch (error) {
        setError(error.message || "Error al obtener los departamentos.");
      }
    };

    fetchDepartamentos();
  }, [user]); // Se ejecuta cuando user cambia

  // Navegar a los detalles del departamento
  const handleVerDetalles = (id) => {
    navigate(`/misdepartamentos/${id}`);
  };

  // Navegar al formulario para crear un nuevo departamento
  const handleCrearDepartamento = () => {
    navigate("/crear/departamento");
  };

  console.log("Departamentos:", departamentos); // Debugging

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Departamentos</h2>
        <button
          onClick={handleCrearDepartamento}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Crear Departamento
        </button>
      </div>

      {departamentos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departamentos.map((departamento) => (
            <div
              key={departamento._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Imágenes */}
              <div className="flex overflow-x-auto p-2">
                {departamento.fotos && departamento.fotos.length > 0 ? (
                  departamento.fotos.map((foto, index) => (
                    <img
                      key={index}
                      src={foto} // Usamos la URL completa
                      alt={`Foto ${index + 1} de ${departamento.titulo}`}
                      className="w-32 h-32 object-cover rounded-lg mr-2"
                    />
                  ))
                ) : (
                  <p className="text-gray-500">Sin imágenes</p>
                )}
              </div>

              {/* Información del departamento */}
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
                  {departamento.caracteristicas && departamento.caracteristicas.length > 0 ? (
                    departamento.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="text-gray-600">
                        {caracteristica}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">Sin características</p>
                  )}
                </ul>
                <p className="text-gray-600 mb-2">
                  <strong>Condiciones:</strong> {departamento.condiciones}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Fecha de Publicación:</strong>{" "}
                  {departamento.fechaPublicacion
                    ? new Date(departamento.fechaPublicacion).toLocaleDateString()
                    : "No disponible"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Aprobado:</strong>{" "}
                  <span
                    className={`font-semibold ${departamento.aprobado ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {departamento.aprobado ? "Sí" : "No"}
                  </span>
                </p>

                {/* Mostrar disponibilidad actualizada */}
                <p className="text-gray-600 mb-4">
                  <strong>Disponible:</strong>{" "}
                  <span
                    className={`font-semibold ${departamento.disponible === "Sí"
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {departamento.disponible}
                  </span>
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
        <p className="text-gray-600">No tienes departamentos publicados.</p>
      )}
    </div>
  );
}

export default MisDepartamentos;
