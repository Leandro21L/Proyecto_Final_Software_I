import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doc_number: "",
    name: "",
    last_name: "",
    user_type: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const registerResponse = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerResult = await registerResponse.json();

      if (registerResponse.ok) {
        // Intento de inicio de sesión automático
        const loginResponse = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem('token', loginResult.token);
          alert("Usuario registrado e iniciado sesión correctamente");
          navigate('/');
        } else {
          alert("Usuario registrado correctamente. Por favor, inicie sesión.");
          navigate('/login');
        }
      } else {
        setError(`Error: ${registerResult.error}${registerResult.details ? ` - ${registerResult.details}` : ''}`);
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError(`Error de conexión: ${err.message}`);
    }
  };

  return (
    <div className="register-form-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Registro de Usuario</h2>
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          marginBottom: '10px',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#fff5f5'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px' 
      }}>
        <input
          type="text"
          name="doc_number"
          placeholder="Número de Documento"
          value={formData.doc_number}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        />
        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        >
          <option value="">Selecciona el tipo de usuario</option>
          <option value="admin">Admin</option>
          <option value="supervisor">Supervisor</option>
          <option value="operator">Operador</option>
          <option value="consultant">Consultor</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginTop: '5px' }}
        />
        <button 
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Registrar
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login" style={{ 
          textDecoration: 'none', 
          color: '#007bff' 
        }}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;