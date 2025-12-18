import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCalendarAlt, faPenFancy, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './PostForm.css'; // O './css/Posts.css'

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Vercel o Localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para las publicaciones
const API_URL = `${BASE_URL}/api/publicaciones`;
// -----------------------------------------------------------------------------

// Sub-componente simple para botones de acción
const ActionButton = ({ icon, label, onClick }) => (
    <button type="button" className="action-button" onClick={onClick}>
        <FontAwesomeIcon icon={icon} className="action-icon" />
        {label}
    </button>
);

function PostForm({ onPostCreated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [contenido, setContenido] = useState('');
    const [esAnonimo, setEsAnonimo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        if (contenido.trim() && !window.confirm('¿Descartar publicación?')) {
            return;
        }
        resetForm();
    };

    const resetForm = () => {
        setContenido('');
        setEsAnonimo(false);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contenido.trim()) return;

        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post(API_URL,
                { contenido, es_anonimo: esAnonimo },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            resetForm();
            if (onPostCreated) onPostCreated(); // Recargar feed

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || 'Error al conectar con el servidor';
            alert(`Error: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- VISTA PREVIA (Minimizada) ---
    if (!isEditing) {
        return (
            <div className="post-form-card">
                <div className="post-form-preview-line" onClick={() => setIsEditing(true)}>
                    <span className="profile-icon">✎</span>
                    <p>Crear publicación...</p>
                </div>
                <div className="action-buttons-row">
                    <ActionButton icon={faImage} label="Multimedia" onClick={() => { }} />
                    <ActionButton icon={faCalendarAlt} label="Evento" onClick={() => { }} />
                    <ActionButton icon={faPenFancy} label="Artículo" onClick={() => { }} />
                </div>
            </div>
        );
    }

    // --- VISTA FORMULARIO (Expandida) ---
    return (
        <div className="post-form-container">
            <div className="post-form-header">
                <div className="header-user-info">
                    <span className="profile-icon">Yo</span>
                    <span className="post-author">{localStorage.getItem('nombreUsuario') || 'Usuario'}</span>
                </div>
                <button onClick={handleClose} className="close-btn" type="button">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    className="post-input-area"
                    placeholder="¿Qué quieres compartir hoy?"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                    rows={4}
                    autoFocus
                />

                <div className="form-footer">
                    <div className="action-buttons-row inner-buttons">
                        <ActionButton icon={faImage} label="Foto" onClick={() => { }} />
                        <ActionButton icon={faCalendarAlt} label="Evento" onClick={() => { }} />
                    </div>

                    <div className="publish-actions">
                        <label className="anon-checkbox" title="Tu nombre se ocultará">
                            <input
                                type="checkbox"
                                checked={esAnonimo}
                                onChange={(e) => setEsAnonimo(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <span>Anónimo</span>
                        </label>

                        <button type="submit" className="submit-post-btn" disabled={!contenido.trim() || isSubmitting}>
                            {isSubmitting ? '...' : <FontAwesomeIcon icon={faPaperPlane} />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PostForm;