# Authentication Implementation Guide

## Overview

This document describes the authentication system implementation for the POS Dashboard application. The implementation follows the API specification in `API_DOCUMENTATION.mdc` and provides a complete authentication flow including login, signup, logout, and protected routes.

## Features Implemented

✅ **User Authentication**
- Login with email and password
- User registration with name, email, and password
- Remember me functionality (extends token to 30 days)
- Logout functionality
- Token-based authentication using Bearer tokens

✅ **Protected Routes**
- Automatic redirect to login for unauthenticated users
- Protected admin and RTL routes
- Route-level authentication checks

✅ **User Interface**
- Form validation with error messages
- Loading states for async operations
- Toast notifications for success/error messages
- User dropdown menu in navbar with logout option

✅ **State Management**
- Global authentication context using React Context API
- Persistent authentication state in localStorage
- Automatic token management

## Architecture

### 1. Service Layer (`src/services/`)

#### `api.js`
Base API configuration and fetch wrapper that:
- Handles common HTTP configurations
- Automatically includes authentication tokens
- Manages error responses
- Base URL: `http://127.0.0.1:8000/api`

#### `authService.js`
Authentication service providing functions for:
- `registerUser()` - Register new user
- `loginUser()` - Authenticate user
- `logoutUser()` - Invalidate user session
- `getUserProfile()` - Get user profile data
- `updateUserProfile()` - Update user information
- `changePassword()` - Change user password
- `testAuth()` - Test authentication status
- `isAuthenticated()` - Check if user is logged in
- `getStoredUser()` - Get user data from localStorage
- `isAdmin()` - Check if user has admin role
- `isStaff()` - Check if user has staff role

### 2. Context Layer (`src/contexts/`)

#### `AuthContext.js`
Global authentication state management providing:
- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Authentication status
- `login(email, password, rememberMe)` - Login function
- `register(name, email, password, passwordConfirmation, role)` - Register function
- `logout()` - Logout function
- `refreshProfile()` - Refresh user profile

### 3. Component Layer

#### `src/views/Auth/SignIn.js`
Login page with:
- Email and password inputs
- Remember me checkbox
- Form validation
- Error handling
- Loading states
- Navigation to signup page

#### `src/views/Auth/SignUp.js`
Registration page with:
- Name, email, and password inputs
- Remember me checkbox
- Form validation
- Error handling
- Loading states
- Navigation to signin page

#### `src/components/ProtectedRoute/ProtectedRoute.js`
Route protection component that:
- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state during auth check

#### `src/components/Navbars/AdminNavbarLinks.js`
Updated navbar with:
- User dropdown menu showing user name
- Profile and Settings menu items
- Logout button
- Conditional rendering based on auth status

## Usage Examples

### 1. Login

```javascript
import { useAuth } from 'contexts/AuthContext';

function LoginForm() {
  const { login } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123', true);
    
    if (result.success) {
      // Login successful
      console.log('Welcome', result.data.user.name);
    } else {
      // Login failed
      console.error(result.error);
    }
  };
}
```

### 2. Register

```javascript
import { useAuth } from 'contexts/AuthContext';

function RegisterForm() {
  const { register } = useAuth();

  const handleRegister = async () => {
    const result = await register(
      'John Doe',
      'john@example.com',
      'password123',
      'password123',
      'staff'
    );
    
    if (result.success) {
      // Registration successful
      console.log('Account created for', result.data.user.name);
    } else {
      // Registration failed
      console.error(result.error);
    }
  };
}
```

### 3. Logout

```javascript
import { useAuth } from 'contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };
}
```

### 4. Access User Data

```javascript
import { useAuth } from 'contexts/AuthContext';

function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role_display}</p>
    </div>
  );
}
```

### 5. Check User Role

```javascript
import { isAdmin, isStaff } from 'services/authService';

function AdminPanel() {
  if (!isAdmin()) {
    return <div>Access denied. Admin only.</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

## API Endpoints Used

The implementation uses the following API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/register` | POST | Register new user |
| `/login` | POST | Authenticate user |
| `/logout` | POST | Invalidate session |
| `/profile` | GET | Get user profile |
| `/profile` | PUT | Update user profile |
| `/change-password` | POST | Change password |
| `/user` | GET | Test authentication |

## Token Management

### Storage
- **Token**: Stored in `localStorage` as `auth_token`
- **User Data**: Stored in `localStorage` as `user` (JSON string)

### Token Inclusion
All authenticated API requests automatically include the token in the Authorization header:
```
Authorization: Bearer {token}
```

### Token Expiration
- Default: 1 day (86400 seconds)
- With "Remember Me": 30 days (2592000 seconds)

## Security Considerations

1. **HTTPS Required**: In production, ensure the API uses HTTPS
2. **Token Storage**: Consider using httpOnly cookies for enhanced security
3. **Password Requirements**: Minimum 6 characters (enforced in frontend)
4. **Input Validation**: Both frontend and backend validation
5. **CORS Configuration**: Ensure proper CORS settings on the backend

## Testing the Implementation

### 1. Start the Backend API
Ensure the Laravel backend is running at `http://127.0.0.1:8000`

### 2. Start the Frontend
```bash
npm start
```

### 3. Test Registration
1. Navigate to the signup page
2. Fill in name, email, and password
3. Check "Remember me" if desired
4. Click "SIGN UP"
5. You should be redirected to the dashboard

### 4. Test Login
1. Navigate to the signin page
2. Enter email and password
3. Check "Remember me" if desired
4. Click "SIGN IN"
5. You should be redirected to the dashboard

### 5. Test Protected Routes
1. While logged out, try to access `/admin/dashboard`
2. You should be redirected to `/auth/signin`
3. After login, you should be able to access protected routes

### 6. Test Logout
1. Click on your name in the navbar
2. Click "Logout"
3. You should be redirected to the signin page

## Form Validation

### Sign In
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters

### Sign Up
- **Name**: Required, minimum 2 characters
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters

## Error Handling

The implementation handles various error scenarios:

1. **Network Errors**: Displayed via toast notifications
2. **Validation Errors**: Shown inline below form fields
3. **Authentication Errors**: Invalid credentials, expired tokens
4. **Server Errors**: Generic error messages for 500 errors

## Integration Points

### Components That Need Auth
If you need to access authentication in other components:

```javascript
import { useAuth } from 'contexts/AuthContext';

function YourComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Your component logic
}
```

### Making Authenticated API Calls
For additional API calls that require authentication:

```javascript
import apiFetch from 'services/api';

const getCustomers = async () => {
  try {
    const data = await apiFetch('/customers', {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};
```

## Troubleshooting

### Token Not Being Sent
- Check that `localStorage.getItem('auth_token')` returns a valid token
- Verify the Authorization header is being set in network tab

### Redirects Not Working
- Ensure `useHistory` from `react-router-dom` is used correctly
- Check that routes are properly configured in `src/index.js`

### User State Not Persisting
- Clear localStorage and try logging in again
- Check browser console for any errors during auth initialization

### API Connection Issues
- Verify backend is running on `http://127.0.0.1:8000`
- Check CORS configuration on the backend
- Ensure API endpoints match the documentation

## Future Enhancements

Potential improvements to consider:

1. **Refresh Token**: Implement token refresh mechanism
2. **Password Recovery**: Add forgot password functionality
3. **Two-Factor Authentication**: Add 2FA support
4. **Session Timeout**: Auto-logout on inactivity
5. **Better Loading States**: Skeleton loaders instead of text
6. **Email Verification**: Require email verification for new accounts
7. **Social Login**: Add OAuth providers (Google, Facebook, etc.)
8. **Role-Based Access Control**: More granular permission system

## File Structure

```
src/
├── services/
│   ├── api.js                    # Base API configuration
│   └── authService.js            # Authentication service functions
├── contexts/
│   └── AuthContext.js            # Global auth state management
├── components/
│   ├── ProtectedRoute/
│   │   └── ProtectedRoute.js     # Protected route wrapper
│   └── Navbars/
│       └── AdminNavbarLinks.js   # Updated navbar with user menu
└── views/
    └── Auth/
        ├── SignIn.js             # Login page
        └── SignUp.js             # Registration page
```

## API Configuration

To change the API base URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## Conclusion

This authentication implementation provides a solid foundation for user management in the POS Dashboard application. It follows React best practices, includes proper error handling, and is fully integrated with the backend API as documented in `API_DOCUMENTATION.mdc`.

For questions or issues, please refer to the API documentation or contact the development team.

