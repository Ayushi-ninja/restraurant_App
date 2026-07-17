// src/screens/SearchScreen.tsx
// Full search: auto-focus, recent searches, live restaurant+dish filter, filter/sort sheet
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SectionList,
  Image,
  ScrollView,
  Modal,
  Animated,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import {
  Search,
  X,
  SlidersHorizontal,
  Clock,
  Star,
  Bike,
  Leaf,
  ChevronDown,
} from 'lucide-react-native';

import { MOCK_RESTAURANTS } from '../data/restaurants';
import { MOCK_MENU_ITEMS } from '../data/menuItems';
import { colors } from '../theme/colors';
import RestaurantCard from '../components/RestaurantCard';
import type { Restaurant, MenuItem } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// ─── Static data ──────────────────────────────────────────────────────────────
const RECENT_SEARCHES = ['Smash Burger', 'Tonkotsu Ramen', 'Vegan Bowl', 'The Smoky Grill'];
const CUISINE_OPTIONS = ['All', 'American', 'BBQ', 'Japanese', 'Asian', 'Vegan', 'Healthy'];
const RATING_OPTIONS = [{ label: 'Any', value: 0 }, { label: '3.5+', value: 3.5 }, { label: '4.0+', value: 4 }, { label: '4.5+', value: 4.5 }];
const DELIVERY_OPTIONS = [{ label: 'Any', value: 999 }, { label: '< 30 min', value: 30 }, { label: '< 45 min', value: 45 }];

// ─── Types ────────────────────────────────────────────────────────────────────
interface FilterState {
  cuisine: string;
  minRating: number;
  maxDelivery: number;
  vegOnly: boolean;
}
const DEFAULT_FILTERS: FilterState = {
  cuisine: 'All',
  minRating: 0,
  maxDelivery: 999,
  vegOnly: false,
};

// ─── Dish Result Card ─────────────────────────────────────────────────────────
function DishResultCard({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row bg-white rounded-2xl mb-3 border border-neutral-100 overflow-hidden"
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-24 h-24 bg-neutral-100"
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          {item.isPopular && (
            <View className="bg-primary-50 self-start px-2 py-0.5 rounded-full mb-1">
              <Text className="text-[10px] font-bold text-primary uppercase tracking-wide">Popular</Text>
            </View>
          )}
          <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>{item.name}</Text>
          <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>{item.description}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-sm font-extrabold text-neutral-950">${item.price.toFixed(2)}</Text>
          {item.calories !== undefined && (
            <Text className="text-xs text-neutral-400">{item.calories} kcal</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Filter Sheet ─────────────────────────────────────────────────────────────
function FilterSheet({
  visible,
  filters,
  onApply,
  onClose,
}: {
  visible: boolean;
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => { setDraft(filters); }, [filters]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const resetDraft = () => setDraft(DEFAULT_FILTERS);
  const activeFilterCount = [
    draft.cuisine !== 'All',
    draft.minRating > 0,
    draft.maxDelivery < 999,
    draft.vegOnly,
  ].filter(Boolean).length;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropAnim }}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          maxHeight: SCREEN_HEIGHT * 0.88,
          backgroundColor: '#FAF8F6',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          overflow: 'hidden',
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Handle */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 bg-neutral-300 rounded-full" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-neutral-100">
          <Text className="text-lg font-extrabold text-neutral-950">Filters</Text>
          <TouchableOpacity onPress={resetDraft}>
            <Text className="text-sm font-bold text-primary">Reset{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          {/* ── Cuisine ─────────────────────────────────────────────── */}
          <Text className="text-sm font-extrabold text-neutral-900 mb-3">Cuisine</Text>
          <View className="flex-row flex-wrap mb-6">
            {CUISINE_OPTIONS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setDraft((d) => ({ ...d, cuisine: c }))}
                className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
                  draft.cuisine === c ? 'bg-primary border-primary' : 'bg-white border-neutral-200'
                }`}
              >
                <Text className={`text-xs font-bold ${draft.cuisine === c ? 'text-white' : 'text-neutral-600'}`}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Min Rating ──────────────────────────────────────────── */}
          <Text className="text-sm font-extrabold text-neutral-900 mb-3">Min Rating</Text>
          <View className="flex-row mb-6">
            {RATING_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => setDraft((d) => ({ ...d, minRating: opt.value }))}
                className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${
                  draft.minRating === opt.value ? 'bg-primary border-primary' : 'bg-white border-neutral-200'
                }`}
              >
                {opt.value > 0 && <Star size={12} color={draft.minRating === opt.value ? 'white' : colors.star} fill={draft.minRating === opt.value ? 'white' : colors.star} />}
                <Text className={`text-xs font-bold ml-1 ${draft.minRating === opt.value ? 'text-white' : 'text-neutral-600'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Max Delivery Time ────────────────────────────────────── */}
          <Text className="text-sm font-extrabold text-neutral-900 mb-3">Delivery Time</Text>
          <View className="flex-row mb-6">
            {DELIVERY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => setDraft((d) => ({ ...d, maxDelivery: opt.value }))}
                className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${
                  draft.maxDelivery === opt.value ? 'bg-primary border-primary' : 'bg-white border-neutral-200'
                }`}
              >
                {opt.value < 999 && <Bike size={12} color={draft.maxDelivery === opt.value ? 'white' : '#8C8278'} />}
                <Text className={`text-xs font-bold ml-1 ${draft.maxDelivery === opt.value ? 'text-white' : 'text-neutral-600'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Veg Only ─────────────────────────────────────────────── */}
          <View className="flex-row items-center justify-between bg-white border border-neutral-100 rounded-2xl px-4 py-4 mb-8">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
                <Leaf size={16} color="#10B981" />
              </View>
              <View>
                <Text className="text-sm font-bold text-neutral-900">Veg Only</Text>
                <Text className="text-xs text-neutral-500">Show vegetarian & vegan options</Text>
              </View>
            </View>
            <Switch
              value={draft.vegOnly}
              onValueChange={(v) => setDraft((d) => ({ ...d, vegOnly: v }))}
              trackColor={{ false: '#E5E0DB', true: '#10B981' }}
              thumbColor="white"
            />
          </View>
        </ScrollView>

        {/* Apply CTA */}
        <SafeAreaView className="px-5 pt-3 pb-3 bg-neutral-50 border-t border-neutral-100">
          <TouchableOpacity
            onPress={() => { onApply(draft); onClose(); }}
            className="bg-primary rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-extrabold text-base">Apply Filters</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  const addRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => [term, ...prev.filter((r) => r !== term)].slice(0, 8));
  }, []);

  const handleSubmit = () => {
    addRecentSearch(query.trim());
  };

  const handleRecentTap = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((r) => r !== term));
  };

  // ── Filtering logic ────────────────────────────────────────────────────────
  const { matchedRestaurants, matchedDishes } = useMemo(() => {
    const q = query.toLowerCase().trim();

    // Veg restaurantIds (for veg-only filter, use Verde Kitchen r3 as mock veg)
    const vegRestaurantIds = ['r3'];

    let restaurants = MOCK_RESTAURANTS.filter((r) => {
      if (filters.vegOnly && !vegRestaurantIds.includes(r.id)) return false;
      if (filters.minRating > 0 && r.rating < filters.minRating) return false;
      if (filters.maxDelivery < 999) {
        const minEta = parseInt(r.deliveryTime.split('–')[0], 10);
        if (minEta > filters.maxDelivery) return false;
      }
      if (filters.cuisine !== 'All' && !r.cuisine.some((c) => c.toLowerCase() === filters.cuisine.toLowerCase())) return false;
      return true;
    });

    let dishes = MOCK_MENU_ITEMS.filter((i) => {
      if (filters.vegOnly) {
        const r = MOCK_RESTAURANTS.find((r) => r.id === i.restaurantId);
        if (r && !vegRestaurantIds.includes(r.id)) return false;
      }
      return true;
    });

    if (q.length > 0) {
      restaurants = restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)),
      );
      dishes = dishes.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    } else if (q.length === 0) {
      // If no query, show restaurants matching filters but no dish results
      dishes = [];
    }

    return { matchedRestaurants: restaurants, matchedDishes: dishes };
  }, [query, filters]);

  const activeFilterCount = [
    filters.cuisine !== 'All',
    filters.minRating > 0,
    filters.maxDelivery < 999,
    filters.vegOnly,
  ].filter(Boolean).length;

  const isShowingResults = query.trim().length > 0 || activeFilterCount > 0;

  // ── Sections for SectionList (need uniform item type) ──────────────────────
  // Wrap each in a discriminated union so one SectionList can hold both
  type SearchItem =
    | { kind: 'restaurant'; payload: Restaurant }
    | { kind: 'dish'; payload: MenuItem };

  const sections: { title: string; data: SearchItem[] }[] = useMemo(() => {
    const s: { title: string; data: SearchItem[] }[] = [];
    if (matchedRestaurants.length > 0) {
      s.push({
        title: 'Restaurants',
        data: matchedRestaurants.map((r) => ({ kind: 'restaurant' as const, payload: r })),
      });
    }
    if (matchedDishes.length > 0) {
      s.push({
        title: 'Dishes',
        data: matchedDishes.map((d) => ({ kind: 'dish' as const, payload: d })),
      });
    }
    return s;
  }, [matchedRestaurants, matchedDishes]);

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <SafeAreaView className="bg-white z-10 border-b border-neutral-100">
        <View className="px-5 py-4">
          <Text className="text-2xl font-extrabold text-neutral-950 mb-4">Search</Text>
          <View className="flex-row items-center">
            {/* Search input */}
            <View className={`flex-1 flex-row items-center bg-neutral-100 rounded-2xl px-4 h-12 mr-3 ${isFocused ? 'border border-primary' : ''}`}>
              <Search size={18} color={isFocused ? colors.primary : '#A39D96'} />
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSubmitEditing={handleSubmit}
                placeholder="Restaurants, dishes, cuisines…"
                placeholderTextColor="#A39D96"
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                className="flex-1 text-sm font-medium text-neutral-900 ml-3 h-full"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={16} color="#A39D96" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter button */}
            <TouchableOpacity
              onPress={() => setShowFilterSheet(true)}
              className={`w-12 h-12 rounded-2xl items-center justify-center relative ${
                activeFilterCount > 0 ? 'bg-primary' : 'bg-neutral-100'
              }`}
            >
              <SlidersHorizontal size={18} color={activeFilterCount > 0 ? 'white' : '#4A4239'} />
              {activeFilterCount > 0 && (
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-[9px] font-extrabold">{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
          >
            {filters.cuisine !== 'All' && (
              <View className="flex-row items-center bg-primary-50 border border-primary rounded-full px-3 py-1 mr-2">
                <Text className="text-xs font-bold text-primary mr-1">{filters.cuisine}</Text>
                <TouchableOpacity onPress={() => setFilters((f) => ({ ...f, cuisine: 'All' }))}>
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.minRating > 0 && (
              <View className="flex-row items-center bg-primary-50 border border-primary rounded-full px-3 py-1 mr-2">
                <Star size={11} color={colors.primary} fill={colors.primary} />
                <Text className="text-xs font-bold text-primary mx-1">{filters.minRating}+</Text>
                <TouchableOpacity onPress={() => setFilters((f) => ({ ...f, minRating: 0 }))}>
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.maxDelivery < 999 && (
              <View className="flex-row items-center bg-primary-50 border border-primary rounded-full px-3 py-1 mr-2">
                <Bike size={11} color={colors.primary} />
                <Text className="text-xs font-bold text-primary mx-1">&lt;{filters.maxDelivery} min</Text>
                <TouchableOpacity onPress={() => setFilters((f) => ({ ...f, maxDelivery: 999 }))}>
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.vegOnly && (
              <View className="flex-row items-center bg-emerald-50 border border-emerald-400 rounded-full px-3 py-1 mr-2">
                <Leaf size={11} color="#10B981" />
                <Text className="text-xs font-bold text-emerald-700 mx-1">Veg Only</Text>
                <TouchableOpacity onPress={() => setFilters((f) => ({ ...f, vegOnly: false }))}>
                  <X size={12} color="#10B981" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      {/* ── BODY ──────────────────────────────────────────────────────── */}
      {!isShowingResults ? (
        /* Recent Searches */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          {recentSearches.length > 0 && (
            <>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-extrabold text-neutral-900">Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text className="text-xs font-bold text-neutral-400">Clear all</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap">
                {recentSearches.map((term) => (
                  <View key={term} className="flex-row items-center bg-white border border-neutral-200 rounded-full pl-3 pr-2 py-2 mr-2 mb-2">
                    <Clock size={13} color="#A39D96" />
                    <TouchableOpacity onPress={() => handleRecentTap(term)}>
                      <Text className="text-sm font-medium text-neutral-700 mx-2">{term}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeRecent(term)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                      <X size={13} color="#C4BDB5" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Suggested cuisines */}
          <Text className="text-sm font-extrabold text-neutral-900 mt-6 mb-3">Browse Cuisines</Text>
          <View className="flex-row flex-wrap">
            {CUISINE_OPTIONS.filter((c) => c !== 'All').map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setFilters((f) => ({ ...f, cuisine: c }));
                  setQuery(c);
                }}
                className="px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl mr-2 mb-2"
              >
                <Text className="text-sm font-semibold text-neutral-700">{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : sections.length === 0 ? (
        /* Empty results */
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-5">
            <Search size={36} color="#D4CCC2" />
          </View>
          <Text className="text-xl font-bold text-neutral-900 mb-2">No Results</Text>
          <Text className="text-sm text-neutral-500 text-center leading-5">
            Nothing matched "{query}". Try a different keyword or adjust your filters.
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity
              onPress={() => setFilters(DEFAULT_FILTERS)}
              className="mt-5 bg-primary px-6 py-3 rounded-2xl"
            >
              <Text className="text-white font-bold text-sm">Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Sectioned results */
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.payload.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderSectionHeader={({ section }) => (
            <View className="flex-row items-center justify-between mb-3 mt-2">
              <Text className="text-base font-extrabold text-neutral-900">{section.title}</Text>
              <Text className="text-xs font-bold text-neutral-400">{section.data.length} found</Text>
            </View>
          )}
          renderItem={({ item, section }) => {
            if (item.kind === 'restaurant') {
              return (
                <RestaurantCard
                  restaurant={item.payload}
                  onPress={() => {
                    addRecentSearch(item.payload.name);
                    navigation.navigate('RestaurantDetail', { restaurantId: item.payload.id });
                  }}
                />
              );
            }
            return (
              <DishResultCard
                item={item.payload}
                onPress={() => {
                  addRecentSearch(item.payload.name);
                  navigation.navigate('RestaurantDetail', { restaurantId: item.payload.restaurantId });
                }}
              />
            );
          }}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* ── FILTER SHEET ──────────────────────────────────────────────── */}
      <FilterSheet
        visible={showFilterSheet}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilterSheet(false)}
      />
    </View>
  );
}
