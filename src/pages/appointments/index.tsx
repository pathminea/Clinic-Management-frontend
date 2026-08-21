import React, { useEffect, useState } from 'react';
import type { Appointment } from '../../types';
import { appointmentApi } from '../../api/appointments';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const statusKey = (status: string) => status.toLowerCase().replace(/[^a-z]/g, '');

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

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
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            style={styles.themeToggle}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

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
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td style={styles.emptyCell} colSpan={6}>No appointments found.</td>
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

type Palette = typeof palette.light;

const makeStyles = (c: Palette): Record<string, React.CSSProperties> => ({
  pageWrap: {
    minHeight: '100vh',
    backgroundColor: c.pageBg,
    transition: 'background-color 0.2s ease',
  },
  container: {
    padding: '2rem',
    maxWidth: '960px',
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