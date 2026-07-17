// src/screens/OffersScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, TicketPercent, Copy, Check } from 'lucide-react-native';

import { MOCK_OFFERS } from '../data/offers';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';

export default function OffersScreen() {
  const navigation = useNavigation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    setCopiedId(id);
    Alert.alert('Coupon copied', `${code} is ready to use at checkout.`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & Coupons</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Grab a deal before it expires. Apply codes at checkout.</Text>

        {MOCK_OFFERS.map((offer) => {
          const isCopied = copiedId === offer.id;
          return (
            <View key={offer.id} style={[styles.card, shadows.sm]}>
              <View style={[styles.ribbon, { backgroundColor: offer.color }]}>
                <TicketPercent size={16} color="#fff" />
                <Text style={styles.ribbonText}>{offer.discountLabel}</Text>
              </View>

              <Text style={styles.title}>{offer.title}</Text>
              <Text style={styles.desc}>{offer.description}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>Min. ${offer.minOrder.toFixed(0)}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.meta}>Expires {offer.expiresAt}</Text>
              </View>

              <View style={styles.codeRow}>
                <View style={styles.codeBox}>
                  <Text style={styles.code}>{offer.code}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCopy(offer.id, offer.code)}
                  style={[styles.copyBtn, isCopied && styles.copyBtnDone]}
                >
                  {isCopied ? (
                    <Check size={16} color="#fff" />
                  ) : (
                    <Copy size={16} color="#fff" />
                  )}
                  <Text style={styles.copyText}>{isCopied ? 'Copied' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  list: { padding: 16, paddingBottom: 40 },
  intro: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  ribbon: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  ribbonText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  title: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  desc: { fontSize: 13, lineHeight: 19, color: colors.textSecondary, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  meta: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  metaDot: { marginHorizontal: 6, color: colors.textTertiary },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  codeBox: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceSubtle,
  },
  code: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textPrimary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  copyBtnDone: { backgroundColor: colors.success },
  copyText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
