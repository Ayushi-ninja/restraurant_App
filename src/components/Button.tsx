// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let buttonStyle = 'w-full py-4 rounded-xl flex-row items-center justify-center ';
  let textStyle = 'font-bold text-base ';

  switch (variant) {
    case 'primary':
      buttonStyle += 'bg-primary shadow-md shadow-primary/20';
      textStyle += 'text-white';
      break;
    case 'secondary':
      buttonStyle += 'bg-neutral-900';
      textStyle += 'text-white';
      break;
    case 'outline':
      buttonStyle += 'bg-transparent border border-neutral-300';
      textStyle += 'text-neutral-950';
      break;
    case 'ghost':
      buttonStyle += 'bg-transparent';
      textStyle += 'text-primary';
      break;
  }

  if (disabled || loading) {
    buttonStyle += ' opacity-50';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`${buttonStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#FF5A1F' : 'white'} />
      ) : (
        <Text className={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
