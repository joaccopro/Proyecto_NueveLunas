import { useState, useCallback, useRef, useEffect } from 'react';
import { loadData, saveData, KEYS } from './utils/storage';
import { playAlarmSound, showNativeNotification } from './services/notificationService';
import './App.css';

import SplashScreen from './pages/SplashScreen';
import PatientRegister from './pages/PatientRegister';
import ObstetricData from './pages/ObstetricData';
import EmergencyContacts from './pages/EmergencyContacts';
import HealthCenter from './pages/HealthCenter';
import Dashboard from './pages/Dashboard';
import MyInfo from './pages/MyInfo';
import EditProfile from './pages/EditProfile';
import PregnancyControl from './pages/PregnancyControl';
import AlarmSigns from './pages/AlarmSigns';
import Emergency from './pages/Emergency';
import EmergencyMap from './pages/EmergencyMap';
import AlertSent from './pages/AlertSent';
import AlertHistory from './pages/AlertHistory';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import ContactsView from './pages/ContactsView';
import HealthCentersView from './pages/HealthCentersView';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import Reminders from './pages/Reminders';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [theme, setTheme] = useState(loadData(KEYS.THEME, 'light'));
  const historyRef = useRef(['splash']);
  const [activeAlarm, setActiveAlarm] = useState(null);

  const navigateTo = useCallback((page) => {
    historyRef.current.push(page);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prev = historyRef.current[historyRef.current.length - 1];
      setCurrentPage(prev);
      window.scrollTo(0, 0);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Global Reminder Auto-checker (every 30 seconds)
  useEffect(() => {
    const checkAlarms = () => {
      const reminders = loadData(KEYS.REMINDERS, []);
      if (!reminders || reminders.length === 0) return;

      const now = new Date();
      let updated = false;

      const newReminders = reminders.map(r => {
        if ((r.status === 'pendiente' || r.status === 'pospuesto') && r.fecha && r.hora) {
          const alarmTime = new Date(`${r.fecha}T${r.hora}`);
          if (now >= alarmTime) {
            // Trigger alarm
            setActiveAlarm(r);
            playAlarmSound();
            showNativeNotification('Recordatorio NueveLunas', `${r.text} ${r.desc ? '- ' + r.desc : ''}`);
            updated = true;
            return { ...r, status: 'notificado' };
          }
        }
        return r;
      });

      if (updated) {
        saveData(KEYS.REMINDERS, newReminders);
        window.dispatchEvent(new Event('remindersUpdated'));
      }
    };

    const intervalId = setInterval(checkAlarms, 30000);
    // Initial check just in case
    setTimeout(checkAlarms, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSnooze = () => {
    if (!activeAlarm) return;
    const reminders = loadData(KEYS.REMINDERS, []);
    
    // Add 10 mins
    const alarmTime = new Date(`${activeAlarm.fecha}T${activeAlarm.hora}`);
    alarmTime.setMinutes(alarmTime.getMinutes() + 10);
    
    // Extract new date and time in local timezone format preserving YYYY-MM-DD
    const yyyy = alarmTime.getFullYear();
    const mm = String(alarmTime.getMonth() + 1).padStart(2, '0');
    const dd = String(alarmTime.getDate()).padStart(2, '0');
    const newFecha = `${yyyy}-${mm}-${dd}`;
    
    const h = String(alarmTime.getHours()).padStart(2, '0');
    const m = String(alarmTime.getMinutes()).padStart(2, '0');
    const newHora = `${h}:${m}`;

    const updated = reminders.map(r => 
      r.id === activeAlarm.id ? { ...r, status: 'pospuesto', fecha: newFecha, hora: newHora } : r
    );
    saveData(KEYS.REMINDERS, updated);
    window.dispatchEvent(new Event('remindersUpdated'));
    setActiveAlarm(null);
  };

  const handleDone = () => {
    if (!activeAlarm) return;
    const reminders = loadData(KEYS.REMINDERS, []);
    const updated = reminders.map(r => 
      r.id === activeAlarm.id ? { ...r, status: 'realizado' } : r
    );
    saveData(KEYS.REMINDERS, updated);
    window.dispatchEvent(new Event('remindersUpdated'));
    setActiveAlarm(null);
  };

  const renderPage = () => {
    const nav = { onNavigate: navigateTo, goBack };

    switch (currentPage) {
      case 'splash': return <SplashScreen {...nav} />;
      case 'patientRegister': return <PatientRegister {...nav} />;
      case 'obstetricData': return <ObstetricData {...nav} />;
      case 'emergencyContacts': return <EmergencyContacts {...nav} />;
      case 'healthCenter': return <HealthCenter {...nav} />;
      case 'dashboard': return <Dashboard {...nav} />;
      case 'myInfo': return <MyInfo {...nav} />;
      case 'editProfile': return <EditProfile {...nav} />;
      case 'pregnancyControl': return <PregnancyControl {...nav} />;
      case 'alarmSigns': return <AlarmSigns {...nav} />;
      case 'emergency': return <Emergency {...nav} />;
      case 'emergencyMap': return <EmergencyMap {...nav} />;
      case 'alertSent': return <AlertSent {...nav} />;
      case 'alertHistory': return <AlertHistory {...nav} />;
      case 'appointments': return <Appointments {...nav} />;
      case 'contactsView': return <ContactsView {...nav} />;
      case 'healthCentersView': return <HealthCentersView {...nav} />;
      case 'settings': return <Settings {...nav} onThemeChange={handleThemeChange} />;
      case 'helpSupport': return <HelpSupport {...nav} />;
      case 'profile': return <Profile {...nav} />;
      case 'reminders': return <Reminders {...nav} />;
      default: return <SplashScreen {...nav} />;
    }
  };

  return (
    <div className={`app-shell ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {renderPage()}

      {/* Alarm Modal Overlay */}
      {activeAlarm && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⏰</div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 8, color: 'var(--color-primary)' }}>Es hora de:</h2>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{activeAlarm.text}</h3>
            {activeAlarm.desc && <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>{activeAlarm.desc}</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <button className="btn btn-primary" onClick={handleDone} style={{ width: '100%' }}>
                Marcar como realizado ✓
              </button>
              <button className="btn btn-secondary" onClick={handleSnooze} style={{ width: '100%' }}>
                Posponer 10 minutos 💤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
