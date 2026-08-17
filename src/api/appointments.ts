import apiClient from './client';
import type { Appointment, AppointmentRequest, AppointmentResponse } from '../types';

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments');
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: AppointmentRequest): Promise<AppointmentResponse> => {
    const response = await apiClient.post<AppointmentResponse>('/appointments', data);
    return response.data;
  },

  update: async (id: number, data: AppointmentRequest): Promise<AppointmentResponse> => {
    const response = await apiClient.put<AppointmentResponse>(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },

  updateStatus: async (id: number, status: string): Promise<AppointmentResponse> => {
    const response = await apiClient.put<AppointmentResponse>(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
