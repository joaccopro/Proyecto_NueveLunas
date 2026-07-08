import { loadData, KEYS } from '../utils/storage';
import BottomNav from '../components/BottomNav';
import EmergencyFab from '../components/EmergencyFab';

function Dashboard({ onNavigate }) {
  const patient = loadData(KEYS.PATIENT, {});
  const obstetric = loadData(KEYS.OBSTETRIC, {});
  const controls = loadData(KEYS.CONTROLS, []);
  const semanas = Number(obstetric.semanasGestacion) || 0;
  const progress = Math.min((semanas / 40) * 100, 100);

  const lastControl = controls.length > 0 ? controls[controls.length - 1] : null;

  const actionCards = [
    { icon: '👤', title: 'Mi información', page: 'myInfo' },
    { icon: '📊', title: 'Control del embarazo', page: 'pregnancyControl' },
    { icon: '📞', title: 'Contactos de emergencia', page: 'emergencyContacts_view' },
    { icon: '🏥', title: 'Establecimiento de salud', page: 'healthCenter_view' },
    { icon: '⚠️', title: 'Signos de alarma', page: 'alarmSigns' },
  ];

  return (
    <div className="page with-nav">
      {/* Greeting */}
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
          Hola, {patient.nombres || 'Gestante'} 👋
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Bienvenida a NueveLunas
        </p>
      </div>

      {/* Weeks Card */}
      <div className="card card-accent mb-16">
        <div className="card-label">Semanas de gestación</div>
        <div className="card-value">{semanas} semanas</div>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.85)' }} />
          </div>
          <div className="progress-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>Semana {semanas}</span>
            <span>Semana 40</span>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="card mb-16">
        <div className="card-label">Próxima cita</div>
        {lastControl ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: '1.5rem' }}>📅</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Último control: {lastControl.fecha}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                P.A.: {lastControl.presionArterial || '—'} | Peso: {lastControl.peso || '—'} kg
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Sin citas registradas aún
          </p>
        )}
      </div>

      {/* Action Cards Grid */}
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
            <span className="card-icon">{card.icon}</span>
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
