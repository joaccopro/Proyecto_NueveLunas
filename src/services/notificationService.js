// Web Audio API context (lazy initialization)
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Request permissions for native notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return { success: false, message: 'Tu navegador no soporta notificaciones nativas.' };
  }

  // Play a silent sound to unlock the audio context on user gesture
  playSilentSound();

  if (Notification.permission === 'granted') {
    return { success: true, message: 'Permisos ya concedidos.' };
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return { success: true, message: 'Notificaciones activadas exitosamente.' };
    }
  }

  return { success: false, message: 'Debes activar los permisos de notificación en tu navegador.' };
};

// Play a short beep pattern using Web Audio API
export const playAlarmSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playBeep = (startTime, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Play a sequence of beeps
    playBeep(now, 880, 0.2);
    playBeep(now + 0.3, 880, 0.2);
    playBeep(now + 0.6, 1046.5, 0.4);
    
  } catch (error) {
    console.error('Error playing alarm sound:', error);
  }
};

// Play a silent sound to unlock Web Audio API (requires user interaction)
export const playSilentSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0; // Silent
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.error('Error unlocking audio:', error);
  }
};

// Show a native notification
export const showNativeNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/vite.svg', // Fallback icon
      });
    } catch (e) {
      console.error('Error showing notification:', e);
    }
  }
};
