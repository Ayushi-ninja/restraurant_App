// src/screens/LoginScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Soup } from 'lucide-react-native';

import { useUserStore } from '../store/userStore';
import { MOCK_USER } from '../data/users';
import Input from '../components/Input';
import Button from '../components/Button';
import { shadows } from '../theme/shadows';
import { colors } from '../theme/colors';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation();
  const login = useUserStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({
        ...MOCK_USER,
        email: data.email,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    }, 1500);
  };

  const handleGuestAccess = () => {
    useUserStore.getState().logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.logoBlock}>
              <View style={[styles.logo, shadows.primarySm]}>
                <Soup size={32} color="white" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to your account to continue</Text>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  inputRef={passwordRef}
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.signInBtn}
            />

            <Text style={styles.demoHint}>
              Demo: any valid email + 8+ char password
            </Text>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONNECT WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.socialBtn, styles.socialGoogle]}
                onPress={() =>
                  navigation.navigate('Placeholder', { title: 'Google Sign-In' })
                }
              >
                <Text style={styles.socialGoogleText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.socialBtn, styles.socialApple]}
                onPress={() =>
                  navigation.navigate('Placeholder', { title: 'Apple Sign-In' })
                }
              >
                <Text style={styles.socialAppleText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.signupPrompt}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleGuestAccess}
              style={styles.guestWrap}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.guestLink}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    transform: [{ rotate: '12deg' }],
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgot: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  signInBtn: {
    marginBottom: 16,
  },
  demoHint: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 0.6,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialGoogle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialApple: {
    backgroundColor: '#000000',
  },
  socialGoogleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E2820',
  },
  socialAppleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  guestWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
