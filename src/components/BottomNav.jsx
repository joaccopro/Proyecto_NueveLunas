function BottomNav({ currentPage, onNavigate }) {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Inicio' },
    { id: 'alertHistory', icon: '📋', label: 'Historial' },
    { id: 'appointments', icon: '📅', label: 'Citas' },
    { id: 'profile', icon: '👤', label: 'Perfil' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item${currentPage === tab.id ? ' active' : ''}`}
          onClick={() => onNavigate(tab.id)}
          type="button"
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
