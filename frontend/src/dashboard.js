import React, { useState, useEffect } from 'react';
import Chart from './chart';
import { simulateData } from './dataSimulation';
import './styles.css';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [customThresholds, setCustomThresholds] = useState({}); // Umbrales personalizados por material
  const [notificationSettings, setNotificationSettings] = useState({
    email: '',
    mobile: false,
  });

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const data = simulateData();
      setInventory(data);
      checkAlerts(data);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Verificar alertas con umbrales personalizados
  const checkAlerts = (data) => {
    const newAlerts = data.filter((item) => {
      const customThreshold = customThresholds[item.name] || 50; // Umbral por defecto de 50
      return item.level < customThreshold;
    });
    setAlerts(newAlerts);
    if (newAlerts.length > 0) {
      sendNotification(newAlerts); // Enviar notificaciones
    }
  };

  // Manejo del cambio de umbrales personalizados
  const handleThresholdChange = (e, material) => {
    const newThresholds = { ...customThresholds, [material]: e.target.value };
    setCustomThresholds(newThresholds);
  };

  // Enviar notificaciones (simuladas por ahora)
  const sendNotification = (alerts) => {
    console.log("Enviando notificaciones...", alerts);
    if (notificationSettings.email) {
      alert(`Correo enviado a ${notificationSettings.email}`);
    }
    if (notificationSettings.mobile) {
      alert("Notificación enviada al móvil");
    }
  };

  // Manejo de cambios en la configuración de notificaciones
  const handleNotificationChange = (e) => {
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard">
      <div className="section">
        <h2>Monitoreo de Inventario</h2>
        <Chart data={inventory} />
      </div>

      <div className="section">
        <h2>Ajustes de Umbrales Personalizados</h2>
        {inventory.map((item, index) => (
          <div key={index}>
            <label>{item.name}:</label>
            <input
              type="number"
              value={customThresholds[item.name] || 50}
              onChange={(e) => handleThresholdChange(e, item.name)}
            />
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Configuración de Notificaciones</h2>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={notificationSettings.email}
          onChange={handleNotificationChange}
        />
        <label>Notificaciones Móviles:</label>
        <input
          type="checkbox"
          name="mobile"
          checked={notificationSettings.mobile}
          onChange={() => setNotificationSettings({ ...notificationSettings, mobile: !notificationSettings.mobile })}
        />
      </div>

      <div className="section alerts">
        <h2>Alertas Activas</h2>
        {alerts.length > 0 ? (
          alerts.map((item, index) => (
            <div key={index} className="alert">
              {item.name} está por debajo del umbral (Nivel: {item.level})
            </div>
          ))
        ) : (
          <p>No hay alertas activas</p>
        )}
      </div>

      <div className="section metrics">
        <h2>Métricas Clave</h2>
        <p>Nivel Promedio de Inventario: {averageInventory(inventory)}</p>
        <p>Total de Alertas: {alerts.length}</p>
      </div>
    </div>
  );
};

// Función para calcular el nivel promedio de inventario
const averageInventory = (inventory) => {
  const total = inventory.reduce((sum, item) => sum + item.level, 0);
  return (total / inventory.length).toFixed(2);
};

export default Dashboard;
