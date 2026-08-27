import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { ThemeProvider, useTheme } from "@/src/theme/ThemeProvider";
import { fontAssets } from "@/src/theme/tokens";

// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true);

// Keep the native splash visible from cold start until icon fonts register.
// Required because @expo/vector-icons' componentDidMount fallback fires
// Font.loadAsync against a broken vendor path if any <Icon> mounts before
// the family is registered — which throws on Android Expo Go.
SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { scheme } = useTheme();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

function RootNavigator() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="group/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="event/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="register/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="roster/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="listing/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="chat/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="weather" options={{ presentation: "modal" }} />
        <Stack.Screen name="appearance" options={{ presentation: "modal" }} />
        <Stack.Screen name="paid-event-fee" options={{ presentation: "modal" }} />
        <Stack.Screen name="create-event" options={{ presentation: "modal" }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [iconsLoaded, iconError] = useIconFonts();
  const [appFontsLoaded, appFontError] = useFonts(fontAssets);

  const ready = (iconsLoaded || iconError) && (appFontsLoaded || appFontError);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  // If the CDN is unreachable we fall through on error rather than wedging
  // the app — icons will tofu, but the app still boots.
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
