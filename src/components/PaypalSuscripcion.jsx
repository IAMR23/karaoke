import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Message({ content }) {
  return <p>{content}</p>;
}

function PaypalSuscripcion({ planId , userId = "user_123" }) {
  const initialOptions = {
    "client-id": "AX-QrOl40YLb-vOl8j3wdMGcTsgAGTjxiSrTaSLiiMeqIpOQTRGpcXm8djIVNv6zgbOj-SN9x3ALlaxO",
    vault: true,
    intent: "subscription",
    currency: "USD",
  };

  const [message, setMessage] = useState("");

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: planId,
              custom_id: userId, // ¡Clave para saber quién paga!
            });
          }}
          onApprove={(data, actions) => {
            setMessage(`Suscripción creada con éxito. ID: ${data.subscriptionID}`);
            console.log("Datos de la suscripción:", data);
            // Puedes hacer un fetch aquí para notificar a tu backend si deseas
          }}
          onError={(err) => {
            setMessage(`Error en la suscripción: ${err.message}`);
            console.error(err);
          }}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  );
}

export default PaypalSuscripcion;
