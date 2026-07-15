// src/screens/OrderTrackingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  CheckCircle2,
  ChefHat,
  Bike,
  Home,
  Info,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Mock order state
const ORDER_STAGES = [
  { id: 'placed', title: 'Order Placed', time: '12:30 PM', icon: CheckCircle2 },
  { id: 'preparing', title: 'Preparing Your Food', time: '12:35 PM', icon: ChefHat },
  { id: 'delivering', title: 'Out for Delivery', time: '12:50 PM', icon: Bike },
  { id: 'delivered', title: 'Delivered', time: 'Est. 1:15 PM', icon: Home },
];

export default function OrderTrackingScreen() {
  const navigation = useNavigation<any>();

  // In a real app this would be synced via sockets. We'll mock it at index 1 (Preparing).
  const [activeStageIndex, setActiveStageIndex] = useState(1);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Pulse animation for the active stage icon
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  // Mock progress bar width
  const progressPercent = (activeStageIndex / (ORDER_STAGES.length - 1)) * 100;

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <SafeAreaView className="bg-white z-10 shadow-sm shadow-neutral-100/50">
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center"
          >
            <X size={22} color="#1A1410" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-sm font-bold text-neutral-900">Order #84920</Text>
            <Text className="text-xs text-neutral-500">The Smoky Grill</Text>
          </View>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* ── MAP PLACEHOLDER ────────────────────────────────────────────── */}
        <View className="h-64 bg-neutral-200 relative items-center justify-center border-b border-neutral-200">
          <MapPin size={48} color={colors.primary} opacity={0.3} />
          <Text className="text-sm font-bold text-neutral-500 mt-2 opacity-50">
            Live Delivery Map
          </Text>
          {/* Faux route line */}
          <View className="absolute bottom-10 left-10 right-10 h-1 bg-primary/20 rounded-full overflow-hidden">
            <View className="h-full bg-primary/60 w-1/2 rounded-full" />
          </View>
        </View>

        {/* ── ESTIMATE CARD ──────────────────────────────────────────────── */}
        <View className="bg-white mx-5 -mt-8 rounded-2xl p-5 shadow-lg shadow-neutral-300/40 border border-neutral-100 mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">
                Estimated Delivery
              </Text>
              <Text className="text-3xl font-extrabold text-neutral-950">
                1:15 <Text className="text-lg">PM</Text>
              </Text>
            </View>
            <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center">
              <Clock size={24} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* ── ORDER PROGRESS STEPPER ─────────────────────────────────────── */}
        <View className="px-5 mb-8">
          <Text className="text-sm font-extrabold text-neutral-900 mb-6">Order Status</Text>

          <View className="pl-4">
            {ORDER_STAGES.map((stage, index) => {
              const isActive = index === activeStageIndex;
              const isPast = index < activeStageIndex;
              const isLast = index === ORDER_STAGES.length - 1;
              const Icon = stage.icon;

              return (
                <View key={stage.id} className="flex-row mb-6 relative">
                  {/* Vertical connecting line */}
                  {!isLast && (
                    <View
                      className={`absolute left-4 top-10 w-0.5 h-10 ${
                        isPast ? 'bg-primary' : 'bg-neutral-200'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <View className="items-center justify-center w-8">
                    {isActive ? (
                      <Animated.View
                        style={{ transform: [{ scale: pulseAnim }] }}
                        className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-md shadow-primary/40"
                      >
                        <Icon size={16} color="white" />
                      </Animated.View>
                    ) : (
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          isPast ? 'bg-primary' : 'bg-neutral-100 border border-neutral-200'
                        }`}
                      >
                        <Icon size={16} color={isPast ? 'white' : '#A39D96'} />
                      </View>
                    )}
                  </View>

                  {/* Text Details */}
                  <View className="flex-1 ml-4 justify-center pt-1">
                    <Text
                      className={`text-base font-bold ${
                        isActive ? 'text-primary' : isPast ? 'text-neutral-900' : 'text-neutral-400'
                      }`}
                    >
                      {stage.title}
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-0.5">{stage.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── DELIVERY PARTNER (Only visible when out for delivery) ──────── */}
        {activeStageIndex >= 2 && (
          <View className="px-5 mb-6">
            <View className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex-row items-center">
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=33' }}
                className="w-12 h-12 rounded-full bg-neutral-200 mr-4"
              />
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-900 mb-0.5">David M.</Text>
                <Text className="text-xs text-neutral-500">Your delivery partner</Text>
              </View>
              <View className="flex-row space-x-2">
                <TouchableOpacity className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-2">
                  <MessageSquare size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center">
                  <Phone size={18} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── ORDER SUMMARY (Collapsible) ────────────────────────────────── */}
        <View className="px-5 mb-8">
          <View className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <TouchableOpacity
              onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <Text className="text-sm font-extrabold text-neutral-900 mr-2">Order Details</Text>
                <Text className="text-xs font-bold text-neutral-500">• 3 items</Text>
              </View>
              {isSummaryExpanded ? (
                <ChevronUp size={20} color="#1A1410" />
              ) : (
                <ChevronDown size={20} color="#1A1410" />
              )}
            </TouchableOpacity>

            {isSummaryExpanded && (
              <View className="px-4 pb-4 border-t border-neutral-50 pt-3">
                {/* Mock Items */}
                <View className="flex-row justify-between mb-3">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-bold text-neutral-800">
                      1x Classic Smash Burger
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-1">Large, Extra Cheese</Text>
                  </View>
                  <Text className="text-sm font-bold text-neutral-900">$17.49</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-bold text-neutral-800">
                      1x Loaded Cheese Fries
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-neutral-900">$6.99</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-bold text-neutral-800">
                      1x Diet Cola
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-neutral-900">$2.50</Text>
                </View>
                
                <View className="h-px bg-neutral-100 my-2" />
                <View className="flex-row justify-between py-2">
                  <Text className="text-sm font-bold text-neutral-900">Total Paid</Text>
                  <Text className="text-sm font-extrabold text-primary">$31.98</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── SUPPORT & CANCEL LINKS ─────────────────────────────────────── */}
        <View className="px-5 space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-neutral-100">
            <View className="flex-row items-center">
              <Info size={18} color={colors.primary} />
              <Text className="text-sm font-bold text-neutral-800 ml-3">Need Help?</Text>
            </View>
            <ChevronRight size={18} color="#A39D96" />
          </TouchableOpacity>

          {/* Only allow cancellation in the first stage */}
          <TouchableOpacity
            disabled={activeStageIndex > 0}
            className={`flex-row items-center justify-center p-4 rounded-xl border ${
              activeStageIndex === 0 ? 'bg-red-50 border-red-100' : 'bg-neutral-50 border-neutral-100 opacity-50'
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeStageIndex === 0 ? 'text-red-500' : 'text-neutral-400'
              }`}
            >
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
