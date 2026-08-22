import React, { useEffect, useState } from 'react';
import { prescriptionApi } from '../../api/prescriptions';
import { treatmentApi } from '../../api/treatments';
import type { Prescription, Treatment, PrescriptionDto } from '../../types';

const emptyForm: PrescriptionDto = { id: 0, treatmentId: 0, medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' };

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [form, setForm] = useState<PrescriptionDto>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, treatmentData] = await Promise.all([prescriptionApi.getAll(controller.signal), treatmentApi.getAll()]);
        setPrescriptions(data);
        setTreatments(treatmentData);
      } catch (err: any) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
    return () => controller.abort();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setError(null);
      if (editingId === null) await prescriptionApi.create(form);
      else await prescriptionApi.update(editingId, form);
      setForm(emptyForm); setEditingId(null);
      setPrescriptions(await prescriptionApi.getAll());
    } catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to save prescription'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this prescription?')) return;
    try { await prescriptionApi.delete(id); setPrescriptions((items) => items.filter((item) => item.id !== id)); }
    catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Failed to delete prescription'); }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Prescriptions</h1>
      {loading && <p>Loading prescriptions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={formStyle}>
        <h2>{editingId === null ? 'New prescription' : 'Edit prescription'}</h2>
        <select required value={form.treatmentId || ''} onChange={(e) => setForm({ ...form, treatmentId: Number(e.target.value) })}><option value="">Select treatment</option>{treatments.map((treatment) => <option key={treatment.id} value={treatment.id}>{treatment.name} (#{treatment.id})</option>)}</select>
        <input required placeholder="Medicine" value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} />
        <input placeholder="Dosage" value={form.dosage ?? ''} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
        <input placeholder="Frequency" value={form.frequency ?? ''} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
        <input placeholder="Duration" value={form.duration ?? ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <input placeholder="Instructions" value={form.instructions ?? ''} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId === null ? 'Create' : 'Save'}</button>{editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
      </form>
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Medicine</th>
              <th style={cellStyle}>Dosage</th>
              <th style={cellStyle}>Frequency</th>
              <th style={cellStyle}>Duration</th>
              <th style={cellStyle}>Instructions</th>
              <th style={cellStyle}>Treatment</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.id}>
                <td style={cellStyle}>{p.medicineName}</td>
                <td style={cellStyle}>{p.dosage ?? '-'}</td>
                <td style={cellStyle}>{p.frequency ?? '-'}</td>
                <td style={cellStyle}>{p.duration ?? '-'}</td>
                <td style={cellStyle}>{p.instructions ?? '-'}</td>
                <td style={cellStyle}>{p.treatment?.name ?? `#${p.treatmentId}`}</td>
                <td style={cellStyle}><button onClick={() => { setEditingId(p.id); setForm({ ...emptyForm, ...p }); }}>Edit</button> <button onClick={() => remove(p.id)}>Delete</button></td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={7}>No prescriptions found.</td>
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