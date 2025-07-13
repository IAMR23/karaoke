import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AnunciosVisibles.css"
const AnunciosVisibles = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [error, setError] = useState(null);
  //test 
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await axios.get(`${API_URL}/anuncio/visible`);
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
  <div className="bg-primary text-white py-2 w-100 overflow-hidden position-relative">
  <div className="marquee d-flex fs-3"> {/* <-- Tamaño aumentado con fs-4 */}
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
