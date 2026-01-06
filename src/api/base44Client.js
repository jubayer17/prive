import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6952cc08d56d26289d2cf3bb", 
  requiresAuth: true // Ensure authentication is required for all operations
});
