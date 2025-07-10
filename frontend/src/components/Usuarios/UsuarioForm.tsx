import { useState, useEffect } from 'react';
import type { Usuario } from '../../interfaces/Usuario'; // Importa el tipo Usuario para el tipado

// Define la interfaz para las props del formulario
interface UsuarioFormProps {
  usuario?: Usuario | null; // El usuario a editar (opcional)
  onSubmit: (usuario: Omit<Usuario, 'id_usuario'>) => void; // Función para enviar los datos del formulario
  onCancel: () => void; // Función para cancelar la edición o creación
}

const UsuarioForm = ({ usuario, onSubmit, onCancel }: UsuarioFormProps) => {
  // Estado para los datos del formulario (nombre, correo, fecha)
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    fecha_registro: new Date().toISOString().split('T')[0], // Fecha actual
  });
  // Estado para los errores de validación
  const [errors, setErrors] = useState<string[]>([]);

  // Si el usuario es proporcionado, llena el formulario con sus datos
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        correo: usuario.correo,
        fecha_registro: usuario.fecha_registro.split('T')[0], // Formatea la fecha
      });
    }
  }, [usuario]);

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors: string[] = [];

    // Validaciones de campos
    if (!formData.nombre.trim()) {
      newErrors.push('El nombre es requerido');
    }

    if (!formData.correo.trim()) {
      newErrors.push('El correo es requerido');
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.push('El correo debe ser válido');
    }

    if (!formData.fecha_registro) {
      newErrors.push('La fecha de registro es requerida');
    }

    setErrors(newErrors); // Establece los errores encontrados
    return newErrors.length === 0; // Retorna si no hay errores
  };

  // Función que maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData); // Si es válido, llama a onSubmit con los datos del formulario
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpia los errores cuando el usuario empieza a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="form-container">
      <h3>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
      
      {/* Muestra los errores si existen */}
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}

      {/* Formulario de usuario */}
      <form onSubmit={handleSubmit}>
        {/* Campo de nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange} // Llama a handleChange cuando cambia
            className="form-input"
          />
        </div>

        {/* Campo de correo */}
        <div className="form-group">
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange} // Llama a handleChange cuando cambia
            className="form-input"
          />
        </div>

        {/* Campo de fecha de registro */}
        <div className="form-group">
          <label htmlFor="fecha_registro">Fecha de Registro:</label>
          <input
            type="date"
            id="fecha_registro"
            name="fecha_registro"
            value={formData.fecha_registro}
            onChange={handleChange} // Llama a handleChange cuando cambia
            className="form-input"
          />
        </div>

        {/* Botones para enviar o cancelar */}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {usuario ? 'Actualizar' : 'Crear'} {/* Cambia el texto según si estamos editando o creando */}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
