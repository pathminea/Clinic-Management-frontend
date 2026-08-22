import React, { useEffect, useState } from 'react';
import { treatmentApi } from '../../api/treatments';
import { appointmentApi } from '../../api/appointments';
import type { Treatment, TreatmentDto, Appointment } from '../../types';

const emptyForm: TreatmentDto = { id: 0, appointmentId: 0, name: '', description: '', cost: 0 };

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState<TreatmentDto>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, appointmentData] = await Promise.all([treatmentApi.getAll(), appointmentApi.getAll()]);
        setTreatments(data);
        setAppointments(appointmentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load treatments');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setError(null);
      if (editingId === null) await treatmentApi.create(form);
      else await treatmentApi.update(editingId, form);
      setForm(emptyForm); setEditingId(null); setTreatments(await treatmentApi.getAll());
    } catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to save treatment'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this treatment?')) return;
    try { await treatmentApi.delete(id); setTreatments((items) => items.filter((item) => item.id !== id)); }
    catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to delete treatment'); }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Treatments</h1>
      {loading && <p>Loading treatments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={formStyle}>
        <h2>{editingId === null ? 'New treatment' : 'Edit treatment'}</h2>
        <select required value={form.appointmentId || ''} onChange={(e) => setForm({ ...form, appointmentId: Number(e.target.value) })}><option value="">Select appointment</option>{appointments.map((appointment) => <option key={appointment.id} value={appointment.id}>#{appointment.id} {appointment.appointmentDate}</option>)}</select>
        <input required placeholder="Treatment name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required type="number" min="0" step="0.01" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId === null ? 'Create' : 'Save'}</button>{editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
      </form>
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Name</th><th style={cellStyle}>Description</th><th style={cellStyle}>Cost</th><th style={cellStyle}>Appointment</th><th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.id}>
                <td style={cellStyle}>{t.name}</td><td style={cellStyle}>{t.description}</td><td style={cellStyle}>{t.cost}</td><td style={cellStyle}>{t.appointment ? `#${t.appointment.id}` : `#${t.appointmentId}`}</td><td style={cellStyle}><button onClick={() => { setEditingId(t.id); setForm({ ...emptyForm, ...t }); }}>Edit</button> <button onClick={() => remove(t.id)}>Delete</button></td>
              </tr>
            ))}
            {treatments.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={5}>No treatments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '0.75rem',
  textAlign: 'left',
};

const formStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd' };