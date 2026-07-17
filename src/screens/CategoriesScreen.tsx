// src/screens/CategoriesScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ChevronLeft, Search } from 'lucide-react-native';

import RestaurantCard from '../components/RestaurantCard';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { RootStackParamList } from '../navigation/types';

const CATEGORIES = [
  { id: 'all', name: 'All Food', icon: '🍽️' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'ramen', name: 'Ramen', icon: '🍜' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'asian', name: 'Asian', icon: '🍣' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
];

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Categories'>>();
  const [selectedId, setSelectedId] = useState(route.params?.categoryId ?? 'all');
  const [query, setQuery] = useState('');

  const selected = CATEGORIES.find((c) => c.id === selectedId) ?? CATEGORIES[0];

  const restaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      const matchesCategory =
        selectedId === 'all' ||
        r.cuisine.some((c) => c.toLowerCase() === selected.name.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(selected.name.toLowerCase()));
      const matchesQuery =
        !query.trim() ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.join(' ').toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedId, selected.name, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchWrap}>
        <Search size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search in category..."
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((cat) => {
          const active = cat.id === selectedId;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedId(cat.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={styles.chipIcon}>{cat.icon}</Text>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <Text style={styles.resultLabel}>
          {restaurants.length} place{restaurants.length === 1 ? '' : 's'} · {selected.name}
        </Text>
        {restaurants.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptySub}>Try another category or search term.</Text>
          </View>
        ) : (
          restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: r.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  headerSpacer: { width: 40 },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 0 },
  chipRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: { fontSize: 14, marginRight: 6 },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  chipTextActive: { color: '#FFFFFF' },
  list: { padding: 16, paddingBottom: 40 },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 12,
  },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.textSecondary },
});
