import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";

import Inicial from "./pages/Inicial";
import Planes from "./pages/Planes";
import React from "react";
import AnunciosCRUD from "./pages/AnunciosCrud";
import CancionesCRUD from "./pages/CancionesCrud";
import GeneroCRUD from "./pages/GeneroCrud";
import FavoritosPage from "./pages/FavoritosPage";
import PromocionesPage from "./pages/PromocionesPage";
import SidebarLayout from "./components/SidebarLayout";
import UsuariosPage from "./pages/UsuariosPage";
import SolicitudesCancion from "./pages/SolicitudCancion";
import ListaCanciones from "./components/ListaCanciones";
import PublicacionesCrud from "./pages/PublicacionesCrud";

function App() {
  // 🔹 Estado global de autenticación
  const [auth, setAuth] = useState({ isAuthenticated: false, rol: null });

  useEffect(() => {
    // 🔹 Verificar si hay un token guardado
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuth({ isAuthenticated: true, rol: decodedToken.rol });
      } catch (error) {
        console.error("Error al decodificar el token", error);
        localStorage.removeItem("token"); // Elimina el token si es inválido
        setAuth({ isAuthenticated: false, rol: null });
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* 🔹 Pasamos auth y setAuth a Navbar para manejar autenticación */}
        <Navbar auth={auth} setAuth={setAuth} />
        <main className="flex-grow w-full ">
          <Routes>
            <Route path="/" element={<SidebarLayout />}>
              <Route path="anuncios" element={<AnunciosCRUD />} />
              <Route path="canciones" element={<CancionesCRUD />} />
              <Route path="genero" element={<GeneroCRUD />} /> 
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="promociones" element={<PromocionesPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
            </Route>
            <Route path="favoritos" element={<FavoritosPage />} />
            {/* Son las funcionalidades de los botones */}
            <Route path="solicitud" element={<SolicitudesCancion />} />
            <Route path="listacanciones" element={<ListaCanciones />} />
            <Route path="test" element={<PublicacionesCrud />} />

            <Route index="/" element={<Inicial />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/propiedad/:id" element={<PropertyDetail />} />
            <Route path="/buscar" element={<SearchResults />} />
            {/* 🔹 Pasamos setAuth a LoginForm para actualizar estado tras login */}
            <Route path="/login" element={<LoginForm setAuth={setAuth} />} />
            <Route path="/registro" element={<RegistrationForm />} />
          
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
