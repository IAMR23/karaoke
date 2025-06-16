import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../services/api';
import Messaging from '../components/Messaging';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const data = await getPropertyById(id);
      setProperty(data);
    };
    fetchProperty();
  }, [id]);

  if (!property) return <p>Cargando propiedad...</p>;

  return (
    <div>
      <img src={property.image} alt={property.title} className="w-full h-64 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{property.title}</h1>
      <p className="text-gray-700 mt-2">Precio: ${property.price} / mes</p>
      <p className="mt-4">Descripción detallada de la propiedad...</p>
      <Messaging />
    </div>
  );
}

export default PropertyDetail;
