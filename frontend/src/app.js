//Centraliza la navegación y estructura de la aplicación.

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1 className="navbar">Sistema de Gestión de Inventarios</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
