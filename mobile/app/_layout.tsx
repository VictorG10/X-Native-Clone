import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar />
      <Stack screenOptions={{}}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </>
  );
}
