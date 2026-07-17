import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { registerRootComponent } from 'expo';

import App from './App';

// NativeWind css-interop reads shared values during render; disable Reanimated
// strict mode so those warnings don't escalate into navigation crashes.
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
