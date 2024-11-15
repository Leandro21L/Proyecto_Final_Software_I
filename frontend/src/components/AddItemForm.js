import React, { useState } from 'react';
import { addItem } from '../services/api';

function AddItemForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    type: '',
    threshold: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Para campos numéricos, no permitir valores negativos
    if (e.target.type === 'number' && value < 0) {
      value = 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Preparar los datos en el formato correcto
      const dataToSend = {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity, 10),
        type: formData.type.trim() || null,
        threshold: formData.threshold ? parseInt(formData.threshold, 10) : null
      };

      console.log('Enviando datos:', dataToSend);
      
      await addItem(dataToSend);
      
      // Limpiar el formulario
      setFormData({
        name: '',
        quantity: '',
        type: '',
        threshold: ''
      });
      
      if (onAdd) onAdd();
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.error || 'Error al añadir el item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-form">
      <h2>Añadir Nuevo Item</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="100"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo:</label>
          <input
            id="type"
            name="type"
            type="text"
            value={formData.type}
            onChange={handleChange}
            maxLength="50"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="threshold">Umbral:</label>
          <input
            id="threshold"
            name="threshold"
            type="number"
            value={formData.threshold}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Añadiendo...' : 'Añadir Item'}
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;