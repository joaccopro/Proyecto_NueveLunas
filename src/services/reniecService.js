// ============================================================
// SERVICIO DE VALIDACIÓN RENIEC (Simulado)
// ============================================================
//
// IMPORTANTE: Esta es una simulación local para desarrollo.
// La integración real con RENIEC NO debe hacerse desde el
// navegador (frontend) por seguridad y restricciones de CORS.
//
// Para producción, implementar la validación mediante:
// - Supabase Edge Function (recomendado para este proyecto)
// - Backend propio (Node.js, Express, etc.)
// - API Gateway que conecte con el servicio RENIEC real
//
// El backend debe tener las credenciales de acceso a la API
// de RENIEC o a un proveedor intermediario autorizado
// (ej. APIs.net.pe, Consultaruc.com, etc.)
// ============================================================

/**
 * Valida un DNI y nombre completo contra RENIEC (simulación).
 *
 * @param {string} dni - Número de DNI (8 dígitos)
 * @param {string} fullName - Nombre completo del titular
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 *
 * En producción, esta función debería llamar al backend:
 *   const response = await fetch('/api/reniec/validate', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ dni, fullName })
 *   });
 *   return response.json();
 */
export async function validateDniWithReniec(dni, fullName) {
  // Simular latencia de red (500-1500ms)
  const delay = 500 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Validación básica de DNI: exactamente 8 dígitos
  if (!dni || !/^\d{8}$/.test(dni.trim())) {
    return {
      success: false,
      message: 'El DNI debe tener exactamente 8 dígitos numéricos.',
    };
  }

  // Validación básica de nombre: al menos 2 palabras con letras válidas
  const nameParts = (fullName || '')
    .trim()
    .split(/\s+/)
    .filter((part) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(part));

  if (nameParts.length < 2) {
    return {
      success: false,
      message:
        'Ingresa el nombre completo (nombres y apellidos) para validar.',
    };
  }

  // Simulación exitosa
  return {
    success: true,
    message: 'Identidad validada correctamente (simulación RENIEC)',
    data: {
      dni: dni.trim(),
      nombres: nameParts.slice(0, -2).join(' ') || nameParts[0],
      apellidoPaterno: nameParts[nameParts.length - 2] || '',
      apellidoMaterno: nameParts[nameParts.length - 1] || '',
      // En producción, estos datos vendrían del servicio real
    },
  };
}
