import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Heart, DollarSign } from 'lucide-react-native';
import { Event } from '@/types/event';
import { router } from 'expo-router';

interface EventCardProps {
  event: Event;
  onToggleFavorite?: (eventId: string) => void;
}

export default function EventCard({ event, onToggleFavorite }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleFavoritePress = () => {
    onToggleFavorite?.(event.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Heart 
            size={20} 
            color={event.isFavorite ? '#EC4899' : '#FFFFFF'} 
            fill={event.isFavorite ? '#EC4899' : 'transparent'}
          />
        </TouchableOpacity>
        <View style={styles.dateTag}>
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText} numberOfLines={1}>{event.location.name}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={14} color="#6B7280" />
            <Text style={styles.detailText}>
              {event.currentAttendees}/{event.maxAttendees}
            </Text>
          </View>
          
          {event.price > 0 && (
            <View style={styles.detailItem}>
              <DollarSign size={14} color="#6B7280" />
              <Text style={styles.detailText}>${event.price}</Text>
            </View>
          )}
        </View>
        
        {event.isRSVPed && (
          <View style={styles.rsvpBadge}>
            <Text style={styles.rsvpText}>✓ Going</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    music: '#8B5CF6',
    art: '#EC4899',
    food: '#F97316',
    tech: '#3B82F6',
    sports: '#10B981',
    networking: '#F59E0B',
    workshop: '#EF4444',
    entertainment: '#8B5CF6',
  };
  return colors[category] || '#8B5CF6';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  dateTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginRight: 8,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    maxWidth: 120,
  },
  rsvpBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  rsvpText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
});