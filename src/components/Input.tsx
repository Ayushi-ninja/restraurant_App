// src/components/Input.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ label, error, isPassword, style, ...props }: InputProps) {
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View className="w-full mb-4">
      <Text className="text-sm font-semibold text-neutral-700 mb-1.5">{label}</Text>
      <View
        className={`w-full h-13 flex-row items-center border rounded-xl px-4 bg-white ${
          error ? 'border-red-500' : 'border-neutral-200 focus:border-primary'
        }`}
      >
        <TextInput
          secureTextEntry={secureText}
          className="flex-1 text-base text-neutral-900 h-full py-0"
          placeholderTextColor="#B0A898"
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            className="h-full items-center justify-center pl-2"
          >
            {secureText ? (
              <EyeOff size={20} color="#8C8278" />
            ) : (
              <Eye size={20} color="#8C8278" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1 font-medium">{error}</Text>}
    </View>
  );
}
