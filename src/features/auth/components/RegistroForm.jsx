import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Vercel o Localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para el Registro
const API_URL = `${BASE_URL}/api/usuarios/registro`;
// -----------------------------------------------------------------------------

function RegistroForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [feedback, setFeedback] = useState({ msg: '', isError: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(API_URL, formData);

            setFeedback({ msg: `¡Éxito! ${res.data}. Redirigiendo...`, isError: false });
            setFormData({ nombre: '', email: '', password: '' }); // Limpiar formulario

            setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            const errorMsg = err.response?.data || 'Error de conexión desconocido.';
            setFeedback({ msg: errorMsg, isError: true });
        }
    };

    return (
        <div className="auth-container">
            <div className="registro-container">
                <h2>🚀 Registro Académico</h2>
                <p>Crea tu perfil en la plataforma.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre Completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-buttons-row">
                        <button type="submit" className="submit-btn">Registrarme</button>

                        <Link to="/login" className="login-redirect-btn">
                            Ya tengo cuenta
                        </Link>
                    </div>
                </form>

                {feedback.msg && (
                    <p className={feedback.isError ? 'msg-error' : 'msg-success'}>
                        {feedback.msg}
                    </p>
                )}
            </div>
        </div>
    );
}

export default RegistroForm;