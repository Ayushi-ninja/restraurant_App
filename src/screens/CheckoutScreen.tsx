// src/screens/CheckoutScreen.tsx
// Final checkout step: Address selection, delivery time, payment method, order summary

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { colors } from '../theme/colors';

// ── Mock Data ──
const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI / Digital Wallet', icon: Smartphone },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { items, restaurantId, subtotal, clearCart } = useCartStore();
  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);

  const { user, addAddress } = useUserStore();
  const addresses = user?.addresses || [];
  
  // Selections
  const [selectedAddressId, setSelectedAddressId] = useState<string>(user?.defaultAddressId || (addresses.length > 0 ? addresses[0].id : ''));
  const [deliveryTime, setDeliveryTime] = useState<'ASAP' | 'Schedule'>('ASAP');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('card');
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Modals
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // Add Address Form State
  const [newLabel, setNewLabel] = useState('Home');
  const [newDetails, setNewDetails] = useState('');

  // Bill calculation (mocked simply for summary)
  const sub = subtotal();
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const taxes = sub * 0.08;
  const total = sub + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    alert('Order Placed Successfully!');
    clearCart();
    navigation.navigate('OrderTracking');
  };

  const handleSaveAddress = () => {
    if (!newDetails.trim()) return;
    const newId = Date.now().toString();
    addAddress({
      id: newId,
      label: newLabel,
      street: newDetails.trim(),
      city: 'Demo City',
      state: 'Demo State',
      zip: '12345',
    });
    setSelectedAddressId(newId);
    setShowAddAddressForm(false);
    setShowAddressModal(false);
    setNewDetails('');
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

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
          <Text className="text-lg font-bold text-neutral-950">Checkout</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
      >
        {/* ── DELIVERY ADDRESS ───────────────────────────────────────── */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-neutral-900">Delivery Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
              <Text className="text-sm font-bold text-primary">Change</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm shadow-neutral-100/50 flex-row items-center">
            <View className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-4">
              <MapPin size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral-900 mb-0.5">
                {selectedAddress?.label}
              </Text>
              <Text className="text-xs text-neutral-500 leading-5">
                {selectedAddress?.street}
              </Text>
            </View>
          </View>
        </View>

        {/* ── DELIVERY TIME ──────────────────────────────────────────── */}
        <View className="px-5 mb-6">
          <Text className="text-sm font-extrabold text-neutral-900 mb-3">Delivery Time</Text>
          <View className="flex-row bg-white rounded-2xl p-1 border border-neutral-100 shadow-sm shadow-neutral-100/50">
            <TouchableOpacity
              onPress={() => setDeliveryTime('ASAP')}
              className={`flex-1 py-3 items-center rounded-xl ${
                deliveryTime === 'ASAP' ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  deliveryTime === 'ASAP' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                ASAP (30-45 min)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeliveryTime('Schedule')}
              className={`flex-1 py-3 items-center rounded-xl ${
                deliveryTime === 'Schedule' ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  deliveryTime === 'Schedule' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                Schedule Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── PAYMENT METHOD ─────────────────────────────────────────── */}
        <View className="px-5 mb-6">
          <Text className="text-sm font-extrabold text-neutral-900 mb-3">Payment Method</Text>
          <View className="bg-white rounded-2xl border border-neutral-100 shadow-sm shadow-neutral-100/50 overflow-hidden">
            {PAYMENT_METHODS.map((method, index) => {
              const Icon = method.icon;
              const isSelected = paymentMethodId === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setPaymentMethodId(method.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center p-4 ${
                    index !== PAYMENT_METHODS.length - 1 ? 'border-b border-neutral-50' : ''
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      isSelected ? 'bg-primary-50' : 'bg-neutral-50'
                    }`}
                  >
                    <Icon size={20} color={isSelected ? colors.primary : '#A39D96'} />
                  </View>
                  <Text
                    className={`flex-1 text-sm font-semibold ${
                      isSelected ? 'text-neutral-950' : 'text-neutral-600'
                    }`}
                  >
                    {method.label}
                  </Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-neutral-300'
                    }`}
                  >
                    {isSelected && <View className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── ORDER SUMMARY ACCORDION ────────────────────────────────── */}
        <View className="px-5 mb-6">
          <View className="bg-white rounded-2xl border border-neutral-100 shadow-sm shadow-neutral-100/50 overflow-hidden">
            <TouchableOpacity
              onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4"
            >
              <Text className="text-sm font-extrabold text-neutral-900">Order Summary</Text>
              <View className="flex-row items-center">
                <Text className="text-sm font-bold text-neutral-600 mr-2">
                  ${total.toFixed(2)}
                </Text>
                {isSummaryExpanded ? (
                  <ChevronUp size={20} color="#1A1410" />
                ) : (
                  <ChevronDown size={20} color="#1A1410" />
                )}
              </View>
            </TouchableOpacity>

            {isSummaryExpanded && (
              <View className="px-4 pb-4 border-t border-neutral-50 pt-3">
                {items.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between mb-2">
                    <Text className="text-xs text-neutral-600 flex-1 pr-4">
                      {item.quantity}x {item.menuItem.name}
                    </Text>
                    <Text className="text-xs font-medium text-neutral-900">
                      ${item.totalPrice.toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View className="h-px bg-neutral-100 my-3" />
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-neutral-500">Subtotal</Text>
                  <Text className="text-xs font-medium text-neutral-900">${sub.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-neutral-500">Delivery Fee</Text>
                  <Text className="text-xs font-medium text-neutral-900">
                    ${deliveryFee.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-neutral-500">Taxes</Text>
                  <Text className="text-xs font-medium text-neutral-900">${taxes.toFixed(2)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── PLACE ORDER CTA ──────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 pt-4 pb-8"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-primary rounded-2xl py-4 flex-row items-center justify-between px-5 shadow-lg shadow-primary/30"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white font-extrabold text-base">Place Order</Text>
          <Text className="text-white font-extrabold text-lg">${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* ── ADDRESS SELECTION MODAL ──────────────────────────────────── */}
      <Modal visible={showAddressModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-neutral-50">
          <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-neutral-100">
            <Text className="text-lg font-bold text-neutral-950">Select Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
              <X size={24} color="#1A1410" />
            </TouchableOpacity>
          </View>
          <ScrollView className="px-5 pt-4">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => {
                    setSelectedAddressId(addr.id);
                    setShowAddressModal(false);
                  }}
                  className={`p-4 rounded-2xl mb-3 border ${
                    isSelected ? 'bg-primary-50 border-primary' : 'bg-white border-neutral-100'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <MapPin size={16} color={isSelected ? colors.primary : '#A39D96'} />
                      <Text
                        className={`ml-2 text-sm font-bold ${
                          isSelected ? 'text-primary' : 'text-neutral-900'
                        }`}
                      >
                        {addr.label}
                      </Text>
                    </View>
                    {isSelected && <CheckCircle2 size={18} color={colors.primary} />}
                  </View>
                  <Text className="text-sm text-neutral-600 pr-8 leading-5">
                    {addr.street}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            <TouchableOpacity
              onPress={() => setShowAddAddressForm(true)}
              className="flex-row items-center justify-center py-4 mt-2 bg-white rounded-2xl border border-dashed border-neutral-300"
            >
              <Plus size={20} color={colors.primary} />
              <Text className="text-sm font-bold text-primary ml-2">Add New Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── ADD ADDRESS FORM MODAL ───────────────────────────────────── */}
      <Modal visible={showAddAddressForm} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-neutral-100">
              <Text className="text-lg font-bold text-neutral-950">Add Address</Text>
              <TouchableOpacity onPress={() => setShowAddAddressForm(false)}>
                <X size={24} color="#1A1410" />
              </TouchableOpacity>
            </View>
            <ScrollView className="px-5 pt-6">
              <Text className="text-sm font-bold text-neutral-900 mb-3">Save as</Text>
              <View className="flex-row mb-6">
                {['Home', 'Work', 'Other'].map((lbl) => (
                  <TouchableOpacity
                    key={lbl}
                    onPress={() => setNewLabel(lbl)}
                    className={`px-4 py-2 rounded-full border mr-3 ${
                      newLabel === lbl
                        ? 'bg-primary border-primary'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        newLabel === lbl ? 'text-white' : 'text-neutral-600'
                      }`}
                    >
                      {lbl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-bold text-neutral-900 mb-2">Complete Address</Text>
              <TextInput
                value={newDetails}
                onChangeText={setNewDetails}
                placeholder="Apt, Floor, Building Name, Street..."
                placeholderTextColor="#A39D96"
                multiline
                className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm text-neutral-900 min-h-[100px] mb-8"
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={handleSaveAddress}
                activeOpacity={0.8}
                disabled={!newDetails.trim()}
                className={`py-4 rounded-2xl items-center shadow-lg ${
                  newDetails.trim() ? 'bg-primary shadow-primary/30' : 'bg-neutral-300 shadow-transparent'
                }`}
              >
                <Text className="text-white font-extrabold text-base">Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
