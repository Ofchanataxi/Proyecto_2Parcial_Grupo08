import type { MiembroGrupo } from '../interfaces/MiembroGrupo';

const API_URL = 'http://localhost:3000/api/miembroGrupo';

export const miembroService = {
  async getAll(): Promise<MiembroGrupo[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching miembros');
    return response.json();
  },

  async getById(id: number): Promise<MiembroGrupo> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error fetching miembro');
    return response.json();
  },

  async create(miembro: Omit<MiembroGrupo, 'id'>): Promise<MiembroGrupo> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(miembro),
    });
    if (!response.ok) throw new Error('Error creating miembro');
    return response.json();
  },

  async update(id: number, miembro: Partial<MiembroGrupo>): Promise<MiembroGrupo> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(miembro),
    });
    if (!response.ok) throw new Error('Error updating miembro');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting miembro');
  },

  async getByUsuario(id_usuario: number): Promise<MiembroGrupo[]> {
    const response = await fetch(`${API_URL}/usuario/${id_usuario}`);
    if (!response.ok) throw new Error('Error fetching miembros por usuario');
    return response.json();
  },

  async getByGrupo(id_grupo: number): Promise<MiembroGrupo[]> {
    const response = await fetch(`${API_URL}/grupo/${id_grupo}`);
    if (!response.ok) throw new Error('Error fetching miembros por grupo');
    return response.json();
  },

  async checkMembership(id_usuario: number, id_grupo: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/verificar/${id_usuario}/${id_grupo}`);
    if (!response.ok) throw new Error('Error checking membership');
    const result = await response.json();
    return result.exists;
  },
};