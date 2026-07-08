import { useState } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

const EMPTY_CONTACT = { nombre: '', parentesco: '', celular: '' };

function EmergencyContacts({ onNavigate }) {
  const existing = loadData(KEYS.CONTACTS, []);
  const [contacts, setContacts] = useState(
    existing.length > 0 ? existing : [{ ...EMPTY_CONTACT }]
  );

  const handleChange = (index, field, value) => {
    setContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
    }
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const valid = contacts.filter((c) => c.nombre && c.celular);
    if (valid.length === 0) return;
    saveData(KEYS.CONTACTS, valid);
    onNavigate('healthCenter');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('obstetricData')} type="button">
          ←
        </button>
        <h1>Contactos de Emergencia</h1>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Registra hasta 3 contactos que serán notificados en caso de emergencia.
      </p>

      <form onSubmit={handleNext}>
        {contacts.map((contact, index) => (
          <div className="contact-card" key={index}>
            <div className="contact-card-header">
              <div className="contact-card-number">{index + 1}</div>
              {contacts.length > 1 && (
                <button
                  className="contact-remove"
                  type="button"
                  onClick={() => removeContact(index)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Nombre del contacto"
                value={contact.nombre}
                onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Parentesco</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Esposo, madre..."
                  value={contact.parentesco}
                  onChange={(e) => handleChange(index, 'parentesco', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Celular *</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="987654321"
                  value={contact.celular}
                  onChange={(e) => handleChange(index, 'celular', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {contacts.length < 3 && (
          <button className="btn btn-secondary btn-sm mb-20" type="button" onClick={addContact}>
            + Agregar contacto
          </button>
        )}

        <button className="btn btn-primary mt-8" type="submit">
          Siguiente →
        </button>
      </form>
    </div>
  );
}

export default EmergencyContacts;
