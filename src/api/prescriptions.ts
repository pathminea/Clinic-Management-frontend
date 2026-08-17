import apiClient from './client';
import type { Prescription, PrescriptionDto } from '../types';

export const prescriptionApi = {
  getAll: async (): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>('/prescriptions');
    return response.data;
  },

  getById: async (id: number): Promise<Prescription> => {
    const response = await apiClient.get<Prescription>(`/prescriptions/${id}`);
    return response.data;
  },

  getByAppointmentId: async (appointmentId: number): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>(`/prescriptions/appointment/${appointmentId}`);
    return response.data;
  },

  create: async (data: PrescriptionDto): Promise<Prescription> => {
    const response = await apiClient.post<Prescription>('/prescriptions', data);
    return response.data;
  },

  update: async (id: number, data: PrescriptionDto): Promise<Prescription> => {
    const response = await apiClient.put<Prescription>(`/prescriptions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/prescriptions/${id}`);
  },
};
