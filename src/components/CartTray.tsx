// src/components/CartTray.tsx
// Sticky bottom bar showing cart summary and CTA to Checkout
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ShoppingBag, ArrowRight } from 'lucide-react-native';

interface CartTrayProps {
  totalItems: number;
  subtotal: number;
  onPress: () => void;
}

export default function CartTray({ totalItems, subtotal, onPress }: CartTrayProps) {
  if (totalItems === 0) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-transparent">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        className="bg-primary rounded-2xl flex-row items-center justify-between px-5 py-4 shadow-xl shadow-primary/40"
      >
        {/* Item count bubble */}
        <View className="bg-white/20 rounded-xl px-3 py-1 flex-row items-center">
          <ShoppingBag size={16} color="white" />
          <Text className="text-white font-bold text-sm ml-2">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <Text className="text-white font-bold text-sm">View Cart</Text>

        <View className="flex-row items-center">
          <Text className="text-white font-extrabold text-sm mr-2">
            ${subtotal.toFixed(2)}
          </Text>
          <ArrowRight size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
