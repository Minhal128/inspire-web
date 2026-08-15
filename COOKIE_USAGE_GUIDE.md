# Cookie/Session Management Guide

This guide explains how to use the cookie-based storage system instead of localStorage in the NspireInspection.Ai application.

## Why Cookies Instead of localStorage?

1. **Better Security**: Cookies can be marked as `HttpOnly`, `Secure`, and `SameSite` for enhanced protection
2. **Server-Side Access**: Cookies can be read server-side for SSR/SSG
3. **Automatic Expiration**: Built-in expiration mechanism
4. **GDPR Compliance**: Better support for consent management
5. **Cross-Domain Support**: Can work across subdomains

## Installation

The cookie utility is already installed at: `lib/cookies.ts`

## Basic Usage

### Import the utility

```typescript
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';
```

### Set a cookie

```typescript
// Basic usage
setCookie('username', 'john_doe');

// With options
setCookie('username', 'john_doe', {
  expires: 30,        // 30 days
  secure: true,       // HTTPS only
  sameSite: 'strict'  // CSRF protection
});
```

### Get a cookie

```typescript
const username = getCookie('username');
console.log(username); // 'john_doe' or null
```

### Delete a cookie

```typescript
deleteCookie('username');
```

## Working with JSON Data

### Store JSON objects

```typescript
import { setJsonCookie, getJsonCookie } from '@/lib/cookies';

const user = {
  id: 1,
  name: 'John Doe',
  role: 'inspector'
};

setJsonCookie('user_data', user, { expires: 7 });
```

### Retrieve JSON objects

```typescript
const user = getJsonCookie('user_data');
console.log(user?.name); // 'John Doe'
```

## Authentication Cookies

### Using the Auth Helper

```typescript
import { authCookies } from '@/lib/cookies';

// Set authentication token
authCookies.setToken('your-jwt-token', 7); // 7 days

// Get authentication token
const token = authCookies.getToken();

// Set user data
authCookies.setUser({ id: 1, name: 'John', role: 'inspector' });

// Get user data
const user = authCookies.getUser();

// Check if authenticated
if (authCookies.isAuthenticated()) {
  console.log('User is logged in');
}

// Clear all auth data
authCookies.clearAuth();
```

## Session Cookies (Browser Session Only)

```typescript
import { sessionCookies } from '@/lib/cookies';

// Set session data (expires when browser closes)
sessionCookies.set('temp_data', 'temporary value');

// Get session data
const tempData = sessionCookies.get('temp_data');

// Set JSON session data
sessionCookies.setJson('form_data', { field1: 'value1' });

// Get JSON session data
const formData = sessionCookies.getJson('form_data');

// Remove session data
sessionCookies.remove('temp_data');
```

## Cookie Consent Management

```typescript
import { consentCookies } from '@/lib/cookies';

// Set user's cookie consent
consentCookies.setConsent({
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false
});

// Get user's consent
const consent = consentCookies.getConsent();

// Check if user has given consent
if (consentCookies.hasConsent()) {
  console.log('User has set cookie preferences');
}

// Remove consent
consentCookies.removeConsent();
```

## Migration from localStorage

The utility includes an automatic migration function:

```typescript
import { migrateFromLocalStorage } from '@/lib/cookies';

// Call this once on app initialization (e.g., in app layout or main page)
useEffect(() => {
  migrateFromLocalStorage();
}, []);
```

This will automatically:
- Move `localStorage.getItem('token')` → `authCookies.setToken()`
- Move `localStorage.getItem('user')` → `authCookies.setUser()`
- Move `localStorage.getItem('selectedUnits')` → cookie `selectedUnits`

## Example: Login Flow

### Before (with localStorage)

```typescript
// Login
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

// Check auth
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
if (token && userStr) {
  const user = JSON.parse(userStr);
  // ...
}

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### After (with cookies)

```typescript
import { authCookies } from '@/lib/cookies';

// Login
authCookies.setToken(response.token, 7); // 7 days
authCookies.setUser(response.user);

// Check auth
const token = authCookies.getToken();
const user = authCookies.getUser();
if (token && user) {
  // ...
}

// Logout
authCookies.clearAuth();
```

## Cookie Options Reference

```typescript
interface CookieOptions {
  expires?: number;      // Days until expiration (default: 7)
  path?: string;         // Cookie path (default: '/')
  domain?: string;       // Cookie domain
  secure?: boolean;      // HTTPS only (default: true)
  sameSite?: 'strict' | 'lax' | 'none'; // CSRF protection (default: 'lax')
}
```

## Security Best Practices

1. **Always use `secure: true` in production** - Ensures cookies are only sent over HTTPS
2. **Use `sameSite: 'strict'` or 'lax'** - Prevents CSRF attacks
3. **Set appropriate expiration times** - Don't make auth tokens last forever
4. **Never store sensitive data in cookies** - Like passwords or credit card numbers
5. **Use HttpOnly cookies for sensitive tokens** - (Requires server-side implementation)

## Browser Compatibility

The cookie utility works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Cookies not being set

1. Check if you're on HTTPS in production (required for `secure: true`)
2. Verify cookie size isn't too large (max ~4KB per cookie)
3. Check browser settings allow cookies
4. Verify domain/path settings are correct

### Cookies not persisting

1. Check expiration time is set correctly
2. Verify browser isn't in incognito/private mode
3. Check if user has disabled cookies
4. Verify `sameSite` setting is appropriate for your use case

## Cookie Policy Page

Users can manage their cookie preferences at `/cookies`

The page provides:
- Information about cookie types
- Toggle switches for different cookie categories
- Save/Accept/Reject all options
- Contact information for questions

## Additional Resources

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [GDPR Cookie Consent](https://gdpr.eu/cookies/)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
