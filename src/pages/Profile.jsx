import { useState, useRef } from 'react';
import { loadData, saveData, KEYS, clearNavigation } from '../utils/storage';
import BottomNav from '../components/BottomNav';

function Profile({ onNavigate }) {
  const patient = loadData(KEYS.PATIENT, {});
  const [profilePhoto, setProfilePhoto] = useState(loadData(KEYS.PROFILE_PHOTO, null));
  const fileInputRef = useRef(null);

  const initial = patient.nombres ? patient.nombres.charAt(0).toUpperCase() : '?';
  const secondInitial = patient.apellidos ? patient.apellidos.charAt(0).toUpperCase() : '';

  const handleLogout = () => {
    clearNavigation();
    onNavigate('splash');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      saveData(KEYS.PROFILE_PHOTO, base64);
      setProfilePhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const menuItems = [
    { icon: '✏️', title: 'Ver y editar perfil', subtitle: 'Datos personales, obstétricos, contactos', action: () => onNavigate('editProfile') },
    { icon: '⚙️', title: 'Configuración', subtitle: 'Tema, preferencias', action: () => onNavigate('settings') },
    { icon: '❓', title: 'Ayuda y soporte', subtitle: 'Emergencias, signos de alarma', action: () => onNavigate('helpSupport') },
  ];

  return (
    <div className="page with-nav">
      <div className="page-header">
        <h1>Perfil</h1>
      </div>

      {/* Avatar with photo upload */}
      <div style={{ paddingTop: 12, marginBottom: 28 }}>
        <div
          className="profile-avatar-wrapper"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Foto de perfil" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar">{initial}{secondInitial}</div>
          )}
          <div className="profile-avatar-edit">📷</div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
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
            {item.subtitle && <div className="item-subtitle">{item.subtitle}</div>}
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
