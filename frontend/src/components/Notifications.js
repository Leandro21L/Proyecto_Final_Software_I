import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css'; // Ruta relativa desde el componente

const Notifications = ({ messages }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Las notificaciones desaparecen después de 5 segundos

    return () => clearTimeout(timer);
  }, [messages]);

  if (!visible || messages.length === 0) return null;

  return (
    <div className="notifications-container">
      {messages.map((msg, index) => (
        <div key={index} className="notification warning">
          <span className="notification-icon">⚠️</span>
          <span className="notification-message">{msg}</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;