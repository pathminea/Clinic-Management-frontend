import React, { useEffect, useState } from 'react';
import { prescriptionApi } from '../../api/prescriptions';
import type { Prescription } from '../../types';

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await prescriptionApi.getAll(controller.signal);
        setPrescriptions(data);
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Prescriptions</h1>
      {loading && <p>Loading prescriptions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Patient</th>
              <th style={cellStyle}>Medication</th>
              <th style={cellStyle}>Dosage</th>
              <th style={cellStyle}>Issued</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.id}>
                <td style={cellStyle}>{p.patientName ?? '-'}</td>
                <td style={cellStyle}>{p.medication}</td>
                <td style={cellStyle}>{p.dosage ?? '-'}</td>
                <td style={cellStyle}>{p.issuedDate ?? '-'}</td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={4}>No prescriptions found.</td>
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