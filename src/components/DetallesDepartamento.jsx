import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDepartamento, updateDepartament } from "../services/departamentServices";

function DetallesDepartamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    ubicacion: "",
    habitaciones: "",
    caracteristicas: "",
    condiciones: "",
    disponibilidad: false,
  });

  const [fotos, setFotos] = useState([]); // Fotos existentes
  const [nuevasFotos, setNuevasFotos] = useState([]); // Nuevas fotos a subir
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener detalles del departamento al cargar el componente
  useEffect(() => {
    if (id) {
      obtenerDepartamento(id)
        .then((response) => {
          const dept = response.data;
          console.log("Datos del backend:", dept); // 🔍 Depuración

          setFormData({
            titulo: dept.titulo,
            descripcion: dept.descripcion,
            precio: dept.precio,
            ubicacion: dept.ubicacion,
            habitaciones: dept.habitaciones,
            caracteristicas: dept.caracteristicas.join(", "),
            condiciones: dept.condiciones,
            disponibilidad: dept.disponible || false,
          });

          // Guardar las URLs de las imágenes en el estado
          setFotos(dept.fotos || []);
          setIsLoading(false);
        })
        .catch(() => {
          setError("Error al cargar los detalles del departamento");
          setIsLoading(false);
        });
    }
  }, [id]);

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "disponibilidad" ? value === "Sí" : value, // Convertir disponibilidad a booleano
    }));
  };

  // Manejar selección de nuevas imágenes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNuevasFotos(files);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "disponibilidad") {
          formDataToSend.append("disponible", value);
        } else {
          formDataToSend.append(key, value);
        }
      });
  
      // Incluir imágenes nuevas solo si hay
      if (nuevasFotos.length > 0) {
        nuevasFotos.forEach((file) => {
          formDataToSend.append("fotos", file);
        });
      }
  
      const updatedDepartamento = await updateDepartament(id, formDataToSend);
      
      // Actualizar la vista con las nuevas fotos del backend
      setFotos(updatedDepartamento.fotos);
      
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Error al actualizar el departamento.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Detalles del Departamento</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Campo Título */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Descripción */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Precio */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Ubicación */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Habitaciones */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Número de Habitaciones</label>
          <input
            type="number"
            name="habitaciones"
            value={formData.habitaciones}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Características */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Características</label>
          <input
            type="text"
            name="caracteristicas"
            value={formData.caracteristicas}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Campo Disponibilidad */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Disponibilidad</label>
          <select
            name="disponibilidad"
            value={formData.disponibilidad ? "Sí" : "No"}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          >
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Vista previa de imágenes existentes */}
        {fotos.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Imágenes Actuales:</h3>
            <div className="grid grid-cols-3 gap-2">
              {fotos.map((foto, index) => (
                <img key={index} src={foto} alt={`Foto ${index + 1}`} className="w-24 h-24 object-cover rounded border" />
              ))}
            </div>
          </div>
        )}

        {/* Subir nuevas imágenes */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Subir Nuevas Fotos (JPG)</label>
          <input
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default DetallesDepartamento;
