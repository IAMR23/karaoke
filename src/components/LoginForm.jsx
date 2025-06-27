import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userServices";
import { jwtDecode } from "jwt-decode";

function LoginForm({ setAuth }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación básica
    if (!credentials.email || !credentials.password) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.token);

      const decodedToken = jwtDecode(response.token);
      const userRole = decodedToken.rol;

      localStorage.setItem("rol", userRole);

      if (setAuth) {
        setAuth({ isAuthenticated: true, rol: userRole });
      }

      // Redirigir según el rol
      if (userRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      // Limpiar formulario (opcional)
      setCredentials({ email: "", password: "" });

    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow mx-2" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Spinner visual si está cargando */}
          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" />
            </div>
          )}

          {/* Enlace para registrarse */}
          <div className="text-center mt-3">
            <a href="/registro" className="text-decoration-none">
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
