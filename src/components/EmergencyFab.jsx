function EmergencyFab({ onPress }) {
  return (
    <button
      className="btn btn-emergency"
      onClick={onPress}
      type="button"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--bottom-nav-height) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '382px',
        zIndex: 90,
      }}
    >
      🚨 BOTÓN DE EMERGENCIA
    </button>
  );
}

export default EmergencyFab;
