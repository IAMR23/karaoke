import React, { useEffect, useState } from "react";

function GestionarCuentas() {
  const [arrendadoresPendientes, setArrendadoresPendientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArrendadoresPendientes = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token de autenticación si es necesario
      const response = await fetch(
        "http://localhost:5000/arrendadores/verificacion",
        {
          method: "GET",
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
      setArrendadoresPendientes(data); // Almacena los datos en el estado
    } catch (err) {
      setError(err.message); // Maneja errores
    } finally {
      setLoading(false); // Indica que la carga ha terminado
    }
  };

  useEffect(() => {
    // Función para obtener los arrendadores pendientes

    fetchArrendadoresPendientes();
  }, []);

  // Función para manejar la aprobación de un arrendador
  const handleAprobar = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token de autenticación si es necesario
      const response = await fetch(
        `http://localhost:5000/aprobar/arrendador/${id}`,
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
      setArrendadoresPendientes(data); // Almacena los datos en el estado
      fetchArrendadoresPendientes();
    } catch (err) {
      setError(err.message); // Maneja errores
    }
  };

  // Función para manejar el rechazo de un arrendador
  const handleRechazar = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token de autenticación si es necesario
      const response = await fetch(
        `http://localhost:5000/desactivar/arrendador/${id}`,
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
      setArrendadoresPendientes(data); // Almacena los datos en el estado
      fetchArrendadoresPendientes();
    } catch (err) {
      setError(err.message); // Maneja errores
    }
  };

  if (loading) {
    return <p>Cargando arrendadores pendientes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Gestionar Cuentas</h1>
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Arrendadores Pendientes
      </h2>
      {arrendadoresPendientes.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Verificado</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {arrendadoresPendientes.map((arrendador) => (
              <tr key={arrendador.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">
                  {arrendador.nombre}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {arrendador.email}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {arrendador.verificado ? (
                    <span className="text-green-600">Sí</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleAprobar(arrendador._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazar(arrendador._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay arrendadores pendientes.</p>
      )}
    </div>
  );
}

export default GestionarCuentas;
