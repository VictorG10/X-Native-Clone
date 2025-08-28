import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function RootLayout() {
  return (
    <>
      <StatusBar />
      <ClerkProvider tokenCache={tokenCache}>
        <Stack screenOptions={{}}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ClerkProvider>
    </>
  );
}
