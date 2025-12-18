import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/layouts/NavBar';
import RecursoForm from '../features/resources/components/RecursoForm'; // Importamos el modal
import './Conferences.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faFileAlt, faPlus, faUniversity, faClock } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api/recursos';

const Conferences = () => {
    const [activeTab, setActiveTab] = useState('investigaciones'); // 'investigaciones' o 'videos'
    const [recursos, setRecursos] = useState([]); // Datos reales del backend
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Controla si se ve el formulario

    // 1. CARGAR DATOS (READ)
    const fetchRecursos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setRecursos(res.data);
        } catch (error) {
            console.error("Error cargando recursos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecursos();
    }, []);

    // 2. FILTRAR EN EL FRONTEND (Separar Tesis de Videos)
    // El backend manda todo junto, aquí lo separamos según la pestaña activa
    const recursosFiltrados = recursos.filter(item => {
        if (activeTab === 'investigaciones') {
            return item.tipo === 'TESIS' || item.tipo === 'ARTICULO';
        } else {
            return item.tipo === 'VIDEO' || item.tipo === 'EVENTO';
        }
    });

    const handleAbrirRecurso = (item) => {
        let urlDestino = '';

        // 1. Determinar la URL correcta según el tipo
        if (item.tipo === 'TESIS' || item.tipo === 'ARTICULO') {
            urlDestino = item.detalles.url_pdf;
        } else if (item.tipo === 'VIDEO' || item.tipo === 'EVENTO') {
            // LÓGICA CORREGIDA:
            // Busca 'url_video'. Si no existe, busca 'link_reunion'.
            // Esto arregla el error si la plataforma no es YouTube o si es un Evento.
            urlDestino = item.detalles.url_video || item.detalles.link_reunion;
        }

        // Validación básica
        if (!urlDestino) {
            alert("Este recurso no tiene una URL válida adjunta.");
            return;
        }

        // 2. LÓGICA INTELIGENTE: ¿Es un documento o un link normal?
        // Expresión regular para detectar archivos de ofimática o PDF
        const esDocumento = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i.test(urlDestino);

        if (esDocumento) {
            // OPCIÓN A: Abrir VISOR DE GOOGLE en una ventana emergente (Popup) centrada
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(urlDestino)}&embedded=true`;

            // Calculamos centro de la pantalla
            const width = 800;
            const height = 600;
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;

            window.open(
                googleViewerUrl,
                'VisorDocumento',
                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
            );
        } else {
            // OPCIÓN B: Es un video de YouTube o Web -> Abrir en nueva pestaña
            window.open(urlDestino, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <NavBar />
            <div className="dashboard-content-container conferencias-page">

                {/* Cabecera */}
                <header className="conferencias-header">
                    <div className="header-text">
                        <h2>📚 Centro de Conocimiento</h2>
                        <p>Recursos académicos compartidos por la comunidad.</p>
                    </div>
                    {/* Botón que abre el Modal */}
                    <button className="btn-crear-evento" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Publicar Aporte
                    </button>
                </header>

                {/* Navegación */}
                <div className="tabs-navigation">
                    <button className={`tab-btn ${activeTab === 'investigaciones' ? 'active' : ''}`}
                        onClick={() => setActiveTab('investigaciones')}>
                        <FontAwesomeIcon icon={faFileAlt} /> Investigaciones
                    </button>
                    <button className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}>
                        <FontAwesomeIcon icon={faVideo} /> Videos y Eventos
                    </button>
                </div>

                {/* Lista de Contenido */}
                <div className="conferencias-grid">
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>Cargando recursos...</p>
                    ) : recursosFiltrados.length > 0 ? (
                        recursosFiltrados.map(item => (
                            <div key={item._id} className="resource-card">
                                {/* Icono según tipo */}
                                <div className="card-icon-box">
                                    <FontAwesomeIcon icon={item.tipo === 'VIDEO' ? faVideo : faUniversity} />
                                </div>

                                <div className="card-info">
                                    <h3>{item.titulo}</h3>

                                    {/* Autor (Poblado desde Backend) */}
                                    <p className="card-author">
                                        Por: {item.autor_id ? item.autor_id.nombre : 'Anónimo'}
                                    </p>

                                    {/* Detalles Dinámicos (Polimorfismo Visual) */}
                                    <span className="card-meta">
                                        {item.tipo} •
                                        {item.tipo === 'TESIS' && ` 🏛 ${item.detalles.universidad || 'Univ. desconocida'}`}
                                        {item.tipo === 'VIDEO' && ` ⏱ ${item.detalles.duracion || '?? min'}`}
                                    </span>

                                    {/* Tags */}
                                    <div className="tags-row" style={{ marginTop: '5px', fontSize: '0.8em', color: '#0077b5' }}>
                                        {item.tags.map((tag, i) => <span key={i}>#{tag} </span>)}
                                    </div>
                                </div>

                                <button
                                    className="btn-ver"
                                    onClick={() => handleAbrirRecurso(item)} // <--- AQUÍ CONECTAMOS LA LÓGICA
                                >
                                    {item.tipo === 'VIDEO' ? 'Ver Video' : 'Leer Documento'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No hay recursos en esta categoría aún.</p>
                            <p>¡Sé el primero en publicar!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL (Solo se muestra si showModal es true) */}
            {showModal && (
                <RecursoForm
                    onClose={() => setShowModal(false)}
                    onRecursoCreated={fetchRecursos} // Pasa la función para recargar la lista
                />
            )}
        </>
    );
};

export default Conferences;