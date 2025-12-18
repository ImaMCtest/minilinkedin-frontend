import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { faUser, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 🎯 IMPORTACIONES OPTIMIZADAS
import NavBar from '../components/layouts/NavBar';
import PostForm from '../features/posts/components/PostForm';
import PostItem from '../features/posts/components/PostItem';

import './Dashboard.css';

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Vercel o Localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para el Feed de publicaciones
const API_FEED_URL = `${BASE_URL}/api/publicaciones`;
// -----------------------------------------------------------------------------

const Dashboard = () => {
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [publicaciones, setPublicaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- LÓGICA DE FETCHING ---
    const fetchPublicaciones = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            // OJO: Aquí usa la nueva URL dinámica
            const res = await axios.get(API_FEED_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPublicaciones(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error cargando feed:', err);
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- EFECTO DE INICIO ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const nombre = localStorage.getItem('nombreUsuario');
        if (!token) { navigate('/login'); return; }

        setNombreUsuario(nombre);
        fetchPublicaciones();
    }, [navigate]);

    // --- VISTA DE CARGA ---
    if (isLoading) {
        return (
            <div className="dashboard-content-container loading-screen">
                <p>Cargando Dashboard...</p>
            </div>
        );
    }

    // --- VISTA PRINCIPAL ---
    return (
        <>
            <NavBar />
            <div className="dashboard-content-container">
                <div className="main-layout">

                    {/* COLUMNA IZQUIERDA: Widgets */}
                    <aside className="sidebar-left">
                        <div className="widget profile-widget">
                            <h4><FontAwesomeIcon icon={faUser} /> Perfil</h4>
                            <p className="user-name-display">{nombreUsuario}</p>
                            <p className="user-role">Estudiante UNAMAD</p>
                            <span className="read-more-link">Ver perfil completo</span>
                        </div>
                    </aside>

                    {/* COLUMNA CENTRAL: Feed */}
                    <main className="main-feed-column">
                        <div className="welcome-section">
                            <h2>¡Hola, {nombreUsuario}!</h2>
                            <p>¿Qué conocimiento académico quieres compartir hoy?</p>
                        </div>

                        <PostForm onPostCreated={fetchPublicaciones} />

                        <div className="publicaciones-feed">
                            <h4 className="feed-title">Publicaciones Recientes</h4>

                            {publicaciones.length > 0 ? (
                                publicaciones.map(post => (
                                    <PostItem key={post._id} post={post} />
                                ))
                            ) : (
                                <p className="no-posts-message">
                                    No hay publicaciones aún. ¡Sé el primero!
                                </p>
                            )}
                        </div>
                    </main>

                    {/* COLUMNA DERECHA: Noticias */}
                    <aside className="sidebar-right">
                        <div className="widget news-widget">
                            <h4><FontAwesomeIcon icon={faNewspaper} /> Noticias</h4>
                            <ul>
                                <li>📅 Conferencia IA - 20 Nov</li>
                                <li>📚 Nueva biblioteca digital disponible</li>
                            </ul>
                        </div>
                    </aside>

                </div>
            </div>
        </>
    );
};

export default Dashboard;