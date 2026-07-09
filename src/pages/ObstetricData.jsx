import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';
import { getTodayStr, addDays } from '../utils/validation';

function ObstetricData({ onNavigate, goBack }) {
  const existing = loadData(KEYS.OBSTETRIC, {});
  const [form, setForm] = useState({
    semanasGestacion: existing.semanasGestacion || '',
    fum: existing.fum || '',
    fpp: existing.fpp || '',
    gestaciones: existing.gestaciones || '',
    partos: existing.partos || '',
    cesarea: existing.cesarea || false,
    altoRiesgo: existing.altoRiesgo || false,
    enfermedades: existing.enfermedades || '',
    alergias: existing.alergias || '',
  });

  const [errors, setErrors] = useState({});
  const [manualFPP, setManualFPP] = useState(false);

  const todayStr = getTodayStr();
  const minFUM = addDays(todayStr, -294);
  const maxFPP = addDays(todayStr, 294);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      
      // Auto-calculate FPP when FUM changes, if not in manual mode
      if (field === 'fum' && !manualFPP && value) {
        nextForm.fpp = addDays(value, 280);
      }
      return nextForm;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Update warnings during render based on current state
  const calculatedWarning = (!manualFPP && form.fpp && form.fpp < todayStr) 
    ? 'Revisa la FUM ingresada, la fecha probable de parto ya habría pasado' 
    : '';

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.semanasGestacion) return;

    const newErrors = {};

    // Validate FUM
    if (form.fum) {
      if (form.fum > todayStr) {
        newErrors.fum = 'La fecha de última menstruación no puede ser futura';
      } else if (form.fum < minFUM) {
        newErrors.fum = 'La fecha de última menstruación no puede superar aproximadamente 42 semanas';
      }
    }

    // Validate FPP
    if (form.fpp) {
      if (form.fpp < todayStr) {
        newErrors.fpp = 'La fecha probable de parto no puede ser anterior a hoy';
      } else if (form.fpp > maxFPP) {
        newErrors.fpp = 'La fecha probable de parto no puede superar aproximadamente 42 semanas desde hoy';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveData(KEYS.OBSTETRIC, form);
    onNavigate('emergencyContacts');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('patientRegister')} type="button">
          ←
        </button>
        <h1>Datos Obstétricos</h1>
      </div>

      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label">Semanas de gestación *</label>
          <input
            className="form-input"
            type="number"
            placeholder="Ej: 24"
            value={form.semanasGestacion}
            onChange={(e) => handleChange('semanasGestacion', e.target.value)}
            min={1}
            max={42}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha última menstruación</label>
          <input
            className={`form-input ${errors.fum ? 'input-error' : ''}`}
            type="date"
            value={form.fum}
            onChange={(e) => handleChange('fum', e.target.value)}
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
            value={form.fpp}
            onChange={(e) => handleChange('fpp', e.target.value)}
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
            <label className="form-label">N° de gestaciones</label>
            <input
              className="form-input"
              type="number"
              placeholder="1"
              value={form.gestaciones}
              onChange={(e) => handleChange('gestaciones', e.target.value)}
              min={0}
            />
          </div>
          <div className="form-group">
            <label className="form-label">N° de partos previos</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={form.partos}
              onChange={(e) => handleChange('partos', e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="toggle-group">
          <span className="toggle-label">Antecedente de cesárea</span>
          <div
            className={`toggle-switch${form.cesarea ? ' active' : ''}`}
            onClick={() => handleChange('cesarea', !form.cesarea)}
            role="switch"
            aria-checked={form.cesarea}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleChange('cesarea', !form.cesarea); }}
          />
        </div>

        <div className="toggle-group">
          <span className="toggle-label">Embarazo de alto riesgo</span>
          <div
            className={`toggle-switch${form.altoRiesgo ? ' active' : ''}`}
            onClick={() => handleChange('altoRiesgo', !form.altoRiesgo)}
            role="switch"
            aria-checked={form.altoRiesgo}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleChange('altoRiesgo', !form.altoRiesgo); }}
          />
        </div>

        <div className="form-group mt-8">
          <label className="form-label">Enfermedades previas</label>
          <input
            className="form-input"
            type="text"
            placeholder="Diabetes, hipertensión, etc."
            value={form.enfermedades}
            onChange={(e) => handleChange('enfermedades', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Alergias u otras condiciones</label>
          <input
            className="form-input"
            type="text"
            placeholder="Penicilina, mariscos, etc."
            value={form.alergias}
            onChange={(e) => handleChange('alergias', e.target.value)}
          />
        </div>

        <button className="btn btn-primary mt-20" type="submit">
          Siguiente →
        </button>
      </form>
    </div>
  );
}

export default ObstetricData;
