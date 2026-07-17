// src/screens/PlaceholderScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ChevronLeft, Construction } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/types';

type PlaceholderRouteProp = RouteProp<RootStackParamList, 'Placeholder'>;

export default function PlaceholderScreen() {
  const navigation = useNavigation();
  const route = useRoute<PlaceholderRouteProp>();
  const { title } = route.params;

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <SafeAreaView className="bg-white border-b border-neutral-100">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center"
          >
            <ChevronLeft size={22} color="#1A1410" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-neutral-950">{title}</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-neutral-100 rounded-full items-center justify-center mb-6">
          <Construction size={48} color="#D4CCC2" />
        </View>
        <Text className="text-xl font-extrabold text-neutral-900 mb-3 text-center">
          {title}
        </Text>
        <Text className="text-base text-neutral-500 text-center leading-6 mb-8">
          We're working hard to bring this feature to life. Check back soon for updates!
        </Text>
        
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
