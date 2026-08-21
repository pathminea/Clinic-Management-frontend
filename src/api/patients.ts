import apiClient from './client';
import type { Patient } from '../types';

export const patientApi = {
  getAll: async (signal?: AbortSignal): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients', { signal });
    return response.data;
  },

  getById: async (id: number, signal?: AbortSignal): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`, { signal });
    return response.data;
  },

  create: async (data: Omit<Patient, 'id'>): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/patients', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Omit<Patient, 'id'>>): Promise<Patient> => {
    const response = await apiClient.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },
};