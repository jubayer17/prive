// Mock data for the application
// This replaces the base44 backend with local data

export const mockServices = [
  {
    id: '1',
    name: 'Classic Haircut',
    description: 'Traditional haircut with precision cutting and styling',
    duration: 30,
    price: 35,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400',
    category: 'haircut',
    is_active: true,
    gender: 'male'
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Professional beard shaping and trimming',
    duration: 20,
    price: 20,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
    category: 'beard',
    is_active: true,
    gender: 'male'
  },
  {
    id: '3',
    name: 'Hot Towel Shave',
    description: 'Relaxing traditional hot towel shave experience',
    duration: 45,
    price: 45,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    category: 'shave',
    is_active: true,
    gender: 'male'
  },
  {
    id: '4',
    name: 'Hair & Beard Combo',
    description: 'Complete grooming package with haircut and beard styling',
    duration: 60,
    price: 55,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
    category: 'combo',
    is_active: true,
    gender: 'male'
  },
  {
    id: '5',
    name: 'Kids Haircut',
    description: 'Gentle haircut service for children under 12',
    duration: 25,
    price: 25,
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400',
    category: 'haircut',
    is_active: true,
    gender: 'unisex'
  },
  {
    id: '6',
    name: 'Premium Styling',
    description: 'Advanced styling with premium products',
    duration: 45,
    price: 50,
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400',
    category: 'styling',
    is_active: true,
    gender: 'male'
  }
];

export const mockBarbers = [
  {
    id: '1',
    name: 'James Wilson',
    bio: 'Master barber with 15 years of experience. Specializes in classic cuts and hot towel shaves.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    specialty: 'Classic Cuts',
    experience_years: 15,
    rating: 4.9,
    reviews_count: 234,
    is_active: true,
    availability: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '16:00' }
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    bio: 'Trendsetter and modern style expert. Known for creative fades and contemporary looks.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    specialty: 'Modern Fades',
    experience_years: 8,
    rating: 4.8,
    reviews_count: 187,
    is_active: true,
    availability: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '17:00' }
    }
  },
  {
    id: '3',
    name: 'David Thompson',
    bio: 'Beard specialist and grooming consultant. Expert in beard shaping and maintenance.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    specialty: 'Beard Styling',
    experience_years: 12,
    rating: 4.7,
    reviews_count: 156,
    is_active: true,
    availability: {
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '15:00' }
    }
  }
];

export const mockBlogPosts = [
  {
    id: '1',
    title: 'Top Hair Trends for 2026',
    excerpt: 'Discover the latest hairstyle trends that are dominating the grooming scene this year.',
    content: `# Top Hair Trends for 2026

The grooming industry is constantly evolving, and 2026 brings exciting new trends that blend classic sophistication with modern edge.

## 1. The Textured Crop
This versatile cut features short sides with textured length on top. It works great for various face shapes and requires minimal styling.

## 2. Modern Mullet
Yes, the mullet is back! But this time with a refined twist - shorter, more blended, and incredibly stylish.

## 3. Natural Curls
Embracing your natural texture is more popular than ever. Let those curls shine with proper care and minimal manipulation.

## 4. Clean Fades
Precision fades continue to dominate, with skin fades being particularly popular for their sharp, clean look.

Visit us at Privé to get any of these trending styles from our expert barbers!`,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
    category: 'trends',
    author: 'James Wilson',
    published_date: '2026-01-05',
    is_published: true
  },
  {
    id: '2',
    title: 'Beard Care 101: Essential Tips',
    excerpt: 'Learn the fundamentals of maintaining a healthy, great-looking beard.',
    content: `# Beard Care 101: Essential Tips

A well-maintained beard can transform your appearance. Here's everything you need to know about proper beard care.

## Washing Your Beard
Use a dedicated beard wash 2-3 times per week. Regular shampoo can strip natural oils and dry out your facial hair.

## Conditioning
Beard oil and balm are essential. Apply daily to keep your beard soft, moisturized, and manageable.

## Trimming
Regular trims every 2-3 weeks keep your beard looking neat. Invest in quality trimming tools or visit your barber.

## Brushing
Use a boar bristle brush to distribute oils evenly and train your beard hairs to grow in the right direction.

Book a beard consultation with our specialists at Privé!`,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    category: 'tips',
    author: 'David Thompson',
    published_date: '2026-01-03',
    is_published: true
  },
  {
    id: '3',
    title: 'Finding the Right Haircut for Your Face Shape',
    excerpt: 'A guide to choosing the perfect hairstyle based on your facial features.',
    content: `# Finding the Right Haircut for Your Face Shape

The right haircut can enhance your best features. Here's how to choose based on your face shape.

## Oval Face
Lucky you! Most styles work well. Experiment with different lengths and textures.

## Round Face
Add height on top and keep sides shorter to elongate your face. Avoid rounded styles.

## Square Face
Soften angular features with textured styles. Avoid boxy cuts that emphasize squareness.

## Heart Face
Balance a wider forehead with volume at the jawline. Side parts work particularly well.

## Oblong Face
Add width with volume on the sides. Avoid too much height on top.

Not sure about your face shape? Visit Privé for a personalized consultation!`,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
    category: 'guide',
    author: 'Michael Chen',
    published_date: '2026-01-01',
    is_published: true
  }
];

export const mockReviews = [
  {
    id: '1',
    barber_id: '1',
    customer_name: 'John D.',
    rating: 5,
    comment: 'James is an absolute master! Best haircut I\'ve ever had. Will definitely be back.',
    created_date: '2026-01-04',
    is_approved: true
  },
  {
    id: '2',
    barber_id: '2',
    customer_name: 'Mike S.',
    rating: 5,
    comment: 'Michael understood exactly what I wanted. The fade is perfect!',
    created_date: '2026-01-03',
    is_approved: true
  },
  {
    id: '3',
    barber_id: '3',
    customer_name: 'Robert K.',
    rating: 5,
    comment: 'David transformed my beard completely. Great attention to detail.',
    created_date: '2026-01-02',
    is_approved: true
  },
  {
    id: '4',
    barber_id: '1',
    customer_name: 'Alex P.',
    rating: 4,
    comment: 'Great experience overall. The shop has a really nice atmosphere.',
    created_date: '2026-01-01',
    is_approved: true
  }
];

export const mockMembershipPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    interval: 'month',
    description: 'Perfect for regular maintenance',
    features: ['2 haircuts per month', '10% off products', 'Priority booking']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 89,
    interval: 'month',
    description: 'For the discerning gentleman',
    features: ['Unlimited haircuts', 'Free beard trims', '20% off products', 'Priority booking', 'Free hot towel service']
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    interval: 'month',
    description: 'The ultimate grooming experience',
    features: ['Unlimited services', 'Complimentary beverages', '30% off products', 'Priority booking', 'Exclusive events access', 'Personal grooming consultant']
  }
];

// Local storage keys
const STORAGE_KEYS = {
  BOOKINGS: 'prive_bookings',
  MEMBERSHIPS: 'prive_memberships',
  GIFT_CARDS: 'prive_gift_cards',
  PAYMENTS: 'prive_payments',
  USER: 'prive_user'
};

// Helper to get data from localStorage
export const getStoredData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to set data to localStorage
export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export { STORAGE_KEYS };
