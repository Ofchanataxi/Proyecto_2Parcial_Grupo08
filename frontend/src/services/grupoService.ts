import type { Grupo } from '../interfaces/Grupo';

const API_URL = 'http://localhost:3000/api/grupos';

export const grupoService = {
  async getAll(): Promise<Grupo[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching grupos');
    return response.json();
  },

  async getById(id: number): Promise<Grupo> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error fetching grupo');
    return response.json();
  },

  async create(grupo: Omit<Grupo, 'id_grupo'>): Promise<Grupo> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grupo),
    });
    if (!response.ok) throw new Error('Error creating grupo');
    return response.json();
  },

  async update(id: number, grupo: Partial<Grupo>): Promise<Grupo> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grupo),
    });
    if (!response.ok) throw new Error('Error updating grupo');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting grupo');
  },

  async getMiembros(id: number): Promise<any[]> {
    const response = await fetch(`${API_URL}/${id}/miembros`);
    if (!response.ok) throw new Error('Error fetching miembros del grupo');
    return response.json();
  },

  async getEstadisticas(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/${id}/estadisticas`);
    if (!response.ok) throw new Error('Error fetching estadísticas del grupo');
    return response.json();
  },
};