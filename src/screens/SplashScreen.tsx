// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Soup } from 'lucide-react-native';
import { colors } from '../theme/colors';

const ONBOARDING_KEY = '@has_onboarded';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Soup size={56} color="white" />
        </View>
        <Text style={styles.brand}>Craving</Text>
        <Text style={styles.tagline}>Bite-sized happiness</Text>
        <ActivityIndicator color="white" size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFE4D6',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
});
