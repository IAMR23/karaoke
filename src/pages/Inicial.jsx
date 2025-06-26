import React, { useState, useEffect } from "react";
import "../styles/inicial.css";
import GaleriaYoutube from "../components/GaleriaYoutube";
import AnunciosVisibles from "../components/AnunciosVisibles";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/botones.css";

export default function Inicial() {
  let userId = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (err) {
      console.error("Token inválido", err);
      // opcional: redirigir a login
    }
  }

  const [cola, setCola] = useState([]);

  const cargarCola = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/t/cola/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(userId);
      setCola(res.data?.canciones || []);
      console.log(res.data.canciones);
    } catch (error) {
      console.error("Error al cargar la cola", error);
    }
  };

  useEffect(() => {
    cargarCola();
  }, []);

  return (
    <>
<div className="fondo container-fluid px-4 py-3 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-row justify-content-center align-items-center w-100 ">
          <img src="./icono.png" alt="" width={"100rem"}/>
          <img src="./logo.png" alt="" />

        </div>
        <div className="d-flex flex-row justify-content-center align-items-center w-100 flex-wrap gap-2">
          <div className=" d-flex flex-row flex-md-column flex-wrap justify-content-center gap-1">
            <button class="boton-personalizado rojo">Buscador</button>
            <button class="boton-personalizado verde">PlayList</button>
            <button class="boton-personalizado rojo">Lo más cantado</button>
            <button class="boton-personalizado verde">Favoritos</button>
            <button class="boton-personalizado rojo">Lista de Canciones</button>
            <button class="boton-personalizado verde">Sugerir Canciones</button>
            <button class="boton-personalizado rojo">Scanner a Celular</button>
          </div>

          <div className="flex-grow-1">
            <lite-youtube
              videoid="pL6va9fADfQ"
              className=""
            ></lite-youtube>
          </div>

          <div className="d-flex flex-row flex-md-column flex-wrap justify-content-center gap-2">
            <button class="boton-personalizado rojo">Ingresar</button>
            <button class="boton-personalizado verde">Listado PDF</button>{" "}
            <button class="boton-personalizado rojo">Calificación</button>
            <button class="boton-personalizado verde">Suscribir</button>{" "}
            <button class="boton-personalizado rojo">Ayuda</button>
            <button class="boton-personalizado verde">Galería Otros</button>
            <button class="boton-personalizado rojo">TV Smart</button>
          </div>
        </div>

        {/* Cola dinámica */}
        <div className=" m-2 d-flex flex-row gap-2  justify-content-center align-items-center p-2 mt-3">
          {cola.map((cancion, index) => (
            <div key={index} className="text-center bg-dark text-white p-2">
              🎵 {cancion.titulo}
            </div>
          ))}
        </div>
        <AnunciosVisibles />

        <GaleriaYoutube setCola={setCola} cola={cola} cargarCola={cargarCola} />
      </div>
    </>
  );
}
