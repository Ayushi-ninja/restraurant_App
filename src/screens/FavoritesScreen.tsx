// src/screens/FavoritesScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { Heart, HeartOff, Store, Utensils } from 'lucide-react-native';

import { useUserStore } from '../store/userStore';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { MOCK_MENU_ITEMS } from '../data/menuItems';
import { colors } from '../theme/colors';
import RestaurantCard from '../components/RestaurantCard';

type TabKey = 'restaurants' | 'dishes';

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabKey>('restaurants');

  const favoriteRestaurantIds = useUserStore((s) => s.favoriteRestaurantIds);
  const favoriteDishIds = useUserStore((s) => s.favoriteDishIds);
  const toggleFavoriteRestaurant = useUserStore((s) => s.toggleFavoriteRestaurant);
  const toggleFavoriteDish = useUserStore((s) => s.toggleFavoriteDish);

  const favRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => favoriteRestaurantIds.includes(r.id));
  }, [favoriteRestaurantIds]);

  const favDishes = useMemo(() => {
    return MOCK_MENU_ITEMS.filter((d) => favoriteDishIds.includes(d.id));
  }, [favoriteDishIds]);

  const renderRestaurants = () => {
    if (favRestaurants.length === 0) {
      return (
        <View className="py-24 items-center justify-center px-8">
          <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-5">
            <Store size={36} color="#D4CCC2" />
          </View>
          <Text className="text-lg font-bold text-neutral-900 mb-2">No Saved Restaurants</Text>
          <Text className="text-sm text-neutral-500 text-center leading-5">
            Tap the heart icon on any restaurant to save it for quick access later.
          </Text>
        </View>
      );
    }

    return (
      <View className="px-5 pt-4 pb-20">
        {favRestaurants.map((r) => (
          <View key={r.id} className="relative mb-5">
            <RestaurantCard
              restaurant={r}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: r.id })}
            />
            <TouchableOpacity
              onPress={() => toggleFavoriteRestaurant(r.id)}
              className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full items-center justify-center"
            >
              <Heart size={20} color={colors.primary} fill={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderDishes = () => {
    if (favDishes.length === 0) {
      return (
        <View className="py-24 items-center justify-center px-8">
          <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-5">
            <Utensils size={36} color="#D4CCC2" />
          </View>
          <Text className="text-lg font-bold text-neutral-900 mb-2">No Saved Dishes</Text>
          <Text className="text-sm text-neutral-500 text-center leading-5">
            Keep track of your favorite meals by tapping the heart icon on the menu.
          </Text>
        </View>
      );
    }

    return (
      <View className="px-5 pt-4 pb-20">
        <View className="flex-row flex-wrap justify-between">
          {favDishes.map((dish) => {
            const restaurant = MOCK_RESTAURANTS.find((r) => r.id === dish.restaurantId);
            return (
              <TouchableOpacity
                key={dish.id}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: dish.restaurantId })}
                activeOpacity={0.8}
                className="w-[48%] bg-white rounded-2xl mb-4 border border-neutral-100 overflow-hidden relative"
              >
                <Image source={{ uri: dish.imageUrl }} className="w-full h-32 bg-neutral-100" resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => toggleFavoriteDish(dish.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center"
                >
                  <Heart size={16} color={colors.primary} fill={colors.primary} />
                </TouchableOpacity>
                <View className="p-3">
                  <Text className="text-sm font-bold text-neutral-900 mb-0.5" numberOfLines={1}>{dish.name}</Text>
                  <Text className="text-xs text-neutral-500 mb-2" numberOfLines={1}>{restaurant?.name}</Text>
                  <Text className="text-sm font-extrabold text-neutral-950">${dish.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />
      
      {/* ── SEGMENTED CONTROL ────────────────────────────────────────── */}
      <View className="bg-white border-b border-neutral-100 px-5 py-3">
        <View className="flex-row bg-neutral-100 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setActiveTab('restaurants')}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === 'restaurants' ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Text className={`text-sm font-bold ${activeTab === 'restaurants' ? 'text-neutral-900' : 'text-neutral-500'}`}>
              Restaurants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('dishes')}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === 'dishes' ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Text className={`text-sm font-bold ${activeTab === 'dishes' ? 'text-neutral-900' : 'text-neutral-500'}`}>
              Dishes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'restaurants' ? renderRestaurants() : renderDishes()}
      </ScrollView>
    </View>
  );
}
