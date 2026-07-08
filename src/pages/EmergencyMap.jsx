import { loadData, KEYS } from '../utils/storage';

function EmergencyMap({ onNavigate }) {
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});

  return (
    <div className="page">
      <div className="page-header">
        <h1>📍 Mapa de Emergencia</h1>
      </div>

      {/* Simulated Map */}
      <div className="sim-map">
        <div className="sim-map-grid">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} />
          ))}
        </div>
        <div className="sim-map-dot" />
        <div className="sim-map-pin">📍</div>
        <div className="sim-map-label">Ubicación en tiempo real simulada</div>
      </div>

      {/* Contacts to notify */}
      <h3 className="section-title">Contactos que serán notificados</h3>
      {contacts.length > 0 ? contacts.map((c, i) => (
        <div className="list-item" key={i}>
          <span className="item-icon">👤</span>
          <div className="item-content">
            <div className="item-title">{c.nombre}</div>
            <div className="item-subtitle">{c.parentesco || 'Contacto'} — {c.celular}</div>
          </div>
        </div>
      )) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          No hay contactos registrados
        </p>
      )}

      {/* Health Center */}
      {healthCenter.nombre && (
        <>
          <h3 className="section-title">Centro de Salud</h3>
          <div className="list-item">
            <span className="item-icon">🏥</span>
            <div className="item-content">
              <div className="item-title">{healthCenter.nombre}</div>
              <div className="item-subtitle">
                {healthCenter.obstetra && `${healthCenter.obstetra} — `}
                {healthCenter.telefono || 'Sin teléfono'}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <button className="btn btn-danger" onClick={() => onNavigate('alertSent')} type="button">
          🚨 Enviar alerta
        </button>
        <button className="btn btn-ghost" onClick={() => onNavigate('dashboard')} type="button">
          ✕ Cancelar alerta
        </button>
      </div>
    </div>
  );
}

export default EmergencyMap;
