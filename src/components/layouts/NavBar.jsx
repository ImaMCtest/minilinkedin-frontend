import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faBriefcase, faChalkboardTeacher, faLightbulb,
    faUserCircle, faCog, faEnvelope, faTrashAlt, faSignOutAlt, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import './NavBar.css';

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Si estás en Vercel usa la variable, si no, localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para este componente (usuarios)
const API_URL = `${BASE_URL}/api/usuarios`;
// -----------------------------------------------------------------------------

function NavBar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

    const toggleMenu = () => setShowMenu(!showMenu);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('¿⚠️ Estás SEGURO de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            // Aquí ya usa la API_URL dinámica que definimos arriba
            await axios.delete(`${API_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Cuenta eliminada. Gracias por haber sido parte de la comunidad.');
            handleLogout();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la cuenta. Inténtalo más tarde.');
        }
    };

    return (
        <nav className="navbar-custom">
            <div className="navbar-logo">
                <Link to="/dashboard">SEARCH JOBS ESP</Link>
            </div>

            <div className="navbar-links">
                {/* Enlaces Principales */}
                <Link to="/dashboard" className="nav-item">
                    <FontAwesomeIcon icon={faHome} /> <span>Home</span>
                </Link>
                <Link to="/trabajo" className="nav-item">
                    <FontAwesomeIcon icon={faBriefcase} /> <span>Trabajo</span>
                </Link>
                <Link to="/conferencias" className="nav-item">
                    <FontAwesomeIcon icon={faChalkboardTeacher} /> <span>Conferencias</span>
                </Link>
                <Link to="/knowledge" className="nav-item">
                    <FontAwesomeIcon icon={faLightbulb} /> <span>Knowledge</span>
                </Link>

                {/* Menú de Usuario */}
                <div className="profile-menu-container">
                    <button
                        onClick={toggleMenu}
                        className="icon-profile-btn"
                        aria-label="Menú de usuario"
                    >
                        <FontAwesomeIcon icon={faUserCircle} className="profile-avatar" />
                        <FontAwesomeIcon icon={faChevronDown} className={`profile-arrow ${showMenu ? 'rotate' : ''}`} />
                    </button>

                    {showMenu && (
                        <div className="dropdown-menu">
                            <div className="menu-header">
                                Hola, <strong>{nombreUsuario}</strong>
                            </div>

                            <button className="menu-item" onClick={() => alert("Próximamente")}>
                                <FontAwesomeIcon icon={faEnvelope} /> Buzón
                            </button>
                            <button
                                className="menu-item"
                                onClick={() => {
                                    navigate('/perfil');
                                    setShowMenu(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faCog} /> Configuración
                            </button>

                            <div className="menu-divider"></div>

                            <button className="menu-item delete-btn" onClick={handleDeleteAccount}>
                                <FontAwesomeIcon icon={faTrashAlt} /> Eliminar Cuenta
                            </button>

                            <div className="menu-divider"></div>

                            <button className="menu-item logout-item" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;