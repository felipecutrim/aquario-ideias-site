export function isRequired(value) {
  return Boolean(value && value.trim())
}

export function isValidEmail(value) {
  if (!value || !value.trim()) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

// Aceita apenas dígitos e formatos comuns de telefone brasileiro
// (com ou sem DDD, parênteses, espaços, hífen ou código do país 55).
export function isValidPhone(value) {
  if (!value || !value.trim()) return true
  const digits = value.replace(/\D/g, '')
  return /^(55)?\d{10,11}$/.test(digits)
}
