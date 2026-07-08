import { useState, useEffect, useRef } from 'react';

function Emergency({ onNavigate }) {
  const [phase, setPhase] = useState('ready'); // 'ready' | 'counting'
  const [count, setCount] = useState(5);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (phase === 'counting' && count > 0) {
      intervalRef.current = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'counting' && count === 0) {
      onNavigate('emergencyMap');
    }
    return () => clearTimeout(intervalRef.current);
  }, [phase, count, onNavigate]);

  const handleActivate = () => {
    setPhase('counting');
    setCount(5);
  };

  const handleCancel = () => {
    clearTimeout(intervalRef.current);
    setPhase('ready');
    setCount(5);
  };

  return (
    <div className="emergency-page">
      <div className="page-header" style={{ position: 'absolute', top: 16, left: 16 }}>
        <button
          className="back-btn"
          onClick={() => onNavigate('dashboard')}
          type="button"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          ←
        </button>
      </div>

      {phase === 'ready' ? (
        <>
          <div
            className="emergency-circle"
            onClick={handleActivate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleActivate(); }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>🚨</div>
              <div style={{ fontSize: '0.85rem' }}>ACTIVAR</div>
              <div style={{ fontSize: '0.85rem' }}>EMERGENCIA</div>
            </div>
          </div>
          <h2 className="emergency-title">Emergencia Obstétrica</h2>
          <p className="emergency-subtitle">
            Al activar, se iniciará una cuenta regresiva de 5 segundos. Tus contactos de emergencia serán notificados.
          </p>
        </>
      ) : (
        <>
          <div className="emergency-circle countdown">
            {count}
          </div>
          <h2 className="emergency-title">Enviando alerta en {count}...</h2>
          <p className="emergency-subtitle">
            Presiona cancelar si fue un error
          </p>
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            type="button"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              maxWidth: 280,
            }}
          >
            ✕ Cancelar alerta
          </button>
        </>
      )}
    </div>
  );
}

export default Emergency;
