// src/components/Rating.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export default function Rating({ rating, reviewCount, size = 16 }: RatingProps) {
  return (
    <View className="flex-row items-center">
      <Star size={size} color={colors.star} fill={colors.star} />
      <Text className="text-sm font-bold text-neutral-800 ml-1">
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text className="text-xs text-neutral-400 ml-1">
          ({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
        </Text>
      )}
    </View>
  );
}
