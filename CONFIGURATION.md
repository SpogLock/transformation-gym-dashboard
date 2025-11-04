# Configuration Guide

## API Configuration

### Changing the API Base URL

To change the API base URL for different environments:

1. Open `src/services/api.js`
2. Modify the `API_BASE_URL` constant:

```javascript
// Development
const API_BASE_URL = 'http://localhost:8000/api';

// Production
const API_BASE_URL = 'https://api.yourdomain.com/api';

// Staging
const API_BASE_URL = 'https://staging-api.yourdomain.com/api';
```

### Using Environment Variables (Recommended)

If you want to use environment variables:

1. Create a `.env` file in the project root:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

2. Update `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
```

3. Create environment-specific files:
- `.env.development` - for development
- `.env.production` - for production
- `.env.staging` - for staging

Example `.env.production`:
```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com/api
```

### CORS Configuration

If you encounter CORS errors, ensure your backend API allows requests from your frontend domain.

Laravel CORS configuration (`config/cors.php`):
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yourdomain.com',
],
```

## Authentication Configuration

### Token Storage

By default, tokens are stored in `localStorage`. To use a different storage mechanism:

Edit `src/services/authService.js` and update the storage methods:

```javascript
// Example using sessionStorage
localStorage.setItem('auth_token', token);
// Change to:
sessionStorage.setItem('auth_token', token);
```

### Token Expiration

Token expiration is controlled by the backend:
- Default: 1 day (86400 seconds)
- With "Remember Me": 30 days (2592000 seconds)

To change these values, update your backend API configuration.

### Default User Role

When registering new users, the default role is 'staff'. To change this:

Edit `src/views/Auth/SignUp.js`:
```javascript
// Current
const result = await register(name, email, password, password, "staff");

// Change to:
const result = await register(name, email, password, password, "admin");
```

## Routes Configuration

### Changing Default Route

To change where users are redirected after login:

Edit `src/views/Auth/SignIn.js` and `src/views/Auth/SignUp.js`:
```javascript
// Current
history.push("/admin/dashboard");

// Change to your preferred route
history.push("/admin/home");
```

### Changing Login Redirect

To change the default route when not authenticated:

Edit `src/index.js`:
```javascript
// Current
<Redirect from={`/`} to="/auth/signin" />

// Change to:
<Redirect from={`/`} to="/auth/login" />
```

## Form Validation

### Password Requirements

Current password requirements are set in the validation functions. To change them:

Edit `src/views/Auth/SignIn.js` and `src/views/Auth/SignUp.js`:

```javascript
// Current minimum is 6 characters
if (password.length < 6) {
  newErrors.password = "Password must be at least 6 characters";
}

// Change to 8 characters
if (password.length < 8) {
  newErrors.password = "Password must be at least 8 characters";
}
```

### Email Validation

Email validation uses a simple regex pattern. To use a more strict pattern:

```javascript
// Current
if (!/\S+@\S+\.\S+/.test(email)) {
  newErrors.email = "Email is invalid";
}

// More strict pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailPattern.test(email)) {
  newErrors.email = "Email is invalid";
}
```

## UI Configuration

### Toast Notifications

To change toast notification settings:

Edit the toast calls in `src/views/Auth/SignIn.js` and `src/views/Auth/SignUp.js`:

```javascript
toast({
  title: "Login successful",
  description: `Welcome back, ${result.data.user.name}!`,
  status: "success",
  duration: 3000,        // Change duration (in milliseconds)
  isClosable: true,
  position: "top-right", // Change position: top, top-right, bottom, etc.
});
```

### Loading Text

To change loading button text:

```javascript
// In SignIn.js
<Button
  isLoading={loading}
  loadingText='Signing in...' // Change this text
>
  SIGN IN
</Button>

// In SignUp.js
<Button
  isLoading={loading}
  loadingText='Creating account...' // Change this text
>
  SIGN UP
</Button>
```

## Security Configuration

### Secure Storage (Production Recommendation)

For production environments, consider implementing:

1. **HTTP-Only Cookies**: Store tokens in HTTP-only cookies instead of localStorage
2. **Secure Flag**: Ensure cookies are only sent over HTTPS
3. **SameSite**: Set SameSite attribute for CSRF protection

Example implementation:
```javascript
// Backend sets HTTP-only cookie
response.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 86400000 // 1 day
});
```

### Content Security Policy

Add CSP headers to your deployment:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self' https://api.yourdomain.com;
```

## Development vs Production

### Development Configuration

For local development:
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';
```

### Production Configuration

For production deployment:
```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.yourdomain.com/api';
```

Then set the environment variable in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & deploy → Environment
- AWS: Set in environment configuration

## Debugging

### Enable API Logging

To see all API calls in the console:

Edit `src/services/api.js`:
```javascript
const apiFetch = async (endpoint, options = {}) => {
  console.log('API Call:', endpoint, options); // Add this line
  
  // ... rest of the code
  
  console.log('API Response:', data); // Add this line
  return data;
};
```

### Enable Auth State Logging

To see auth state changes:

Edit `src/contexts/AuthContext.js`:
```javascript
useEffect(() => {
  const initAuth = () => {
    const storedUser = getStoredUser();
    const authenticated = checkAuth();
    
    console.log('Auth Init:', { storedUser, authenticated }); // Add this
    
    if (authenticated && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  initAuth();
}, []);
```

## Testing Configuration

### Mock API for Testing

To use a mock API during testing:

Create `src/services/api.mock.js`:
```javascript
export const mockApiFetch = async (endpoint, options = {}) => {
  // Return mock data based on endpoint
  if (endpoint === '/login') {
    return {
      success: true,
      data: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'mock-token-123'
      }
    };
  }
  // Add more mock responses as needed
};
```

Then in your tests, import the mock instead of the real API.

## Support

For additional configuration assistance, please refer to:
- `API_DOCUMENTATION.mdc` - Backend API documentation
- `AUTH_IMPLEMENTATION.md` - Implementation details
- `src/services/README.md` - Services documentation

