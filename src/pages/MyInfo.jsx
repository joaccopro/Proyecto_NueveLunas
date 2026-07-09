import { loadData, KEYS } from '../utils/storage';

function MyInfo({ onNavigate, goBack }) {
  const patient = loadData(KEYS.PATIENT, {});
  const obstetric = loadData(KEYS.OBSTETRIC, {});
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenters = loadData(KEYS.HEALTH_CENTERS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});
  const profilePhoto = loadData(KEYS.PROFILE_PHOTO, null);

  const initial = patient.nombres ? patient.nombres.charAt(0).toUpperCase() : '?';

  const renderSection = (title, rows) => (
    <div style={{ marginBottom: 20 }}>
      <h3 className="section-title">{title}</h3>
      <div className="card">
        {rows.map((row, i) => (
          <div className="info-row" key={i}>
            <span className="info-key">{row.label}</span>
            <span className="info-value">{row.value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* Use health centers array, fallback to single center */
  const centersToShow = healthCenters.length > 0 ? healthCenters : (healthCenter.nombre ? [healthCenter] : []);

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">
          ←
        </button>
        <h1>Mi Información</h1>
      </div>

      {/* Profile photo */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        {profilePhoto ? (
          <img src={profilePhoto} alt="Foto de perfil" className="myinfo-photo" />
        ) : (
          <div className="profile-avatar">{initial}</div>
        )}
        <div className="profile-name" style={{ marginTop: 8 }}>
          {patient.nombres || 'Gestante'} {patient.apellidos || ''}
        </div>
      </div>

      {renderSection('Datos Personales', [
        { label: 'Nombres', value: patient.nombres },
        { label: 'Apellidos', value: patient.apellidos },
        { label: 'DNI', value: patient.dni },
        { label: 'Edad', value: patient.edad ? `${patient.edad} años` : '' },
        { label: 'Dirección', value: patient.direccion },
        { label: 'Celular', value: patient.celular },
        { label: 'Correo', value: patient.correo },
      ])}

      {renderSection('Datos Obstétricos', [
        { label: 'Semanas de gestación', value: obstetric.semanasGestacion },
        { label: 'Última menstruación', value: obstetric.fum },
        { label: 'Fecha probable de parto', value: obstetric.fpp },
        { label: 'Gestaciones', value: obstetric.gestaciones },
        { label: 'Partos previos', value: obstetric.partos },
        { label: 'Cesárea previa', value: obstetric.cesarea ? 'Sí' : 'No' },
        { label: 'Alto riesgo', value: obstetric.altoRiesgo ? 'Sí' : 'No' },
        { label: 'Enfermedades previas', value: obstetric.enfermedades },
        { label: 'Alergias', value: obstetric.alergias },
      ])}

      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title">Contactos de Emergencia</h3>
        {contacts.length > 0 ? contacts.map((c, i) => (
          <div className="card" key={i} style={{ marginBottom: 8 }}>
            <div className="info-row">
              <span className="info-key">Nombre</span>
              <span className="info-value">{c.nombre}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Parentesco</span>
              <span className="info-value">{c.parentesco || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Celular</span>
              <span className="info-value">{c.celular}</span>
            </div>
          </div>
        )) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Sin contactos registrados</p>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title">Establecimientos de Salud</h3>
        {centersToShow.length > 0 ? centersToShow.map((center, i) => (
          <div className="card" key={i} style={{ marginBottom: 8 }}>
            <div className="info-row">
              <span className="info-key">Centro de salud</span>
              <span className="info-value">{center.nombre}</span>
            </div>
            {center.obstetra && (
              <div className="info-row">
                <span className="info-key">Obstetra</span>
                <span className="info-value">{center.obstetra}</span>
              </div>
            )}
            {center.telefono && (
              <div className="info-row">
                <span className="info-key">Teléfono</span>
                <span className="info-value">{center.telefono}</span>
              </div>
            )}
            {center.direccion && (
              <div className="info-row">
                <span className="info-key">Dirección</span>
                <span className="info-value">{center.direccion}</span>
              </div>
            )}
          </div>
        )) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Sin establecimientos registrados</p>
        )}
      </div>

      <button className="btn btn-secondary" onClick={goBack} type="button">
        ← Volver
      </button>
    </div>
  );
}

export default MyInfo;
