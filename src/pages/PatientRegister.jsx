import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

function PatientRegister({ onNavigate }) {
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.nombres || !form.apellidos || !form.dni || !form.edad || !form.celular) {
      return;
    }
    saveData(KEYS.PATIENT, form);
    onNavigate('obstetricData');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('splash')} type="button">
          ←
        </button>
        <h1>Registro de Paciente</h1>
      </div>

      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label">Nombres *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ingresa tus nombres"
            value={form.nombres}
            onChange={(e) => handleChange('nombres', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Apellidos *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ingresa tus apellidos"
            value={form.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">DNI *</label>
            <input
              className="form-input"
              type="text"
              placeholder="12345678"
              value={form.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
              maxLength={8}
              required
            />
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

        <div className="form-group">
          <label className="form-label">Número de celular *</label>
          <input
            className="form-input"
            type="tel"
            placeholder="987654321"
            value={form.celular}
            onChange={(e) => handleChange('celular', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Correo electrónico (opcional)</label>
          <input
            className="form-input"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
          />
        </div>

        <button className="btn btn-primary mt-20" type="submit">
          Siguiente →
        </button>
      </form>
    </div>
  );
}

export default PatientRegister;
