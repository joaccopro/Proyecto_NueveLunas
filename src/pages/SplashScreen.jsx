import { isRegistered } from '../utils/storage';

function SplashScreen({ onNavigate }) {
  const handleEnter = () => {
    if (isRegistered()) {
      onNavigate('dashboard');
    } else {
      onNavigate('patientRegister');
    }
  };

  return (
    <div className="splash">
      <div className="splash-illustration">🤰</div>
      <h1 className="splash-logo">NueveLunas</h1>
      <p className="splash-tagline">Cuidamos de ti y de tu bebé</p>
      <div className="splash-actions">
        <button className="btn-enter" onClick={handleEnter} type="button">
          Ingresar
        </button>
        <button
          className="btn-emergency-splash"
          onClick={() => onNavigate('emergency')}
          type="button"
        >
          🚨 Emergencia
        </button>
      </div>
    </div>
  );
}

export default SplashScreen;
