import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import UsuariosList from './components/Usuarios/UsuariosList';
import GruposList from './components/Grupos/GruposList';
import MiembrosList from './components/Miembros/MiembrosList';
import './App.css';

const Home = () => (
  <div className="home-container">
    <h1>Sistema de Red Social</h1>
    <div className="home-content">
      <h2>Bienvenido al Sistema de Gestión de Red Social</h2>
      <p>Este sistema te permite gestionar usuarios, grupos y membresías de manera eficiente.</p>
      
      <div className="features">
        <div className="feature">
          <h3>Usuarios</h3>
          <p>Gestiona la información de los usuarios registrados en el sistema.</p>
        </div>
        <div className="feature">
          <h3>Grupos</h3>
          <p>Administra los grupos y sus características.</p>
        </div>
        <div className="feature">
          <h3>Miembros</h3>
          <p>Controla las membresías entre usuarios y grupos.</p>
        </div>
      </div>
    </div>
  </div>
);

const About = () => (
  <div className="about-container">
    <h2>Acerca del Proyecto</h2>
    
    <div className="about-content">
      <h3>Información Institucional</h3>
      <p><strong>Departamento:</strong> Ciencias de la Computación</p>
      <p><strong>Carrera:</strong> Tecnologías de la Información</p>
      <p><strong>Asignatura:</strong> Programación Integrativa de Componentes</p>
      <p><strong>Proyecto:</strong> Proyecto Integrador del Segundo Parcial - Grupo 8</p>

      <h3>Integrantes</h3>
      <ul className="member-list">
        <li>Chanataxi Oscar</li>
        <li>Colina Mateo</li>
        <li>Mena James</li>
      </ul>

    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<UsuariosList />} />
            <Route path="/grupos" element={<GruposList />} />
            <Route path="/miembros" element={<MiembrosList />} />
            <Route path="/acerca" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;