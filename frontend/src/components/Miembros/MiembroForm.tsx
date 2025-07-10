import { useState, useEffect } from 'react';
import type { MiembroGrupo } from '../../interfaces/MiembroGrupo';
import type { Usuario } from '../../interfaces/Usuario';
import type { Grupo } from '../../interfaces/Grupo';
import { usuarioService } from '../../services/usuarioService';
import { grupoService } from '../../services/grupoService';

interface MiembroFormProps {
  miembro?: MiembroGrupo | null; // Miembro a editar, si existe
  onSubmit: (miembro: Omit<MiembroGrupo, 'id'>) => void; // Función para enviar los datos del formulario
  onCancel: () => void; // Función para cancelar el formulario
}

const MiembroForm = ({ miembro, onSubmit, onCancel }: MiembroFormProps) => {
  // Estado del formulario y validación
  const [formData, setFormData] = useState({
    id_usuario: 0,
    id_grupo: 0,
  });

  // Estado para almacenar los usuarios y grupos disponibles
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // Estado para manejar errores y el estado de carga
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios y grupos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Rellenar el formulario con los datos del miembro si se está editando
  useEffect(() => {
    if (miembro) {
      setFormData({
        id_usuario: miembro.id_usuario,
        id_grupo: miembro.id_grupo,
      });
    }
  }, [miembro]);

  // Función para cargar los usuarios y grupos disponibles
  const loadData = async () => {
    try {
      const [usuariosData, gruposData] = await Promise.all([
        usuarioService.getAll(),
        grupoService.getAll()
      ]);
      setUsuarios(usuariosData);
      setGrupos(gruposData);
    } catch (err) {
      setErrors(['Error al cargar datos']);
    } finally {
      setLoading(false);
    }
  };

  // Validación del formulario antes de enviarlo
  const validateForm = () => {
    const newErrors: string[] = [];

    if (formData.id_usuario === 0) {
      newErrors.push('Debe seleccionar un usuario');
    }

    if (formData.id_grupo === 0) {
      newErrors.push('Debe seleccionar un grupo');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Enviar los datos del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const usuario = usuarios.find(u => u.id_usuario === formData.id_usuario);
      const grupo = grupos.find(g => g.id_grupo === formData.id_grupo);
      if (usuario && grupo) {
        onSubmit({
          id_usuario: formData.id_usuario,
          id_grupo: formData.id_grupo,
          nombre_usuario: usuario.nombre,
          correo: usuario.correo,
          nombre_grupo: grupo.nombre_grupo
        });
      } else {
        setErrors(['Usuario o grupo seleccionado no es válido']);
      }
    }
  };

  // Manejar los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));

    // Limpiar errores cuando el usuario hace una selección
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Si el formulario está cargando, mostrar mensaje de carga
  if (loading) return <div className="loading">Cargando formulario...</div>;

  return (
    <div className="form-container">
      <h3>{miembro ? 'Editar Miembro' : 'Nuevo Miembro'}</h3>
      
      {/* Mostrar los errores del formulario */}
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_usuario">Usuario:</label>
          <select
            id="id_usuario"
            name="id_usuario"
            value={formData.id_usuario}
            onChange={handleChange}
            className="form-input"
          >
            <option value={0}>Selecciona un usuario</option>
            {/* Renderizar usuarios en el formulario */}
            {usuarios.map(usuario => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.nombre} ({usuario.correo})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="id_grupo">Grupo:</label>
          <select
            id="id_grupo"
            name="id_grupo"
            value={formData.id_grupo}
            onChange={handleChange}
            className="form-input"
          >
            <option value={0}>Selecciona un grupo</option>
            {/* Renderizar grupos en el formulario */}
            {grupos.map(grupo => (
              <option key={grupo.id_grupo} value={grupo.id_grupo}>
                {grupo.nombre_grupo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {miembro ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MiembroForm;
