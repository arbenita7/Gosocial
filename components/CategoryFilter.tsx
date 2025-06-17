import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { EventCategory } from '@/types/event';
import { eventCategories } from '@/data/mockEvents';

interface CategoryFilterProps {
  selectedCategory: EventCategory | 'all';
  onSelectCategory: (category: EventCategory | 'all') => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const allCategories = [{ key: 'all' as const, label: 'All', color: '#6B7280' }, ...eventCategories];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allCategories.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category.key ? category.color : '#F3F4F6',
            },
          ]}
          onPress={() => onSelectCategory(category.key)}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color: selectedCategory === category.key ? '#FFFFFF' : '#6B7280',
              },
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});