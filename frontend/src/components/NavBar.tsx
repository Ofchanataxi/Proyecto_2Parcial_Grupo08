import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Red Social
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/usuarios" className="navbar-link">Usuarios</Link>
          <Link to="/grupos" className="navbar-link">Grupos</Link>
          <Link to="/miembros" className="navbar-link">Miembros</Link>
          <Link to="/acerca" className="navbar-link">Acerca de</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;