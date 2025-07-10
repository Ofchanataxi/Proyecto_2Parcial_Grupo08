import { useState, useEffect } from 'react';
import type { Grupo } from '../../interfaces/Grupo';
import { grupoService } from '../../services/grupoService';
import GrupoForm from './GrupoForm';

const GruposList = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]); // Estado para almacenar los grupos
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null); // Estado para el grupo en edición
  const [showForm, setShowForm] = useState(false); // Estado para mostrar u ocultar el formulario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    loadGrupos(); // Carga los grupos cuando el componente se monta
  }, []);

  // Función que carga los grupos desde el servicio
  const loadGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.getAll();
      setGrupos(data); // Guarda los grupos en el estado
    } catch (err) {
      setError('Error al cargar grupos'); // Maneja errores
    } finally {
      setLoading(false); // Cambia el estado de carga al finalizar
    }
  };

  // Función para editar un grupo
  const handleEdit = (grupo: Grupo) => {
    setEditingGrupo(grupo); // Establece el grupo a editar
    setShowForm(true); // Muestra el formulario
  };

  // Función para eliminar un grupo
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      try {
        await grupoService.delete(id); // Elimina el grupo
        loadGrupos(); // Recarga los grupos después de eliminar
      } catch (err) {
        setError('Error al eliminar grupo'); // Maneja errores
      }
    }
  };

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (grupo: Omit<Grupo, 'id_grupo'>) => {
    try {
      if (editingGrupo) {
        await grupoService.update(editingGrupo.id_grupo, grupo); // Actualiza el grupo
      } else {
        await grupoService.create(grupo); // Crea un nuevo grupo
      }
      setShowForm(false); // Cierra el formulario
      setEditingGrupo(null); // Restablece el grupo en edición
      loadGrupos(); // Recarga los grupos
    } catch (err) {
      setError('Error al guardar grupo'); // Maneja errores
    }
  };

  if (loading) return <div className="loading">Cargando grupos...</div>; // Muestra mensaje de carga
  if (error) return <div className="error">{error}</div>; // Muestra errores

  return (
    <div className="grupos-container">
      <h2>Gestión de Grupos</h2>
      {/* Botón para crear un nuevo grupo */}
      {!showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Nuevo Grupo
        </button>
      )}
      {/* Formulario para crear o editar un grupo */}
      {showForm && (
        <GrupoForm
          grupo={editingGrupo}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      {/* Tabla de grupos */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Grupo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map(grupo => (
              <tr key={grupo.id_grupo}>
                <td>{grupo.id_grupo}</td>
                <td>{grupo.nombre_grupo}</td>
                <td>{grupo.descripcion}</td>
                <td>
                  {/* Botón de editar */}
                  <button className="btn btn-secondary" onClick={() => handleEdit(grupo)}>
                    Editar
                  </button>
                  {/* Botón de eliminar */}
                  <button className="btn btn-danger" onClick={() => handleDelete(grupo.id_grupo)}>
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

export default GruposList;
