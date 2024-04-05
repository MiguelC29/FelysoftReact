import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "../css/inicioSesion.css";
import logo from "../img/logo.svg";

export const InicioSesion = () => {
  const navigate = useNavigate(); // Obtiene la función de navegación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/productos'); // Navega a la página de productos
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoading(false);
      alert('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="page">
      <div className="container-logo bg-white p-3" style={{borderRadius: '60px 0 0 60px'}}>
        <img className="logo" src={logo} alt="Logo" />
      </div>
      <div className="login-card" style={{borderRadius: '20px 80px 80px 20px'}}>
        <div className="content">
          <h2>Iniciar Sesión</h2>
          <form className="login-form" onSubmit={handleSubmit} style={{background: '#19191a'}}>
            <div className="input__wrapper">
              <input
                autoComplete="off"
                spellCheck="false"
                type="Username"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input__field"
              />
              <label htmlFor="Username" className="input__label">
                Username
              </label>
              <div className="input__wrapper">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input__field"
                />
                <label htmlFor="password" className="input__label">
                  Password
                </label>
              </div>
              <div id="spinner" className="spinner"></div>
            </div>

            <button className="control" type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
