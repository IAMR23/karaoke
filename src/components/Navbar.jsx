import { Link } from "react-router-dom";
import React from "react";
export default function Navbar({ auth, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid">
        {/* Botón hamburguesa alineado a la derecha */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="mainNavbar"
        >
          <ul className="navbar-nav d-flex flex-wrap align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/planes">
                Planes
              </Link>
            </li>

            {(!auth.isAuthenticated || auth.role !== "arrendador") && (
              <li className="nav-item">
                <Link className="nav-link" to="/buscar">
                  Favoritos ⭐
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/">
                AMERICAN KARAOKE 🎤🎶
              </Link>
            </li>

            {!auth.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">
                    Registro
                  </Link>
                </li>
              </>
            )}

            {auth.isAuthenticated && auth.role !== "arrendatario" && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            )}

            {auth.isAuthenticated &&
              auth.role !== "arrendador" &&
              auth.role !== "arrendatario" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              )}

            {auth.isAuthenticated && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
