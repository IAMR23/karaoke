import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AnunciosVisibles.css"
const AnunciosVisibles = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await axios.get("http://localhost:5000/anuncio/visible");
        setAnuncios(res.data);
      } catch (err) {
        setError("Error al cargar los anuncios");
      }
    };

    fetchAnuncios();
  }, []); 

  if (error) return <p className="text-danger">{error}</p>;
  if (anuncios.length === 0) return <p className="text-light"></p>;

  return (
    <div className="bg-primary text-white py-4 w-100 overflow-hidden position-relative">
      <div className="marquee d-flex">
        {anuncios.map((anuncio, index) => (
          <div key={index} className="px-4"> 
            <strong>{anuncio.titulo}: </strong>
            {anuncio.contenido}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnunciosVisibles;
