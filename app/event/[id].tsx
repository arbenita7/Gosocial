import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Heart, 
  Share2,
  User
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '@/types/event';
import { mockEvents } from '@/data/mockEvents';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const events = storedEvents ? JSON.parse(storedEvents) : mockEvents;
      const foundEvent = events.find((e: Event) => e.id === id);
      
      if (foundEvent) {
        setEvent(foundEvent);
        setIsRSVPed(foundEvent.isRSVPed);
        setIsFavorite(foundEvent.isFavorite);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  };

  const handleRSVP = async () => {
    if (!event) return;

    const newRSVPStatus = !isRSVPed;
    setIsRSVPed(newRSVPStatus);

    // Update event in storage
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const events = storedEvents ? JSON.parse(storedEvents) : mockEvents;
      const updatedEvents = events.map((e: Event) =>
        e.id === event.id
          ? { 
            ...e, 
            isRSVPed: newRSVPStatus,
            currentAttendees: newRSVPStatus 
              ? e.currentAttendees + 1 
              : Math.max(0, e.currentAttendees - 1)
          }
          : e
      );
      
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Update local state
      setEvent(prev => prev ? {
        ...prev,
        isRSVPed: newRSVPStatus,
        currentAttendees: newRSVPStatus 
          ? prev.currentAttendees + 1 
          : Math.max(0, prev.currentAttendees - 1)
      } : null);

      Alert.alert(
        newRSVPStatus ? 'RSVP Confirmed!' : 'RSVP Cancelled',
        newRSVPStatus 
          ? 'You have successfully RSVP\'d to this event.' 
          : 'Your RSVP has been cancelled.'
      );
    } catch (error) {
      console.error('Error updating RSVP:', error);
      setIsRSVPed(!newRSVPStatus); // Revert on error
    }
  };

  const handleToggleFavorite = async () => {
    if (!event) return;

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const events = storedEvents ? JSON.parse(storedEvents) : mockEvents;
      const updatedEvents = events.map((e: Event) =>
        e.id === event.id ? { ...e, isFavorite: newFavoriteStatus } : e
      );
      
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error updating favorite:', error);
      setIsFavorite(!newFavoriteStatus); // Revert on error
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageSection}>
          <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleToggleFavorite}
            >
              <Heart 
                size={24} 
                color={isFavorite ? '#EC4899' : '#FFFFFF'} 
                fill={isFavorite ? '#EC4899' : 'transparent'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={[
              styles.categoryBadge, 
              { backgroundColor: getCategoryColor(event.category) }
            ]}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={20} color="#8B5CF6" />
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={20} color="#8B5CF6" />
              <Text style={styles.detailText}>{formatTime(event.time)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MapPin size={20} color="#8B5CF6" />
              <Text style={styles.detailText}>{event.location.name}</Text>
            </View>
            
            {event.price > 0 && (
              <View style={styles.detailItem}>
                <DollarSign size={20} color="#8B5CF6" />
                <Text style={styles.detailText}>${event.price}</Text>
              </View>
            )}
          </View>

          <View style={styles.attendanceSection}>
            <View style={styles.attendanceHeader}>
              <Users size={20} color="#6B7280" />
              <Text style={styles.attendanceText}>
                {event.currentAttendees} of {event.maxAttendees} attending
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(attendancePercentage, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizerInfo}>
              <Image source={{ uri: event.organizer.avatar }} style={styles.organizerAvatar} />
              <View>
                <Text style={styles.organizerName}>{event.organizer.name}</Text>
                <Text style={styles.organizerTitle}>Event Organizer</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationInfo}>
              <MapPin size={20} color="#6B7280" />
              <View style={styles.locationText}>
                <Text style={styles.locationName}>{event.location.name}</Text>
                <Text style={styles.locationAddress}>{event.location.address}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[
            styles.rsvpButton,
            isRSVPed && styles.rsvpButtonActive
          ]}
          onPress={handleRSVP}
        >
          <Text style={[
            styles.rsvpButtonText,
            isRSVPed && styles.rsvpButtonTextActive
          ]}>
            {isRSVPed ? '✓ Going' : 'RSVP'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  imageSection: {
    position: 'relative',
    height: 300,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  contentSection: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginRight: 16,
  },
  categoryBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  attendanceSection: {
    marginBottom: 24,
  },
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  attendanceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  organizerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 12,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  organizerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  organizerTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8B5CF6',
  },
  locationSection: {
    marginBottom: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  rsvpButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: '#10B981',
  },
  rsvpButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  rsvpButtonTextActive: {
    color: '#FFFFFF',
  },
});