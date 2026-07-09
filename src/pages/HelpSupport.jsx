import { loadData, KEYS } from '../utils/storage';

function HelpSupport({ goBack }) {
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenters = loadData(KEYS.HEALTH_CENTERS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});

  /* Use first health center from array or fallback */
  const mainCenter = healthCenters.length > 0 ? healthCenters[0] : (healthCenter.nombre ? healthCenter : null);

  const emergencyNumbers = [
    { icon: '🚑', name: 'SAMU', number: '106', color: '#D42E2E' },
    { icon: '🚒', name: 'Bomberos', number: '116', color: '#E8A317' },
    { icon: '🚔', name: 'Policía', number: '105', color: '#3B82F6' },
  ];

  const alarmSigns = [
    { icon: '🩸', title: 'Sangrado vaginal', desc: 'Acude inmediatamente al establecimiento de salud más cercano. No te automediques. Recuéstate y pide ayuda.' },
    { icon: '💧', title: 'Pérdida de líquido amniótico', desc: 'Coloca una toalla limpia. No hagas esfuerzo. Dirígete al hospital lo antes posible.' },
    { icon: '⚡', title: 'Dolor abdominal intenso', desc: 'Si el dolor no cede en reposo, es severo o va acompañado de sangrado, ve a urgencias.' },
    { icon: '😵', title: 'Mareos fuertes o desmayos', desc: 'Recuéstate con las piernas elevadas. Bebe agua. Si persiste, llama a emergencias.' },
    { icon: '👶', title: 'Ausencia de movimientos fetales', desc: 'Si tu bebé no se mueve por más de 2 horas, acude a tu centro de salud para evaluación.' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">←</button>
        <h1>❓ Ayuda y Soporte</h1>
      </div>

      {/* Warning */}
      <div className="alert-card mb-16" style={{ borderLeftColor: 'var(--color-danger)' }}>
        <span className="alert-icon">⚠️</span>
        <div>
          <div className="alert-title">Importante</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Ante cualquier signo de alarma durante el embarazo, acude <strong>inmediatamente</strong> al establecimiento de salud más cercano. Estos botones son accesos de apoyo y no reemplazan la atención médica presencial.
          </p>
        </div>
      </div>

      {/* Alarm signs */}
      <h3 className="section-title">Signos de alarma obstétricos</h3>
      {alarmSigns.map((sign, i) => (
        <div className="alert-card" key={i}>
          <span className="alert-icon">{sign.icon}</span>
          <div>
            <div className="alert-title">{sign.title}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 4, lineHeight: 1.5 }}>
              {sign.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Emergency recommendations */}
      <h3 className="section-title">¿Qué hacer en una emergencia?</h3>
      <div className="card mb-16">
        <ol style={{ paddingLeft: 20, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <li>Mantén la calma y respira profundamente.</li>
          <li>Llama al SAMU (106) o al número de emergencias.</li>
          <li>Notifica a tu contacto de emergencia.</li>
          <li>Acude al establecimiento de salud más cercano.</li>
          <li>Lleva tu documento de identidad y carnet prenatal.</li>
          <li>No tomes medicamentos sin indicación médica.</li>
        </ol>
      </div>

      {/* Emergency call buttons with tel: links */}
      <h3 className="section-title">Números de emergencia</h3>
      {emergencyNumbers.map((num) => (
        <a
          key={num.number}
          href={`tel:${num.number}`}
          className="call-btn"
          style={{ '--call-color': num.color, textDecoration: 'none' }}
        >
          <span className="call-btn-icon">{num.icon}</span>
          <div className="call-btn-content">
            <div className="call-btn-name">{num.name}</div>
            <div className="call-btn-number">{num.number}</div>
          </div>
          <span className="call-btn-action">📞 Llamar</span>
        </a>
      ))}

      {/* Health center */}
      {mainCenter && (
        <>
          <h3 className="section-title">Tu centro de salud</h3>
          <a
            href={`tel:${mainCenter.telefono || ''}`}
            className="call-btn"
            style={{ '--call-color': '#8B1A2B', textDecoration: 'none' }}
          >
            <span className="call-btn-icon">🏥</span>
            <div className="call-btn-content">
              <div className="call-btn-name">{mainCenter.nombre}</div>
              <div className="call-btn-number">{mainCenter.telefono || 'Sin número registrado'}</div>
            </div>
            <span className="call-btn-action">📞 Llamar</span>
          </a>
        </>
      )}

      {/* Emergency contact */}
      {contacts.length > 0 && (
        <>
          <h3 className="section-title">Tu contacto de emergencia</h3>
          <a
            href={`tel:${contacts[0].celular}`}
            className="call-btn"
            style={{ '--call-color': '#22A867', textDecoration: 'none' }}
          >
            <span className="call-btn-icon">👤</span>
            <div className="call-btn-content">
              <div className="call-btn-name">{contacts[0].nombre}</div>
              <div className="call-btn-number">{contacts[0].celular} {contacts[0].parentesco ? `(${contacts[0].parentesco})` : ''}</div>
            </div>
            <span className="call-btn-action">📞 Llamar</span>
          </a>
        </>
      )}

      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}>
        Los botones de llamada usan enlaces <code>tel:</code> que abrirán tu app de teléfono si estás en un dispositivo móvil.
      </p>
    </div>
  );
}

export default HelpSupport;
