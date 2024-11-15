import React, { useState, useEffect } from 'react';
import InventoryList from './components/InventoryList';
import AddItemForm from './components/AddItemForm';
import EditItemForm from './components/EditItemForm';
import { getInventory } from './services/api';

function App() {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar el inventario
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

  // Cargar inventario al montar el componente
  useEffect(() => {
    loadInventory();
  }, []);

  // Función para manejar la adición de un nuevo item
  const handleAdd = () => {
    loadInventory(); // Recargar el inventario después de añadir
  };

  // Función para manejar la edición
  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  // Función después de completar la edición
  const handleEditComplete = () => {
    setSelectedItem(null);
    loadInventory(); // Recargar el inventario después de editar
  };

  // Función para ajustar la cantidad
  const handleAdjust = (item) => {
    // Implementar lógica para ajustar cantidad
    console.log('Ajustando cantidad para:', item);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Gestión de Inventario</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <AddItemForm onAdd={handleAdd} />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>Cargando inventario...</div>
      ) : (
        <InventoryList 
          inventory={inventory}
          onEdit={handleEdit}
          onAdjust={handleAdjust}
        />
      )}

      {selectedItem && (
        <EditItemForm 
          item={selectedItem}
          onEdit={handleEditComplete}
          onCancel={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

export default App;