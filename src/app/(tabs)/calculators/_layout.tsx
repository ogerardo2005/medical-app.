import { Stack } from 'expo-router';

export default function CalculatorsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="glasgow" />
      <Stack.Screen name="creatinine-clearance" />
      <Stack.Screen name="cha2ds2-vasc" />
    </Stack>
  );
}
