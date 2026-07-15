// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { Soup } from 'lucide-react-native';

const ONBOARDING_KEY = '@has_onboarded';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Add a slight artificial delay for a premium splash feel (1.5 seconds)
        const [hasOnboarded] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);

        if (hasOnboarded === 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }
      } catch (error) {
        console.error('Error reading onboarding status:', error);
        // Fallback to onboarding if anything fails
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <View className="items-center">
        <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-6">
          <Soup size={56} color="white" />
        </View>
        <Text className="text-4xl font-extrabold text-white tracking-wider mb-2">
          Craving
        </Text>
        <Text className="text-sm font-medium text-primary-100 tracking-widest uppercase mb-12">
          Bite-sized happiness
        </Text>
        <ActivityIndicator color="white" size="small" />
      </View>
    </View>
  );
}
