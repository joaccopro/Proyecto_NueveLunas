function AlarmSigns({ onNavigate, goBack }) {
  const signs = [
    { icon: '🩸', title: 'Sangrado vaginal', desc: 'Cualquier tipo de sangrado durante el embarazo requiere atención inmediata.' },
    { icon: '💧', title: 'Pérdida de líquido amniótico', desc: 'Salida de líquido claro o con olor por la vagina antes del momento del parto.' },
    { icon: '⚡', title: 'Dolor abdominal intenso', desc: 'Dolor fuerte y persistente en el abdomen o bajo vientre que no cede.' },
    { icon: '😵', title: 'Mareos fuertes', desc: 'Sensación de desmayo o mareo intenso que impide realizar actividades.' },
    { icon: '👁️', title: 'Visión borrosa', desc: 'Ver puntos, luces o tener la visión nublada de forma repentina.' },
    { icon: '🤕', title: 'Dolor de cabeza intenso', desc: 'Cefalea severa que no mejora con reposo ni analgésicos comunes.' },
    { icon: '🦶', title: 'Hinchazón excesiva', desc: 'Hinchazón repentina y severa en manos, pies o cara.' },
    { icon: '👶', title: 'Ausencia de movimientos fetales', desc: 'Disminución notable o ausencia de los movimientos del bebé por más de 2 horas.' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">
          ←
        </button>
        <h1>Signos de Alarma</h1>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Si presentas alguno de estos síntomas, busca atención médica de inmediato.
      </p>

      {signs.map((sign, i) => (
        <div className="alert-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <span className="alert-icon">{sign.icon}</span>
          <div>
            <div className="alert-title">{sign.title}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
              {sign.desc}
            </p>
            <span className="alert-desc">⚠️ Acude inmediatamente a un establecimiento de salud</span>
          </div>
        </div>
      ))}

      <button className="btn btn-secondary mt-20" onClick={goBack} type="button">
        ← Volver
      </button>
    </div>
  );
}

export default AlarmSigns;
