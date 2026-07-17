// src/screens/RateReviewScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ChevronLeft, Star } from 'lucide-react-native';

import Button from '../components/Button';
import { getOrderById } from '../data/orders';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { RootStackParamList } from '../navigation/types';

const TAGS = ['Tasty', 'Hot & fresh', 'On time', 'Packaging', 'Value', 'Friendly rider'];

export default function RateReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RateReview'>>();
  const order = getOrderById(route.params.orderId);

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Order not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.missingBtn}>
            <Text style={styles.missingBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Add a rating', 'Please tap a star rating before submitting.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Thanks!', 'Your review helps other food lovers.', [
        {
          text: 'Done',
          onPress: () => navigation.navigate('Tabs', { screen: 'Orders' }),
        },
      ]);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate & Review</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, shadows.sm]}>
            <Image source={{ uri: order.restaurantImage }} style={styles.img} />
            <Text style={styles.restaurant}>{order.restaurantName}</Text>
            <Text style={styles.meta}>
              Order #{order.id.replace('ord_', '')} · {order.date}
            </Text>
          </View>

          <Text style={styles.label}>How was your order?</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= rating;
              return (
                <TouchableOpacity key={value} onPress={() => setRating(value)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Star
                    size={36}
                    color={active ? colors.star : colors.borderStrong}
                    fill={active ? colors.star : 'transparent'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>What stood out?</Text>
          <View style={styles.tags}>
            {TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tag, active && styles.tagActive]}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Write a review</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Tell others what you loved (or what could be better)..."
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
            style={styles.input}
          />

          <Button title="Submit Review" loading={loading} onPress={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  missingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  missingBtnText: { color: '#fff', fontWeight: '700' },
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
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  img: { width: 72, height: 72, borderRadius: 16, marginBottom: 12, backgroundColor: colors.surfaceSubtle },
  restaurant: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  meta: { fontSize: 12, color: colors.textTertiary, marginTop: 4, fontWeight: '600' },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tagTextActive: { color: colors.primary },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 20,
  },
});
