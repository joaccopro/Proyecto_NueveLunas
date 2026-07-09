import { loadData, KEYS } from '../services/storageService';
import madreBebeImg from '../assets/madre-bebe.png';
import BottomNav from '../components/BottomNav';
import EmergencyFab from '../components/EmergencyFab';

function Dashboard({ onNavigate }) {
  const patient = loadData(KEYS.PATIENT, {});
  const obstetric = loadData(KEYS.OBSTETRIC, {});
  const appointments = loadData(KEYS.APPOINTMENTS, []);
  const reminders = loadData(KEYS.REMINDERS, []);
  const profilePhoto = loadData(KEYS.PROFILE_PHOTO, null);
  const semanas = Number(obstetric.semanasGestacion) || 0;
  const progress = Math.min((semanas / 40) * 100, 100);

  /* Find next upcoming appointment */
  const today = new Date().toISOString().split('T')[0];
  const nextAppointment = appointments.find((a) => a.fecha >= today) || null;

  /* Find next active reminder */
  const activeReminders = reminders
    .filter(r => (r.status === 'pendiente' || r.status === 'pospuesto') && r.fecha && r.hora)
    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
  const nextReminder = activeReminders.length > 0 ? activeReminders[0] : null;

  /* Trimester info */
  const trimester = semanas <= 12 ? '1er' : semanas <= 27 ? '2do' : '3er';

  const initial = patient.nombres ? patient.nombres.charAt(0).toUpperCase() : '?';

  const actionCards = [
    { icon: '👤', title: 'Mi información', page: 'myInfo', color: '#8B1A2B' },
    { icon: '📊', title: 'Control del embarazo', page: 'pregnancyControl', color: '#6B0F1A' },
    { icon: '📞', title: 'Contactos de emergencia', page: 'contactsView', color: '#C4314B' },
    { icon: '🏥', title: 'Establecimiento de salud', page: 'healthCentersView', color: '#A82040' },
    { icon: '⚠️', title: 'Signos de alarma', page: 'alarmSigns', color: '#D42E2E' },
    { icon: '📅', title: 'Citas y recordatorios', page: 'appointments', color: '#8B1A2B' },
  ];

  return (
    <div className="page with-nav">
      {/* Dashboard Header with gradient */}
      <div className="dash-header">
        <div className="dash-header-bg" />
        <div className="dash-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="dash-greeting">
                Hola, {patient.nombres || 'Gestante'} 👋
              </h1>
              <p className="dash-subtitle">Bienvenida a NueveLunas</p>
            </div>
            {/* Profile avatar with photo support */}
            <div
              className="dash-avatar"
              onClick={() => onNavigate('profile')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('profile'); }}
              style={{ cursor: 'pointer' }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Foto de perfil"
                  className="dash-avatar-img"
                />
              ) : (
                initial
              )}
            </div>
          </div>

          {/* Weeks Card with inline SVG illustration */}
          <div className="dash-weeks-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div className="card-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Semanas de gestación</div>
                <div className="card-value" style={{ color: 'white' }}>{semanas} semanas</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="dash-trimester-badge">{trimester} trimestre</div>
                {/* Mini gestante SVG */}
                <img src={madreBebeImg} alt="Gestante" style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '2px' }} />
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <div className="progress-fill" style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.9)' }} />
              </div>
              <div className="progress-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <span>Semana {semanas}</span>
                <span>Semana 40</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="card mb-16" onClick={() => onNavigate('appointments')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('appointments'); }} style={{ cursor: 'pointer' }}>
        <div className="card-label">Próxima cita</div>
        {nextAppointment ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <div className="dash-appt-icon">📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{nextAppointment.motivo}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {nextAppointment.fecha} {nextAppointment.hora && `— ${nextAppointment.hora}`}
              </div>
              {nextAppointment.establecimiento && (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  🏥 {nextAppointment.establecimiento}
                </div>
              )}
            </div>
            <span style={{ color: 'var(--color-gray-400)' }}>›</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: '1.3rem' }}>📅</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              Sin citas programadas — toca para agregar
            </p>
          </div>
        )}
      </div>

      {/* Next Reminder */}
      <div className="card mb-16" onClick={() => onNavigate('reminders')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('reminders'); }} style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-primary)' }}>
        <div className="card-label">Próximo recordatorio</div>
        {nextReminder ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <div className="dash-appt-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{nextReminder.icon || '🔔'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{nextReminder.text}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                📅 {nextReminder.fecha} ⏰ {nextReminder.hora}
              </div>
            </div>
            <span style={{ color: 'var(--color-gray-400)' }}>›</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: '1.3rem' }}>🔔</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              No tienes recordatorios pendientes
            </p>
          </div>
        )}
      </div>

      {/* Action Cards Grid */}
      <h3 className="section-title">Accesos rápidos</h3>
      <div className="card-grid mb-20">
        {actionCards.map((card) => (
          <div
            className="card card-action"
            key={card.page}
            onClick={() => onNavigate(card.page)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigate(card.page); }}
          >
            <div className="card-icon-circle" style={{ background: `${card.color}15` }}>
              <span className="card-icon" style={{ fontSize: '1.5rem' }}>{card.icon}</span>
            </div>
            <span className="card-title">{card.title}</span>
          </div>
        ))}
      </div>

      {/* Emergency FAB */}
      <EmergencyFab onPress={() => onNavigate('emergency')} />

      <BottomNav currentPage="dashboard" onNavigate={onNavigate} />
    </div>
  );
}

export default Dashboard;
