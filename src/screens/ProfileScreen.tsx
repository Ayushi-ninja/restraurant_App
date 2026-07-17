// src/screens/ProfileScreen.tsx
// User profile: avatar, info, quick-stats, settings rows, sign-out
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  ChevronRight,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  Star,
  LogOut,
  Edit3,
  CreditCard,
  Gift,
} from 'lucide-react-native';

import { useUserStore } from '../store/userStore';
import { colors } from '../theme/colors';

// Mock logged-in user that would normally come from auth
const MOCK_USER = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 (555) 012-3456',
  avatarUrl: 'https://i.pravatar.cc/160?img=65',
  ordersCount: 24,
  favoritesCount: 8,
  reviewsCount: 12,
};

interface SettingsRowProps {
  icon: React.ComponentType<any>;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  danger?: boolean;
}

function SettingsRow({
  icon: Icon,
  label,
  subtitle,
  onPress,
  rightElement,
  iconBg = 'bg-neutral-100',
  iconColor = '#4A4239',
  danger = false,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center px-5 py-4 border-b border-neutral-50 last:border-0"
    >
      <View className={`w-9 h-9 rounded-xl ${iconBg} items-center justify-center mr-4`}>
        <Icon size={18} color={danger ? '#EF4444' : iconColor} />
      </View>
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-neutral-900'}`}>
          {label}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-neutral-500 mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {rightElement !== undefined ? (
        rightElement
      ) : onPress ? (
        <ChevronRight size={18} color="#C4BDB5" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout } = useUserStore();
  const user = useUserStore((s) => s.user);
  const favoriteRestaurantIds = useUserStore((s) => s.favoriteRestaurantIds);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="bg-white border-b border-neutral-100">
        <View className="flex-row items-center justify-between px-5 py-4">
          <Text className="text-2xl font-extrabold text-neutral-950">Profile</Text>
          <TouchableOpacity className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center">
            <Edit3 size={18} color="#1A1410" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── AVATAR + INFO ────────────────────────────────────────────── */}
        <View className="bg-white px-5 pb-6 pt-4 mb-3">
          <View className="flex-row items-center">
            <View className="relative mr-4">
              <Image
                source={{ uri: MOCK_USER.avatarUrl }}
                className="w-20 h-20 rounded-full bg-neutral-200"
              />
              {/* Online dot */}
              <View className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-neutral-950">{MOCK_USER.name}</Text>
              <Text className="text-sm text-neutral-500 mt-0.5">{MOCK_USER.email}</Text>
              <Text className="text-sm text-neutral-500">{MOCK_USER.phone}</Text>
            </View>
          </View>

          {/* Quick stats */}
          <View className="flex-row mt-5 bg-neutral-50 rounded-2xl p-4">
            <View className="flex-1 items-center">
              <Text className="text-xl font-extrabold text-neutral-950">{MOCK_USER.ordersCount}</Text>
              <Text className="text-xs font-medium text-neutral-500 mt-1">Orders</Text>
            </View>
            <View className="w-px bg-neutral-200" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-extrabold text-neutral-950">{MOCK_USER.favoritesCount}</Text>
              <Text className="text-xs font-medium text-neutral-500 mt-1">Favorites</Text>
            </View>
            <View className="w-px bg-neutral-200" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-extrabold text-neutral-950">{MOCK_USER.reviewsCount}</Text>
              <Text className="text-xs font-medium text-neutral-500 mt-1">Reviews</Text>
            </View>
          </View>
        </View>

        {/* ── ACCOUNT SECTION ──────────────────────────────────────────── */}
        <View className="bg-white rounded-2xl mx-5 mb-4 overflow-hidden border border-neutral-100">
          <Text className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-5 pt-4 pb-2">
            Account
          </Text>
          <SettingsRow
            icon={MapPin}
            label="Saved Addresses"
            subtitle={`${user?.addresses?.length ?? 0} saved`}
            iconBg="bg-blue-50"
            iconColor="#3B82F6"
            onPress={() => navigation.navigate('SavedAddresses')}
          />
          <SettingsRow
            icon={CreditCard}
            label="Payment Methods"
            subtitle="Visa •••• 4242"
            iconBg="bg-purple-50"
            iconColor="#8B5CF6"
            onPress={() => navigation.navigate('Placeholder', { title: 'Payment Methods' })}
          />
          <SettingsRow
            icon={Gift}
            label="Promo Codes & Offers"
            iconBg="bg-amber-50"
            iconColor="#D97706"
            onPress={() => navigation.navigate('Offers')}
          />
          <SettingsRow
            icon={Heart}
            label="Favourite Restaurants"
            subtitle={`${favoriteRestaurantIds.length} saved`}
            iconBg="bg-red-50"
            iconColor="#EF4444"
            onPress={() => navigation.navigate('Favorites')}
          />
          <SettingsRow
            icon={Star}
            label="My Reviews"
            subtitle="12 reviews written"
            iconBg="bg-amber-50"
            iconColor="#D97706"
            onPress={() => navigation.navigate('Placeholder', { title: 'My Reviews' })}
          />
        </View>

        {/* ── PREFERENCES SECTION ──────────────────────────────────────── */}
        <View className="bg-white rounded-2xl mx-5 mb-4 overflow-hidden border border-neutral-100">
          <Text className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-5 pt-4 pb-2">
            Preferences
          </Text>
          <SettingsRow
            icon={Bell}
            label="Push Notifications"
            iconBg="bg-orange-50"
            iconColor="#F97316"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E0DB', true: colors.primary }}
                thumbColor="white"
              />
            }
          />
          <SettingsRow
            icon={Moon}
            label="Dark Mode"
            subtitle="Coming soon"
            iconBg="bg-neutral-200"
            iconColor="#6B7280"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={(val) => {
                  if (val) {
                    Alert.alert('Coming Soon', 'Dark mode is currently under development.');
                  }
                  setDarkModeEnabled(false);
                }}
                trackColor={{ false: '#E5E0DB', true: colors.primary }}
                thumbColor="white"
              />
            }
          />
        </View>

        {/* ── SUPPORT SECTION ──────────────────────────────────────────── */}
        <View className="bg-white rounded-2xl mx-5 mb-4 overflow-hidden border border-neutral-100">
          <Text className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-5 pt-4 pb-2">
            Support
          </Text>
          <SettingsRow
            icon={HelpCircle}
            label="Help Centre"
            iconBg="bg-teal-50"
            iconColor="#14B8A6"
            onPress={() => navigation.navigate('Placeholder', { title: 'Help Centre' })}
          />
          <SettingsRow
            icon={Shield}
            label="Privacy Policy"
            iconBg="bg-neutral-100"
            iconColor="#6B7280"
            onPress={() => navigation.navigate('Placeholder', { title: 'Privacy Policy' })}
          />
        </View>

        {/* ── SIGN OUT ─────────────────────────────────────────────────── */}
        <View className="bg-white rounded-2xl mx-5 mb-4 overflow-hidden border border-neutral-100">
          <SettingsRow
            icon={LogOut}
            label="Sign Out"
            danger
            iconBg="bg-red-50"
            onPress={handleSignOut}
          />
        </View>

        {/* App version */}
        <Text className="text-center text-xs text-neutral-400 mt-2">
          RestaurantApp v1.0.0 • Build 84920
        </Text>
      </ScrollView>
    </View>
  );
}
