// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Bell, Search, Filter } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Food', icon: '🍽️' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'ramen', name: 'Ramen', icon: '🍜' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'asian', name: 'Asian', icon: '🍣' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleRestaurantPress = (restaurantId: string) => {
    // Navigate to detail view
    navigation.navigate('RestaurantDetail', { restaurantId });
  };

  const handleSearchPress = () => {
    // Navigate to Search tab inside Tabs navigator
    navigation.navigate('Tabs', { screen: 'Search' });
  };

  // Filter restaurants based on category name matching in cuisine
  const filteredRestaurants = MOCK_RESTAURANTS.filter((r) => {
    if (selectedCategory === 'all') return true;
    const catName = CATEGORIES.find((c) => c.id === selectedCategory)?.name ?? '';
    return r.cuisine.some((c) => c.toLowerCase() === catName.toLowerCase());
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Fixed Header Row */}
      <View className="px-6 pt-2 pb-4 flex-row items-center justify-between bg-white border-b border-neutral-100">
        <View>
          <View className="flex-row items-center">
            <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Deliver to
            </Text>
            <MapPin size={12} color={colors.primary} className="ml-1" />
          </View>
          <TouchableOpacity className="flex-row items-center mt-0.5">
            <Text className="text-sm font-extrabold text-neutral-900">
              Alex's Home - Brooklyn
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bell Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-10 h-10 border border-neutral-200 rounded-full items-center justify-center relative bg-white"
        >
          <Bell size={20} color="#2E2820" />
          {/* Notification bubble overlay */}
          <View className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full" />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Area */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="py-5">
          {/* Headline block */}
          <View className="px-6 mb-5">
            <Text className="text-xl font-bold text-neutral-400">Hello Alex,</Text>
            <Text className="text-3xl font-extrabold text-neutral-950 mt-1">
              Find your favorite bite
            </Text>
          </View>

          {/* Dummy Search bar redirecting inputs */}
          <View className="px-6 mb-6">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSearchPress}
              className="w-full h-13 border border-neutral-200 bg-white rounded-2xl flex-row items-center px-4 shadow-sm shadow-neutral-100"
            >
              <Search size={20} color="#8C8278" />
              <Text className="flex-1 text-sm text-neutral-400 ml-3">
                Search restaurants, dishes...
              </Text>
              <View className="w-8 h-8 bg-primary-50 rounded-xl items-center justify-center">
                <Filter size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Categories slide */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-neutral-950 px-6 mb-3">
              Popular Categories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`flex-row items-center px-4 py-2.5 rounded-full mr-3 border ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text className="text-base mr-1.5">{cat.icon}</Text>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Promoted / Featured scroll list */}
          {selectedCategory === 'all' && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between px-6 mb-3">
                <Text className="text-lg font-bold text-neutral-950">Featured Offers</Text>
                <TouchableOpacity>
                  <Text className="text-xs font-bold text-primary">See All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {MOCK_RESTAURANTS.map((res) => (
                  <RestaurantCard
                    key={`promoted-${res.id}`}
                    restaurant={res}
                    layout="horizontal"
                    onPress={() => handleRestaurantPress(res.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* All Restaurants Feed */}
          <View className="px-6">
            <Text className="text-lg font-bold text-neutral-950 mb-3">
              {selectedCategory === 'all' ? 'All Restaurants' : `Results for ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
            </Text>

            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((res) => (
                <RestaurantCard
                  key={res.id}
                  restaurant={res}
                  layout="vertical"
                  onPress={() => handleRestaurantPress(res.id)}
                />
              ))
            ) : (
              <View className="py-8 items-center bg-white border border-neutral-200 rounded-2xl">
                <Text className="text-sm font-medium text-neutral-500">
                  No restaurants in this category yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
