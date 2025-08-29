import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <>
      <ClerkProvider tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <StatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </QueryClientProvider>
      </ClerkProvider>
    </>
  );
}
