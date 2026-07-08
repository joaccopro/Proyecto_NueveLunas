import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

function PregnancyControl({ onNavigate }) {
  const obstetric = loadData(KEYS.OBSTETRIC, {});
  const [controls, setControls] = useState(loadData(KEYS.CONTROLS, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fecha: '',
    peso: '',
    presionArterial: '',
    sintomas: '',
    observaciones: '',
  });

  const semanas = Number(obstetric.semanasGestacion) || 0;
  const progress = Math.min((semanas / 40) * 100, 100);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fecha) return;
    const newControls = [...controls, { ...form, id: Date.now() }];
    setControls(newControls);
    saveData(KEYS.CONTROLS, newControls);
    setForm({ fecha: '', peso: '', presionArterial: '', sintomas: '', observaciones: '' });
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')} type="button">
          ←
        </button>
        <h1>Control del Embarazo</h1>
      </div>

      {/* Progress */}
      <div className="card mb-20">
        <div className="card-label">Progreso de gestación</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          {semanas} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>semanas</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">
            <span>Semana {semanas}</span>
            <span>Semana 40</span>
          </div>
        </div>
      </div>

      {/* Add Control Button */}
      {!showForm && (
        <button
          className="btn btn-primary mb-20"
          onClick={() => setShowForm(true)}
          type="button"
        >
          + Registrar control prenatal
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-20" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Nuevo Control Prenatal</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input
                className="form-input"
                type="date"
                value={form.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="65.5"
                  step="0.1"
                  value={form.peso}
                  onChange={(e) => handleChange('peso', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Presión arterial</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="120/80"
                  value={form.presionArterial}
                  onChange={(e) => handleChange('presionArterial', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Síntomas</label>
              <input
                className="form-input"
                type="text"
                placeholder="Náuseas, fatiga..."
                value={form.sintomas}
                onChange={(e) => handleChange('sintomas', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <input
                className="form-input"
                type="text"
                placeholder="Notas adicionales..."
                value={form.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" type="submit">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      <h3 className="section-title">Historial de Controles</h3>
      {controls.length > 0 ? (
        [...controls].reverse().map((control) => (
          <div className="card mb-8" key={control.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>📅 {control.fecha}</span>
              <span className="badge badge-success">Registrado</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              {control.peso && <span>⚖️ {control.peso} kg</span>}
              {control.presionArterial && <span>💓 {control.presionArterial}</span>}
            </div>
            {control.sintomas && (
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                Síntomas: {control.sintomas}
              </p>
            )}
            {control.observaciones && (
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Obs: {control.observaciones}
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Sin controles registrados</div>
          <div className="empty-text">Registra tu primer control prenatal para llevar un seguimiento.</div>
        </div>
      )}
    </div>
  );
}

export default PregnancyControl;
