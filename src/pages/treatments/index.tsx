import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // adjust path to match your project

interface Treatment {
  id: string | number;
  name: string;
  patientName?: string;
  status?: string;
  date?: string;
}

export const TreatmentsPage: React.FC = () => {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      setError('You are not logged in. Please sign in to view treatments.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchTreatments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/treatments', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.status === 401 || res.status === 403) {
          throw new Error('Your session has expired. Please log in again.');
        }
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setTreatments(Array.isArray(data) ? data : data.treatments ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load treatments');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
    return () => controller.abort();
  }, [authLoading, isAuthenticated, token]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Treatments</h1>
      {loading && <p>Loading treatments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Treatment</th>
              <th style={cellStyle}>Patient</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.id}>
                <td style={cellStyle}>{t.name}</td>
                <td style={cellStyle}>{t.patientName ?? '-'}</td>
                <td style={cellStyle}>{t.status ?? '-'}</td>
                <td style={cellStyle}>{t.date ?? '-'}</td>
              </tr>
            ))}
            {treatments.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={4}>No treatments found.</td>
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