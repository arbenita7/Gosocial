import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/event';
import { mockEvents } from '@/data/mockEvents';

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents(mockEvents);
    }
  };

  const handleToggleFavorite = async (eventId: string) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    );
    setEvents(updatedEvents);
    
    try {
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const days = getDaysInMonth(currentDate);
  const today = formatDate(new Date());
  const currentMonth = currentDate.getMonth();
  
  const eventsForSelectedDate = selectedDate ? getEventsForDate(selectedDate) : [];
  const allUpcomingEvents = events
    .filter(event => event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Calendar</Text>
        
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <ChevronLeft size={24} color="#8B5CF6" />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>{formatDisplayDate(currentDate)}</Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <ChevronRight size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendar}>
          <View style={styles.weekHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const dateString = formatDate(day);
              const dayEvents = getEventsForDate(dateString);
              const isCurrentMonth = day.getMonth() === currentMonth;
              const isToday = dateString === today;
              const isSelected = dateString === selectedDate;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    !isCurrentMonth && styles.dayButtonDisabled,
                    isToday && styles.dayButtonToday,
                    isSelected && styles.dayButtonSelected,
                  ]}
                  onPress={() => setSelectedDate(isSelected ? null : dateString)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrentMonth && styles.dayTextDisabled,
                      isToday && styles.dayTextToday,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedDate && eventsForSelectedDate.length > 0 && (
          <View style={styles.selectedDateEvents}>
            <Text style={styles.sectionTitle}>
              Events on {new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            {eventsForSelectedDate.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </View>
        )}

        {!selectedDate && (
          <View style={styles.upcomingEvents}>
            <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
            {allUpcomingEvents.length > 0 ? (
              allUpcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <CalendarIcon size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No upcoming events</Text>
                <Text style={styles.emptyText}>Check back later for new events</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 8,
    margin: 1,
  },
  dayButtonDisabled: {
    opacity: 0.3,
  },
  dayButtonToday: {
    backgroundColor: '#EEF2FF',
  },
  dayButtonSelected: {
    backgroundColor: '#8B5CF6',
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  dayTextDisabled: {
    color: '#9CA3AF',
  },
  dayTextToday: {
    color: '#8B5CF6',
    fontFamily: 'Inter-Bold',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC4899',
  },
  selectedDateEvents: {
    marginVertical: 16,
  },
  upcomingEvents: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});