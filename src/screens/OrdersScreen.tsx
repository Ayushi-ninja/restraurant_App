// src/screens/OrdersScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ClipboardList, ChevronRight, Clock, Star, RefreshCcw } from 'lucide-react-native';
import { colors } from '../theme/colors';

type TabKey = 'active' | 'past';

// Mock Order Data
const ACTIVE_ORDERS = [
  {
    id: 'ord_84920',
    restaurantName: 'The Smoky Grill',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format',
    itemCount: 3,
    total: 31.98,
    status: 'Preparing',
    eta: '1:15 PM',
  },
];

const PAST_ORDERS = [
  {
    id: 'ord_84812',
    restaurantName: 'Sakura Ramen House',
    restaurantImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format',
    itemCount: 2,
    total: 24.50,
    status: 'Delivered',
    date: '12 Jul, 7:30 PM',
    rating: 0,
  },
  {
    id: 'ord_84705',
    restaurantName: 'Verde Kitchen',
    restaurantImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format',
    itemCount: 4,
    total: 42.00,
    status: 'Cancelled',
    date: '05 Jul, 1:00 PM',
    rating: 0,
  },
];

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const renderActiveOrders = () => {
    if (ACTIVE_ORDERS.length === 0) {
      return (
        <View className="py-20 items-center justify-center px-8">
          <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-5">
            <ClipboardList size={36} color="#A39D96" />
          </View>
          <Text className="text-lg font-bold text-neutral-900 mb-2">No Active Orders</Text>
          <Text className="text-sm text-neutral-500 text-center leading-5">
            You don't have any ongoing orders at the moment.
          </Text>
        </View>
      );
    }

    return ACTIVE_ORDERS.map((order) => (
      <TouchableOpacity
        key={order.id}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('OrderTracking')}
        className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100 shadow-sm shadow-neutral-100/50"
      >
        <View className="flex-row items-center justify-between border-b border-neutral-50 pb-3 mb-3">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-sm font-bold text-neutral-900">{order.status}</Text>
          </View>
          <Text className="text-xs font-bold text-neutral-500">#{order.id.split('_')[1]}</Text>
        </View>

        <View className="flex-row items-center">
          <Image
            source={{ uri: order.restaurantImage }}
            className="w-14 h-14 rounded-xl bg-neutral-100 mr-4"
          />
          <View className="flex-1">
            <Text className="text-base font-extrabold text-neutral-950 mb-1">
              {order.restaurantName}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs font-medium text-neutral-500 mr-2">
                {order.itemCount} items
              </Text>
              <Text className="text-xs font-bold text-neutral-900">${order.total.toFixed(2)}</Text>
            </View>
          </View>
          <View className="items-end justify-center">
            <Text className="text-xs font-bold text-neutral-400 mb-1">ETA</Text>
            <Text className="text-sm font-bold text-primary">{order.eta}</Text>
          </View>
        </View>

        <View className="mt-4 bg-primary-50 rounded-xl p-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Clock size={16} color={colors.primary} />
            <Text className="text-sm font-bold text-primary ml-2">Track Order</Text>
          </View>
          <ChevronRight size={18} color={colors.primary} />
        </View>
      </TouchableOpacity>
    ));
  };

  const renderPastOrders = () => {
    if (PAST_ORDERS.length === 0) {
      return (
        <View className="py-20 items-center justify-center px-8">
          <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-5">
            <ClipboardList size={36} color="#A39D96" />
          </View>
          <Text className="text-lg font-bold text-neutral-900 mb-2">No Past Orders</Text>
          <Text className="text-sm text-neutral-500 text-center leading-5">
            Your past deliveries will show up here once you place an order.
          </Text>
        </View>
      );
    }

    return PAST_ORDERS.map((order) => {
      const isDelivered = order.status === 'Delivered';
      return (
        <View
          key={order.id}
          className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100 shadow-sm shadow-neutral-100/50"
        >
          <View className="flex-row items-center justify-between border-b border-neutral-50 pb-3 mb-3">
            <View
              className={`px-2.5 py-1 rounded-md ${
                isDelivered ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDelivered ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {order.status}
              </Text>
            </View>
            <Text className="text-xs font-medium text-neutral-400">{order.date}</Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: order.restaurantImage }}
              className="w-14 h-14 rounded-xl bg-neutral-100 mr-4"
            />
            <View className="flex-1">
              <Text className="text-base font-extrabold text-neutral-950 mb-1">
                {order.restaurantName}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-xs font-medium text-neutral-500 mr-2">
                  {order.itemCount} items
                </Text>
                <Text className="text-xs font-bold text-neutral-900">${order.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row items-center space-x-3 pt-2 border-t border-dashed border-neutral-100">
            <TouchableOpacity className="flex-1 bg-neutral-100 py-3 rounded-xl items-center justify-center flex-row mr-2">
              <RefreshCcw size={14} color="#1A1410" />
              <Text className="text-sm font-bold text-neutral-900 ml-2">Reorder</Text>
            </TouchableOpacity>
            
            {isDelivered && (
              <TouchableOpacity className="flex-1 bg-amber-50 py-3 rounded-xl items-center justify-center flex-row ml-1">
                <Star size={14} color="#D97706" fill="transparent" />
                <Text className="text-sm font-bold text-amber-700 ml-2">Rate Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="bg-white border-b border-neutral-100">
        <View className="px-5 py-4">
          <Text className="text-2xl font-extrabold text-neutral-950 mb-4">My Orders</Text>

          {/* Segmented Control */}
          <View className="flex-row bg-neutral-100 p-1 rounded-xl">
            <TouchableOpacity
              onPress={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === 'active' ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === 'active' ? 'text-neutral-900' : 'text-neutral-500'
                }`}
              >
                Active Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === 'past' ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === 'past' ? 'text-neutral-900' : 'text-neutral-500'
                }`}
              >
                Past Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {activeTab === 'active' ? renderActiveOrders() : renderPastOrders()}
      </ScrollView>
    </View>
  );
}
