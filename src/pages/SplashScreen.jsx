import { isRegistered } from '../services/storageService';
import madreBebeImg from '../assets/madre-bebe.png';

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
      {/* SVG Illustration: Pregnant mother silhouette */}
      <div className="splash-art" aria-hidden="true">
        <img src={madreBebeImg} alt="Madre gestante" className="splash-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

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
