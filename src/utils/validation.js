export const validateName = (name) => {
  if (!name || name.trim() === '') return 'Este campo es obligatorio';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return 'Solo se permiten letras, espacios y tildes';
  }
  return '';
};

export const validateDNI = (dni) => {
  if (!dni || dni.trim() === '') return 'El DNI es obligatorio';
  if (!/^\d{8}$/.test(dni)) {
    return 'El DNI debe tener exactamente 8 dígitos';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') return 'El número es obligatorio';
  if (!/^9\d{8}$/.test(phone)) {
    return 'Ingresa un celular peruano válido: 9 dígitos y debe empezar con 9';
  }
  return '';
};

export const validateOptionalPhone = (phone) => {
  if (!phone || phone.trim() === '') return '';
  if (!/^9\d{8}$/.test(phone)) {
    return 'Ingresa un celular peruano válido: 9 dígitos y debe empezar con 9';
  }
  return '';
};

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
