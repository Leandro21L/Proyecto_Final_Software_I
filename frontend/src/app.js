import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from "./components/RegisterForm";
import Login from './components/Login';
import InventoryList from './components/InventoryList';
import AddItemForm from './components/AddItemForm';
import EditItemForm from './components/EditItemForm';
import { getInventory } from './services/api';

function App() {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) loadInventory();
  }, [isAuthenticated]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await getInventory();
      setInventory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el inventario:', err);
      setError('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const AuthContent = () => (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={logout} 
        style={{ 
          float: 'right', 
          padding: '8px 16px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Cerrar Sesión
      </button>
      <h1>Gestión de Inventario</h1>
      <div style={{ marginBottom: '20px' }}>
        <AddItemForm onAdd={loadInventory} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      {loading ? (
        <div>Cargando inventario...</div>
      ) : (
        <InventoryList inventory={inventory} onEdit={setSelectedItem} />
      )}
      {selectedItem && (
        <EditItemForm 
          item={selectedItem} 
          onEdit={() => {
            setSelectedItem(null);
            loadInventory();
          }} 
        />
      )}
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? (
          <Login onLogin={checkAuth} />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/register" element={
        !isAuthenticated ? (
          <RegisterForm />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/" element={
        isAuthenticated ? (
          <AuthContent />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export default App;