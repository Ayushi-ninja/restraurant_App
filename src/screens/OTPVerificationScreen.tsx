// src/screens/OTPVerificationScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';

import Button from '../components/Button';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

const OTP_LENGTH = 4;

export default function OTPVerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'OTPVerification'>>();
  const { email, purpose } = route.params;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const code = useMemo(() => digits.join(''), [digits]);
  const canSubmit = code.length === OTP_LENGTH;

  const updateDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (purpose === 'reset') {
        navigation.navigate('ResetPassword', { email });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
      }
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
          <Text style={styles.headerTitle}>Verify OTP</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={28} color={colors.primary} />
          </View>
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a {OTP_LENGTH}-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.otpRow}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(v) => updateDigit(index, v)}
                onKeyPress={({ nativeEvent }) => onKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                textAlign="center"
                returnKeyType="next"
              />
            ))}
          </View>

          <Button
            title="Verify Code"
            loading={loading}
            disabled={!canSubmit}
            onPress={handleVerify}
            style={styles.verifyBtn}
          />

          <TouchableOpacity
            disabled={seconds > 0}
            onPress={() => setSeconds(30)}
            style={styles.resendWrap}
          >
            <Text style={[styles.resend, seconds > 0 && styles.resendDisabled]}>
              {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
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
  content: { padding: 24, paddingTop: 32 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  email: { fontWeight: '700', color: colors.textPrimary },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
  },
  verifyBtn: { marginBottom: 20 },
  resendWrap: { alignItems: 'center', paddingVertical: 8 },
  resend: { fontSize: 14, fontWeight: '600', color: colors.primary },
  resendDisabled: { color: colors.textTertiary },
});
