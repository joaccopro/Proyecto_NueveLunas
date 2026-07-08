import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

function ObstetricData({ onNavigate }) {
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.semanasGestacion) return;
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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Fecha última menstruación</label>
            <input
              className="form-input"
              type="date"
              value={form.fum}
              onChange={(e) => handleChange('fum', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha probable de parto</label>
            <input
              className="form-input"
              type="date"
              value={form.fpp}
              onChange={(e) => handleChange('fpp', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
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
