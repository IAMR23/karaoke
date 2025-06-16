import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getProperties();
      // Filtra las propiedades cuyo título contenga la consulta
      const filtered = data.filter(property => property.title.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
    };
    fetchResults();
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Resultados de búsqueda para: "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length > 0 ? (
          results.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
