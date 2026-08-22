import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme: themeMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const theme = themeMode === 'dark' ? darkColors : lightColors;
  const quickLinks = [
    { mark: '01', title: 'Appointments', detail: 'Coordinate the day ahead', to: '/appointments' },
    { mark: '02', title: 'Patients', detail: 'Keep every record current', to: '/patients' },
    { mark: '03', title: 'Treatments', detail: 'Follow care plans end to end', to: '/treatments' },
    { mark: '04', title: 'Prescriptions', detail: 'Review medication details', to: '/prescriptions' },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">+</span><span>Northstar<br /><b>Clinic</b></span></div>
        <p className="eyebrow">Workspace</p>
        <nav className="side-nav" aria-label="Main navigation">
          <Link className="active" to="/"><span>⌂</span> Overview</Link>
          <Link to="/appointments"><span>◷</span> Appointments</Link>
          <Link to="/patients"><span>◌</span> Patients</Link>
          <Link to="/doctors"><span>✚</span> Doctors</Link>
          <Link to="/treatments"><span>◈</span> Treatments</Link>
          <Link to="/prescriptions"><span>▤</span> Prescriptions</Link>
        </nav>
        <div className="sidebar-foot"><span className="status-dot" /> Systems operational<br /><small>Last synced just now</small></div>
      </aside>
      <main className="dashboard">
        <header className="topbar"><div><p className="eyebrow">Friday, August 22, 2026</p><h1>Good morning, {user?.firstName || 'there'}.</h1></div><div className="top-actions"><span className="user-chip">{user?.firstName?.[0]}{user?.lastName?.[0]} <b>{user?.firstName} {user?.lastName}</b></span><button className="logout-button" onClick={handleLogout}>Sign out</button></div></header>
        <section className="welcome-panel"><div><span className="section-kicker">Clinical command center</span><h2>A clearer view of today’s care.</h2><p>Keep appointments moving and give every patient the attention they deserve.</p></div><Link className="primary-cta" to="/appointments">+ New appointment</Link></section>
        <section className="metric-grid" aria-label="Clinic summary"><div className="metric"><span className="metric-label">Today’s visits</span><strong>24</strong><small className="positive">↑ 12% from last week</small></div><div className="metric"><span className="metric-label">Active patients</span><strong>1,284</strong><small>Across all departments</small></div><div className="metric"><span className="metric-label">Open treatment plans</span><strong>86</strong><small className="warning">8 need review today</small></div><div className="metric"><span className="metric-label">Care team</span><strong>18</strong><small>4 currently on shift</small></div></section>
        <section className="dashboard-grid"><div className="schedule-panel"><div className="panel-heading"><div><span className="section-kicker">Live schedule</span><h2>Today at a glance</h2></div><Link to="/appointments">View all →</Link></div><div className="timeline"><div><time>09:00</time><span className="timeline-line active-line" /><article><b>Annual health review</b><p>Dr. Maya Chen · Olivia Martin</p></article><em>In 15 min</em></div><div><time>10:30</time><span className="timeline-line" /><article><b>Follow-up consultation</b><p>Dr. Lucas Reed · James Wilson</p></article></div><div><time>13:00</time><span className="timeline-line" /><article><b>New patient intake</b><p>Dr. Maya Chen · Sophia Brown</p></article></div></div></div><div className="access-panel"><span className="section-kicker">Quick access</span><h2>Move with intent.</h2>{quickLinks.map((item) => <Link className="access-row" key={item.to} to={item.to}><span className="access-number">{item.mark}</span><span><b>{item.title}</b><small>{item.detail}</small></span><span>↗</span></Link>)}</div></section>
        <footer className="dashboard-footer">Northstar Clinic <span>·</span> Private workspace <span>·</span> {themeMode === 'dark' ? 'Night mode' : 'Day mode'} <span className="footer-theme">{theme.background}</span></footer>
      </main>
    </div>
  );
};

const lightColors = {
  background: '#f3f6f3',
};

const darkColors = {
  background: '#101d1d',
};
