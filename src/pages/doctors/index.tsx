import React, { useEffect, useState } from 'react';
import type { Doctor } from '../../types';
import { doctorApi } from '../../api/doctors';
import { useTheme } from '../../context/ThemeContext';

const emptyForm: Omit<Doctor, 'id'> = { firstName: '', lastName: '', email: '', specialization: '', phone: '' };

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Omit<Doctor, 'id'>>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await doctorApi.getAll();
      setDoctors(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctors';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setError('');
      if (editingId === null) await doctorApi.create({ id: 0, ...form });
      else await doctorApi.update(editingId, { id: editingId, ...form });
      setForm(emptyForm); setEditingId(null); await fetchDoctors();
    } catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to save doctor'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this doctor?')) return;
    try { await doctorApi.delete(id); setDoctors((items) => items.filter((item) => item.id !== id)); }
    catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to delete doctor'); }
  };

  const c = palette[theme];
  const styles = makeStyles(c);

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
          <h1 style={styles.heading}>Doctors</h1>
        
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form style={styles.form} onSubmit={submit}>
          <h2 style={styles.formHeading}>{editingId === null ? 'New doctor' : 'Edit doctor'}</h2>
          <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          <input placeholder="Phone" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div><button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId === null ? 'Create' : 'Save'}</button>{editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}</div>
        </form>

        <div style={styles.gridContainer}>
          {doctors.map((doctor) => (
            <div key={doctor.id} style={styles.card}>
              <h3 style={styles.cardName}>{doctor.firstName} {doctor.lastName}</h3>
              <p style={styles.cardLine}><span style={styles.cardLabel}>Specialization:</span> {doctor.specialization}</p>
              <p style={styles.cardLine}><span style={styles.cardLabel}>Email:</span> {doctor.email}</p>
              {doctor.phone && <p style={styles.cardLine}><span style={styles.cardLabel}>Phone:</span> {doctor.phone}</p>}
              <button onClick={() => { setEditingId(doctor.id); setForm({ ...emptyForm, ...doctor }); }}>Edit</button>{' '}
              <button onClick={() => remove(doctor.id)}>Delete</button>
            </div>
          ))}
          {doctors.length === 0 && (
            <p style={styles.emptyText}>No doctors found.</p>
          )}
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
    cardBg: '#f9f9f9',
    cardBorder: '#eeeeee',
    errorText: '#842029',
    errorBg: '#f8d7da',
    errorBorder: '#f5c2c7',
    toggleBg: 'rgba(0, 0, 0, 0.05)',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    pageBg: '#15161a',
    text: '#f1f1f1',
    subtleText: '#a0a0a8',
    cardBg: '#1e1f24',
    cardBorder: '#2f3037',
    errorText: '#ffb3b8',
    errorBg: '#3a1f22',
    errorBorder: '#5c2a2f',
    toggleBg: 'rgba(255, 255, 255, 0.08)',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
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
    maxWidth: '1100px',
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
    padding: '1rem',
    marginBottom: '1rem',
    border: `1px solid ${c.cardBorder}`,
    backgroundColor: c.cardBg,
  },
  formHeading: { gridColumn: '1 / -1', margin: 0, color: c.text, fontSize: '1rem' },
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  card: {
    backgroundColor: c.cardBg,
    border: `1px solid ${c.cardBorder}`,
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: c.cardShadow,
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  cardName: {
    margin: '0 0 0.5rem',
    color: c.text,
    fontSize: '1.1rem',
  },
  cardLine: {
    margin: '0.25rem 0',
    color: c.text,
    fontSize: '0.9rem',
  },
  cardLabel: {
    fontWeight: 600,
    color: c.subtleText,
  },
  emptyText: {
    color: c.subtleText,
    fontSize: '0.9rem',
  },
});