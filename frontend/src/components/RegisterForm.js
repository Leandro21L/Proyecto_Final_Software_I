import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doc_number: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    id_rol: ''
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Nuevo estado para mensaje de éxito

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/roles');
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        console.error('Error al obtener roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Establece mensaje de éxito
        setSuccess('¡Usuario registrado correctamente!');
        
        // Redirige después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registro de Usuario</h2>
      
      {/* Mensaje de éxito */}
      {success && (
        <div style={{ 
          backgroundColor: '#dff0d8', 
          color: '#3c763d', 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px', 
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {['doc_number', 'name', 'last_name', 'email', 'password'].map((field) => (
          <div key={field} style={{ marginBottom: '15px' }}>
            <label htmlFor={field} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {field === 'doc_number' ? 'Número de Documento' : field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        ))}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="id_rol" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol:</label>
          <select
            id="id_rol"
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#28a745', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '16px', 
            cursor: 'pointer' 
          }}
        >
          Registrarse
        </button>
      </form>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p style={{ margin: '0' }}>¿Ya tienes una cuenta? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
}

export default RegisterForm;