// src/components/Badge.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export default function Badge({ label, variant = 'primary' }: BadgeProps) {
  let badgeStyle = 'px-2.5 py-1 rounded-full flex-row items-center ';
  let textStyle = 'text-xs font-bold ';

  switch (variant) {
    case 'primary':
      badgeStyle += 'bg-primary-50';
      textStyle += 'text-primary';
      break;
    case 'secondary':
      badgeStyle += 'bg-neutral-100';
      textStyle += 'text-neutral-700';
      break;
    case 'success':
      badgeStyle += 'bg-emerald-50';
      textStyle += 'text-emerald-700';
      break;
    case 'warning':
      badgeStyle += 'bg-amber-50';
      textStyle += 'text-amber-700';
      break;
    case 'info':
      badgeStyle += 'bg-blue-50';
      textStyle += 'text-blue-700';
      break;
  }

  return (
    <View className={badgeStyle}>
      <Text className={textStyle}>{label}</Text>
    </View>
  );
}
