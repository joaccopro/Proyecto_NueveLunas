import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { validateName, validatePhone } from '../utils/validation';

const EMPTY_CONTACT = { nombre: '', parentesco: '', celular: '' };

function EmergencyContacts({ onNavigate, goBack }) {
  const existing = loadData(KEYS.CONTACTS, []);
  const [contacts, setContacts] = useState(
    existing.length > 0 ? existing : [{ ...EMPTY_CONTACT }]
  );
  const [errors, setErrors] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
    
    // Clear error
    if (errors[index] && errors[index][field]) {
      const newErrors = [...errors];
      newErrors[index][field] = '';
      setErrors(newErrors);
    }
  };

  const handleAddContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { ...EMPTY_CONTACT }]);
    }
  };

  const handleRemoveContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors = contacts.map(contact => {
      const contactErrors = {};
      if (contact.nombre || contact.celular) {
        contactErrors.nombre = validateName(contact.nombre);
        contactErrors.celular = validatePhone(contact.celular);
        if (contactErrors.nombre || contactErrors.celular) hasErrors = true;
      }
      return contactErrors;
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Filter out empty contacts before saving
    const validContacts = contacts.filter((c) => c.nombre && c.celular);
    saveData(KEYS.CONTACTS, validContacts);
    onNavigate('healthCenter');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack || (() => onNavigate('obstetricData'))} type="button">
          ←
        </button>
        <h1>Contactos de Emergencia</h1>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '75%' }} />
        </div>
        <div className="progress-label">Paso 3 de 4</div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Registra hasta 3 personas de confianza a las que notificaremos si tienes una emergencia.
      </p>

      <form onSubmit={handleNext}>
        {contacts.map((contact, index) => {
          const contactErrors = errors[index] || {};
          return (
            <div className="card mb-16" key={index} style={{ position: 'relative' }}>
              {index > 0 && (
                <button
                  className="contact-remove"
                  style={{ position: 'absolute', top: 12, right: 12 }}
                  onClick={() => handleRemoveContact(index)}
                  type="button"
                >
                  ✕
                </button>
              )}
              <h3 style={{ fontSize: '0.9rem', marginBottom: 16 }}>Contacto {index + 1}</h3>

              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input
                  className={`form-input ${contactErrors.nombre ? 'input-error' : ''}`}
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={contact.nombre}
                  onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                  required={index === 0 || !!contact.celular}
                />
                {contactErrors.nombre && <span className="error-text">{contactErrors.nombre}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Parentesco</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Pareja, madre..."
                    value={contact.parentesco}
                    onChange={(e) => handleChange(index, 'parentesco', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Celular *</label>
                  <input
                    className={`form-input ${contactErrors.celular ? 'input-error' : ''}`}
                    type="tel"
                    placeholder="987654321"
                    value={contact.celular}
                    onChange={(e) => handleChange(index, 'celular', e.target.value)}
                    required={index === 0 || !!contact.nombre}
                    maxLength={9}
                  />
                  {contactErrors.celular && <span className="error-text">{contactErrors.celular}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {contacts.length < 3 && (
          <button className="btn btn-secondary" onClick={handleAddContact} type="button">
            + Agregar otro contacto
          </button>
        )}

        <button className="btn btn-primary mt-20" type="submit">
          Siguiente ›
        </button>
      </form>
    </div>
  );
}

export default EmergencyContacts;
