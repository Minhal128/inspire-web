/**
 * Cookie and Session Management Utility
 * Replaces localStorage with secure cookie-based storage
 */

// Cookie options interface
interface CookieOptions {
  expires?: number; // Days until expiration
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with specified options
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const {
    expires = 7, // Default 7 days
    path = '/',
    secure = true,
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Add expiration
  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  // Add path
  cookieString += `; path=${path}`;

  // Add secure flag (HTTPS only)
  if (secure) {
    cookieString += '; secure';
  }

  // Add SameSite attribute
  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(
        cookie.substring(nameEQ.length, cookie.length)
      );
    }
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Set a JSON object as a cookie
 */
export function setJsonCookie(
  name: string,
  value: any,
  options?: CookieOptions
): void {
  try {
    const jsonString = JSON.stringify(value);
    setCookie(name, jsonString, options);
  } catch (error) {
    console.error('Error setting JSON cookie:', error);
  }
}

/**
 * Get a JSON object from a cookie
 */
export function getJsonCookie<T = any>(name: string): T | null {
  try {
    const value = getCookie(name);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Error parsing JSON cookie:', error);
    return null;
  }
}

/**
 * Session Storage - cookies that expire when browser closes
 */
export const sessionCookies = {
  set(name: string, value: string): void {
    setCookie(name, value, { expires: 0 }); // Session cookie (expires: 0)
  },

  get(name: string): string | null {
    return getCookie(name);
  },

  setJson(name: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      this.set(name, jsonString);
    } catch (error) {
      console.error('Error setting session JSON:', error);
    }
  },

  getJson<T = any>(name: string): T | null {
    try {
      const value = this.get(name);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing session JSON:', error);
      return null;
    }
  },

  remove(name: string): void {
    deleteCookie(name);
  },

  has(name: string): boolean {
    return hasCookie(name);
  },
};

/**
 * Auth Token Management
 */
export const authCookies = {
  setToken(token: string, expiresInDays: number = 7): void {
    setCookie('auth_token', token, {
      expires: expiresInDays,
      secure: true,
      sameSite: 'strict',
    });
  },

  getToken(): string | null {
    return getCookie('auth_token');
  },

  removeToken(): void {
    deleteCookie('auth_token');
  },

  setUser(user: any): void {
    setJsonCookie('user_data', user, {
      expires: 7,
      secure: true,
      sameSite: 'strict',
    });
  },

  getUser<T = any>(): T | null {
    return getJsonCookie<T>('user_data');
  },

  removeUser(): void {
    deleteCookie('user_data');
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return hasCookie('auth_token');
  },
};

/**
 * Consent Management for Cookie Policy
 */
export const consentCookies = {
  setConsent(consent: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }): void {
    setJsonCookie('cookie_consent', consent, {
      expires: 365, // 1 year
      secure: true,
      sameSite: 'lax',
    });
  },

  getConsent(): {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  } | null {
    return getJsonCookie('cookie_consent');
  },

  hasConsent(): boolean {
    return hasCookie('cookie_consent');
  },

  removeConsent(): void {
    deleteCookie('cookie_consent');
  },
};

/**
 * Migrate from localStorage to cookies (helper for transition)
 */
export function migrateFromLocalStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    // Migrate auth token
    const token = localStorage.getItem('token');
    if (token) {
      authCookies.setToken(token);
      localStorage.removeItem('token');
    }

    // Migrate user data
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      authCookies.setUser(user);
      localStorage.removeItem('user');
    }

    // Migrate selected units
    const selectedUnits = localStorage.getItem('selectedUnits');
    if (selectedUnits) {
      setCookie('selectedUnits', selectedUnits, { expires: 7 });
      localStorage.removeItem('selectedUnits');
    }

    console.log('Successfully migrated from localStorage to cookies');
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
}

export default {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  setJsonCookie,
  getJsonCookie,
  sessionCookies,
  authCookies,
  consentCookies,
  migrateFromLocalStorage,
};
