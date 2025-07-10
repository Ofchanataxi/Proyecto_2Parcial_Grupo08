import { useState, useEffect } from 'react'; 
import type { Usuario } from '../../interfaces/Usuario'; // Tipado para usuarios
import { usuarioService } from '../../services/usuarioService'; // Servicio para manejar las peticiones a la API
import UsuarioForm from './UsuarioForm'; 

const UsuariosList = () => {
  // Definición de estados clave
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Lista de usuarios
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null); // Usuario en edición
  const [showForm, setShowForm] = useState(false); // Estado para mostrar el formulario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Manejo de errores

  // Efecto para cargar usuarios al inicio
  useEffect(() => {
    loadUsuarios(); // Carga los usuarios desde la API
  }, []);

  // Función para cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true); // Activar estado de carga
      const data = await usuarioService.getAll(); // Llama al servicio para obtener todos los usuarios
      setUsuarios(data); // Almacena los usuarios
    } catch (err) {
      setError('Error al cargar usuarios'); // En caso de error
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario); // Establece el usuario a editar
    setShowForm(true); // Muestra el formulario
  };

  // Función para eliminar un usuario
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await usuarioService.delete(id); // Elimina el usuario
        loadUsuarios(); // Recarga la lista
      } catch (err) {
        setError('Error al eliminar usuario'); // Maneja error al eliminar
      }
    }
  };

  // Función para manejar el envío del formulario (crear o editar usuario)
  const handleFormSubmit = async (usuario: Omit<Usuario, 'id_usuario'>) => {
    try {
      if (editingUsuario) {
        await usuarioService.update(editingUsuario.id_usuario, usuario); // Actualiza el usuario
      } else {
        await usuarioService.create(usuario); // Crea un nuevo usuario
      }
      setShowForm(false); // Cierra el formulario
      setEditingUsuario(null); // Limpia el usuario editado
      loadUsuarios(); // Recarga la lista de usuarios
    } catch (err) {
      setError('Error al guardar usuario'); // Maneja error al guardar
    }
  };

  // Función para cancelar el formulario de edición
  const handleFormCancel = () => {
    setShowForm(false); // Cierra el formulario
    setEditingUsuario(null); // Limpia el usuario editado
  };

  // Si está cargando, muestra mensaje
  if (loading) return <div className="loading">Cargando usuarios...</div>;
  
  // Si hay un error, lo muestra
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>
      
      {/* Botón para crear un nuevo usuario */}
      {!showForm && (
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nuevo Usuario
        </button>
      )}

      {/* Formulario para crear o editar */}
      {showForm && (
        <UsuarioForm
          usuario={editingUsuario}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                <td>
                  {/* Botón de edición */}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEdit(usuario)}
                  >
                    Editar
                  </button>
                  {/* Botón de eliminación */}
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(usuario.id_usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosList;