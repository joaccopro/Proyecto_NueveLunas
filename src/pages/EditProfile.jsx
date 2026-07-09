import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { validateName, validateDNI, validatePhone, getTodayStr, addDays } from '../utils/validation';
import { validateDniWithReniec } from '../services/reniecService';

function EditProfile({ onNavigate, goBack }) {
  const existingPatient = loadData(KEYS.PATIENT, {});
  const existingObstetric = loadData(KEYS.OBSTETRIC, {});
  const existingContacts = loadData(KEYS.CONTACTS, []);
  const existingCenters = loadData(KEYS.HEALTH_CENTERS, []);

  const [patient, setPatient] = useState({
    nombres: existingPatient.nombres || '',
    apellidos: existingPatient.apellidos || '',
    dni: existingPatient.dni || '',
    edad: existingPatient.edad || '',
    direccion: existingPatient.direccion || '',
    celular: existingPatient.celular || '',
    correo: existingPatient.correo || '',
  });

  const [obstetric, setObstetric] = useState({
    semanasGestacion: existingObstetric.semanasGestacion || '',
    fum: existingObstetric.fum || '',
    fpp: existingObstetric.fpp || '',
    gestaciones: existingObstetric.gestaciones || '',
    partos: existingObstetric.partos || '',
    cesarea: existingObstetric.cesarea || false,
    altoRiesgo: existingObstetric.altoRiesgo || false,
    enfermedades: existingObstetric.enfermedades || '',
    alergias: existingObstetric.alergias || '',
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [reniecStatus, setReniecStatus] = useState('idle');
  const [reniecMessage, setReniecMessage] = useState('');
  const [manualFPP, setManualFPP] = useState(false);

  const todayStr = getTodayStr();
  const minFUM = addDays(todayStr, -294);
  const maxFPP = addDays(todayStr, 294);

  const handlePatientChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (field === 'dni' || field === 'nombres' || field === 'apellidos') {
      setReniecStatus('idle');
      setReniecMessage('');
    }
  };

  const handleObstetricChange = (field, value) => {
    setObstetric((prev) => {
      const nextObs = { ...prev, [field]: value };
      
      // Auto-calculate FPP when FUM changes, if not in manual mode
      if (field === 'fum' && !manualFPP && value) {
        nextObs.fpp = addDays(value, 280);
      }
      return nextObs;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Update warnings during render based on current state
  const calculatedWarning = (!manualFPP && obstetric.fpp && obstetric.fpp < todayStr) 
    ? 'Revisa la FUM ingresada, la fecha probable de parto ya habría pasado' 
    : '';

  const handleReniecValidation = async () => {
    const fullName = `${patient.nombres} ${patient.apellidos}`.trim();
    setReniecStatus('loading');
    setReniecMessage('');

    try {
      const result = await validateDniWithReniec(patient.dni, fullName);
      if (result.success) {
        setReniecStatus('success');
        setReniecMessage(result.message);
      } else {
        setReniecStatus('error');
        setReniecMessage(result.message);
      }
    } catch {
      setReniecStatus('error');
      setReniecMessage('Error al conectar con el servicio de validación.');
    }
  };

  const handleSave = () => {
    // Validate Patient Info
    const newErrors = {
      nombres: validateName(patient.nombres),
      apellidos: validateName(patient.apellidos),
      dni: validateDNI(patient.dni),
      celular: validatePhone(patient.celular),
    };

    // Validate FUM
    if (obstetric.fum) {
      if (obstetric.fum > todayStr) {
        newErrors.fum = 'La fecha de última menstruación no puede ser futura';
      } else if (obstetric.fum < minFUM) {
        newErrors.fum = 'La fecha de última menstruación no puede superar aproximadamente 42 semanas';
      }
    }

    // Validate FPP
    if (obstetric.fpp) {
      if (obstetric.fpp < todayStr) {
        newErrors.fpp = 'La fecha probable de parto no puede ser anterior a hoy';
      } else if (obstetric.fpp > maxFPP) {
        newErrors.fpp = 'La fecha probable de parto no puede superar aproximadamente 42 semanas desde hoy';
      }
    }

    if (Object.values(newErrors).some(err => err && err !== '')) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    saveData(KEYS.PATIENT, patient);
    saveData(KEYS.OBSTETRIC, obstetric);
    setSaved(true);
    setTimeout(() => {
      goBack();
    }, 800);
  };

  const handleCancel = () => {
    goBack();
  };

  const canValidateReniec = /^\d{8}$/.test(patient.dni) && patient.nombres.trim() && patient.apellidos.trim();

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">←</button>
        <h1>Editar Perfil</h1>
      </div>

      {saved && (
        <div className="save-toast">✅ Datos guardados correctamente</div>
      )}

      {/* Datos Personales */}
      <h3 className="section-title">Datos Personales</h3>
      <div className="card mb-16">
        <div className="form-group">
          <label className="form-label">Nombres *</label>
          <input
            className={`form-input ${errors.nombres ? 'input-error' : ''}`}
            type="text"
            placeholder="Ingresa tus nombres"
            value={patient.nombres}
            onChange={(e) => handlePatientChange('nombres', e.target.value)}
          />
          {errors.nombres && <span className="error-text">{errors.nombres}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Apellidos *</label>
          <input
            className={`form-input ${errors.apellidos ? 'input-error' : ''}`}
            type="text"
            placeholder="Ingresa tus apellidos"
            value={patient.apellidos}
            onChange={(e) => handlePatientChange('apellidos', e.target.value)}
          />
          {errors.apellidos && <span className="error-text">{errors.apellidos}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">DNI *</label>
            <input
              className={`form-input ${errors.dni ? 'input-error' : ''}`}
              type="text"
              placeholder="12345678"
              value={patient.dni}
              onChange={(e) => handlePatientChange('dni', e.target.value)}
              maxLength={8}
            />
            {errors.dni && <span className="error-text">{errors.dni}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Edad *</label>
            <input
              className="form-input"
              type="number"
              placeholder="28"
              value={patient.edad}
              onChange={(e) => handlePatientChange('edad', e.target.value)}
              min={10}
              max={60}
            />
          </div>
        </div>

        {/* Validación RENIEC */}
        <div className="reniec-section">
          <div className="reniec-header">
            <span className="reniec-title">🛡️ Validación RENIEC</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleReniecValidation}
              disabled={!canValidateReniec || reniecStatus === 'loading'}
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              {reniecStatus === 'loading' ? '⏳ Validando...' : '✓ Validar con RENIEC'}
            </button>
          </div>
          {!canValidateReniec && reniecStatus === 'idle' && (
            <p className="reniec-hint">Ingresa DNI (8 dígitos), nombres y apellidos para validar.</p>
          )}
          {reniecStatus === 'success' && (
            <div className="reniec-result reniec-success">✅ {reniecMessage}</div>
          )}
          {reniecStatus === 'error' && (
            <div className="reniec-result reniec-error">❌ {reniecMessage}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input
            className="form-input"
            type="text"
            placeholder="Av. Principal 123"
            value={patient.direccion}
            onChange={(e) => handlePatientChange('direccion', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Celular *</label>
            <input
              className={`form-input ${errors.celular ? 'input-error' : ''}`}
              type="tel"
              placeholder="987654321"
              value={patient.celular}
              onChange={(e) => handlePatientChange('celular', e.target.value)}
              maxLength={9}
            />
            {errors.celular && <span className="error-text">{errors.celular}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Correo</label>
            <input
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={patient.correo}
              onChange={(e) => handlePatientChange('correo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Datos Obstétricos */}
      <h3 className="section-title">Datos Obstétricos</h3>
      <div className="card mb-16">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Semanas de gestación *</label>
            <input
              className="form-input"
              type="number"
              placeholder="24"
              value={obstetric.semanasGestacion}
              onChange={(e) => handleObstetricChange('semanasGestacion', e.target.value)}
              min={1}
              max={42}
            />
          </div>
          <div className="form-group">
            <label className="form-label">N° gestaciones</label>
            <input
              className="form-input"
              type="number"
              placeholder="1"
              value={obstetric.gestaciones}
              onChange={(e) => handleObstetricChange('gestaciones', e.target.value)}
              min={0}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Fecha última menstruación</label>
          <input
            className={`form-input ${errors.fum ? 'input-error' : ''}`}
            type="date"
            value={obstetric.fum}
            onChange={(e) => handleObstetricChange('fum', e.target.value)}
            min={minFUM}
            max={todayStr}
          />
          {errors.fum && <span className="error-text">{errors.fum}</span>}
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Fecha probable de parto</label>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={manualFPP} 
                onChange={(e) => setManualFPP(e.target.checked)} 
              />
              Editar FPP manualmente
            </label>
          </div>
          <input
            className={`form-input ${errors.fpp ? 'input-error' : ''}`}
            type="date"
            value={obstetric.fpp}
            onChange={(e) => handleObstetricChange('fpp', e.target.value)}
            min={todayStr}
            max={maxFPP}
            readOnly={!manualFPP}
            style={{ backgroundColor: !manualFPP ? 'var(--color-gray-100)' : 'transparent' }}
          />
          {errors.fpp && <span className="error-text">{errors.fpp}</span>}
          {!errors.fpp && calculatedWarning && <span className="error-text" style={{ color: '#E8A317' }}>⚠️ {calculatedWarning}</span>}
        </div>
        <div className="form-row mt-12">
          <div className="form-group">
            <label className="form-label">Partos previos</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={obstetric.partos}
              onChange={(e) => handleObstetricChange('partos', e.target.value)}
              min={0}
            />
          </div>
          <div className="form-group" />
        </div>

        <div className="toggle-group">
          <span className="toggle-label">Antecedente de cesárea</span>
          <div
            className={`toggle-switch${obstetric.cesarea ? ' active' : ''}`}
            onClick={() => handleObstetricChange('cesarea', !obstetric.cesarea)}
            role="switch"
            aria-checked={obstetric.cesarea}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleObstetricChange('cesarea', !obstetric.cesarea); }}
          />
        </div>

        <div className="toggle-group">
          <span className="toggle-label">Embarazo de alto riesgo</span>
          <div
            className={`toggle-switch${obstetric.altoRiesgo ? ' active' : ''}`}
            onClick={() => handleObstetricChange('altoRiesgo', !obstetric.altoRiesgo)}
            role="switch"
            aria-checked={obstetric.altoRiesgo}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleObstetricChange('altoRiesgo', !obstetric.altoRiesgo); }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Enfermedades previas</label>
          <input
            className="form-input"
            type="text"
            placeholder="Diabetes, hipertensión..."
            value={obstetric.enfermedades}
            onChange={(e) => handleObstetricChange('enfermedades', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Alergias</label>
          <input
            className="form-input"
            type="text"
            placeholder="Penicilina, mariscos..."
            value={obstetric.alergias}
            onChange={(e) => handleObstetricChange('alergias', e.target.value)}
          />
        </div>
      </div>

      {/* Quick access to contacts and health centers */}
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
          <div className="item-title">Contactos de emergencia</div>
          <div className="item-subtitle">{existingContacts.length} contacto(s) registrado(s)</div>
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
          <div className="item-title">Establecimientos de salud</div>
          <div className="item-subtitle">{existingCenters.length} establecimiento(s)</div>
        </div>
        <span className="item-arrow">›</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28, marginBottom: 20 }}>
        <button className="btn btn-ghost" type="button" onClick={handleCancel} style={{ flex: 1 }}>
          Cancelar
        </button>
        <button className="btn btn-primary" type="button" onClick={handleSave} style={{ flex: 2 }}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
