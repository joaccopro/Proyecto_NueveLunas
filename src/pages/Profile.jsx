import { loadData, KEYS, clearNavigation } from '../utils/storage';
import BottomNav from '../components/BottomNav';

function Profile({ onNavigate }) {
  const patient = loadData(KEYS.PATIENT, {});
  const initial = patient.nombres ? patient.nombres.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    clearNavigation();
    onNavigate('splash');
  };

  const menuItems = [
    { icon: '👤', title: 'Ver y editar perfil', action: () => onNavigate('myInfo') },
    { icon: '⚙️', title: 'Configuración', action: null },
    { icon: '❓', title: 'Ayuda y soporte', action: null },
  ];

  return (
    <div className="page with-nav">
      <div className="page-header">
        <h1>Perfil</h1>
      </div>

      {/* Avatar */}
      <div style={{ paddingTop: 12, marginBottom: 28 }}>
        <div className="profile-avatar">{initial}</div>
        <div className="profile-name">
          {patient.nombres || 'Gestante'} {patient.apellidos || ''}
        </div>
        <div className="profile-subtitle">Paciente NueveLunas</div>
      </div>

      {/* Menu items */}
      {menuItems.map((item, i) => (
        <div
          className="list-item"
          key={i}
          onClick={item.action || undefined}
          role={item.action ? 'button' : undefined}
          tabIndex={item.action ? 0 : undefined}
          onKeyDown={item.action ? (e) => { if (e.key === 'Enter') item.action(); } : undefined}
          style={{ cursor: item.action ? 'pointer' : 'default' }}
        >
          <span className="item-icon">{item.icon}</span>
          <div className="item-content">
            <div className="item-title">{item.title}</div>
          </div>
          <span className="item-arrow">›</span>
        </div>
      ))}

      {/* Logout */}
      <button
        className="list-item"
        onClick={handleLogout}
        type="button"
        style={{
          width: '100%',
          marginTop: 20,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span className="item-icon">🚪</span>
        <div className="item-content">
          <div className="item-title" style={{ color: 'var(--color-danger)' }}>Cerrar sesión</div>
        </div>
        <span className="item-arrow">›</span>
      </button>

      <BottomNav currentPage="profile" onNavigate={onNavigate} />
    </div>
  );
}

export default Profile;
