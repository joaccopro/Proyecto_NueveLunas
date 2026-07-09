import { useState, useEffect } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';
import BottomNav from '../components/BottomNav';
import { requestNotificationPermission } from '../services/notificationService';

const REMINDER_TYPES = [
  'ácido fólico',
  'hierro',
  'control prenatal',
  'tomar agua',
  'ecografía',
  'medicamento',
  'otro'
];

const TYPE_ICONS = {
  'ácido fólico': '💊',
  'hierro': '💉',
  'control prenatal': '🩺',
  'tomar agua': '💧',
  'ecografía': '📸',
  'medicamento': '💊',
  'otro': '🔔'
};

const STATUS_COLORS = {
  pendiente: 'var(--color-primary)',
  notificado: '#E8A317',
  pospuesto: '#E8A317',
  realizado: '#22A867'
};

const getReminderType = (reminder) => {
  return reminder?.type || reminder?.tipo || 'otro';
};

const getReminderStatus = (reminder) => {
  return reminder?.status || 'pendiente';
};

const normalizeReminders = (raw) => {
  if (!Array.isArray(raw)) throw new Error('Data is not an array');
  return raw.map(r => ({
    id: r.id || Date.now().toString() + Math.random().toString().substring(2, 6),
    title: r.title || r.text || 'Recordatorio',
    text: r.title || r.text || 'Recordatorio',
    description: r.description || r.desc || '',
    desc: r.description || r.desc || '',
    date: r.date || r.fecha || new Date().toISOString().split('T')[0],
    fecha: r.date || r.fecha || new Date().toISOString().split('T')[0],
    time: r.time || r.hora || '12:00',
    hora: r.time || r.hora || '12:00',
    type: getReminderType(r),
    status: getReminderStatus(r),
    active: r.active !== undefined ? r.active : true,
    notified: r.notified || false,
    icon: r.icon || TYPE_ICONS[getReminderType(r)] || '🔔'
  }));
};

function Reminders({ onNavigate }) {
  const [reminders, setReminders] = useState(() => {
    try {
      const raw = loadData(KEYS.REMINDERS, []);
      return normalizeReminders(raw);
    } catch {
      return null;
    }
  });

  const isCorrupt = reminders === null;

  const [isAdding, setIsAdding] = useState(false);
  const [notiMsg, setNotiMsg] = useState('');
  const [errors, setErrors] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'ácido fólico'
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const raw = loadData(KEYS.REMINDERS, []);
        setReminders(normalizeReminders(raw));
      } catch {
        setReminders(null);
      }
    };
    window.addEventListener('remindersUpdated', handleUpdate);
    return () => window.removeEventListener('remindersUpdated', handleUpdate);
  }, []);

  const handleActivateNoti = async () => {
    const res = await requestNotificationPermission();
    setNotiMsg(res.message);
    setTimeout(() => setNotiMsg(''), 4000);
  };

  const handleClearCorrupt = () => {
    saveData(KEYS.REMINDERS, []);
    setReminders([]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors('');

    if (!form.title.trim() || !form.date || !form.time) {
      setErrors('Por favor, completa título, fecha y hora.');
      return;
    }

    const now = new Date();
    const alarmTime = new Date(`${form.date}T${form.time}`);

    if (alarmTime <= now) {
      setErrors('No puedes programar un recordatorio en una fecha u hora pasada');
      return;
    }

    const newReminder = normalizeReminders([{
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'pendiente'
    }])[0];

    const updated = [...(reminders || []), newReminder].sort((a, b) => 
      new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );
    
    setReminders(updated);
    saveData(KEYS.REMINDERS, updated);
    setIsAdding(false);
    setForm({ title: '', description: '', date: '', time: '', type: 'ácido fólico' });
  };

  const handleDelete = (id) => {
    if (!reminders) return;
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveData(KEYS.REMINDERS, updated);
  };

  if (isCorrupt) {
    return (
      <div className="page with-nav">
        <div className="page-header">
          <h1>⏰ Recordatorios</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
          <p style={{ marginBottom: 20 }}>Hubo un problema cargando tus recordatorios. Puedes limpiarlos y volver a crearlos.</p>
          <button className="btn btn-danger" onClick={handleClearCorrupt}>
            Limpiar recordatorios dañados
          </button>
        </div>
        <BottomNav currentPage="reminders" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="page with-nav">
      <div className="page-header" style={{ justifyContent: 'space-between' }}>
        <h1>⏰ Recordatorios</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={handleActivateNoti} style={{ width: '100%', border: '1px solid var(--color-gray-300)' }}>
          🔔 Activar notificaciones
        </button>
        {notiMsg && <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>{notiMsg}</div>}
      </div>

      {isAdding && (
        <div className="card mb-20" style={{ backgroundColor: 'var(--color-gray-50)' }}>
          <h3 style={{ marginBottom: 12, fontSize: '1.1rem' }}>Nuevo Recordatorio</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input 
                className="form-input" 
                placeholder="Ej. Tomar pastilla" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Descripción (Opcional)</label>
              <input 
                className="form-input" 
                placeholder="Con un vaso de agua..." 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select 
                className="form-input" 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
                style={{ appearance: 'auto' }}
              >
                {REMINDER_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha *</label>
                <input 
                  className="form-input" 
                  type="date" 
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora *</label>
                <input 
                  className="form-input" 
                  type="time" 
                  value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}
                />
              </div>
            </div>

            {errors && <div className="error-text mb-12">{errors}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Guardar
            </button>
          </form>
        </div>
      )}

      {reminders.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
          <p>No tienes recordatorios activos.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reminders.map(r => (
            <div className="card" key={r.id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: '2rem' }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: 4 }}>{r.title}</div>
                  {r.description && <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>{r.description}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                    <span>📅 {r.date}</span>
                    <span>⏰ {r.time}</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: `${STATUS_COLORS[r.status]}15`, color: STATUS_COLORS[r.status] }}>
                    {r.status.toUpperCase()}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(r.id)} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-gray-400)', lineHeight: 1.5, marginBottom: 40 }}>
        Las notificaciones funcionan mientras la app esté abierta o el navegador permita notificaciones. Para una APK final se pueden usar notificaciones locales.
      </div>

      <BottomNav currentPage="reminders" onNavigate={onNavigate} />
    </div>
  );
}

export default Reminders;
