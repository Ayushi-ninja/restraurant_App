// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { shadows } from '../theme/shadows';
import { colors } from '../theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyles = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles.button,
        variant === 'primary' ? shadows.primarySm : null,
        disabled || loading ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text style={[styles.text, variantStyles.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

const VARIANT_STYLES: Record<
  NonNullable<ButtonProps['variant']>,
  { button: ViewStyle; text: TextStyle }
> = {
  primary: {
    button: { backgroundColor: colors.primary },
    text: { color: '#FFFFFF' },
  },
  secondary: {
    button: { backgroundColor: colors.textPrimary },
    text: { color: '#FFFFFF' },
  },
  outline: {
    button: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    text: { color: colors.textPrimary },
  },
  ghost: {
    button: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
};
