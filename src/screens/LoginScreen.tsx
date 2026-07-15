// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserStore } from '../store/userStore';
import { MOCK_USER } from '../data/users';
import Input from '../components/Input';
import Button from '../components/Button';
import { Soup } from 'lucide-react-native';
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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Log in with mock user matching the email, or fallback to Alex
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
    // Navigate to Home layout without setting an active user session (guest)
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
            {/* Logo area */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4 rotate-12 shadow-lg shadow-primary/20">
                <Soup size={32} color="white" />
              </View>
              <Text className="text-3xl font-extrabold text-neutral-900">Welcome Back</Text>
              <Text className="text-sm text-neutral-500 mt-1">Log in to your account to continue</Text>
            </View>

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
                  placeholder="Enter your password"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity className="align-self-end mb-6">
              <Text className="text-sm font-semibold text-primary text-right">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In CTA */}
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              className="mb-4"
            />

            {/* Social Logins Header */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="text-xs font-bold text-neutral-400 mx-4 uppercase tracking-wider">Or connect with</Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            {/* Social Logins Buttons */}
            <View className="flex-row space-x-4 mb-6">
              {/* Google Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 h-13 border border-neutral-200 bg-white rounded-xl items-center justify-center flex-row"
              >
                <Text className="text-sm font-bold text-neutral-800">Google</Text>
              </TouchableOpacity>
              {/* Apple Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 h-13 bg-black rounded-xl items-center justify-center flex-row"
              >
                <Text className="text-sm font-bold text-white">Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation to Signup */}
            <View className="flex-row justify-center mb-6">
              <Text className="text-neutral-500 text-sm">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
                <Text className="text-primary font-bold text-sm">Sign Up</Text>
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
