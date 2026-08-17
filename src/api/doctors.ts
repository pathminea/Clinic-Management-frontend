import apiClient from './client';
import type { Doctor } from '../types';

export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/doctors');
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  create: async (data: Doctor): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>('/doctors', data);
    return response.data;
  },

  update: async (id: number, data: Doctor): Promise<Doctor> => {
    const response = await apiClient.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/doctors/${id}`);
  },
};
