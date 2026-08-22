import React, { useEffect, useState } from 'react';
import { patientApi } from '../../api/patients';
import type { Patient } from '../../types';

type PatientForm = Omit<Patient, 'id'>;
const emptyForm: PatientForm = { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', address: '' };

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientApi.getAll();
      setPatients(data);
    } catch (err: any) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      if (editingId === null) await patientApi.create(form);
      else await patientApi.update(editingId, form);
      setForm(emptyForm);
      setEditingId(null);
      await fetchPatients();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to save patient');
    } finally {
      setSaving(false);
    }
  };

  const edit = (patient: Patient) => {
    setEditingId(patient.id);
    setForm({ ...emptyForm, ...patient });
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await patientApi.delete(id);
      setPatients((items) => items.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to delete patient');
    }
  };

  const update = (field: keyof PatientForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div style={styles.page}>
      <h1>Patients</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form style={styles.form} onSubmit={submit}>
        <h2>{editingId === null ? 'New patient' : 'Edit patient'}</h2>
        <input required placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
        <input required placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        <input placeholder="Phone" value={form.phone ?? ''} onChange={(e) => update('phone', e.target.value)} />
        <input type="date" value={form.dateOfBirth ?? ''} onChange={(e) => update('dateOfBirth', e.target.value)} />
        <input placeholder="Address" value={form.address ?? ''} onChange={(e) => update('address', e.target.value)} />
        <div>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId === null ? 'Create' : 'Save'}</button>
          {editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
        </div>
      </form>
      {loading ? <p>Loading patients...</p> : <table style={styles.table}><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
        {patients.map((patient) => <tr key={patient.id}><td>{patient.firstName} {patient.lastName}</td><td>{patient.email || '-'}</td><td>{patient.phone || '-'}</td><td><button onClick={() => edit(patient)}>Edit</button> <button onClick={() => remove(patient.id)}>Delete</button></td></tr>)}
        {patients.length === 0 && <tr><td colSpan={4}>No patients found.</td></tr>}
      </tbody></table>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd' },
  table: { width: '100%', borderCollapse: 'collapse' },
  error: { color: 'red' }
};