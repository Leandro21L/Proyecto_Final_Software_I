import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FinishedProducts from './components/FinishedProducts';
import InventoryMovements from './components/InventoryMovements';
import RawMaterials from './components/RawMaterials';
import ProductsMaterials from './components/ProductsMaterials';
import Reports from './components/Reports'; 
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import './styles/app.css';
import './styles/Notifications.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <header>
        <h1>Gestión de Inventario</h1>
      </header>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/users/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/" />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/products" element={<FinishedProducts />} />
            <Route path="/inventory-movements" element={<InventoryMovements />} />
            <Route path="/materials" element={<RawMaterials />} />
            <Route path="/products-materials" element={<ProductsMaterials />} />
            <Route path="/reports" element={<Reports />} /> {/* Nueva ruta */}
            <Route path="/" element={<Navigate to="/products" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;