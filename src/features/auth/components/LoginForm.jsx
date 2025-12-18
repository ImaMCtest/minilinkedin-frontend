import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

// -----------------------------------------------------------------------------
// 🎯 CAMBIO "IDEAL": Configuración Dinámica de la URL
// -----------------------------------------------------------------------------
// 1. Detecta la URL base (Vercel o Localhost)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Construye la ruta específica para el Login
const API_URL = `${BASE_URL}/api/usuarios/login`;
// -----------------------------------------------------------------------------

function LoginForm() {
    const navigate = useNavigate();

    // Unificamos el estado del feedback para limpiar el renderizado
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [feedback, setFeedback] = useState({ msg: '', isError: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ msg: 'Iniciando sesión...', isError: false });

        try {
            const res = await axios.post(API_URL, formData);

            // Guardamos sesión
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('nombreUsuario', res.data.nombre);

            // Redirección inmediata
            navigate('/dashboard');

        } catch (err) {
            const errorMsg = err.response?.data || 'Error de conexión con el servidor.';
            setFeedback({ msg: errorMsg, isError: true });
        }
    };

    return (
        <div className="auth-container">
            <div className="login-container">
                <h2>🔑 Iniciar Sesión</h2>
                <p>Accede a tu Dashboard Académico.</p>

                <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="submit-btn">Entrar</button>

                        <Link to="/registro" className="login-redirect-btn">
                            Registrarme
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

export default LoginForm;