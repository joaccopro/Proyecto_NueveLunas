import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';
import BottomNav from '../components/BottomNav';

const DEFAULT_REMINDERS = [
  { id: 'acidoFolico', icon: '💊', text: 'Tomar ácido fólico', active: true },
  { id: 'controlPrenatal', icon: '🩺', text: 'Próximo control prenatal', active: true },
  { id: 'hierro', icon: '💉', text: 'Tomar hierro', active: true },
  { id: 'agua', icon: '💧', text: 'Beber agua', active: true },
];

function Reminders({ onNavigate }) {
  const stored = loadData(KEYS.REMINDERS, null);
  const [reminders, setReminders] = useState(stored || DEFAULT_REMINDERS);

  const toggleReminder = (id) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    setReminders(updated);
    saveData(KEYS.REMINDERS, updated);
  };

  return (
    <div className="page with-nav">
      <div className="page-header">
        <h1>⏰ Recordatorios</h1>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Activa o desactiva tus recordatorios de cuidado prenatal.
      </p>

      {reminders.map((reminder) => (
        <div
          className={`reminder-item${reminder.active ? '' : ' inactive'}`}
          key={reminder.id}
        >
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

      <BottomNav currentPage="reminders" onNavigate={onNavigate} />
    </div>
  );
}

export default Reminders;
