import { SplashScreen } from 'expo-router';
import { useSession } from '../hooks/auth';


export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
