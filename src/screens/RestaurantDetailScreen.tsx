// src/screens/RestaurantDetailScreen.tsx
// Full-featured detail page: hero, info, segmented tabs (Menu | Reviews | Info),
// cart-integrated menu items, and floating cart tray.

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import {
  MapPin,
  Clock,
  Bike,
  ChevronLeft,
  Heart,
  Star,
  Phone,
  Info,
  ThumbsUp,
} from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import { MOCK_RESTAURANTS } from '../data/restaurants';
import { getMenuItemsByRestaurant } from '../data/menuItems';
import { getReviewsByRestaurant, type Review } from '../data/reviews';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import MenuItemCard from '../components/MenuItemCard';
import MenuItemBottomSheet from '../components/MenuItemBottomSheet';
import CartTray from '../components/CartTray';
import type { MenuItem } from '../types';

type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

const HERO_HEIGHT = 280;
const SCREEN_WIDTH = Dimensions.get('window').width;
type TabKey = 'menu' | 'reviews' | 'info';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'menu', label: 'Menu' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'info', label: 'Info' },
];

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="bg-white border border-neutral-100 rounded-2xl p-4 mb-3">
      {/* Header row */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: review.avatarUrl }}
          className="w-10 h-10 rounded-full bg-neutral-200 mr-3"
        />
        <View className="flex-1">
          <Text className="text-sm font-bold text-neutral-900">{review.userName}</Text>
          <Text className="text-xs text-neutral-400">{date}</Text>
        </View>
        {/* Stars */}
        <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full">
          <Star size={12} color={colors.star} fill={colors.star} />
          <Text className="text-xs font-bold text-amber-700 ml-1">{review.rating}.0</Text>
        </View>
      </View>

      {/* Comment */}
      <Text className="text-sm text-neutral-600 leading-5">{review.comment}</Text>

      {/* Footer */}
      <View className="flex-row items-center mt-3">
        <ThumbsUp size={13} color="#B0A898" />
        <Text className="text-xs text-neutral-400 ml-1.5">
          {review.helpful} found this helpful
        </Text>
      </View>
    </View>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────
function InfoTab({ restaurant }: { restaurant: (typeof MOCK_RESTAURANTS)[0] }) {
  const hours = [
    { day: 'Monday – Friday', time: '11:00 AM – 10:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 11:00 PM' },
    { day: 'Sunday', time: '11:00 AM – 9:00 PM' },
  ];

  return (
    <View className="pb-8">
      {/* Map placeholder */}
      <View className="mx-4 h-44 bg-neutral-200 rounded-2xl items-center justify-center mb-5 overflow-hidden border border-neutral-200">
        <View className="items-center">
          <MapPin size={32} color={colors.primary} />
          <Text className="text-sm font-semibold text-neutral-500 mt-2">Map coming soon</Text>
          <Text className="text-xs text-neutral-400 mt-1 text-center px-6">
            {restaurant.address}
          </Text>
        </View>
      </View>

      {/* Detail cards */}
      <View className="mx-4 space-y-3">
        {/* Address */}
        <View className="bg-white border border-neutral-100 rounded-2xl p-4">
          <View className="flex-row items-center mb-1">
            <MapPin size={16} color={colors.primary} />
            <Text className="text-sm font-bold text-neutral-900 ml-2">Address</Text>
          </View>
          <Text className="text-sm text-neutral-600">{restaurant.address}</Text>
        </View>

        {/* Phone */}
        <View className="bg-white border border-neutral-100 rounded-2xl p-4 mt-3">
          <View className="flex-row items-center mb-1">
            <Phone size={16} color={colors.primary} />
            <Text className="text-sm font-bold text-neutral-900 ml-2">Phone</Text>
          </View>
          <Text className="text-sm text-primary font-semibold">+1 (555) 800-1234</Text>
        </View>

        {/* Hours */}
        <View className="bg-white border border-neutral-100 rounded-2xl p-4 mt-3">
          <View className="flex-row items-center mb-3">
            <Clock size={16} color={colors.primary} />
            <Text className="text-sm font-bold text-neutral-900 ml-2">Opening Hours</Text>
          </View>
          {hours.map((h) => (
            <View key={h.day} className="flex-row justify-between py-1.5 border-b border-neutral-50 last:border-0">
              <Text className="text-xs text-neutral-500">{h.day}</Text>
              <Text className="text-xs font-semibold text-neutral-800">{h.time}</Text>
            </View>
          ))}
        </View>

        {/* Status pill */}
        <View className="mt-3 items-center">
          <View className={`px-5 py-2 rounded-full ${restaurant.isOpen ? 'bg-emerald-50' : 'bg-neutral-100'}`}>
            <Text className={`text-sm font-bold ${restaurant.isOpen ? 'text-emerald-700' : 'text-neutral-500'}`}>
              {restaurant.isOpen ? '● Currently Open' : '● Currently Closed'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function RestaurantDetailScreen() {
  const route = useRoute<RestaurantDetailRouteProp>();
  const navigation = useNavigation();
  const { restaurantId } = route.params;

  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Favorites store
  const favoriteRestaurantIds = useUserStore((s) => s.favoriteRestaurantIds);
  const toggleFavoriteRestaurant = useUserStore((s) => s.toggleFavoriteRestaurant);
  const liked = favoriteRestaurantIds.includes(restaurantId);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Bottom sheet state
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  // Cart store
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());

  // Data
  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);
  const menuItems = useMemo(() => getMenuItemsByRestaurant(restaurantId), [restaurantId]);
  const reviews = useMemo(() => getReviewsByRestaurant(restaurantId), [restaurantId]);

  const categories = useMemo(
    () => [...new Set(menuItems.map((i) => i.category))],
    [menuItems],
  );
  const filteredItems = useMemo(
    () => (activeCategory ? menuItems.filter((i) => i.category === activeCategory) : menuItems),
    [menuItems, activeCategory],
  );

  const getItemQuantity = useCallback(
    (itemId: string) => cartItems.find((ci) => ci.menuItem.id === itemId)?.quantity ?? 0,
    [cartItems],
  );

  // Animated header: compress title opacity as you scroll the hero out of view
  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 90, HERO_HEIGHT - 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <Text className="text-base text-neutral-500">Restaurant not found.</Text>
      </SafeAreaView>
    );
  }

  const deliveryLabel =
    restaurant.deliveryFee === 0
      ? 'Free delivery'
      : `$${restaurant.deliveryFee.toFixed(2)} delivery`;

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" />

      {/* ── Animated condensed header (appears on scroll) ───────────────── */}
      <Animated.View
        style={{
          opacity: headerOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingTop: 44, // status bar height
          paddingBottom: 10,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-8 h-8 items-center justify-center mr-3"
        >
          <ChevronLeft size={22} color="#1A1410" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-neutral-950 flex-1" numberOfLines={1}>
          {restaurant.name}
        </Text>
      </Animated.View>

      {/* ── Main scrollable body ─────────────────────────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: totalItems > 0 ? 120 : 32,
        }}
      >
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <View style={{ height: HERO_HEIGHT, position: 'relative' }}>
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={{ height: HERO_HEIGHT, width: '100%' }}
            resizeMode="cover"
          />
          {/* Scrim */}
          <View
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.22)',
            }}
          />

          {/* Back + Favourite buttons always on top */}
          <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={[{ backgroundColor: 'rgba(255,255,255,0.92)' }, shadows.sm]}
              >
                <ChevronLeft size={22} color="#1A1410" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleFavoriteRestaurant(restaurantId)}
                activeOpacity={0.85}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={[{ backgroundColor: 'rgba(255,255,255,0.92)' }, shadows.sm]}
              >
                <Heart
                  size={20}
                  color={liked ? colors.primary : '#2E2820'}
                  fill={liked ? colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Open / Closed badge at bottom-left of hero */}
          <View className="absolute bottom-4 left-5">
            <View
              className={`px-3 py-1 rounded-full ${
                restaurant.isOpen ? 'bg-emerald-500' : 'bg-neutral-600'
              }`}
            >
              <Text className="text-white text-xs font-bold">
                {restaurant.isOpen ? '● Open Now' : '● Closed'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── INFO CARD (floats up over the hero) ───────────────────────── */}
        <View className="bg-white mx-4 -mt-5 rounded-2xl px-5 py-4 border border-neutral-100 mb-3">
          {/* Name + rating row */}
          <View className="flex-row items-start justify-between mb-1">
            <Text
              className="text-xl font-extrabold text-neutral-950 flex-1 mr-3"
              numberOfLines={1}
            >
              {restaurant.name}
            </Text>
            <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full">
              <Star size={13} color={colors.star} fill={colors.star} />
              <Text className="text-sm font-bold text-amber-700 ml-1">
                {restaurant.rating.toFixed(1)}
              </Text>
              <Text className="text-xs text-amber-500 ml-1">
                ({restaurant.reviewCount > 999
                  ? `${(restaurant.reviewCount / 1000).toFixed(1)}k`
                  : restaurant.reviewCount})
              </Text>
            </View>
          </View>

          {/* Cuisine tags */}
          <View className="flex-row flex-wrap mb-3">
            {restaurant.cuisine.map((c) => (
              <View key={c} className="bg-neutral-100 rounded-full px-2.5 py-0.5 mr-1.5 mb-1">
                <Text className="text-xs text-neutral-600 font-medium">{c}</Text>
              </View>
            ))}
          </View>

          {/* Stats row */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-5">
              <Clock size={14} color="#8C8278" />
              <Text className="text-xs font-semibold text-neutral-600 ml-1.5">
                {restaurant.deliveryTime} mins
              </Text>
            </View>
            <View className="flex-row items-center mr-5">
              <Bike size={14} color="#8C8278" />
              <Text className="text-xs font-semibold text-neutral-600 ml-1.5">
                {deliveryLabel}
              </Text>
            </View>
            {restaurant.distance && (
              <View className="flex-row items-center">
                <MapPin size={14} color="#8C8278" />
                <Text className="text-xs font-semibold text-neutral-600 ml-1.5">
                  {restaurant.distance}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── SEGMENTED TAB BAR ─────────────────────────────────────────── */}
        <View className="bg-white border-b border-neutral-100 mb-1">
          <View className="flex-row mx-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className="mr-8 pb-3 pt-2"
                  style={{
                    borderBottomWidth: isActive ? 2 : 0,
                    borderBottomColor: colors.primary,
                  }}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? 'text-primary' : 'text-neutral-400'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── MENU TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'menu' && (
          <View>
            {/* Category filter pills */}
            {categories.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
              >
                <TouchableOpacity
                  onPress={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-full mr-2 border ${
                    activeCategory === null
                      ? 'bg-primary border-primary'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      activeCategory === null ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full mr-2 border ${
                      activeCategory === cat
                        ? 'bg-primary border-primary'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        activeCategory === cat ? 'text-white' : 'text-neutral-600'
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Menu items grouped by category */}
            <View className="px-4 pt-2">
              {filteredItems.length === 0 ? (
                <View className="py-10 items-center">
                  <Text className="text-sm text-neutral-400">No items in this category.</Text>
                </View>
              ) : (
                categories
                  .filter((cat) => !activeCategory || cat === activeCategory)
                  .map((cat) => {
                    const catItems = filteredItems.filter((i: MenuItem) => i.category === cat);
                    if (catItems.length === 0) return null;
                    return (
                      <View key={cat}>
                        <Text className="text-base font-extrabold text-neutral-800 mb-3 mt-2">
                          {cat}
                        </Text>
                        {catItems.map((item: MenuItem) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            quantity={getItemQuantity(item.id)}
                            onAdd={() => addItem(item, item.price, [])}
                            onRemove={() => removeItem(item.id)}
                            onTap={() => {
                              navigation.navigate('FoodItemDetail', { menuItemId: item.id });
                            }}
                          />
                        ))}
                      </View>
                    );
                  })
              )}
            </View>
          </View>
        )}

        {/* ── REVIEWS TAB ───────────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <View className="px-4 pt-4">
            {/* Summary row */}
            <View className="bg-white border border-neutral-100 rounded-2xl p-4 mb-4 flex-row items-center">
              <View className="items-center mr-5">
                <Text className="text-4xl font-extrabold text-neutral-950">
                  {restaurant.rating.toFixed(1)}
                </Text>
                <View className="flex-row mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      color={colors.star}
                      fill={s <= Math.round(restaurant.rating) ? colors.star : 'transparent'}
                    />
                  ))}
                </View>
                <Text className="text-xs text-neutral-400 mt-1">
                  {restaurant.reviewCount} reviews
                </Text>
              </View>
              <View className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2;
                  return (
                    <View key={star} className="flex-row items-center mb-1">
                      <Text className="text-xs text-neutral-400 w-3">{star}</Text>
                      <Star size={9} color={colors.star} fill={colors.star} style={{ marginHorizontal: 4 }} />
                      <View className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden mx-2">
                        <View
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </View>
                      <Text className="text-xs text-neutral-400 w-7 text-right">{pct}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {reviews.length === 0 ? (
              <View className="py-10 items-center">
                <Text className="text-sm text-neutral-400">No reviews yet.</Text>
              </View>
            ) : (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </View>
        )}

        {/* ── INFO TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'info' && (
          <View className="pt-4">
            <InfoTab restaurant={restaurant} />
          </View>
        )}
      </Animated.ScrollView>

      {/* ── MENU ITEM BOTTOM SHEET ────────────────────────────────────────── */}
      <MenuItemBottomSheet
        item={selectedMenuItem}
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
      />

      {/* ── FLOATING CART TRAY ────────────────────────────────────────────── */}
      <CartTray
        totalItems={totalItems}
        subtotal={subtotal}
        onPress={() => navigation.navigate('Cart')}
      />
    </View>
  );
}
