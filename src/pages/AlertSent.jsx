import { useEffect, useRef } from 'react';
import { loadData, saveData, KEYS } from '../utils/storage';

// ============================================================
// NOTA: El envío automático de mensajes por SMS o WhatsApp
// requiere un backend con proveedor externo (Twilio, MessageBird,
// WhatsApp Business API, etc.). Los botones actuales abren
// WhatsApp manualmente usando enlaces wa.me. Para envío
// automático, implementar desde backend o Supabase Edge Function.
// ============================================================

function AlertSent({ onNavigate }) {
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenters = loadData(KEYS.HEALTH_CENTERS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});
  const patient = loadData(KEYS.PATIENT, {});
  const savedRef = useRef(false);

  const mainCenter = healthCenters.length > 0 ? healthCenters[0] : (healthCenter.nombre ? healthCenter : null);

  /* Build WhatsApp message */
  const ubicacion = patient.direccion || 'No disponible';
  const centroNombre = mainCenter ? mainCenter.nombre : 'No registrado';
  const whatsappMessage = `Emergencia prenatal activada. La gestante necesita ayuda inmediata. Ubicación referencial: ${ubicacion}. Centro de salud: ${centroNombre}.`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  const getWhatsAppUrl = (celular) => {
    const cleanNumber = celular.replace(/\D/g, '');
    return `https://wa.me/51${cleanNumber}?text=${encodedMessage}`;
  };

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const alerts = loadData(KEYS.ALERTS, []);
    const now = new Date();
    const newAlert = {
      id: Date.now(),
      fecha: now.toLocaleDateString('es-PE'),
      hora: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      ubicacion: patient.direccion || 'Ubicación no registrada',
      estado: 'Completada',
      // Guardar contactos notificados en el historial
      contactosNotificados: contacts.map(c => ({
        nombre: c.nombre,
        celular: c.celular,
        parentesco: c.parentesco || 'Contacto',
      })),
      centroSalud: centroNombre,
    };
    saveData(KEYS.ALERTS, [...alerts, newAlert]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        {contacts.length > 0 ? contacts.map((c, i) => (
          <div className="card mb-12" key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: '1.3rem' }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.nombre}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  {c.parentesco || 'Contacto'} — {c.celular}
                </div>
              </div>
            </div>
            <a
              href={getWhatsAppUrl(c.celular)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              💬 Enviar por WhatsApp
            </a>
          </div>
        )) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            No hay contactos registrados
          </p>
        )}

        {mainCenter && (
          <div className="list-item">
            <span className="item-icon">🏥</span>
            <div className="item-content">
              <div className="item-title">{mainCenter.nombre}</div>
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
