import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkColors : lightColors;

  const quickLinks = [
    { icon: '📅', title: 'Appointments', description: 'View and manage your appointments', linkText: 'Go to Appointments', to: '/appointments' },
    { icon: '👨‍⚕️', title: 'Doctors', description: 'Find and view doctor information', linkText: 'View Doctors', to: '/doctors' },
    { icon: '🧑‍🤝‍🧑', title: 'Patients', description: 'View and manage patient records', linkText: 'View Patients', to: '/patients' },
    { icon: '💊', title: 'Prescriptions', description: 'View and manage prescriptions', linkText: 'View Prescriptions', to: '/prescriptions' },
    { icon: '🩺', title: 'Treatments', description: 'View and manage treatments', linkText: 'View Treatments', to: '/treatments' },
    { icon: '👤', title: 'Users', description: 'Manage system users', linkText: 'View Users', to: '/users' },
  ];

  return (
    <div style={{ ...styles.container, backgroundColor: theme.background }}>
      <nav style={{ ...styles.navbar, backgroundColor: theme.navbarBg }}>
        <div style={styles.navContent}>
          <h2 style={{ ...styles.title, color: theme.navbarText }}>Clinic Management System</h2>
          <div style={styles.navLinks}>
            <Link to="/appointments" style={{ ...styles.navLink, color: theme.navbarText }}>Appointments</Link>
            <Link to="/doctors" style={{ ...styles.navLink, color: theme.navbarText }}>Doctors</Link>
            <Link to="/patients" style={{ ...styles.navLink, color: theme.navbarText }}>Patients</Link>
            <Link to="/prescriptions" style={{ ...styles.navLink, color: theme.navbarText }}>Prescriptions</Link>
            <Link to="/treatments" style={{ ...styles.navLink, color: theme.navbarText }}>Treatments</Link>
            <Link to="/users" style={{ ...styles.navLink, color: theme.navbarText }}>Users</Link>
            {user && (
              <span style={{ ...styles.userInfo, color: theme.navbarText }}>
                {user.firstName} {user.lastName}
              </span>
            )}
            <button onClick={toggleTheme} style={{ ...styles.themeToggle, ...theme.themeToggleStyle }}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div style={styles.content}>
        <h1 style={{ color: theme.text }}>Welcome, {user?.firstName}!</h1>
        <p style={{ color: theme.subText }}>
          Clinic Management System - Manage your appointments and medical records.
        </p>
        <div style={styles.quickLinks}>
          {quickLinks.map((item) => (
            <div key={item.to} style={{ ...styles.quickLink, backgroundColor: theme.cardBg, boxShadow: theme.cardShadow }}>
              <h3 style={{ color: theme.text }}>{item.icon} {item.title}</h3>
              <p style={{ color: theme.subText }}>{item.description}</p>
              <Link to={item.to} style={{ ...styles.link, color: theme.linkColor }}>
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const lightColors = {
  background: '#f5f5f5', navbarBg: '#007bff', navbarText: 'white', text: '#1a1a1a',
  subText: '#555', cardBg: 'white', cardShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', linkColor: '#007bff',
  themeToggleStyle: { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.4)' },
};

const darkColors = {
  background: '#121212', navbarBg: '#1f1f1f', navbarText: '#f1f1f1', text: '#f1f1f1',
  subText: '#b0b0b0', cardBg: '#1e1e1e', cardShadow: '0 2px 6px rgba(0, 0, 0, 0.5)', linkColor: '#4da3ff',
  themeToggleStyle: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#f1f1f1', border: '1px solid rgba(255, 255, 255, 0.25)' },
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', transition: 'background-color 0.2s ease' },
  navbar: { padding: '1rem 0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'background-color 0.2s ease' },
  navContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem', flexWrap: 'wrap', gap: '0.5rem' },
  title: { margin: 0, fontSize: '1.5rem' },
  navLinks: { display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' },
  navLink: { textDecoration: 'none', fontSize: '1rem' },
  userInfo: { fontSize: '0.9rem' },
  themeToggle: { padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', transition: 'background-color 0.15s ease' },
  logoutButton: { padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' },
  quickLink: { padding: '1.5rem', borderRadius: '8px', transition: 'background-color 0.2s ease' },
  link: { textDecoration: 'none', fontWeight: 'bold' },
};