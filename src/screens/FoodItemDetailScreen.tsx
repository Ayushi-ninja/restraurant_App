// src/screens/FoodItemDetailScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ChevronLeft, Minus, Plus, ShoppingBag, Clock, Flame } from 'lucide-react-native';

import { MOCK_MENU_ITEMS } from '../data/menuItems';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { RootStackParamList } from '../navigation/types';

export default function FoodItemDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'FoodItemDetail'>>();
  const { menuItemId } = route.params;

  const item = MOCK_MENU_ITEMS.find((m) => m.id === menuItemId);
  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === item?.restaurantId);
  const addItem = useCartStore((s) => s.addItem);

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const total = useMemo(() => (item ? item.price * qty : 0), [item, qty]);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Item not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.missingBtn}>
            <Text style={styles.missingBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i += 1) {
      addItem(item, item.price, undefined, note || undefined);
    }
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: item.imageUrl }} style={styles.hero} />
          <SafeAreaView style={styles.heroOverlay}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {item.isPopular ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Popular</Text>
            </View>
          ) : null}

          <Text style={styles.name}>{item.name}</Text>
          {restaurant ? <Text style={styles.restaurant}>{restaurant.name}</Text> : null}
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.metaRow}>
            {item.calories != null ? (
              <View style={styles.metaChip}>
                <Flame size={14} color={colors.primary} />
                <Text style={styles.metaText}>{item.calories} kcal</Text>
              </View>
            ) : null}
            {item.prepTime != null ? (
              <View style={styles.metaChip}>
                <Clock size={14} color={colors.primary} />
                <Text style={styles.metaText}>{item.prepTime} min</Text>
              </View>
            ) : null}
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
          </View>

          {item.allergens && item.allergens.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergens</Text>
              <Text style={styles.sectionBody}>{item.allergens.join(' · ')}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special instructions</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setNote((n) => (n ? '' : 'No onions, extra sauce'))}
              style={styles.noteBox}
            >
              <Text style={note ? styles.noteFilled : styles.notePlaceholder}>
                {note || 'Tap to add a note (demo)'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.qtyRow}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.stepBtn}
              >
                <Minus size={16} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qty}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty((q) => q + 1)} style={styles.stepBtn}>
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TouchableOpacity
          activeOpacity={item.isAvailable ? 0.85 : 1}
          disabled={!item.isAvailable}
          onPress={handleAdd}
          style={[styles.cta, !item.isAvailable && styles.ctaDisabled, shadows.primaryMd]}
        >
          <View style={styles.ctaIcon}>
            <ShoppingBag size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.ctaText}>
            {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </Text>
          <Text style={styles.ctaPrice}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  missingTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  missingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  missingBtnText: { color: '#fff', fontWeight: '700' },
  heroWrap: { height: 280, backgroundColor: colors.surfaceSubtle },
  hero: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    marginLeft: 16,
    marginTop: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  body: { padding: 20, paddingBottom: 120 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  restaurant: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12 },
  desc: { fontSize: 14, lineHeight: 21, color: colors.textSecondary, marginBottom: 16 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  metaText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionBody: { fontSize: 13, color: colors.textSecondary, textTransform: 'capitalize' },
  noteBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.surface,
  },
  notePlaceholder: { color: colors.textTertiary, fontSize: 14 },
  noteFilled: { color: colors.textPrimary, fontSize: 14 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaDisabled: { backgroundColor: colors.borderStrong },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 16 },
  ctaPrice: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
