import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { validateName, validatePhone } from '../utils/validation';

const EMPTY_CONTACT = { nombre: '', parentesco: '', celular: '' };

function ContactsView({ goBack }) {
  const [contacts, setContacts] = useState(loadData(KEYS.CONTACTS, []));
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_CONTACT });
  const [errors, setErrors] = useState({});

  const saveContacts = (updated) => {
    setContacts(updated);
    saveData(KEYS.CONTACTS, updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditForm(contacts[index]);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const newErrors = {
      nombre: validateName(editForm.nombre),
      celular: validatePhone(editForm.celular),
    };

    if (newErrors.nombre || newErrors.celular) {
      setErrors(newErrors);
      return;
    }

    const updated = [...contacts];
    if (editingIndex === -1) {
      updated.push(editForm);
    } else {
      updated[editingIndex] = editForm;
    }
    saveContacts(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    saveContacts(updated);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">←</button>
        <h1>Contactos de Emergencia</h1>
      </div>

      {contacts.length === 0 && editingIndex === null && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-title">Sin contactos</div>
          <div className="empty-text">Agrega personas de confianza para notificarlas en emergencias.</div>
        </div>
      )}

      {editingIndex === null ? (
        <>
          {contacts.map((contact, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="contact-card-number">{index + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{contact.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {contact.parentesco || 'Familiar'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="contact-remove"
                    onClick={() => handleEdit(index)}
                    type="button"
                    style={{ color: 'var(--color-primary)' }}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="contact-remove"
                    onClick={() => handleDelete(index)}
                    type="button"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div style={{ background: 'var(--color-gray-100)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📞</span>
                <span style={{ fontWeight: 600 }}>{contact.celular}</span>
              </div>
            </div>
          ))}

          {contacts.length < 3 && (
            <button
              className="btn btn-secondary mt-16"
              onClick={() => {
                setEditingIndex(-1);
                setEditForm({ ...EMPTY_CONTACT });
                setErrors({});
              }}
              type="button"
            >
              + Agregar contacto
            </button>
          )}
        </>
      ) : (
        <div className="card" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>
            {editingIndex === -1 ? 'Nuevo Contacto' : 'Editar Contacto'}
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                type="text"
                placeholder="Ej. Juan Pérez"
                value={editForm.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Parentesco</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Pareja, madre..."
                  value={editForm.parentesco}
                  onChange={(e) => handleChange('parentesco', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Celular *</label>
                <input
                  className={`form-input ${errors.celular ? 'input-error' : ''}`}
                  type="tel"
                  placeholder="987654321"
                  value={editForm.celular}
                  onChange={(e) => handleChange('celular', e.target.value)}
                  maxLength={9}
                />
                {errors.celular && <span className="error-text">{errors.celular}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                className="btn btn-ghost"
                onClick={() => setEditingIndex(null)}
                type="button"
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ContactsView;
