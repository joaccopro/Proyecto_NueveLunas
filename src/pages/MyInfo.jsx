import { loadData, KEYS } from '../utils/storage';

function MyInfo({ onNavigate }) {
  const patient = loadData(KEYS.PATIENT, {});
  const obstetric = loadData(KEYS.OBSTETRIC, {});
  const contacts = loadData(KEYS.CONTACTS, []);
  const healthCenter = loadData(KEYS.HEALTH_CENTER, {});

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

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')} type="button">
          ←
        </button>
        <h1>Mi Información</h1>
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

      {renderSection('Establecimiento de Salud', [
        { label: 'Centro de salud', value: healthCenter.nombre },
        { label: 'Obstetra', value: healthCenter.obstetra },
        { label: 'Teléfono', value: healthCenter.telefono },
        { label: 'Dirección', value: healthCenter.direccion },
      ])}

      <button className="btn btn-secondary" onClick={() => onNavigate('dashboard')} type="button">
        ← Volver al inicio
      </button>
    </div>
  );
}

export default MyInfo;
