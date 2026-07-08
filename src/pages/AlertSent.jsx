import { useEffect, useRef } from 'react';
import { loadData, saveData, KEYS } from '../utils/storage';

function AlertSent({ onNavigate }) {
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const alerts = loadData(KEYS.ALERTS, []);
    const now = new Date();
    const newAlert = {
      id: Date.now(),
      fecha: now.toLocaleDateString('es-PE'),
      hora: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      ubicacion: 'Av. Universitaria 1801, Lima',
      estado: 'Completada',
    };
    saveData(KEYS.ALERTS, [...alerts, newAlert]);
  }, []);

  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div style={{ paddingTop: 40 }}>
        <div className="alert-sent-icon">✅</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
          ¡Alerta enviada!
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: 320, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Tu ubicación simulada fue compartida con tus contactos de emergencia y establecimiento de salud.
        </p>
      </div>

      <div style={{ textAlign: 'left' }}>
        <h3 className="section-title">Contactos notificados</h3>
        {contacts.map((c, i) => (
          <div className="list-item" key={i}>
            <span className="item-icon">✅</span>
            <div className="item-content">
              <div className="item-title">{c.nombre}</div>
              <div className="item-subtitle">{c.parentesco || 'Contacto'} — {c.celular}</div>
            </div>
          </div>
        ))}

        {healthCenter.nombre && (
          <div className="list-item">
            <span className="item-icon">🏥</span>
            <div className="item-content">
              <div className="item-title">{healthCenter.nombre}</div>
              <div className="item-subtitle">Centro de salud notificado</div>
            </div>
          </div>
        )}
      </div>

      <button className="btn btn-primary mt-24" onClick={() => onNavigate('dashboard')} type="button">
        ← Volver al inicio
      </button>
    </div>
  );
}

export default AlertSent;
