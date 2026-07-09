import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import BottomNav from '../components/BottomNav';

const DEFAULT_REMINDERS = [
  { id: 'acidoFolico', icon: '💊', text: 'Tomar ácido fólico', active: true },
  { id: 'controlPrenatal', icon: '🩺', text: 'Próximo control prenatal', active: true },
  { id: 'hierro', icon: '💉', text: 'Tomar hierro', active: true },
  { id: 'agua', icon: '💧', text: 'Beber agua', active: true },
];

function Appointments({ onNavigate }) {
  const [appointments, setAppointments] = useState(loadData(KEYS.APPOINTMENTS, []));
  const storedReminders = loadData(KEYS.REMINDERS, null);
  const [reminders, setReminders] = useState(storedReminders || DEFAULT_REMINDERS);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('citas');
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    motivo: '',
    establecimiento: '',
    observaciones: '',
  });

  const healthCenters = loadData(KEYS.HEALTH_CENTERS, []);

  const [errors, setErrors] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors) setErrors('');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.fecha || !form.motivo) return;

    // Validate past dates
    const todayStr = new Date().toISOString().split('T')[0];
    if (form.fecha < todayStr) {
      setErrors('No puedes agendar una cita en una fecha pasada.');
      return;
    }

    const updated = [...appointments, { ...form, id: Date.now() }];
    updated.sort((a, b) => new Date(a.fecha + 'T' + (a.hora || '00:00')) - new Date(b.fecha + 'T' + (b.hora || '00:00')));
    setAppointments(updated);
    saveData(KEYS.APPOINTMENTS, updated);
    setForm({ fecha: '', hora: '', motivo: '', establecimiento: '', observaciones: '' });
    setShowForm(false);
    setErrors('');
  };

  const handleDeleteAppointment = (id) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    saveData(KEYS.APPOINTMENTS, updated);
  };

  const toggleReminder = (id) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    setReminders(updated);
    saveData(KEYS.REMINDERS, updated);
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter((a) => a.fecha >= today);
  const past = appointments.filter((a) => a.fecha < today);

  return (
    <div className="page with-nav">
      <div className="page-header">
        <h1>📅 Citas y Recordatorios</h1>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', padding: 4, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setTab('citas')}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 'var(--radius-full)', border: 'none',
            background: tab === 'citas' ? 'var(--color-white)' : 'transparent',
            color: tab === 'citas' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
            boxShadow: tab === 'citas' ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)',
          }}
        >
          📅 Citas
        </button>
        <button
          type="button"
          onClick={() => setTab('recordatorios')}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 'var(--radius-full)', border: 'none',
            background: tab === 'recordatorios' ? 'var(--color-white)' : 'transparent',
            color: tab === 'recordatorios' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
            boxShadow: tab === 'recordatorios' ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)',
          }}
        >
          ⏰ Recordatorios
        </button>
      </div>

      {/* Citas Tab */}
      {tab === 'citas' && (
        <>
          {!showForm && (
            <button className="btn btn-primary mb-20" type="button" onClick={() => setShowForm(true)}>
              + Nueva cita prenatal
            </button>
          )}

          {showForm && (
            <div className="card mb-20" style={{ animation: 'slideUp 0.3s ease-out', borderLeft: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 14 }}>Nueva cita</h3>
              <form onSubmit={handleAdd}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha *</label>
                    <input className={`form-input ${errors ? 'input-error' : ''}`} type="date" value={form.fecha} onChange={(e) => handleChange('fecha', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    {errors && <span className="error-text">{errors}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora</label>
                    <input className="form-input" type="time" value={form.hora} onChange={(e) => handleChange('hora', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Motivo *</label>
                  <input className="form-input" type="text" placeholder="Control prenatal, ecografía..." value={form.motivo} onChange={(e) => handleChange('motivo', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Establecimiento</label>
                  <select className="form-input" value={form.establecimiento} onChange={(e) => handleChange('establecimiento', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {healthCenters.length === 0 ? (
                      <option value="" disabled>Primero registra un establecimiento de salud</option>
                    ) : (
                      healthCenters.map((hc) => (
                        <option key={hc.id} value={hc.nombre}>{hc.nombre}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <input className="form-input" type="text" placeholder="Llevar resultados de laboratorio..." value={form.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button className="btn btn-primary btn-sm" type="submit">Guardar</button>
                </div>
              </form>
            </div>
          )}

          {upcoming.length > 0 && (
            <>
              <h3 className="section-title">Próximas citas</h3>
              {upcoming.map((apt) => (
                <div className="card mb-12" key={apt.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>📅 {apt.fecha} {apt.hora && `— ${apt.hora}`}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--color-text)', marginTop: 4 }}>{apt.motivo}</div>
                      {apt.establecimiento && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>🏥 {apt.establecimiento}</div>
                      )}
                      {apt.observaciones && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>📝 {apt.observaciones}</div>
                      )}
                    </div>
                    <button className="contact-remove" type="button" onClick={() => handleDeleteAppointment(apt.id)}>✕</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {past.length > 0 && (
            <>
              <h3 className="section-title">Citas pasadas</h3>
              {past.map((apt) => (
                <div className="card mb-12" key={apt.id} style={{ opacity: 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>📅 {apt.fecha} {apt.hora && `— ${apt.hora}`}</div>
                      <div style={{ fontSize: '0.88rem', marginTop: 4 }}>{apt.motivo}</div>
                    </div>
                    <span className="badge badge-success">Completada</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {appointments.length === 0 && !showForm && (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">Sin citas registradas</div>
              <div className="empty-text">Agrega tu próxima cita prenatal para llevar un mejor control.</div>
            </div>
          )}
        </>
      )}

      {/* Recordatorios Tab */}
      {tab === 'recordatorios' && (
        <>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Activa o desactiva tus recordatorios de cuidado prenatal.
          </p>
          {reminders.map((reminder) => (
            <div className={`reminder-item${reminder.active ? '' : ' inactive'}`} key={reminder.id}>
              <span className="reminder-icon">{reminder.icon}</span>
              <span className="reminder-text">{reminder.text}</span>
              <div
                className={`toggle-switch${reminder.active ? ' active' : ''}`}
                onClick={() => toggleReminder(reminder.id)}
                role="switch"
                aria-checked={reminder.active}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') toggleReminder(reminder.id); }}
              />
            </div>
          ))}
        </>
      )}

      <BottomNav currentPage="appointments" onNavigate={onNavigate} />
    </div>
  );
}

export default Appointments;
