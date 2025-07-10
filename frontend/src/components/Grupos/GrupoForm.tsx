import { useState, useEffect } from 'react';
import type { Grupo } from '../../interfaces/Grupo';

interface GrupoFormProps {
  grupo?: Grupo | null; // Grupo que se está editando, si existe
  onSubmit: (grupo: Omit<Grupo, 'id_grupo'>) => void; // Función para enviar el formulario
  onCancel: () => void; // Función para cancelar la edición o creación
}

const GrupoForm = ({ grupo, onSubmit, onCancel }: GrupoFormProps) => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre_grupo: '',
    descripcion: '',
  });
  
  // Estado para almacenar errores de validación
  const [errors, setErrors] = useState<string[]>([]);

  // Efecto que actualiza los datos del formulario si hay un grupo para editar
  useEffect(() => {
    if (grupo) {
      setFormData({
        nombre_grupo: grupo.nombre_grupo,
        descripcion: grupo.descripcion,
      });
    }
  }, [grupo]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.nombre_grupo.trim()) {
      newErrors.push('El nombre del grupo es requerido');
    }

    if (!formData.descripcion.trim()) {
      newErrors.push('La descripción es requerida');
    }

    setErrors(newErrors);
    return newErrors.length === 0; // Si no hay errores, permite enviar el formulario
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // Llama a la función onSubmit para crear o actualizar el grupo
    }
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="form-container">
      <h3>{grupo ? 'Editar Grupo' : 'Nuevo Grupo'}</h3>
      
      {/* Muestra errores de validación si existen */}
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo para el nombre del grupo */}
        <div className="form-group">
          <label htmlFor="nombre_grupo">Nombre del Grupo:</label>
          <input
            type="text"
            id="nombre_grupo"
            name="nombre_grupo"
            value={formData.nombre_grupo}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Campo para la descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-input"
            rows={4}
          />
        </div>

        {/* Botones para enviar o cancelar el formulario */}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {grupo ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrupoForm;
