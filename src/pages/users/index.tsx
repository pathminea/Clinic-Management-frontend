import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // adjust path to match your project

interface User {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export const UsersPage: React.FC = () => {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      setError('You are not logged in. Please sign in to view users.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/users', {
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
        setUsers(Array.isArray(data) ? data : data.users ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [authLoading, isAuthenticated, token]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Users</h1>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={cellStyle}>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}</td>
                <td style={cellStyle}>{u.email ?? '-'}</td>
                <td style={cellStyle}>{u.role ?? '-'}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td style={cellStyle} colSpan={3}>No users found.</td>
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