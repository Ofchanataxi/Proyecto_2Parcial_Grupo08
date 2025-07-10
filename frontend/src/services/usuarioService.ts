import type { Usuario } from '../interfaces/Usuario';

const API_URL = 'http://localhost:3000/api/usuarios';

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching usuarios');
    return response.json();
  },

  async getById(id: number): Promise<Usuario> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error fetching usuario');
    return response.json();
  },

  async create(usuario: Omit<Usuario, 'id_usuario'>): Promise<Usuario> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error creating usuario');
    return response.json();
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error updating usuario');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting usuario');
  },

  async getGrupos(id: number): Promise<any[]> {
    const response = await fetch(`${API_URL}/${id}/grupos`);
    if (!response.ok) throw new Error('Error fetching grupos del usuario');
    return response.json();
  },
};