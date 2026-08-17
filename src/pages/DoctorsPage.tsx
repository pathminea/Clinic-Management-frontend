import React, { useEffect, useState } from 'react';
import type { Doctor } from '../types';
import { doctorApi } from '../api/doctors';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (isLoading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>Doctors</h1>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.gridContainer}>
        {doctors.map((doctor) => (
          <div key={doctor.id} style={styles.card}>
            <h3>{doctor.firstName} {doctor.lastName}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            {doctor.phone && <p><strong>Phone:</strong> {doctor.phone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
  },
  error: {
    color: 'red',
    padding: '1rem',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};
