// src/screens/OrderDetailsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Bike,
  Star,
} from 'lucide-react-native';

import { getOrderById } from '../data/orders';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { RootStackParamList } from '../navigation/types';

export default function OrderDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const order = getOrderById(route.params.orderId);

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

  const isDelivered = order.status === 'Delivered';
  const isActive = order.status === 'Preparing' || order.status === 'Out for delivery';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusPill,
                isDelivered && styles.statusDelivered,
                order.status === 'Cancelled' && styles.statusCancelled,
                isActive && styles.statusActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isDelivered && { color: '#065F46' },
                  order.status === 'Cancelled' && { color: '#991B1B' },
                  isActive && { color: colors.primaryDark },
                ]}
              >
                {order.status}
              </Text>
            </View>
            <Text style={styles.date}>{order.date}</Text>
          </View>

          <View style={styles.restaurantRow}>
            <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImg} />
            <View style={styles.flex}>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <Text style={styles.orderId}>#{order.id.replace('ord_', '')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Items</Text>
        <View style={[styles.card, shadows.sm]}>
          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < order.items.length - 1 && styles.itemBorder,
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
              <View style={styles.flex}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Delivery</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.infoRow}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.infoText}>{order.address}</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <CreditCard size={18} color={colors.primary} />
            <Text style={styles.infoText}>{order.paymentMethod}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Bill summary</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery fee</Text>
            <Text style={styles.billValue}>${order.deliveryFee.toFixed(2)}</Text>
          </View>
          {order.discount > 0 ? (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount</Text>
              <Text style={[styles.billValue, { color: colors.success }]}>
                -${order.discount.toFixed(2)}
              </Text>
            </View>
          ) : null}
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Total</Text>
            <Text style={styles.billTotalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {isActive ? (
          <TouchableOpacity
            style={[styles.cta, shadows.primarySm]}
            onPress={() => navigation.navigate('OrderTracking')}
          >
            <Bike size={18} color="#fff" />
            <Text style={styles.ctaText}>Track Order</Text>
          </TouchableOpacity>
        ) : null}

        {isDelivered ? (
          <TouchableOpacity
            style={[styles.ctaSecondary]}
            onPress={() => navigation.navigate('RateReview', { orderId: order.id })}
          >
            <Star size={18} color={colors.warning} />
            <Text style={styles.ctaSecondaryText}>Rate & Review</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
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
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  statusActive: { backgroundColor: colors.primaryLight },
  statusDelivered: { backgroundColor: colors.successBackground },
  statusCancelled: { backgroundColor: colors.errorBackground },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
  date: { fontSize: 12, color: colors.textTertiary, fontWeight: '600' },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  restaurantImg: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.surfaceSubtle },
  flex: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  orderId: { fontSize: 12, color: colors.textTertiary, marginTop: 2, fontWeight: '600' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  itemImg: { width: 48, height: 48, borderRadius: 10, backgroundColor: colors.surfaceSubtle },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  itemQty: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: { fontSize: 13, color: colors.textSecondary },
  billValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  billDivider: { height: 1, backgroundColor: colors.divider, marginVertical: 8 },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  billTotalValue: { fontSize: 15, fontWeight: '800', color: colors.primary },
  cta: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  ctaSecondary: {
    marginTop: 10,
    backgroundColor: colors.warningBackground,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ctaSecondaryText: { color: '#92400E', fontWeight: '800', fontSize: 15 },
});
