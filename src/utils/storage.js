/* ─── localStorage helpers for NueveLunas ─── */

export const KEYS = {
  PATIENT: 'nl_patient',
  OBSTETRIC: 'nl_obstetric',
  CONTACTS: 'nl_contacts',
  HEALTH_CENTER: 'nl_health_center',
  HEALTH_CENTERS: 'nl_health_centers',
  CONTROLS: 'nl_controls',
  ALERTS: 'nl_alerts',
  REMINDERS: 'nl_reminders',
  APPOINTMENTS: 'nl_appointments',
  THEME: 'nl_theme',
  REGISTERED: 'nl_registered',
  PROFILE_PHOTO: 'nl_profile_photo',
  USER_LOCATION: 'nl_user_location',
};

export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadData(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export function removeData(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

export function clearNavigation() {
  /* Clears only the registration flag so user sees splash,
     but keeps all patient data intact. */
  removeData(KEYS.REGISTERED);
}

export function isRegistered() {
  return loadData(KEYS.REGISTERED, false) === true;
}
