import React from 'react';
import { addItem } from '../services/api';

function InventoryList({ inventory, onEdit, onAdjust }) {
  if (!inventory || inventory.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        No hay items en el inventario
      </div>
    );
  }

  return (
    <div>
      <h2>Lista de Inventario</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Nombre</th>
              <th style={tableHeaderStyle}>Cantidad</th>
              <th style={tableHeaderStyle}>Tipo</th>
              <th style={tableHeaderStyle}>Umbral</th>
              <th style={tableHeaderStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td style={tableCellStyle}>{item.name}</td>
                <td style={tableCellStyle}>{item.quantity}</td>
                <td style={tableCellStyle}>{item.type || '-'}</td>
                <td style={tableCellStyle}>{item.threshold || '-'}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => onEdit(item)}
                    style={buttonStyle}
                  >
                    Editar
                  </button>



                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos
const tableHeaderStyle = {
  backgroundColor: '#f4f4f4',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd'
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd'
};

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default InventoryList;