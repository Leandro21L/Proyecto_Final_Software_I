import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react'; // Opcional, para iconos

const Navbar = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem('username') || 'Usuario'; // Asumo que guardas el nombre de usuario al login

  return (
    <nav>
      <div className="nav-links">
        <Link to="/products">Productos Terminados</Link>
        <Link to="/inventory-movements">Movimientos de Inventario</Link>
        <Link to="/materials">Materias Primas</Link>
        <Link to="/products-materials">Productos y Materiales</Link>
        <Link to="/reports">Reportes</Link>
      </div>
      
      <div className="user-menu">
        <div 
          className="user-avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User /> {username}
        </div>
        
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>
              <LogOut /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;