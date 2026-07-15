// nativewind-env.d.ts
// Required for NativeWind v4 TypeScript support — adds className prop to RN components
/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}

declare module '*.css' {
  const content: any;
  export default content;
}
