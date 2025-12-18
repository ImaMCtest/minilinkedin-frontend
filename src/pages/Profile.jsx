import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/layouts/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faMapMarkerAlt, faBriefcase, faSave } from '@fortawesome/free-solid-svg-icons';
import './Profile.css'; // Crearemos este CSS abajo

const API_URL = 'http://localhost:5000/api/usuarios';

const Profile = () => {
    const [usuario, setUsuario] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Estado para el formulario de edición
    const [formData, setFormData] = useState({
        titular: '',
        resumen: '',
        ciudad: '',
        pais: '',
        habilidades: '', // Lo manejaremos como texto separado por comas
        estado_busqueda: 'PASIVO'
    });

    // 1. Cargar datos al iniciar
    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/perfil`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsuario(res.data);

                // Pre-llenar el formulario con lo que venga de la BD
                setFormData({
                    titular: res.data.titular || '',
                    resumen: res.data.resumen || '',
                    ciudad: res.data.ubicacion?.ciudad || '',
                    pais: res.data.ubicacion?.pais || '',
                    habilidades: res.data.habilidades ? res.data.habilidades.join(', ') : '',
                    estado_busqueda: res.data.estado_busqueda || 'PASIVO'
                });
            } catch (err) {
                console.error("Error cargando perfil", err);
            }
        };
        fetchPerfil();
    }, []);

    // 2. Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Guardar cambios (UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Preparamos el objeto para el backend
        // Convertimos el string de habilidades "React, Node" -> Array ["React", "Node"]
        const payload = {
            titular: formData.titular,
            resumen: formData.resumen,
            estado_busqueda: formData.estado_busqueda,
            ubicacion: {
                ciudad: formData.ciudad,
                pais: formData.pais
            },
            habilidades: formData.habilidades.split(',').map(s => s.trim()).filter(s => s !== '')
        };

        try {
            const res = await axios.put(`${API_URL}/perfil`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsuario(res.data); // Actualizamos la vista con los datos nuevos
            setEditMode(false);   // Salimos del modo edición
            alert('Perfil actualizado correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al actualizar');
        }
    };

    if (!usuario) return <div style={{ marginTop: '80px', color: 'white', textAlign: 'center' }}>Cargando perfil...</div>;

    return (
        <>
            <NavBar />
            <div className="dashboard-content-container profile-page">

                {/* CABECERA DE PERFIL */}
                <div className="profile-header-card">
                    <div className="profile-avatar-large">
                        {usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info-main">
                        <h1>{usuario.nombre}</h1>
                        {/* Si no hay titular, mostramos mensaje para animar a llenar */}
                        <p className="profile-headline">
                            {usuario.titular || "¡Añade un titular profesional!"}
                        </p>
                        <p className="profile-location">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            {usuario.ubicacion?.ciudad ? ` ${usuario.ubicacion.ciudad}, ${usuario.ubicacion.pais}` : " Ubicación no definida"}
                        </p>
                    </div>
                    <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
                        <FontAwesomeIcon icon={faUserEdit} /> {editMode ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                </div>

                {/* MODO EDICIÓN */}
                {editMode ? (
                    <div className="edit-form-container">
                        <h3>Editando Información</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Titular Profesional</label>
                                <input type="text" name="titular" value={formData.titular} onChange={handleChange} placeholder="Ej: Full Stack Developer | Estudiante de Sistemas" />
                            </div>

                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Ciudad</label>
                                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>País</label>
                                    <input type="text" name="pais" value={formData.pais} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Sobre mí (Resumen)</label>
                                <textarea name="resumen" rows="4" value={formData.resumen} onChange={handleChange} placeholder="Cuéntanos tu experiencia y objetivos..."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Habilidades (Separadas por comas)</label>
                                <input type="text" name="habilidades" value={formData.habilidades} onChange={handleChange} placeholder="Ej: React, MongoDB, Liderazgo, Inglés" />
                            </div>

                            <div className="form-group">
                                <label>Estado de Búsqueda</label>
                                <select name="estado_busqueda" value={formData.estado_busqueda} onChange={handleChange}>
                                    <option value="ACTIVO">Buscando activamente</option>
                                    <option value="PASIVO">Abierto a ofertas</option>
                                    <option value="CERRADO">No busco empleo</option>
                                </select>
                            </div>

                            <button type="submit" className="save-profile-btn">
                                <FontAwesomeIcon icon={faSave} /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                ) : (
                    /* MODO VISTA (LO QUE VEN LOS DEMÁS) */
                    <div className="profile-sections">
                        {/* Sección Acerca de */}
                        <div className="profile-section">
                            <h3>Acerca de</h3>
                            <p>{usuario.resumen || "Este usuario aún no ha escrito una descripción."}</p>
                        </div>

                        {/* Sección Habilidades */}
                        <div className="profile-section">
                            <h3>Habilidades</h3>
                            <div className="skills-container">
                                {usuario.habilidades && usuario.habilidades.length > 0 ? (
                                    usuario.habilidades.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))
                                ) : (
                                    <p style={{ color: '#666' }}>No hay habilidades registradas.</p>
                                )}
                            </div>
                        </div>

                        {/* Sección Estado */}
                        <div className="profile-section">
                            <h3>Estado Laboral</h3>
                            <span className={`status-badge ${usuario.estado_busqueda}`}>
                                {usuario.estado_busqueda === 'ACTIVO' && '🟢 Buscando Trabajo'}
                                {usuario.estado_busqueda === 'PASIVO' && '🟡 Abierto a ofertas'}
                                {usuario.estado_busqueda === 'CERRADO' && '🔴 No disponible'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;