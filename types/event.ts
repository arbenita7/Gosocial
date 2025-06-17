export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  category: EventCategory;
  imageUrl: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  isRSVPed: boolean;
  isFavorite: boolean;
}

export type EventCategory = 
  | 'music'
  | 'art'
  | 'food'
  | 'tech'
  | 'sports'
  | 'networking'
  | 'workshop'
  | 'entertainment';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  interests: EventCategory[];
  rsvpedEvents: string[];
  favoriteEvents: string[];
  eventsAttended: number;
}