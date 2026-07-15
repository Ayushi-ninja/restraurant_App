// src/components/RestaurantCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { Restaurant } from '../types';
import Rating from './Rating';
import Badge from './Badge';
import { Clock, Bike } from 'lucide-react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  layout?: 'horizontal' | 'vertical';
  onPress: () => void;
}

export default function RestaurantCard({
  restaurant,
  layout = 'vertical',
  onPress,
}: RestaurantCardProps) {
  const isHorizontal = layout === 'horizontal';

  // Format delivery info
  const deliveryInfo = `$${restaurant.deliveryFee === 0 ? 'Free' : restaurant.deliveryFee.toFixed(2)}`;

  if (isHorizontal) {
    // Horizontal card structure for Promoted/Featured horizontal list
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="w-68 bg-white border border-neutral-100 rounded-2xl overflow-hidden mr-4 shadow-sm shadow-neutral-200/50"
      >
        {/* Card Image banner */}
        <View className="relative w-full h-36">
          <Image
            source={{ uri: restaurant.imageUrl }}
            className="w-full h-full bg-neutral-100"
            resizeMode="cover"
          />
          {/* Top Tag badge overlay */}
          {restaurant.tags.length > 0 && (
            <View className="absolute top-3 left-3 bg-primary px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-extrabold text-white uppercase tracking-wide">
                {restaurant.tags[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Info panel */}
        <View className="p-4">
          <Text numberOfLines={1} className="text-base font-bold text-neutral-900 mb-1">
            {restaurant.name}
          </Text>

          {/* Sub Row */}
          <View className="flex-row items-center justify-between mt-1">
            <Rating rating={restaurant.rating} />
            <View className="flex-row items-center space-x-1">
              <Clock size={12} color="#8C8278" />
              <Text className="text-xs text-neutral-500 font-medium ml-1">
                {restaurant.deliveryTime}m
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Vertical card structure for the standard feed
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white border border-neutral-150 rounded-2xl overflow-hidden mb-4 shadow-sm shadow-neutral-200/50 flex-row p-3"
    >
      {/* Thumbnail */}
      <View className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100">
        <Image
          source={{ uri: restaurant.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Info Body */}
      <View className="flex-1 pl-4 justify-between py-0.5">
        <View>
          <View className="flex-row items-center justify-between">
            <Text numberOfLines={1} className="text-base font-bold text-neutral-900 flex-1 mr-2">
              {restaurant.name}
            </Text>
            <Rating rating={restaurant.rating} />
          </View>

          {/* Cuisine labels */}
          <Text numberOfLines={1} className="text-xs text-neutral-500 mt-1">
            {restaurant.cuisine.join(' • ')}
          </Text>
        </View>

        {/* Stats and metadata footer */}
        <View className="flex-row items-center space-x-3 mt-2 flex-wrap">
          {/* Delivery duration */}
          <View className="flex-row items-center mr-3 mb-1">
            <Clock size={12} color="#8C8278" />
            <Text className="text-xs text-neutral-500 font-medium ml-1">
              {restaurant.deliveryTime} mins
            </Text>
          </View>

          {/* Delivery fee status */}
          <View className="flex-row items-center mr-3 mb-1">
            <Bike size={12} color="#8C8278" />
            <Text className="text-xs text-neutral-500 font-semibold ml-1">
              {deliveryInfo}
            </Text>
          </View>

          {/* Pricing indicator */}
          <Text className="text-xs text-neutral-400 font-medium mb-1">
            Min. ${restaurant.minimumOrder}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
