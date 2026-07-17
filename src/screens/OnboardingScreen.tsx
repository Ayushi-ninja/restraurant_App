// src/screens/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { UtensilsCrossed, Truck, ShieldCheck, ChevronRight } from 'lucide-react-native';

const ONBOARDING_KEY = '@has_onboarded';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgLight: string;
}

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: 0,
      title: 'Find Your Cravings',
      description: 'Explore a curated list of top-rated local restaurants and cuisines tailored just for you.',
      icon: <UtensilsCrossed size={72} color={colors.primary} />,
      bgLight: 'bg-primary-50',
    },
    {
      id: 1,
      title: 'Lightning Fast Delivery',
      description: 'Get your warm meals delivered straight to your doorstep with real-time tracking.',
      icon: <Truck size={72} color={colors.primary} />,
      bgLight: 'bg-primary-50',
    },
    {
      id: 2,
      title: 'Safe & Secure Checkout',
      description: 'Experience convenient payment methods and zero-contact delivery options.',
      icon: <ShieldCheck size={72} color={colors.primary} />,
      bgLight: 'bg-primary-50',
    },
  ];

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    scrollRef.current?.scrollTo({
      x: (slides.length - 1) * SCREEN_WIDTH,
      animated: true,
    });
    setActiveIndex(slides.length - 1);
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header (Skip Button) */}
      <View className="h-14 flex-row justify-end items-center px-6">
        {activeIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-neutral-500 font-semibold text-sm">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Slides Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        className="flex-1"
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: SCREEN_WIDTH }} className="flex-1 items-center justify-center px-8">
            <View className={`w-48 h-48 rounded-full items-center justify-center mb-10 ${slide.bgLight}`}>
              {slide.icon}
            </View>
            <Text className="text-3xl font-extrabold text-neutral-900 text-center mb-4 px-4 leading-tight">
              {slide.title}
            </Text>
            <Text className="text-sm text-neutral-600 text-center leading-relaxed px-6">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer controls */}
      <View className="pb-10 px-8">
        {/* Page Dots Indicator */}
        <View className="flex-row justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-neutral-300'
              }`}
            />
          ))}
        </View>

        {/* CTA Button */}
        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity
            onPress={handleComplete}
            activeOpacity={0.8}
            className="w-full bg-primary py-4 rounded-xl items-center justify-center"
            style={shadows.primarySm}
          >
            <Text className="text-white font-bold text-base">Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            className="w-full bg-neutral-900 py-4 rounded-xl flex-row items-center justify-center"
          >
            <Text className="text-white font-bold text-base mr-2">Continue</Text>
            <ChevronRight size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
