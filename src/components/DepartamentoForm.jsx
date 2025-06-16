import { useState } from "react";
import { createDepartamento } from "../services/departamentServices";

function DepartamentoForm() {
  const [formData, setFormData] = useState({
    titulo: "Prueba",
    descripcion: "Prueba",
    precio: "120",
    ubicacion: "Quito",
    habitaciones: "3",
    caracteristicas: "Muchas, cosas, interesantes",
    condiciones: "",
  });

  const [fotos, setFotos] = useState([]); // Archivos de imágenes
  const [previewUrls, setPreviewUrls] = useState([]); // URLs de vista previa
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la selección de imágenes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + fotos.length > 3) {
      setError("Solo puedes subir un máximo de 3 imágenes.");
      return;
    }

    setFotos((prevFotos) => [...prevFotos, ...files]);
    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setError(null);
  };

  // Eliminar una imagen seleccionada
  const handleRemoveImage = (index) => {
    setFotos((prevFotos) => prevFotos.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
  
      // Agregar las imágenes al FormData
      fotos.forEach((file) => {
        formDataToSend.append("fotos", file);
      });
  
      // Enviar al backend
      await createDepartamento(formDataToSend);
  
      setSuccess("Departamento registrado exitosamente.");
      
      // Resetear el formulario después del éxito
      setFormData({
        titulo: "",
        descripcion: "",
        precio: "",
        ubicacion: "",
        habitaciones: "",
        caracteristicas: "",
        condiciones: "",
      });
      setFotos([]);
      setPreviewUrls([]);
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al registrar el departamento."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Departamento</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
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

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">
            Número de Habitaciones
          </label>
          <input
            type="number"
            name="habitaciones"
            value={formData.habitaciones}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">
            Características (separadas por coma)
          </label>
          <input
            type="text"
            name="caracteristicas"
            value={formData.caracteristicas}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Condiciones</label>
          <textarea
            name="condiciones"
            value={formData.condiciones}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            required
          />
        </div>

        {/* Input de archivos */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Subir Fotos (Máx: 3 JPG)</label>
          <input
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
          />
        </div>

        {/* Vista previa de imágenes */}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Vista previa:</h3>
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Vista previa ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default DepartamentoForm;
