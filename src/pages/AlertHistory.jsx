import { loadData, KEYS } from '../utils/storage';
import BottomNav from '../components/BottomNav';

function AlertHistory({ onNavigate }) {
  const alerts = loadData(KEYS.ALERTS, []);

  return (
    <div className="page with-nav">
      <div className="page-header">
        <h1>📋 Historial de Alertas</h1>
      </div>

      {alerts.length > 0 ? (
        [...alerts].reverse().map((alert) => (
          <div className="card" key={alert.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>🚨 Alerta de emergencia</span>
              <span className="badge badge-success">{alert.estado}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ marginBottom: 4 }}>📅 {alert.fecha} — {alert.hora}</div>
              <div>📍 {alert.ubicacion}</div>
              {alert.centroSalud && (
                <div style={{ marginTop: 4 }}>🏥 {alert.centroSalud}</div>
              )}
            </div>

            {/* Contactos notificados */}
            {alert.contactosNotificados && alert.contactosNotificados.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-gray-200)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Contactos notificados
                </div>
                {alert.contactosNotificados.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', marginBottom: 4 }}>
                    <span>👤</span>
                    <span style={{ fontWeight: 500 }}>{c.nombre}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>({c.parentesco})</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>— {c.celular}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No hay alertas registradas</div>
          <div className="empty-text">
            Cuando envíes una alerta de emergencia, aparecerá aquí con su fecha, hora y ubicación.
          </div>
        </div>
      )}

      <BottomNav currentPage="alertHistory" onNavigate={onNavigate} />
    </div>
  );
}

export default AlertHistory;
