import React, { useEffect, useState } from 'react';
import { patientApi } from '../../api/patients';
import type { Patient } from '../../types';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await patientApi.getAll(controller.signal);
        setPatients(data);
      } catch (err: any) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    return () => controller.abort();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Patients</h1>
      {loading && <p>Loading patients...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td style={cellStyle}>{p.firstName} {p.lastName}</td>
                <td style={cellStyle}>{p.email ?? '-'}</td>
                <td style={cellStyle}>{p.phone ?? '-'}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={3}>No patients found.</td>
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