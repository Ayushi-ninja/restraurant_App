// src/components/Input.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  inputRef?: React.Ref<TextInput>;
}

export default function Input({
  label,
  error,
  isPassword,
  style,
  onFocus,
  onBlur,
  inputRef,
  ...props
}: InputProps) {
  const [secureText, setSecureText] = useState(!!isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          {
            borderColor: error
              ? colors.error
              : focused
                ? colors.primary
                : colors.border,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          secureTextEntry={secureText}
          style={[styles.input, style]}
          placeholderTextColor="#B0A898"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setSecureText((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.eye}
            accessibilityRole="button"
            accessibilityLabel={secureText ? 'Show password' : 'Hide password'}
          >
            {secureText ? (
              <EyeOff size={20} color="#8C8278" />
            ) : (
              <Eye size={20} color="#8C8278" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4239',
    marginBottom: 6,
  },
  field: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 16,
    color: '#1A1410',
  },
  eye: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
  },
});
