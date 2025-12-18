import React from 'react';
import './ComentariosSection.css';
/**
 * Muestra la lista de comentarios.
 * Recibe: { comentarios: [] }
 */
function ComentariosSection({ comentarios }) {

    // 1. Retorno temprano si no hay datos (Clean Code)
    if (!comentarios || comentarios.length === 0) {
        return <p className="no-comments-msg">Sé el primero en comentar.</p>;
    }

    return (
        <div className="comentarios-section">
            <h4>Comentarios ({comentarios.length})</h4>

            {comentarios.map((c, index) => {
                // 2. Lógica de seguridad para el nombre
                // Usamos "Encadenamiento opcional (?.)" para evitar que la app explote si usuario_id viene null
                const nombreAutor = c.es_anonimo
                    ? 'Usuario Anónimo'
                    : (c.usuario_id?.nombre || 'Usuario Desconocido');

                return (
                    <div key={c._id || index} className="comentario-item">
                        <span className="comment-author">{nombreAutor}</span>

                        <span className="comment-date">
                            {new Date(c.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <p className="comment-content">{c.contenido}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default ComentariosSection;