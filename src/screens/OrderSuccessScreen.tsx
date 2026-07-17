// src/screens/OrderSuccessScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle2, Bike, ClipboardList } from 'lucide-react-native';

import Button from '../components/Button';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import type { RootStackParamList } from '../navigation/types';

export default function OrderSuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderSuccess'>>();
  const { orderId, total } = route.params;

  useEffect(() => {
    // Prevent going back to checkout with hardware back
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, shadows.primarySm]}>
          <CheckCircle2 size={48} color="#fff" />
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.subtitle}>
          Your food is being prepared. We'll notify you when the rider is on the way.
        </Text>

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{orderId.replace('ord_', '')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Amount paid</Text>
            <Text style={styles.value}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>ETA</Text>
            <Text style={[styles.value, { color: colors.primary }]}>25–35 min</Text>
          </View>
        </View>

        <Button
          title="Track Order"
          onPress={() => navigation.replace('OrderTracking')}
          style={styles.primaryBtn}
        />

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('OrderDetails', { orderId })}
        >
          <ClipboardList size={18} color={colors.textPrimary} />
          <Text style={styles.secondaryText}>View order details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })}
        >
          <Bike size={16} color={colors.primary} />
          <Text style={styles.linkText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  value: { fontSize: 14, color: colors.textPrimary, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 6 },
  primaryBtn: { marginBottom: 12 },
  secondaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  secondaryText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  linkText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
