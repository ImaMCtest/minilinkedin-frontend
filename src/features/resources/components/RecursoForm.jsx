import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import './RecursoForm.css';

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Vercel o Localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para los recursos
const API_URL = `${BASE_URL}/api/recursos`;
// -----------------------------------------------------------------------------

function RecursoForm({ onClose, onRecursoCreated }) {
    const [tipo, setTipo] = useState('TESIS');
    const [titulo, setTitulo] = useState('');
    const [tags, setTags] = useState('');

    // Estado para los detalles dinámicos
    const [detalles, setDetalles] = useState({
        universidad: '',
        url_pdf: '',
        duracion: '',
        plataforma: 'YouTube',
        url_video: '' // Aseguramos que este campo exista en el estado inicial
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Preparamos el objeto para el Backend (Convertimos tags a array)
        const payload = {
            titulo,
            tipo,
            tags: tags.split(',').map(tag => tag.trim()), // "IA, Tesis" -> ["IA", "Tesis"]
            detalles // Enviamos el objeto detalles tal cual
        };

        try {
            await axios.post(API_URL, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Recurso publicado con éxito');
            if (onRecursoCreated) onRecursoCreated(); // Recargar la lista
            onClose(); // Cerrar modal
        } catch (error) {
            console.error(error);
            alert('Error al crear recurso');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Nuevo Aporte Académico</h3>
                    <button onClick={onClose} className="close-modal-btn">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* 1. Selección de Tipo */}
                    <div className="form-group">
                        <label>¿Qué vas a compartir?</label>
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="TESIS">Tesis / Investigación</option>
                            <option value="VIDEO">Video / Tutorial</option>
                            <option value="EVENTO">Evento / Webinar</option>
                        </select>
                    </div>

                    {/* 2. Título y Tags */}
                    <input
                        type="text" placeholder="Título del recurso" required
                        value={titulo} onChange={e => setTitulo(e.target.value)}
                    />
                    <input
                        type="text" placeholder="Etiquetas (separadas por coma)"
                        value={tags} onChange={e => setTags(e.target.value)}
                    />

                    {/* 3. CAMPOS DINÁMICOS (La Magia del Polimorfismo) */}
                    <div className="dynamic-fields">
                        {tipo === 'TESIS' && (
                            <>
                                <input type="text" placeholder="Universidad"
                                    onChange={e => setDetalles({ ...detalles, universidad: e.target.value })} />
                                <input type="url" placeholder="URL del PDF"
                                    onChange={e => setDetalles({ ...detalles, url_pdf: e.target.value })} />
                            </>
                        )}

                        {tipo === 'VIDEO' && (
                            <>
                                {/* CAMPO NUEVO Y OBLIGATORIO */}
                                <input
                                    type="url"
                                    placeholder="Enlace del Video (YouTube/Vimeo)"
                                    required
                                    onChange={e => setDetalles({ ...detalles, url_video: e.target.value })}
                                />

                                <input type="text" placeholder="Duración (ej: 15 min)"
                                    onChange={e => setDetalles({ ...detalles, duracion: e.target.value })} />

                                <select onChange={e => setDetalles({ ...detalles, plataforma: e.target.value })}>
                                    <option value="YouTube">YouTube</option>
                                    <option value="Vimeo">Vimeo</option>
                                </select>
                            </>
                        )}

                        {/* Puedes agregar lógica para EVENTO aquí si quieres */}
                    </div>

                    <button type="submit" className="save-btn">
                        <FontAwesomeIcon icon={faSave} /> Publicar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RecursoForm;