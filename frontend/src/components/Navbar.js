import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => (
  <nav>
    <Link to="/finished-products">Productos Terminados</Link>
    <Link to="/inventory-movements">Movimientos de Inventario</Link>
    <Link to="/raw-materials">Materias Primas</Link>
    <Link to="/products-materials">Relaciones Productos-Materias</Link>
    <button 
      onClick={onLogout}
      style={{
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Cerrar Sesión
    </button>
  </nav>
);

export default Navbar;