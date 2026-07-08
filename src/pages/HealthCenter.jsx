import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

function HealthCenter({ onNavigate }) {
  const existing = loadData(KEYS.HEALTH_CENTER, {});
  const [form, setForm] = useState({
    nombre: existing.nombre || '',
    obstetra: existing.obstetra || '',
    telefono: existing.telefono || '',
    direccion: existing.direccion || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!form.nombre) return;
    saveData(KEYS.HEALTH_CENTER, form);
    saveData(KEYS.REGISTERED, true);
    onNavigate('dashboard');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('emergencyContacts')} type="button">
          ←
        </button>
        <h1>Establecimiento de Salud</h1>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Registra tu centro de salud para facilitar la atención en emergencias.
      </p>

      <form onSubmit={handleFinish}>
        <div className="form-group">
          <label className="form-label">Nombre del centro de salud *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Hospital Nacional..."
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Obstetra o médico tratante</label>
          <input
            className="form-input"
            type="text"
            placeholder="Dra. María López"
            value={form.obstetra}
            onChange={(e) => handleChange('obstetra', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Teléfono del establecimiento</label>
          <input
            className="form-input"
            type="tel"
            placeholder="(01) 234-5678"
            value={form.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Dirección del establecimiento</label>
          <input
            className="form-input"
            type="text"
            placeholder="Av. Salud 456, Lima"
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
        </div>

        <button className="btn btn-primary mt-20" type="submit">
          ✓ Guardar y Finalizar
        </button>
      </form>
    </div>
  );
}

export default HealthCenter;
