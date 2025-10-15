# Services Directory

This directory contains service modules for handling API communications.

## Files

### `api.js`
Base API configuration and fetch wrapper.

**Configuration:**
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

**Usage:**
```javascript
import apiFetch from './api';

// Make API call with automatic token inclusion
const data = await apiFetch('/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
});

// Make API call without authentication
const data = await apiFetch('/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
  skipAuth: true,
});
```

### `authService.js`
Authentication service with all auth-related functions.

**Available Functions:**

1. **registerUser(userData)**
   ```javascript
   const data = await registerUser({
     name: 'John Doe',
     email: 'john@example.com',
     password: 'password123',
     password_confirmation: 'password123',
     role: 'staff' // optional
   });
   ```

2. **loginUser(credentials)**
   ```javascript
   const data = await loginUser({
     email: 'john@example.com',
     password: 'password123',
     remember_me: true // optional
   });
   ```

3. **logoutUser()**
   ```javascript
   await logoutUser();
   ```

4. **getUserProfile()**
   ```javascript
   const user = await getUserProfile();
   ```

5. **updateUserProfile(profileData)**
   ```javascript
   const user = await updateUserProfile({
     name: 'John Smith',
     email: 'johnsmith@example.com'
   });
   ```

6. **changePassword(passwordData)**
   ```javascript
   const message = await changePassword({
     current_password: 'oldpass123',
     password: 'newpass123',
     password_confirmation: 'newpass123'
   });
   ```

7. **Utility Functions**
   ```javascript
   import {
     isAuthenticated,
     getStoredUser,
     isAdmin,
     isStaff
   } from './authService';

   // Check if user is logged in
   if (isAuthenticated()) {
     console.log('User is authenticated');
   }

   // Get stored user data
   const user = getStoredUser();

   // Check user roles
   if (isAdmin()) {
     console.log('User is admin');
   }
   ```

## Adding New Services

To add a new service module:

1. Create a new file in this directory (e.g., `customerService.js`)
2. Import `apiFetch` from `api.js`
3. Create and export your service functions

Example:
```javascript
// customerService.js
import apiFetch from './api';

export const getCustomers = async () => {
  const data = await apiFetch('/customers', {
    method: 'GET',
  });
  return data;
};

export const createCustomer = async (customerData) => {
  const data = await apiFetch('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
  return data;
};
```

## Error Handling

All service functions throw errors that should be caught:

```javascript
try {
  const data = await loginUser(credentials);
  console.log('Success:', data);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Token Management

Tokens are automatically:
- Stored in `localStorage` after login/register
- Included in all authenticated requests
- Removed from `localStorage` after logout

You don't need to manually manage tokens unless you have special requirements.

