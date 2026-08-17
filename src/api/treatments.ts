import apiClient from './client';
import type { Treatment, TreatmentDto } from '../types';

export const treatmentApi = {
  getAll: async (): Promise<Treatment[]> => {
    const response = await apiClient.get<Treatment[]>('/treatments');
    return response.data;
  },

  getById: async (id: number): Promise<Treatment> => {
    const response = await apiClient.get<Treatment>(`/treatments/${id}`);
    return response.data;
  },

  getByAppointmentId: async (appointmentId: number): Promise<Treatment[]> => {
    const response = await apiClient.get<Treatment[]>(`/treatments/appointment/${appointmentId}`);
    return response.data;
  },

  create: async (data: TreatmentDto): Promise<Treatment> => {
    const response = await apiClient.post<Treatment>('/treatments', data);
    return response.data;
  },

  update: async (id: number, data: TreatmentDto): Promise<Treatment> => {
    const response = await apiClient.put<Treatment>(`/treatments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/treatments/${id}`);
  },
};
