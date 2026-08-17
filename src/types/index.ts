// User and Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'DOCTOR' | 'PATIENT' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Doctor Types
export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  phone?: string;
}

export interface DoctorDto extends Doctor {}

// Patient Types
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface PatientDto extends Patient {}

// Appointment Types
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type AppointmentStatusType = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatusType;
  notes?: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface AppointmentRequest {
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentResponse extends Appointment {}

// Treatment Types
export interface Treatment {
  id: number;
  appointmentId: number;
  name: string;
  description: string;
  cost: number;
  createdDate?: string;
  appointment?: Appointment;
}

export interface TreatmentDto extends Treatment {}

// Prescription Types
export interface Prescription {
  id: number;
  appointmentId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdDate?: string;
  appointment?: Appointment;
}

export interface PrescriptionDto extends Prescription {}
