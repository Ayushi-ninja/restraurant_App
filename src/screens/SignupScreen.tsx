// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserStore } from '../store/userStore';
import { MOCK_USER } from '../data/users';
import Input from '../components/Input';
import Button from '../components/Button';
import { Soup } from 'lucide-react-native';
import { shadows } from '../theme/shadows';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const navigation = useNavigation();
  const login = useUserStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    setLoading(true);
    // Simulate API registration call
    setTimeout(() => {
      setLoading(false);
      // Log in with created details and direct to primary app flow
      login({
        ...MOCK_USER,
        name: data.name,
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
    <SafeAreaView className="flex-1 bg-neutral-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6 py-8">
            {/* Logo Area */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4 rotate-12" style={shadows.primarySm}>
                <Soup size={32} color="white" />
              </View>
              <Text className="text-3xl font-extrabold text-neutral-900">Create Account</Text>
              <Text className="text-sm text-neutral-500 mt-1">Sign up to get started</Text>
            </View>

            {/* Name Field */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Min. 8 characters"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Retype password"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {/* Sign Up CTA */}
            <Button
              title="Sign Up"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              className="mt-2 mb-4"
            />

            {/* Social Header */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="text-xs font-bold text-neutral-400 mx-4 uppercase tracking-wider">Or register with</Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row space-x-4 mb-6">
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 h-13 border border-neutral-200 bg-white rounded-xl items-center justify-center"
              >
                <Text className="text-sm font-bold text-neutral-800">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 h-13 bg-black rounded-xl items-center justify-center"
              >
                <Text className="text-sm font-bold text-white">Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Link back to login */}
            <View className="flex-row justify-center mb-6">
              <Text className="text-neutral-500 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text className="text-primary font-bold text-sm">Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Continue as Guest */}
            <TouchableOpacity onPress={handleGuestAccess} className="items-center py-2">
              <Text className="text-sm font-semibold text-neutral-600 underline">Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
