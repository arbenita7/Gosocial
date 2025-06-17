import { UserProfile } from '@/types/event';

export const mockUser: UserProfile = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
  bio: 'Event enthusiast who loves discovering new experiences in the city. Passionate about music, tech, and connecting with like-minded people.',
  interests: ['music', 'tech', 'food', 'art'],
  rsvpedEvents: ['2', '5'],
  favoriteEvents: ['2', '3'],
  eventsAttended: 23,
};