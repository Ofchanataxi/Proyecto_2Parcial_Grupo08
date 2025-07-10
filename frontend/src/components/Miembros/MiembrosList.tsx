import { useState, useEffect } from 'react';
import type { MiembroGrupo } from '../../interfaces/MiembroGrupo';
import { miembroService } from '../../services/miembroService';
import MiembroForm from './MiembroForm';

const MiembrosList = () => {
  // Estado para almacenar la lista de miembros
  const [miembros, setMiembros] = useState<MiembroGrupo[]>([]);

  // Estado para el miembro que está siendo editado
  const [editingMiembro, setEditingMiembro] = useState<MiembroGrupo | null>(null);

  // Estado para mostrar u ocultar el formulario de creación o edición
  const [showForm, setShowForm] = useState(false);

  // Estado para controlar el estado de carga
  const [loading, setLoading] = useState(true);

  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);

  // Cargar la lista de miembros cuando se monta el componente
  useEffect(() => {
    loadMiembros();
  }, []);

  // Función para cargar los miembros
  const loadMiembros = async () => {
    try {
      setLoading(true);
      const data = await miembroService.getAll();

      // Asegura que cada miembro tenga un campo 'id', normaliza el campo si es necesario
      const miembrosTransformados = data.map(m => ({
        ...m,
        id: (m as any).id || (m as any).id_miembro, // Normaliza el id del miembro
      }));

      setMiembros(miembrosTransformados); // Actualiza la lista de miembros
    } catch (err) {
      setError('Error al cargar miembros'); // Manejo de errores
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Función para manejar la edición de un miembro
  const handleEdit = (miembro: MiembroGrupo) => {
    setEditingMiembro(miembro); // Establece el miembro para editar
    setShowForm(true); // Muestra el formulario de edición
  };

  // Función para eliminar un miembro
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
      try {
        await miembroService.delete(id); // Elimina el miembro
        await loadMiembros(); // Actualiza la lista después de eliminar
      } catch (err) {
        setError('Error al eliminar miembro'); // Manejo de errores
      }
    }
  };

  // Función para manejar el envío del formulario (crear o actualizar miembro)
  const handleFormSubmit = async (miembro: Omit<MiembroGrupo, 'id'>) => {
    try {
      if (editingMiembro) {
        await miembroService.update(editingMiembro.id, miembro); // Actualiza el miembro
      } else {
        await miembroService.create(miembro); // Crea un nuevo miembro
      }
      setShowForm(false); // Cierra el formulario
      setEditingMiembro(null); // Reinicia el miembro en edición
      await loadMiembros(); // Actualiza la lista de miembros
    } catch (err) {
      setError('Error al guardar miembro'); // Manejo de errores
    }
  };

  // Función para manejar la cancelación del formulario
  const handleFormCancel = () => {
    setShowForm(false); // Cierra el formulario sin guardar cambios
    setEditingMiembro(null); // Reinicia el miembro en edición
  };

  // Si estamos cargando los datos, mostramos un mensaje de carga
  if (loading) return <div className="loading">Cargando miembros...</div>;

  // Si ocurre un error, mostramos un mensaje de error
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="miembros-container">
      <h2>Gestión de Miembros</h2>

      {/* Mostrar el botón "Nuevo Miembro" si no estamos en el formulario */}
      {!showForm && (
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)} // Muestra el formulario de creación
        >
          Nuevo Miembro
        </button>
      )}

      {/* Mostrar el formulario de edición o creación */}
      {showForm && (
        <MiembroForm
          miembro={editingMiembro} // Pasa el miembro a editar (si existe)
          onSubmit={handleFormSubmit} // Llama a handleFormSubmit cuando el formulario se envía
          onCancel={handleFormCancel} // Llama a handleFormCancel cuando el formulario se cancela
        />
      )}

      <div className="table-container">
        {/* Tabla de miembros */}
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>ID Grupo</th>
              <th>Usuario</th>
              <th>Grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea los miembros a filas de la tabla */}
            {miembros.map((miembro) => (
              <tr key={miembro.id}>
                <td>{miembro.id}</td>
                <td>{miembro.id_usuario}</td>
                <td>{miembro.id_grupo}</td>
                <td>{miembro.nombre_usuario || 'N/A'}</td> {/* Muestra nombre de usuario o 'N/A' si no está disponible */}
                <td>{miembro.nombre_grupo || 'N/A'}</td> {/* Muestra nombre de grupo o 'N/A' si no está disponible */}
                <td>
                  {/* Botones de editar y eliminar */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(miembro)} // Llama a handleEdit para editar
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(miembro.id)} // Llama a handleDelete para eliminar
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

export default MiembrosList;