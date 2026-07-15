// src/screens/CheckoutScreen.tsx
// Acts as the Cart / Checkout summary screen.

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react-native';

import { useCartStore } from '../store/cartStore';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { colors } from '../theme/colors';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, restaurantId, setQuantity, removeItem, subtotal, totalItems } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);

  // Bill calculation
  const sub = subtotal();
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const taxes = sub * 0.08; // 8% mock tax
  const total = sub + deliveryFee + taxes - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'HALF') {
      setDiscount(sub * 0.5);
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
      alert('Invalid Promo Code');
    }
  };

  // ── EMPTY STATE ───────────────────────────────────────────────────────
  if (items.length === 0 || !restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <View className="items-center px-8">
          <View className="w-24 h-24 bg-neutral-100 rounded-full items-center justify-center mb-6">
            <ShoppingBag size={48} color="#D4CCC2" />
          </View>
          <Text className="text-xl font-extrabold text-neutral-900 mb-2">
            Your cart is empty
          </Text>
          <Text className="text-sm text-neutral-500 text-center mb-8 leading-6">
            Looks like you haven't added anything yet. Explore our top restaurants and discover new flavours.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-primary px-6 py-4 rounded-2xl shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-base">Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── FILLED STATE ──────────────────────────────────────────────────────
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
          <Text className="text-lg font-bold text-neutral-950">Cart Summary</Text>
          <View className="w-10" /> {/* Balance spacer */}
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── RESTAURANT HEADER ──────────────────────────────────────── */}
        <View className="px-5 py-4 border-b border-neutral-100 bg-white mb-2">
          <Text className="text-sm text-neutral-500 font-medium mb-1">Ordering from</Text>
          <Text className="text-xl font-extrabold text-neutral-900">{restaurant.name}</Text>
        </View>

        {/* ── CART ITEMS ─────────────────────────────────────────────── */}
        <View className="bg-white px-5 py-2 mb-3">
          {items.map((cartItem) => (
            <View
              key={cartItem.menuItem.id}
              className="flex-row py-4 border-b border-neutral-50 last:border-0"
            >
              {/* Item Image */}
              <Image
                source={{ uri: cartItem.menuItem.imageUrl }}
                className="w-16 h-16 rounded-xl bg-neutral-100 mr-4"
              />

              {/* Details */}
              <View className="flex-1">
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="text-sm font-bold text-neutral-900 flex-1 mr-3">
                    {cartItem.menuItem.name}
                  </Text>
                  <Text className="text-sm font-extrabold text-neutral-950">
                    ${cartItem.totalPrice.toFixed(2)}
                  </Text>
                </View>

                {/* Customizations summary */}
                {cartItem.customizations && cartItem.customizations.length > 0 && (
                  <Text className="text-xs text-neutral-500 mb-2 leading-5">
                    {cartItem.customizations.join(', ')}
                  </Text>
                )}

                {/* Actions row: stepper + delete */}
                <View className="flex-row items-center justify-between mt-auto pt-1">
                  <View className="flex-row items-center bg-neutral-50 rounded-xl px-1.5 py-1.5 border border-neutral-100">
                    <TouchableOpacity
                      onPress={() => setQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                      className="w-7 h-7 items-center justify-center bg-white rounded-lg shadow-sm"
                    >
                      <Minus size={14} color="#1A1410" strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text className="text-sm font-bold text-neutral-900 mx-4 min-w-[12px] text-center">
                      {cartItem.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                      className="w-7 h-7 items-center justify-center bg-white rounded-lg shadow-sm"
                    >
                      <Plus size={14} color="#1A1410" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeItem(cartItem.menuItem.id)}
                    className="w-9 h-9 items-center justify-center bg-red-50 rounded-full"
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── PROMO CODE ─────────────────────────────────────────────── */}
        <View className="bg-white px-5 py-5 mb-3 border-y border-neutral-100">
          <Text className="text-sm font-bold text-neutral-900 mb-3">Promo Code</Text>
          <View className="flex-row">
            <View className="flex-1 flex-row items-center bg-neutral-50 border border-neutral-200 rounded-xl px-3 mr-3">
              <Tag size={18} color="#A39D96" />
              <TextInput
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter SAVE10"
                placeholderTextColor="#A39D96"
                className="flex-1 h-12 ml-2 text-sm font-medium text-neutral-900"
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity
              onPress={handleApplyPromo}
              activeOpacity={0.8}
              className={`px-5 justify-center rounded-xl ${
                promoApplied ? 'bg-emerald-500' : 'bg-neutral-900'
              }`}
            >
              <Text className="text-white font-bold text-sm">
                {promoApplied ? 'Applied ✓' : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BILL SUMMARY ───────────────────────────────────────────── */}
        <View className="bg-white px-5 py-5 border-y border-neutral-100">
          <Text className="text-base font-extrabold text-neutral-900 mb-4">
            Bill Summary
          </Text>

          <View className="space-y-3 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-600">Subtotal</Text>
              <Text className="text-sm font-medium text-neutral-900">${sub.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-600">Delivery Fee</Text>
              <Text className="text-sm font-medium text-neutral-900">
                ${deliveryFee.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-600">Taxes & Fees</Text>
              <Text className="text-sm font-medium text-neutral-900">${taxes.toFixed(2)}</Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-sm font-bold text-emerald-600">Discount</Text>
                <Text className="text-sm font-bold text-emerald-600">
                  -${discount.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View className="border-t border-dashed border-neutral-200 pt-4 flex-row justify-between items-center">
            <Text className="text-base font-extrabold text-neutral-900">Grand Total</Text>
            <Text className="text-xl font-extrabold text-primary">
              ${Math.max(0, total).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── CHECKOUT CTA ─────────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 pt-4 pb-8"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-primary rounded-2xl py-4 flex-row items-center justify-center shadow-lg shadow-primary/30"
          onPress={() => {
            navigation.navigate('Checkout');
          }}
        >
          <Text className="text-white font-extrabold text-base mr-2">
            Proceed to Checkout
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
