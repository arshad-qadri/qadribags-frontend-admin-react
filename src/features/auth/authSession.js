export const tokenKey = 'access_token'

export function getStoredToken() {
  return localStorage.getItem(tokenKey)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(tokenKey, token)
  }
}

export function clearStoredToken() {
  localStorage.removeItem(tokenKey)
}

export function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.replace('/login')
  }
}

export function clearSessionAndRedirect() {
  clearStoredToken()
  redirectToLogin()
}
