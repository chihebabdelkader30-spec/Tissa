import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { TissaProvider } from '@/contexts/TissaContext';
import { colors } from '@/constants/theme';
void SplashScreen.preventAutoHideAsync().catch(()=>undefined);
export default function RootLayout() {
  const [loaded,error]=useFonts({Poppins_400Regular,Poppins_700Bold,Cairo_400Regular,Cairo_700Bold});
  useEffect(()=>{if(loaded||error)void SplashScreen.hideAsync().catch(()=>undefined);},[loaded,error]);
  if(!loaded&&!error)return null;
  return <AlertProvider><SafeAreaProvider><TissaProvider><StatusBar style="light"/><Stack screenOptions={{headerShown:false,gestureEnabled:false,contentStyle:{backgroundColor:colors.background},animation:'fade',animationDuration:200}}><Stack.Screen name="index"/><Stack.Screen name="[screen]"/></Stack></TissaProvider></SafeAreaProvider></AlertProvider>;
}
