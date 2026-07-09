import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { validateOptionalPhone } from '../utils/validation';

function HealthCenter({ onNavigate, goBack }) {
  const existingArr = loadData(KEYS.HEALTH_CENTERS, []);
  // Use the first center if it exists, or empty
  const existing = existingArr.length > 0 ? existingArr[0] : {};

  const [form, setForm] = useState({
    nombre: existing.nombre || '',
    direccion: existing.direccion || '',
    distrito: existing.distrito || '',
    ciudad: existing.ciudad || '',
    telefono: existing.telefono || '',
    obstetra: existing.obstetra || '',
    referencia: existing.referencia || '',
    latitud: existing.latitud || '',
    longitud: existing.longitud || '',
  });

  const [errors, setErrors] = useState({});
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleGeolocation = () => {
    setGeoLoading(true);
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.');
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitud: position.coords.latitude.toString(),
          longitud: position.coords.longitude.toString()
        }));
        setGeoLoading(false);
      },
      (error) => {
        console.error("Error obtaining location", error);
        setGeoError('No se pudo obtener tu ubicación. Verifica los permisos.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Validations
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
    
    const phoneError = validateOptionalPhone(form.telefono);
    if (phoneError) newErrors.telefono = phoneError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save as array
    const updatedCenters = existingArr.length > 0 ? [...existingArr] : [];
    if (updatedCenters.length > 0) {
      updatedCenters[0] = { ...updatedCenters[0], ...form, id: updatedCenters[0].id || Date.now() };
    } else {
      updatedCenters.push({ ...form, id: Date.now() });
    }

    saveData(KEYS.HEALTH_CENTERS, updatedCenters);
    saveData(KEYS.REGISTERED, true);
    onNavigate('dashboard');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack || (() => onNavigate('emergencyContacts'))} type="button">
          ←
        </button>
        <h1>Establecimiento de Salud</h1>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
        <div className="progress-label">Paso 4 de 4</div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Ingresa los datos del centro de salud donde te atiendes. Esto facilitará las cosas ante cualquier eventualidad.
      </p>

      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label">Nombre del hospital o clínica *</label>
          <input
            className={`form-input ${errors.nombre ? 'input-error' : ''}`}
            type="text"
            placeholder="Hospital San Bartolomé"
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Dirección *</label>
          <input
            className={`form-input ${errors.direccion ? 'input-error' : ''}`}
            type="text"
            placeholder="Av. Alfonso Ugarte 825"
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
          {errors.direccion && <span className="error-text">{errors.direccion}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Distrito</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ej. Lima"
              value={form.distrito}
              onChange={(e) => handleChange('distrito', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ej. Lima"
              value={form.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Referencia</label>
          <input
            className="form-input"
            type="text"
            placeholder="Frente al paradero"
            value={form.referencia}
            onChange={(e) => handleChange('referencia', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Coordenadas (Lat, Lon)</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="form-input"
              type="text"
              placeholder="Latitud"
              value={form.latitud}
              onChange={(e) => handleChange('latitud', e.target.value)}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Longitud"
              value={form.longitud}
              onChange={(e) => handleChange('longitud', e.target.value)}
            />
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={handleGeolocation}
            disabled={geoLoading}
          >
            {geoLoading ? '📍 Obteniendo...' : '📍 Usar mi ubicación actual'}
          </button>
          {geoError && <span className="error-text">{geoError}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Celular de emergencia</label>
            <input
              className={`form-input ${errors.telefono ? 'input-error' : ''}`}
              type="tel"
              placeholder="987654321"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              maxLength={9}
            />
            {errors.telefono && <span className="error-text">{errors.telefono}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Obstetra / Médico</label>
            <input
              className="form-input"
              type="text"
              placeholder="Dra. Ramírez"
              value={form.obstetra}
              onChange={(e) => handleChange('obstetra', e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-20" type="submit">
          Finalizar Registro ✓
        </button>
      </form>
    </div>
  );
}

export default HealthCenter;
