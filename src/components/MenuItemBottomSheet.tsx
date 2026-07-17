// src/components/MenuItemBottomSheet.tsx
// A fully-animated slide-up bottom sheet for menu item detail + customization + cart.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plus, Minus, ShoppingBag, ChevronDown, Star } from 'lucide-react-native';

import type { MenuItem } from '../types';
import type {
  CustomizationGroup,
  RadioOption,
  CheckboxOption,
} from '../types/customization';
import { getCustomizationForItem } from '../data/customizations';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.92;

interface MenuItemBottomSheetProps {
  item: MenuItem | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Radio Group ─────────────────────────────────────────────────────────────
function RadioGroup({
  group,
  selected,
  onSelect,
}: {
  group: CustomizationGroup;
  selected: string;
  onSelect: (optionId: string) => void;
}) {
  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-3">
        <Text className="text-sm font-bold text-neutral-800">{group.label}</Text>
        {group.required && (
          <View className="ml-2 bg-primary-50 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wide">
              Required
            </Text>
          </View>
        )}
      </View>
      {(group.options as RadioOption[]).map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.75}
            className={`flex-row items-center justify-between px-4 py-3.5 rounded-xl mb-2 border ${
              isSelected
                ? 'border-primary bg-primary-50'
                : 'border-neutral-200 bg-white'
            }`}
          >
            <View className="flex-row items-center flex-1">
              {/* Radio circle */}
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                  isSelected ? 'border-primary' : 'border-neutral-300'
                }`}
              >
                {isSelected && (
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-primary font-semibold' : 'text-neutral-700'
                }`}
              >
                {opt.label}
              </Text>
            </View>
            {opt.priceDelta > 0 && (
              <Text className="text-xs font-bold text-primary ml-2">
                +${opt.priceDelta.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Checkbox Group ───────────────────────────────────────────────────────────
function CheckboxGroup({
  group,
  selected,
  onToggle,
}: {
  group: CustomizationGroup;
  selected: Set<string>;
  onToggle: (optionId: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-bold text-neutral-800 mb-3">{group.label}</Text>
      {(group.options as CheckboxOption[]).map((opt) => {
        const isChecked = selected.has(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onToggle(opt.id)}
            activeOpacity={0.75}
            className={`flex-row items-center justify-between px-4 py-3.5 rounded-xl mb-2 border ${
              isChecked
                ? 'border-primary bg-primary-50'
                : 'border-neutral-200 bg-white'
            }`}
          >
            <View className="flex-row items-center flex-1">
              {/* Checkbox square */}
              <View
                className={`w-5 h-5 rounded-md border-2 items-center justify-center mr-3 ${
                  isChecked ? 'border-primary bg-primary' : 'border-neutral-300 bg-white'
                }`}
              >
                {isChecked && (
                  <Text className="text-white text-xs font-extrabold leading-none">✓</Text>
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  isChecked ? 'text-primary font-semibold' : 'text-neutral-700'
                }`}
              >
                {opt.label}
              </Text>
            </View>
            {opt.priceDelta > 0 && (
              <Text className="text-xs font-bold text-primary ml-2">
                +${opt.priceDelta.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────
export default function MenuItemBottomSheet({
  item,
  visible,
  onClose,
}: MenuItemBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Quantity stepper
  const [quantity, setQuantity] = useState(1);

  // Customization state: radio selections (groupId → optionId)
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  // Checkbox selections (groupId → Set<optionId>)
  const [checkboxSelections, setCheckboxSelections] = useState<
    Record<string, Set<string>>
  >({});

  const addItem = useCartStore((s) => s.addItem);

  // Get customization config for this item
  const customization = item ? getCustomizationForItem(item.id) : undefined;

  // ── Initialise selections when item changes ────────────────────────────
  useEffect(() => {
    if (!item || !customization) return;
    const radios: Record<string, string> = {};
    const checks: Record<string, Set<string>> = {};

    customization.groups.forEach((group) => {
      if (group.type === 'radio') {
        // Pre-select first option for required groups
        radios[group.id] = (group.options[0] as RadioOption).id;
      } else {
        checks[group.id] = new Set(
          (group.options as CheckboxOption[])
            .filter((o) => o.isDefault)
            .map((o) => o.id),
        );
      }
    });

    setRadioSelections(radios);
    setCheckboxSelections(checks);
    setQuantity(1);
  }, [item?.id]);

  // ── Animate in / out ──────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // ── Price calculation ─────────────────────────────────────────────────
  const customizationTotal = useCallback(() => {
    if (!customization) return 0;
    let extra = 0;

    customization.groups.forEach((group) => {
      if (group.type === 'radio') {
        const selId = radioSelections[group.id];
        const opt = (group.options as RadioOption[]).find((o) => o.id === selId);
        if (opt) extra += opt.priceDelta;
      } else {
        const sel = checkboxSelections[group.id];
        if (sel) {
          (group.options as CheckboxOption[]).forEach((opt) => {
            if (sel.has(opt.id)) extra += opt.priceDelta;
          });
        }
      }
    });

    return extra;
  }, [customization, radioSelections, checkboxSelections]);

  const unitPrice = item ? item.price + customizationTotal() : 0;
  const totalPrice = unitPrice * quantity;

  // ── Add to cart ───────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!item) return;
    
    // Build array of human-readable customization labels
    const selectedLabels: string[] = [];
    if (customization) {
      customization.groups.forEach((group) => {
        if (group.type === 'radio') {
          const selId = radioSelections[group.id];
          const opt = (group.options as RadioOption[]).find((o) => o.id === selId);
          if (opt && opt.priceDelta > 0) selectedLabels.push(opt.label);
        } else {
          const sel = checkboxSelections[group.id];
          if (sel) {
            (group.options as CheckboxOption[]).forEach((opt) => {
              if (sel.has(opt.id)) selectedLabels.push(opt.label);
            });
          }
        }
      });
    }

    for (let i = 0; i < quantity; i++) {
      addItem(item, unitPrice, selectedLabels);
    }
    onClose();
  };

  // ── Radio handler ─────────────────────────────────────────────────────
  const handleRadioSelect = (groupId: string, optionId: string) => {
    setRadioSelections((prev) => ({ ...prev, [groupId]: optionId }));
  };

  // ── Checkbox handler ──────────────────────────────────────────────────
  const handleCheckboxToggle = (groupId: string, optionId: string) => {
    setCheckboxSelections((prev) => {
      const current = new Set(prev[groupId] ?? []);
      if (current.has(optionId)) {
        current.delete(optionId);
      } else {
        current.add(optionId);
      }
      return { ...prev, [groupId]: current };
    });
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            opacity: backdropAnim,
          }}
        />
      </TouchableWithoutFeedback>

      {/* ── Sheet ──────────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: SHEET_MAX_HEIGHT,
          backgroundColor: '#FAF8F6',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Pull handle */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 bg-neutral-300 rounded-full" />
        </View>

        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-neutral-100 rounded-full items-center justify-center"
        >
          <X size={18} color="#4A4239" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ── Hero Image ────────────────────────────────────────────── */}
          <View className="w-full h-56 bg-neutral-200">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Popular badge overlay */}
            {item.isPopular && (
              <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full">
                <Text className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                  ⭐ Popular
                </Text>
              </View>
            )}
          </View>

          {/* ── Item info ─────────────────────────────────────────────── */}
          <View className="px-5 pt-5 pb-3">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-xl font-extrabold text-neutral-950 flex-1 mr-4">
                {item.name}
              </Text>
              <Text className="text-xl font-extrabold text-primary">
                ${item.price.toFixed(2)}
              </Text>
            </View>

            {/* Meta row */}
            <View className="flex-row flex-wrap mb-3">
              {item.calories !== undefined && (
                <View className="bg-neutral-100 rounded-full px-2.5 py-1 mr-2 mb-1">
                  <Text className="text-xs text-neutral-500 font-medium">
                    {item.calories} kcal
                  </Text>
                </View>
              )}
              {item.prepTime !== undefined && (
                <View className="bg-neutral-100 rounded-full px-2.5 py-1 mr-2 mb-1">
                  <Text className="text-xs text-neutral-500 font-medium">
                    ~{item.prepTime} min prep
                  </Text>
                </View>
              )}
              {!item.isAvailable && (
                <View className="bg-neutral-200 rounded-full px-2.5 py-1 mb-1">
                  <Text className="text-xs text-neutral-500 font-bold">Unavailable</Text>
                </View>
              )}
            </View>

            <Text className="text-sm text-neutral-600 leading-6">{item.description}</Text>

            {/* Allergens */}
            {item.allergens && item.allergens.length > 0 && (
              <View className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <Text className="text-xs text-amber-700 font-semibold">
                  ⚠️ Contains: {item.allergens.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* ── Divider ───────────────────────────────────────────────── */}
          <View className="h-2 bg-neutral-100 mx-0 mb-3" />

          {/* ── Customization groups ──────────────────────────────────── */}
          {customization && customization.groups.length > 0 && (
            <View className="px-5 pb-2">
              <Text className="text-base font-extrabold text-neutral-900 mb-4">
                Customise Your Order
              </Text>
              {customization.groups.map((group) =>
                group.type === 'radio' ? (
                  <RadioGroup
                    key={group.id}
                    group={group}
                    selected={radioSelections[group.id] ?? ''}
                    onSelect={(optId) => handleRadioSelect(group.id, optId)}
                  />
                ) : (
                  <CheckboxGroup
                    key={group.id}
                    group={group}
                    selected={checkboxSelections[group.id] ?? new Set()}
                    onToggle={(optId) => handleCheckboxToggle(group.id, optId)}
                  />
                ),
              )}
              {/* Divider after customizations */}
              <View className="h-px bg-neutral-100 mb-5" />
            </View>
          )}

          {/* ── Quantity Stepper ──────────────────────────────────────── */}
          <View className="px-5 flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold text-neutral-900">Quantity</Text>
            <View className="flex-row items-center bg-white border border-neutral-200 rounded-2xl px-2 py-2">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 bg-neutral-100 rounded-xl items-center justify-center"
              >
                <Minus size={16} color={quantity === 1 ? '#D4CCC2' : colors.primary} strokeWidth={2.5} />
              </TouchableOpacity>

              <Text className="text-base font-extrabold text-neutral-950 mx-6">
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 bg-primary rounded-xl items-center justify-center"
              >
                <Plus size={16} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* ── Add to Cart CTA (fixed above safe area) ───────────────── */}
        <SafeAreaView
          className="absolute bottom-0 left-0 right-0 bg-neutral-50 border-t border-neutral-100 px-5 pt-3 pb-3"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 }}
        >
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={item.isAvailable ? 0.85 : 1}
            disabled={!item.isAvailable}
            className={`rounded-2xl py-4 flex-row items-center justify-between px-5 ${
              item.isAvailable ? 'bg-primary' : 'bg-neutral-300'
            }`}
          >
            {/* Left: shopping bag + quantity */}
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <ShoppingBag size={18} color="white" />
            </View>

            {/* Centre: label */}
            <Text className="text-white font-extrabold text-base flex-1 text-center">
              {item.isAvailable ? `Add ${quantity} to Cart` : 'Item Unavailable'}
            </Text>

            {/* Right: live price */}
            <Text className="text-white font-extrabold text-base">
              ${totalPrice.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}
