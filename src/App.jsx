import { useState, useCallback } from 'react';
import { loadData, KEYS } from './utils/storage';
import './App.css';

import SplashScreen from './pages/SplashScreen';
import PatientRegister from './pages/PatientRegister';
import ObstetricData from './pages/ObstetricData';
import EmergencyContacts from './pages/EmergencyContacts';
import HealthCenter from './pages/HealthCenter';
import Dashboard from './pages/Dashboard';
import MyInfo from './pages/MyInfo';
import PregnancyControl from './pages/PregnancyControl';
import AlarmSigns from './pages/AlarmSigns';
import Emergency from './pages/Emergency';
import EmergencyMap from './pages/EmergencyMap';
import AlertSent from './pages/AlertSent';
import AlertHistory from './pages/AlertHistory';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');

  const navigateTo = useCallback((page) => {
    /* Handle special dashboard card links that point to
       read-only variants of the registration forms. */
    if (page === 'emergencyContacts_view') {
      setCurrentPage('myInfo');
      return;
    }
    if (page === 'healthCenter_view') {
      setCurrentPage('myInfo');
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onNavigate={navigateTo} />;
      case 'patientRegister':
        return <PatientRegister onNavigate={navigateTo} />;
      case 'obstetricData':
        return <ObstetricData onNavigate={navigateTo} />;
      case 'emergencyContacts':
        return <EmergencyContacts onNavigate={navigateTo} />;
      case 'healthCenter':
        return <HealthCenter onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'myInfo':
        return <MyInfo onNavigate={navigateTo} />;
      case 'pregnancyControl':
        return <PregnancyControl onNavigate={navigateTo} />;
      case 'alarmSigns':
        return <AlarmSigns onNavigate={navigateTo} />;
      case 'emergency':
        return <Emergency onNavigate={navigateTo} />;
      case 'emergencyMap':
        return <EmergencyMap onNavigate={navigateTo} />;
      case 'alertSent':
        return <AlertSent onNavigate={navigateTo} />;
      case 'alertHistory':
        return <AlertHistory onNavigate={navigateTo} />;
      case 'reminders':
        return <Reminders onNavigate={navigateTo} />;
      case 'profile':
        return <Profile onNavigate={navigateTo} />;
      default:
        return <SplashScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-shell">
      {renderPage()}
    </div>
  );
}

export default App;
