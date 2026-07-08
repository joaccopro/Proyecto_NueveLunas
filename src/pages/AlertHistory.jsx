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
            </div>
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
