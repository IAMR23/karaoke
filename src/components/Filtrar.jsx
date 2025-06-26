import React, { useEffect, useState } from 'react'

import axios from "axios";

export default function Filtrar() {
  const API_URL = "http://localhost:5000/song";

const FILTRO_URL = "http://localhost:5000/song/filtrar";
const GENEROS_URL = "http://localhost:5000/genero";
    const handleFiltrar = (e) => {
    e.preventDefault();
    fetchVideos(true);
  };
    const [videos, setVideos] = useState([]);
      const [generos, setGeneros] = useState([]);
    

      // Estados para filtros
      const [filtros, setFiltros] = useState({
        titulo: "",
        artista: "",
        genero: [],
        ordenFecha: "desc",
      });
    
  

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const fetchVideos = async (usarFiltro = false) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const url = usarFiltro ? FILTRO_URL : API_URL;

      const params = usarFiltro
        ? {
            titulo: filtros.titulo,
            artista: filtros.artista,
            genero: filtros.genero,
            ordenFecha: filtros.ordenFecha,
          }
        : {};

      const res = await axios.get(url, { headers, params });
      setVideos(res.data.canciones || res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Error al cargar videos", err);
    }
  };

    const fetchGeneros = async () => {
    try {
      const res = await axios.get(GENEROS_URL);
      setGeneros(res.data.genero); // Asumes que viene como { genero: [...] }
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };



    useEffect(() => {
      fetchVideos();
      fetchGeneros();
    }, []);
  
  return (
   <>
        {/* Formulario de Filtros */}
      <form
        onSubmit={handleFiltrar}
        className=" flex flex-wrap items-end"
      >
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={filtros.titulo}
          onChange={handleChange}
          className="p-2 m-2 border rounded"
        />
        <input
          type="text"
          name="artista"
          placeholder="Artista"
          value={filtros.artista}
          onChange={handleChange}
          className="p-2 m-2 border rounded"
        />
        <select
          className="p-2 m-2 border rounded"
          value={filtros.generos}
          onChange={(e) => {
            const selected = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setFiltros({ ...filtros, generos: selected });
          }}
        >
          {generos.map((g) => (
            <option key={g._id} value={g._id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <select
          name="ordenFecha"
          value={filtros.ordenFecha}
          onChange={handleChange}
          className=" p-2 m-2 border rounded"
        >
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguos</option>
        </select>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Filtrar
        </button>
      </form></>
  )
}
