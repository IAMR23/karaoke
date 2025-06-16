import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // Para decodificar el token

function Chat() {
  const [token, setToken] = useState(""); // Token JWT del usuario
  const [userId, setUserId] = useState(""); // ID del usuario extraído del token
  const [recipientId, setRecipientId] = useState(""); // ID del destinatario
  const [message, setMessage] = useState(""); // Mensaje a enviar
  const [chatMessages, setChatMessages] = useState([]); // Lista de mensajes
  const ws = useRef(null); // Referencia al WebSocket

  // Extraer userId del token cuando se proporciona
  const connectWithToken = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decodifica el token
        const extractedUserId = decoded.userId; // Ajusta según la estructura de tu token
        setUserId(extractedUserId);
      } catch (error) {
        alert("Token inválido");
      }
    }
  };

  // Conectar al WebSocket cuando se tiene un userId
  useEffect(() => {
    if (userId) {
      ws.current = new WebSocket(`ws://localhost:8080?userId=${userId}`);

      ws.current.onopen = () => {
        console.log("Conectado al servidor WebSocket");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          alert(data.error);
        } else {
          setChatMessages((prev) => [
            ...prev,
            {
              from: data.from,
              content: data.content,
              timestamp: data.timestamp,
            },
          ]);
        }
      };

      ws.current.onclose = () => {
        console.log("Desconectado del servidor");
      };

      // Limpieza al desmontar el componente
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [userId]);

  // Enviar mensaje
  const sendMessage = () => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      recipientId &&
      message
    ) {
      const payload = JSON.stringify({ recipientId, content: message });
      ws.current.send(payload);
      setMessage(""); // Limpia el campo de mensaje
    } else {
      alert("Conéctate primero y asegúrate de llenar todos los campos");
    }
  };

  return (
    <div className="Chat">
      <h1>Chat en Tiempo Real</h1>

      {/* Campo para el token */}
      {!userId ? (
        <div>
          <input
            type="text"
            placeholder="Pega tu token JWT aquí"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={connectWithToken}>Conectar</button>
        </div>
      ) : (
        <div>
          <p>Conectado como usuario: {userId}</p>

          {/* Campo para el ID del destinatario */}
          <input
            type="text"
            placeholder="ID del destinatario"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />

          {/* Área de mensajes */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
              margin: "10px 0",
            }}
          >
            {chatMessages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.from}:</strong> {msg.content}{" "}
                <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
              </p>
            ))}
          </div>

          {/* Campo para escribir mensaje */}
          <input
            type="text"
            placeholder="Escribe un mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      )}
    </div>
  );
}

export default Chat;
