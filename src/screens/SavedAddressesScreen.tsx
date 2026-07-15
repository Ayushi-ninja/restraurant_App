// src/screens/SavedAddressesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Plus, Trash2, CheckCircle2, X } from 'lucide-react-native';

import { useUserStore } from '../store/userStore';
import { colors } from '../theme/colors';

export default function SavedAddressesScreen() {
  const { user, removeAddress, setDefaultAddress, addAddress } = useUserStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newDetails, setNewDetails] = useState('');

  // Protect against guest state
  if (!user) {
    return (
      <View className="flex-1 bg-neutral-50 items-center justify-center">
        <Text className="text-sm text-neutral-500">Please log in to view addresses.</Text>
      </View>
    );
  }

  const addresses = user.addresses || [];
  const defaultAddressId = user.defaultAddressId;

  const handleSaveNewAddress = () => {
    if (!newDetails.trim()) return;
    const newId = Date.now().toString();
    addAddress({ 
      id: newId, 
      label: newLabel, 
      street: newDetails.trim(),
      city: 'Demo City',
      state: 'Demo State',
      zip: '12345'
    });
    
    // If it's the first address, make it default
    if (addresses.length === 0) {
      setDefaultAddress(newId);
    }
    
    setShowAddModal(false);
    setNewDetails('');
    setNewLabel('Home');
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {addresses.length === 0 ? (
          <View className="py-20 items-center">
            <View className="w-16 h-16 bg-neutral-100 rounded-full items-center justify-center mb-4">
              <MapPin size={24} color="#D4CCC2" />
            </View>
            <Text className="text-lg font-bold text-neutral-900 mb-2">No Saved Addresses</Text>
            <Text className="text-sm text-neutral-500 text-center mb-6">
              Add your home, work, or other addresses for a faster checkout experience.
            </Text>
          </View>
        ) : (
          <View className="mb-6">
            {addresses.map((addr) => {
              const isDefault = addr.id === defaultAddressId;
              return (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => setDefaultAddress(addr.id)}
                  activeOpacity={0.8}
                  className={`p-4 rounded-2xl mb-3 border ${
                    isDefault ? 'bg-primary-50 border-primary' : 'bg-white border-neutral-100 shadow-sm shadow-neutral-100/50'
                  }`}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center">
                      <MapPin size={16} color={isDefault ? colors.primary : '#8C8278'} />
                      <Text
                        className={`ml-2 text-sm font-bold ${
                          isDefault ? 'text-primary' : 'text-neutral-900'
                        }`}
                      >
                        {addr.label}
                      </Text>
                      {isDefault && (
                        <View className="bg-primary/20 px-2 py-0.5 rounded ml-3">
                          <Text className="text-[10px] font-bold text-primary uppercase">Default</Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeAddress(addr.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Trash2 size={16} color="#EF4444" opacity={0.8} />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-sm text-neutral-600 leading-5 pr-8">
                    {addr.street}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="flex-row items-center justify-center py-4 bg-white rounded-2xl border border-dashed border-primary"
        >
          <Plus size={20} color={colors.primary} />
          <Text className="text-sm font-bold text-primary ml-2">Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── ADD ADDRESS MODAL ────────────────────────────────────────── */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl pt-5 px-5 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-neutral-950">Add Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#1A1410" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-bold text-neutral-900 mb-3">Save as</Text>
            <View className="flex-row mb-6">
              {['Home', 'Work', 'Other'].map((lbl) => (
                <TouchableOpacity
                  key={lbl}
                  onPress={() => setNewLabel(lbl)}
                  className={`px-5 py-2.5 rounded-full border mr-3 ${
                    newLabel === lbl ? 'bg-primary border-primary' : 'bg-white border-neutral-200'
                  }`}
                >
                  <Text className={`text-sm font-bold ${newLabel === lbl ? 'text-white' : 'text-neutral-600'}`}>
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
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm text-neutral-900 min-h-[120px] mb-8"
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleSaveNewAddress}
              activeOpacity={0.8}
              disabled={!newDetails.trim()}
              className={`py-4 rounded-2xl items-center shadow-lg ${
                newDetails.trim() ? 'bg-primary shadow-primary/30' : 'bg-neutral-300 shadow-transparent'
              }`}
            >
              <Text className="text-white font-extrabold text-base">Save Address</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
