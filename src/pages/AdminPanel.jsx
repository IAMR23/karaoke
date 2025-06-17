import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido</h1>
      <h2 className="text-2xl font-semibold mb-8">Panel Administrativo</h2>
      <div className="flex space-x-4">
        <div
          className="card bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
          onClick={() => handleNavigate("/gestionar-cuentas")}
        >
          <h2 className="text-xl font-semibold">Gestionar Cuentas</h2>
          <p>Administra las cuentas de los usuarios.</p>
        </div>
        <div
          className="card bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-300"
          onClick={() => handleNavigate("/gestionar-departamentos")}
        >
          <h2 className="text-xl font-semibold">Gestionar Departamentos</h2>
          <p>Administra los departamentos de la organización.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
