import React, { useEffect, useState } from "react";
import MisDepartamentos from "../components/MisDepartamentos";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      // Aquí deberías obtener la información real del usuario.
      // Ejemplo: const data = await getUser();
      // En este ejemplo se simula brevemente la obtención de datos.
      const data = {};
      setUser(data);
    }
    fetchUser();
  }, []);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Sidebar />
      <section className="mb-8">
        <MisDepartamentos />
      </section>
    </div>
  );
}

export default Dashboard;
