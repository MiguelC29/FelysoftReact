import "../css/inicioSesion.css";
import logo from "../img/logo.svg";

export const InicioSesion = () => {
  return (
    <div className="page">
      <img className="logo" src={logo} alt="Logo"/>
      <div className="login-card"> 
        <div className="content">
      <h2>Iniciar Sesión</h2>
          <form className="login-form">
            <div className="input__wrapper">
              <input
                autoComplete="off"
                spellCheck="false"
                type="email"
                placeholder="Email"
                required
                className="input__field"
              />
              <label htmlFor="email" className="input__label">
                Email
              </label>
              <div className="input__wrapper">
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input__field"
              />
              <label htmlFor="password" className="input__label">
                Password
              </label>
              </div>
              <div id="spinner" className="spinner"></div>
            </div>
            
            <button className="control" type="button">
              INICIAR SESIÓN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
