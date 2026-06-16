export function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatPaymentStatus(value) {
  if (!value) {
    return '-'
  }

  const normalized = value.toUpperCase()

  if (normalized === 'CREDIT') {
    return 'Unpaid'
  }

  return normalized.charAt(0) + normalized.slice(1).toLowerCase()
}

export function formatOrderStatus(value) {
  if (!value) {
    return '-'
  }

  return value.charAt(0) + value.slice(1).toLowerCase()
}

export function formatPaymentType(value) {
  if (!value) {
    return '-'
  }

  return value.charAt(0) + value.slice(1).toLowerCase()
}
