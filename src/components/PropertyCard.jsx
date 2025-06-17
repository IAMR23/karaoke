import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  return (
    <div className="bg-white shadow-md rounded p-4">
      {/* Mostrar una imagen por defecto si no hay imagen en la propiedad */}
      <img
        src={property.image || 'https://via.placeholder.com/400x300'}
        alt={property.title || 'Imagen de la propiedad'}
        className="w-full h-48 object-cover rounded"
        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'} // Imagen por defecto si hay error
      />

      <h3 className="text-xl font-bold mt-2">{property.title || 'Propiedad sin título'}</h3>
      <p className="text-gray-600">${property.price ? property.price : 'N/A'} / mes</p>

      <Link
        to={`/propiedad/${property._id || property.id}`} // Soporte para _id o id
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        Ver detalles
      </Link>
    </div>
  );
}

export default PropertyCard;
