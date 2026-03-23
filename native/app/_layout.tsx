import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Appearance } from "react-native";

export default function RootLayout() {
  Appearance.setColorScheme("light");
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
