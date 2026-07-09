import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

function Settings({ onNavigate, goBack, onThemeChange }) {
  const [darkMode, setDarkMode] = useState(loadData(KEYS.THEME, 'light') === 'dark');
  const [resetMsg, setResetMsg] = useState(false);

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    saveData(KEYS.THEME, newTheme);
    if (onThemeChange) onThemeChange(newTheme);
  };

  const resetPreferences = () => {
    saveData(KEYS.THEME, 'light');
    setDarkMode(false);
    if (onThemeChange) onThemeChange('light');
    setResetMsg(true);
    setTimeout(() => setResetMsg(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">←</button>
        <h1>⚙️ Configuración</h1>
      </div>

      {resetMsg && (
        <div className="save-toast">✅ Preferencias restablecidas</div>
      )}

      {/* Appearance */}
      <h3 className="section-title">Apariencia</h3>
      <div className="card mb-16">
        <div className="toggle-group">
          <div>
            <span className="toggle-label">{darkMode ? '🌙 Tema oscuro' : '☀️ Tema claro'}</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {darkMode ? 'Modo oscuro activado' : 'Cambiar a modo oscuro'}
            </p>
          </div>
          <div
            className={`toggle-switch${darkMode ? ' active' : ''}`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={darkMode}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') toggleTheme(); }}
          />
        </div>
      </div>

      {/* Data management */}
      <h3 className="section-title">Datos personales</h3>
      <div
        className="list-item"
        onClick={() => onNavigate('editProfile')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('editProfile'); }}
      >
        <span className="item-icon">👤</span>
        <div className="item-content">
          <div className="item-title">Editar datos personales</div>
          <div className="item-subtitle">Nombres, DNI, dirección, celular</div>
        </div>
        <span className="item-arrow">›</span>
      </div>

      <h3 className="section-title">Contactos y Establecimientos</h3>
      <div
        className="list-item"
        onClick={() => onNavigate('contactsView')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('contactsView'); }}
      >
        <span className="item-icon">📞</span>
        <div className="item-content">
          <div className="item-title">Editar contactos de emergencia</div>
          <div className="item-subtitle">Agregar, editar o eliminar contactos</div>
        </div>
        <span className="item-arrow">›</span>
      </div>

      <div
        className="list-item"
        onClick={() => onNavigate('healthCentersView')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('healthCentersView'); }}
      >
        <span className="item-icon">🏥</span>
        <div className="item-content">
          <div className="item-title">Editar establecimientos de salud</div>
          <div className="item-subtitle">Agregar o modificar centros de salud</div>
        </div>
        <span className="item-arrow">›</span>
      </div>

      {/* Reset */}
      <h3 className="section-title">Otras opciones</h3>
      <div
        className="list-item"
        onClick={resetPreferences}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') resetPreferences(); }}
        style={{ cursor: 'pointer' }}
      >
        <span className="item-icon">🔄</span>
        <div className="item-content">
          <div className="item-title">Restablecer preferencias visuales</div>
          <div className="item-subtitle">Volver al tema claro por defecto</div>
        </div>
        <span className="item-arrow">›</span>
      </div>
    </div>
  );
}

export default Settings;
