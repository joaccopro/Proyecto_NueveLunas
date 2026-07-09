import { loadData, KEYS } from '../utils/storage';

// ============================================================
// NOTA: El envío automático de mensajes por SMS o WhatsApp
// requiere un backend con proveedor externo (Twilio, MessageBird,
// WhatsApp Business API, etc.). Los botones actuales abren
// WhatsApp manualmente usando enlaces wa.me. Para envío
// automático, implementar desde backend o Supabase Edge Function.
// ============================================================

function EmergencyMap({ onNavigate }) {
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenters = loadData(KEYS.HEALTH_CENTERS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});
  const patient = loadData(KEYS.PATIENT, {});

  /* Use first health center from array or fallback */
  const mainCenter = healthCenters.length > 0 ? healthCenters[0] : (healthCenter.nombre ? healthCenter : null);

  /* Build WhatsApp message */
  const ubicacion = patient.direccion || 'No disponible';
  const centroNombre = mainCenter ? mainCenter.nombre : 'No registrado';
  const whatsappMessage = `Emergencia prenatal activada. La gestante necesita ayuda inmediata. Ubicación referencial: ${ubicacion}. Centro de salud: ${centroNombre}.`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  const getWhatsAppUrl = (celular) => {
    // Remove any non-digit characters and add Peru country code
    const cleanNumber = celular.replace(/\D/g, '');
    return `https://wa.me/51${cleanNumber}?text=${encodedMessage}`;
  };

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

      {/* Contacts to notify with WhatsApp */}
      <h3 className="section-title">Contactos que serán notificados</h3>
      {contacts.length > 0 ? contacts.map((c, i) => (
        <div className="card mb-12" key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.nombre}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {c.parentesco || 'Contacto'} — {c.celular}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`tel:${c.celular}`}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
            >
              📞 Llamar
            </a>
            <a
              href={getWhatsAppUrl(c.celular)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
            >
              💬 Enviar por WhatsApp
            </a>
          </div>
        </div>
      )) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          No hay contactos registrados
        </p>
      )}

      {/* Health Center */}
      {mainCenter && (
        <>
          <h3 className="section-title">Centro de Salud</h3>
          <div className="list-item">
            <span className="item-icon">🏥</span>
            <div className="item-content">
              <div className="item-title">{mainCenter.nombre}</div>
              <div className="item-subtitle">
                {mainCenter.obstetra && `${mainCenter.obstetra} — `}
                {mainCenter.telefono || 'Sin teléfono'}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Alert numbers summary */}
      {contacts.length > 0 && (
        <div style={{ background: 'var(--color-gray-100)', padding: 12, borderRadius: 8, marginTop: 16, marginBottom: 8 }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            📱 Se enviará alerta a: {contacts.map(c => c.celular).join(', ')}
          </p>
        </div>
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
