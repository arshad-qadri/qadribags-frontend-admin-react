export function parseNumber(value) {
  if (typeof value === 'number') {
    return value
  }

  const normalizedValue = String(value ?? '').replace(/[^\d.]/g, '')
  return Number(normalizedValue) || 0
}

export function parseColors(value) {
  if (Array.isArray(value)) {
    return value
  }

  return String(value ?? '')
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean)
}
