export function saveToken(token: string, remember = false) {
  try {
    if (remember) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  } catch (e) {
    // ignore storage errors
  }
}

export function getToken(): string | null {
  try {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    sessionStorage.removeItem('userData');
    localStorage.removeItem('userData');
  } catch (e) {}
}

export function isTokenExpired(token?: string) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return Date.now() / 1000 > payload.exp;
  } catch (e) {
    return true;
  }
}