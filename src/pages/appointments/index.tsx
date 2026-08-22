import React, { useEffect, useState } from 'react';
import type { Appointment, AppointmentRequest, Doctor, Patient } from '../../types';
import { appointmentApi } from '../../api/appointments';
import { doctorApi } from '../../api/doctors';
import { patientApi } from '../../api/patients';
import { useTheme } from '../../context/ThemeContext';

const statusKey = (status: string) => status.toLowerCase().replace(/[^a-z]/g, '');

const emptyForm: AppointmentRequest = {
  doctorId: 0,
  patientId: 0,
  appointmentDate: '',
  appointmentTime: '',
  notes: '',
};

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState<AppointmentRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchDoctors(), fetchPatients()]);
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentApi.getAll();
      setAppointments(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setDoctors(await doctorApi.getAll());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    }
  };

  const fetchPatients = async () => {
    try {
      setPatients(await patientApi.getAll());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      if (editingId === null) {
        await appointmentApi.create(form);
      } else {
        await appointmentApi.update(editingId, form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchAppointments();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setForm({
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      notes: appointment.notes ?? '',
    });
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      setError('');
      await appointmentApi.delete(id);
      setAppointments((current) => current.filter((appointment) => appointment.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const c = palette[theme];
  const styles = makeStyles(c);

  const statusBadgeStyle = (status: string): React.CSSProperties => ({
    ...styles.badge,
    ...(c.statusColors[statusKey(status)] ?? c.statusColors.default),
  });

  if (isLoading) {
    return (
      <div style={styles.pageWrap}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Appointments</h1>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.formHeading}>{editingId === null ? 'New appointment' : 'Edit appointment'}</h2>
          <div className="appointment-form-grid" style={styles.formGrid}>
            <label style={styles.label}>
              Doctor
              <select style={styles.input} value={form.doctorId || ''} onChange={(event) => setForm({ ...form, doctorId: Number(event.target.value) })} required>
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>)}
              </select>
            </label>
            <label style={styles.label}>
              Patient
              <select style={styles.input} value={form.patientId || ''} onChange={(event) => setForm({ ...form, patientId: Number(event.target.value) })} required>
                <option value="">Select a patient</option>
                {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>)}
              </select>
            </label>
            <label style={styles.label}>
              Date
              <input style={styles.input} type="date" value={form.appointmentDate} onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })} required />
            </label>
            <label style={styles.label}>
              Time
              <input style={styles.input} type="time" value={form.appointmentTime} onChange={(event) => setForm({ ...form, appointmentTime: event.target.value })} required />
            </label>
            <label style={styles.labelWide}>
              Notes
              <textarea style={styles.input} rows={2} value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </label>
          </div>
          <div style={styles.formActions}>
            {editingId !== null && <button type="button" style={styles.secondaryButton} onClick={handleCancelEdit}>Cancel</button>}
            <button type="submit" style={styles.primaryButton} disabled={isSaving}>{isSaving ? 'Saving...' : editingId === null ? 'Create appointment' : 'Save changes'}</button>
          </div>
        </form>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} style={styles.tr}>
                  <td style={styles.td}>{apt.id}</td>
                  <td style={styles.td}>{apt.doctor?.firstName} {apt.doctor?.lastName}</td>
                  <td style={styles.td}>{apt.patient?.firstName} {apt.patient?.lastName}</td>
                  <td style={styles.td}>{apt.appointmentDate}</td>
                  <td style={styles.td}>{apt.appointmentTime}</td>
                  <td style={styles.td}>
                    <span style={statusBadgeStyle(apt.status)}>{apt.status}</span>
                  </td>
                  <td style={styles.tdActions}>
                    <button type="button" style={styles.actionButton} onClick={() => handleEdit(apt)}>Edit</button>
                    <button type="button" style={styles.deleteButton} onClick={() => handleDelete(apt.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td style={styles.emptyCell} colSpan={7}>No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---- Theme ----

const palette = {
  light: {
    pageBg: '#f5f6f8',
    text: '#1a1a1a',
    subtleText: '#666666',
    cardBg: '#ffffff',
    border: '#e5e7eb',
    headerBg: '#f9fafb',
    rowHoverBg: '#f5f6f8',
    errorText: '#842029',
    errorBg: '#f8d7da',
    errorBorder: '#f5c2c7',
    toggleBg: 'rgba(0, 0, 0, 0.05)',
    tableShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    statusColors: {
      scheduled: { backgroundColor: '#e7f1ff', color: '#0b5ed7' },
      confirmed: { backgroundColor: '#e6f7ec', color: '#146c2e' },
      completed: { backgroundColor: '#e9ecef', color: '#495057' },
      cancelled: { backgroundColor: '#f8d7da', color: '#842029' },
      pending: { backgroundColor: '#fff3cd', color: '#997404' },
      default: { backgroundColor: '#e9ecef', color: '#495057' },
    } as Record<string, React.CSSProperties>,
  },
  dark: {
    pageBg: '#15161a',
    text: '#f1f1f1',
    subtleText: '#a0a0a8',
    cardBg: '#1e1f24',
    border: '#2f3037',
    headerBg: '#22232a',
    rowHoverBg: '#26272e',
    errorText: '#ffb3b8',
    errorBg: '#3a1f22',
    errorBorder: '#5c2a2f',
    toggleBg: 'rgba(255, 255, 255, 0.08)',
    tableShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    statusColors: {
      scheduled: { backgroundColor: '#173049', color: '#7db4f0' },
      confirmed: { backgroundColor: '#173626', color: '#5fd487' },
      completed: { backgroundColor: '#2a2b31', color: '#c2c3c9' },
      cancelled: { backgroundColor: '#3a1f22', color: '#ffb3b8' },
      pending: { backgroundColor: '#3a2f0f', color: '#e0bb5a' },
      default: { backgroundColor: '#2a2b31', color: '#c2c3c9' },
    } as Record<string, React.CSSProperties>,
  },
} as const;

type Palette = (typeof palette)[keyof typeof palette];

const makeStyles = (c: Palette): Record<string, React.CSSProperties> => ({
  pageWrap: {
    minHeight: '100vh',
    backgroundColor: c.pageBg,
    transition: 'background-color 0.2s ease',
  },
  container: {
    padding: '2rem',
    maxWidth: '960px',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  heading: {
    margin: 0,
    color: c.text,
    fontSize: '1.5rem',
  },
  form: {
    backgroundColor: c.cardBg,
    border: `1px solid ${c.border}`,
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: c.tableShadow,
  },
  formHeading: {
    margin: '0 0 1rem',
    color: c.text,
    fontSize: '1rem',
  },
  formGrid: {
    display: 'grid',
    gap: '0.85rem',
  },
  label: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    color: c.subtleText,
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  labelWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    gridColumn: '1 / -1',
    color: c.subtleText,
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '0.6rem',
    border: `1px solid ${c.border}`,
    borderRadius: '6px',
    backgroundColor: c.headerBg,
    color: c.text,
    font: 'inherit',
    fontWeight: 400,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.6rem',
    marginTop: '1rem',
  },
  primaryButton: {
    padding: '0.6rem 0.9rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#146c2e',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryButton: {
    padding: '0.6rem 0.9rem',
    border: `1px solid ${c.border}`,
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: c.text,
    cursor: 'pointer',
  },
  tdActions: {
    display: 'flex',
    gap: '0.45rem',
    padding: '0.75rem 1rem',
  },
  actionButton: {
    padding: '0.35rem 0.55rem',
    border: `1px solid ${c.border}`,
    borderRadius: '5px',
    backgroundColor: c.headerBg,
    color: c.text,
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.35rem 0.55rem',
    border: '1px solid #c0392b',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    color: '#c0392b',
    cursor: 'pointer',
  },
  themeToggle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: c.toggleBg,
    fontSize: '1rem',
    lineHeight: '36px',
    textAlign: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: c.text,
  },
  error: {
    color: c.errorText,
    padding: '1rem',
    backgroundColor: c.errorBg,
    border: `1px solid ${c.errorBorder}`,
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  tableWrap: {
    backgroundColor: c.cardBg,
    border: `1px solid ${c.border}`,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: c.tableShadow,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: c.subtleText,
    backgroundColor: c.headerBg,
    borderBottom: `1px solid ${c.border}`,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  tr: {
    borderBottom: `1px solid ${c.border}`,
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: c.text,
  },
  emptyCell: {
    padding: '1.5rem',
    textAlign: 'center',
    color: c.subtleText,
    fontSize: '0.9rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
});