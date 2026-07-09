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

// ==========================================
// MÓDULO DE ALMACENAMIENTO (Supabase Ready)
// ==========================================
// Actualmente usa localStorage de manera síncrona,
// pero se estructura para facilitar migración futura.

export const storageService = {
  // Función base para leer (podría ser async en Supabase)
  loadData(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error loading data for key ${key}`, e);
      return defaultValue;
    }
  },

  // Función base para guardar (podría ser async en Supabase)
  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving data for key ${key}`, e);
    }
  },

  // Helpers específicos
  isRegistered() {
    return this.loadData(KEYS.REGISTERED, false);
  },

  clearNavigation() {
    // Si mantienes historial o estados persistentes de nav, bórralos aquí.
    // Actualmente la app no guarda el estado de navegación en LS, pero la func existe.
  }
};

// Exportamos atajos para mantener compatibilidad con el código actual, 
// facilitando refactorización incremental.
export const loadData = storageService.loadData.bind(storageService);
export const saveData = storageService.saveData.bind(storageService);
export const isRegistered = storageService.isRegistered.bind(storageService);
export const clearNavigation = storageService.clearNavigation.bind(storageService);
