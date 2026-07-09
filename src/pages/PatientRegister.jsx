import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { validateName, validateDNI, validatePhone } from '../utils/validation';
import { validateDniWithReniec } from '../services/reniecService';

function PatientRegister({ onNavigate, goBack }) {
  const existing = loadData(KEYS.PATIENT, {});
  const [form, setForm] = useState({
    nombres: existing.nombres || '',
    apellidos: existing.apellidos || '',
    dni: existing.dni || '',
    edad: existing.edad || '',
    direccion: existing.direccion || '',
    celular: existing.celular || '',
    correo: existing.correo || '',
  });
  
  const [errors, setErrors] = useState({});
  const [reniecStatus, setReniecStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [reniecMessage, setReniecMessage] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // Reset RENIEC status if DNI or name changes
    if (field === 'dni' || field === 'nombres' || field === 'apellidos') {
      setReniecStatus('idle');
      setReniecMessage('');
    }
  };

  const handleReniecValidation = async () => {
    const fullName = `${form.nombres} ${form.apellidos}`.trim();
    setReniecStatus('loading');
    setReniecMessage('');

    try {
      const result = await validateDniWithReniec(form.dni, fullName);
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

  const handleNext = (e) => {
    e.preventDefault();
    
    const newErrors = {
      nombres: validateName(form.nombres),
      apellidos: validateName(form.apellidos),
      dni: validateDNI(form.dni),
      celular: validatePhone(form.celular),
    };

    if (Object.values(newErrors).some(err => err !== '')) {
      setErrors(newErrors);
      return;
    }

    saveData(KEYS.PATIENT, form);
    onNavigate('obstetricData');
  };

  const canValidateReniec = /^\d{8}$/.test(form.dni) && form.nombres.trim() && form.apellidos.trim();

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack || (() => onNavigate('splash'))} type="button">
          ←
        </button>
        <h1>Datos Personales</h1>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '25%' }} />
        </div>
        <div className="progress-label">Paso 1 de 4</div>
      </div>

      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label">Nombres *</label>
          <input
            className={`form-input ${errors.nombres ? 'input-error' : ''}`}
            type="text"
            placeholder="Ingresa tus nombres"
            value={form.nombres}
            onChange={(e) => handleChange('nombres', e.target.value)}
          />
          {errors.nombres && <span className="error-text">{errors.nombres}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Apellidos *</label>
          <input
            className={`form-input ${errors.apellidos ? 'input-error' : ''}`}
            type="text"
            placeholder="Ingresa tus apellidos"
            value={form.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
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
              value={form.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
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
              value={form.edad}
              onChange={(e) => handleChange('edad', e.target.value)}
              min={10}
              max={60}
              required
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
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Celular *</label>
            <input
              className={`form-input ${errors.celular ? 'input-error' : ''}`}
              type="tel"
              placeholder="987654321"
              value={form.celular}
              onChange={(e) => handleChange('celular', e.target.value)}
              maxLength={9}
            />
            {errors.celular && <span className="error-text">{errors.celular}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Correo (Opcional)</label>
            <input
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-20" type="submit">
          Siguiente ›
        </button>
      </form>
    </div>
  );
}

export default PatientRegister;
