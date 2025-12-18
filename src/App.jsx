import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 🎯 IMPORTACIONES CORREGIDAS (Apuntando a la nueva estructura)
// 1. Auth (Features)
import LoginForm from './features/auth/components/LoginForm';
import RegistroForm from './features/auth/components/RegistroForm';

// 2. Pages (Vistas completas)
import Dashboard from './pages/Dashboard';
import Conferences from './pages/Conferences';
import Profile from './pages/Profile';

// Estilos globales de la App (si tienes)
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Raíz ("/"):
           Redirigimos automáticamente al Login para que no vean una pantalla blanca 
           o un componente suelto.
        */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegistroForm />} />
        <Route path="/perfil" element={<Profile />} />
        {/* Rutas Principales de la App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conferencias" element={<Conferences />} />

        {/* Tip Pro: Podrías agregar una ruta "*" para "Página no encontrada" (404)
           <Route path="*" element={<div>404 - Página no encontrada</div>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;