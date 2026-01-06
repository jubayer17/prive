// Mock API client - replaces base44 SDK
// This provides a standalone implementation without external dependencies

import {
  mockServices,
  mockBarbers,
  mockBlogPosts,
  mockReviews,
  mockMembershipPlans,
  getStoredData,
  setStoredData,
  generateId,
  STORAGE_KEYS
} from './mockData';

// Helper to filter data based on criteria
const filterData = (data, criteria = {}) => {
  return data.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return item[key] === value;
    });
  });
};

// Helper to sort data
const sortData = (data, sortField) => {
  if (!sortField) return data;
  const desc = sortField.startsWith('-');
  const field = desc ? sortField.slice(1) : sortField;
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) return desc ? 1 : -1;
    if (a[field] > b[field]) return desc ? -1 : 1;
    return 0;
  });
};

// Create entity CRUD operations
const createEntity = (entityName, mockData = null, storageKey = null) => ({
  list: async (sort, limit) => {
    let data = storageKey ? getStoredData(storageKey, mockData || []) : (mockData || []);
    data = sortData(data, sort);
    if (limit) data = data.slice(0, limit);
    return data;
  },
  filter: async (criteria = {}, sort) => {
    let data = storageKey ? getStoredData(storageKey, mockData || []) : (mockData || []);
    data = filterData(data, criteria);
    data = sortData(data, sort);
    return data;
  },
  create: async (newData) => {
    const item = { ...newData, id: generateId(), created_date: new Date().toISOString() };
    if (storageKey) {
      const existing = getStoredData(storageKey, []);
      setStoredData(storageKey, [...existing, item]);
    }
    return item;
  },
  update: async (id, updateData) => {
    if (storageKey) {
      const existing = getStoredData(storageKey, []);
      const index = existing.findIndex(item => item.id === id);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...updateData };
        setStoredData(storageKey, existing);
        return existing[index];
      }
    }
    return { id, ...updateData };
  },
  delete: async (id) => {
    if (storageKey) {
      const existing = getStoredData(storageKey, []);
      setStoredData(storageKey, existing.filter(item => item.id !== id));
    }
    return { success: true };
  },
  get: async (id) => {
    const data = storageKey ? getStoredData(storageKey, mockData || []) : (mockData || []);
    return data.find(item => item.id === id) || null;
  }
});

// Mock user for demo purposes
const getMockUser = () => getStoredData(STORAGE_KEYS.USER, null);
const setMockUser = (user) => setStoredData(STORAGE_KEYS.USER, user);

// Auth mock
const auth = {
  me: async () => {
    const user = getMockUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return user;
  },
  login: async (email, password) => {
    // Demo login - accept any credentials
    const user = {
      id: generateId(),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : (email.includes('editor') ? 'editor' : 'user'),
      created_date: new Date().toISOString()
    };
    setMockUser(user);
    return user;
  },
  logout: async (redirectUrl = '/') => {
    setStoredData(STORAGE_KEYS.USER, null);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },
  redirectToLogin: () => {
    // For demo, show a simple login prompt
    const email = window.prompt('Enter your email to login (demo mode):');
    if (email) {
      const user = {
        id: generateId(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : (email.includes('editor') ? 'editor' : 'user'),
        created_date: new Date().toISOString()
      };
      setMockUser(user);
      window.location.reload();
    }
  }
};

// Integrations mock
const integrations = {
  Core: {
    SendEmail: async ({ to, subject, body }) => {
      console.log('Mock email sent:', { to, subject, body });
      return { success: true, message: 'Email logged (demo mode)' };
    },
    InvokeLLM: async ({ prompt }) => {
      console.log('Mock LLM invoked:', prompt);
      return { response: 'This is a demo response. LLM integration is not available in standalone mode.' };
    },
    UploadFile: async (file) => {
      console.log('Mock file upload:', file.name);
      return { url: URL.createObjectURL(file), filename: file.name };
    },
    GenerateImage: async ({ prompt }) => {
      console.log('Mock image generation:', prompt);
      return { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400' };
    },
    ExtractDataFromUploadedFile: async (fileUrl) => {
      console.log('Mock data extraction:', fileUrl);
      return { data: {} };
    },
    CreateFileSignedUrl: async (filename) => {
      console.log('Mock signed URL:', filename);
      return { url: '#' };
    },
    UploadPrivateFile: async (file) => {
      console.log('Mock private file upload:', file.name);
      return { url: URL.createObjectURL(file), filename: file.name };
    }
  }
};

// Main client export
export const base44 = {
  entities: {
    Service: createEntity('Service', mockServices),
    Barber: createEntity('Barber', mockBarbers),
    BlogPost: createEntity('BlogPost', mockBlogPosts, STORAGE_KEYS.BLOG_POSTS),
    Review: createEntity('Review', mockReviews),
    Booking: createEntity('Booking', [], STORAGE_KEYS.BOOKINGS),
    Membership: createEntity('Membership', mockMembershipPlans, STORAGE_KEYS.MEMBERSHIPS),
    GiftCard: createEntity('GiftCard', [], STORAGE_KEYS.GIFT_CARDS),
    Payment: createEntity('Payment', [], STORAGE_KEYS.PAYMENTS),
    User: createEntity('User', [], STORAGE_KEYS.USER)
  },
  auth,
  integrations
};
