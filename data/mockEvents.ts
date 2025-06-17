import { Event, EventCategory } from '@/types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2025',
    description: 'Join us for an unforgettable night of live music featuring top local and international artists. Experience amazing performances across multiple stages with food trucks and craft vendors.',
    date: '2025-06-15',
    time: '18:00',
    location: {
      name: 'Central Park',
      address: '1 Central Park West, New York, NY 10023',
      coordinates: { latitude: 40.7829, longitude: -73.9654 }
    },
    category: 'music' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    price: 45,
    maxAttendees: 5000,
    currentAttendees: 3247,
    organizer: {
      id: 'org1',
      name: 'NYC Events',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    },
    tags: ['live music', 'outdoor', 'festival', 'summer'],
    isRSVPed: false,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Tech Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors and industry experts. Network with entrepreneurs, developers, and investors in the tech space.',
    date: '2025-02-28',
    time: '19:00',
    location: {
      name: 'Innovation Hub',
      address: '123 Tech Street, San Francisco, CA 94107',
      coordinates: { latitude: 37.7749, longitude: -122.4194 }
    },
    category: 'tech' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
    price: 25,
    maxAttendees: 200,
    currentAttendees: 156,
    organizer: {
      id: 'org2',
      name: 'StartupSF',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
    },
    tags: ['networking', 'startups', 'pitch', 'investors'],
    isRSVPed: true,
    isFavorite: true
  },
  {
    id: '3',
    title: 'Artisan Food Market',
    description: 'Discover local flavors and artisanal foods from the best vendors in the city. Enjoy live cooking demonstrations, tastings, and workshops.',
    date: '2025-03-10',
    time: '10:00',
    location: {
      name: 'Downtown Plaza',
      address: '456 Market Square, Portland, OR 97201',
      coordinates: { latitude: 45.5152, longitude: -122.6784 }
    },
    category: 'food' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/1707310/pexels-photo-1707310.jpeg',
    price: 0,
    maxAttendees: 1000,
    currentAttendees: 234,
    organizer: {
      id: 'org3',
      name: 'Portland Markets',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg'
    },
    tags: ['food', 'local', 'artisan', 'free'],
    isRSVPed: false,
    isFavorite: true
  },
  {
    id: '4',
    title: 'Modern Art Exhibition Opening',
    description: 'Explore contemporary works by emerging artists in this exclusive gallery opening. Meet the artists and enjoy complimentary refreshments.',
    date: '2025-03-05',
    time: '17:00',
    location: {
      name: 'Metropolitan Gallery',
      address: '789 Art Avenue, New York, NY 10001',
      coordinates: { latitude: 40.7505, longitude: -73.9934 }
    },
    category: 'art' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/1742370/pexels-photo-1742370.jpeg',
    price: 15,
    maxAttendees: 150,
    currentAttendees: 89,
    organizer: {
      id: 'org4',
      name: 'Metro Gallery',
      avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg'
    },
    tags: ['art', 'exhibition', 'gallery', 'contemporary'],
    isRSVPed: false,
    isFavorite: false
  },
  {
    id: '5',
    title: 'Basketball Championship Finals',
    description: 'Witness the city championship finals between our top two teams. Exciting gameplay guaranteed with food concessions and team merchandise available.',
    date: '2025-04-20',
    time: '20:00',
    location: {
      name: 'Sports Arena',
      address: '321 Stadium Drive, Los Angeles, CA 90015',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    category: 'sports' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
    price: 35,
    maxAttendees: 8000,
    currentAttendees: 7234,
    organizer: {
      id: 'org5',
      name: 'LA Sports',
      avatar: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg'
    },
    tags: ['basketball', 'championship', 'sports', 'finals'],
    isRSVPed: true,
    isFavorite: false
  },
  {
    id: '6',
    title: 'Digital Marketing Workshop',
    description: 'Learn the latest digital marketing strategies from industry experts. Hands-on sessions covering social media, SEO, and content marketing.',
    date: '2025-03-15',
    time: '09:00',
    location: {
      name: 'Business Center',
      address: '654 Corporate Blvd, Austin, TX 78701',
      coordinates: { latitude: 30.2672, longitude: -97.7431 }
    },
    category: 'workshop' as EventCategory,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    price: 75,
    maxAttendees: 50,
    currentAttendees: 32,
    organizer: {
      id: 'org6',
      name: 'Digital Pro',
      avatar: 'https://images.pexels.com/photos/1040884/pexels-photo-1040884.jpeg'
    },
    tags: ['workshop', 'marketing', 'digital', 'business'],
    isRSVPed: false,
    isFavorite: false
  }
];

export const eventCategories: { key: EventCategory; label: string; color: string }[] = [
  { key: 'music', label: 'Music', color: '#8B5CF6' },
  { key: 'art', label: 'Art', color: '#EC4899' },
  { key: 'food', label: 'Food', color: '#F97316' },
  { key: 'tech', label: 'Tech', color: '#3B82F6' },
  { key: 'sports', label: 'Sports', color: '#10B981' },
  { key: 'networking', label: 'Networking', color: '#F59E0B' },
  { key: 'workshop', label: 'Workshop', color: '#EF4444' },
  { key: 'entertainment', label: 'Entertainment', color: '#8B5CF6' },
];