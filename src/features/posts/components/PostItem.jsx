import React from 'react';
import ComentariosSection from './ComentariosSection'; // 🎯 CORREGIDO: Importación relativa directa
import './PostItem.css'; // O './css/Posts.css' según tu estructura final

// Helper fuera del componente para no regenerarlo en cada render
const formatFecha = (date) => {
    if (!date) return '';
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = (now - postDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
    }
    return postDate.toLocaleDateString();
};

function PostItem({ post }) {
    const displayNombre = post.nombre_display || 'Usuario'; // Fallback de seguridad

    return (
        <div className="post-item">
            <div className="post-header">
                <div className="profile-placeholder">
                    {displayNombre.charAt(0).toUpperCase()} {/* Inicial del usuario como avatar temporal */}
                </div>

                <div className="post-info">
                    <span className="post-author">{displayNombre}</span>
                    <span className="post-date"> • {formatFecha(post.fecha_creacion)}</span>
                    {post.es_anonimo && <span className="anon-tag"> (Anónimo)</span>}
                </div>
            </div>

            <p className="post-content">{post.contenido}</p>

            <div className="post-interactions">
                <button className="interact-btn">👍 Me gusta (0)</button>
                <span className="comment-count">{post.comentarios?.length || 0} Comentarios</span>
            </div>

            <hr className="post-divider" />

            {/* Pasamos los comentarios de forma segura (array vacío si es undefined) */}
            <ComentariosSection comentarios={post.comentarios || []} />
        </div>
    );
}

export default PostItem;