// src/components/MenuItemCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import type { MenuItem } from '../types';
import { colors } from '../theme/colors';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number; // 0 = not in cart
  onAdd: () => void;
  onRemove: () => void;
  /** Tap anywhere on the card body → open the detail sheet */
  onTap?: () => void;
}

export default function MenuItemCard({ item, quantity, onAdd, onRemove, onTap }: MenuItemCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={onTap ? 0.88 : 1}
      onPress={onTap}
      className={`flex-row bg-white rounded-2xl mb-3 overflow-hidden border ${
        !item.isAvailable ? 'opacity-50' : 'border-neutral-100'
      } shadow-sm shadow-neutral-100/60`}
    >
      {/* Text block */}
      <View className="flex-1 p-4 justify-between">
        {/* Popular badge */}
        {item.isPopular && (
          <View className="bg-primary-50 self-start px-2 py-0.5 rounded-full mb-2">
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wide">
              Popular
            </Text>
          </View>
        )}

        <Text className="text-sm font-bold text-neutral-900 mb-1" numberOfLines={1}>
          {item.name}
        </Text>

        <Text className="text-xs text-neutral-500 leading-4 mb-3" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Footer row: price + calories */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-extrabold text-neutral-950">
            ${item.price.toFixed(2)}
          </Text>
          {item.calories !== undefined && (
            <Text className="text-xs text-neutral-400">{item.calories} kcal</Text>
          )}
        </View>
      </View>

      {/* Right image + stepper */}
      <View className="w-28 relative">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full bg-neutral-100"
          resizeMode="cover"
        />

        {/* Stepper anchored at bottom-right of image */}
        {item.isAvailable && (
          <View className="absolute bottom-2 right-2">
            {quantity === 0 ? (
              // Single + button when not yet added
              <TouchableOpacity
                onPress={onAdd}
                activeOpacity={0.8}
                className="w-8 h-8 bg-primary rounded-full items-center justify-center shadow-md shadow-primary/40"
              >
                <Plus size={16} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            ) : (
              // Full stepper when in cart
              <View className="flex-row items-center bg-white rounded-full border border-neutral-200 shadow-sm shadow-neutral-100 px-1 py-1">
                <TouchableOpacity
                  onPress={onRemove}
                  className="w-6 h-6 items-center justify-center"
                >
                  <Minus size={12} color={colors.primary} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text className="text-xs font-bold text-neutral-900 mx-1.5 min-w-4 text-center">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={onAdd}
                  className="w-6 h-6 items-center justify-center"
                >
                  <Plus size={12} color={colors.primary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
