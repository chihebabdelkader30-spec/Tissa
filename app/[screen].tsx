import { useLocalSearchParams, Redirect } from 'expo-router';
import { SetupScreen } from '@/screens/SetupScreen';
import { HandoffScreen } from '@/screens/HandoffScreen';
import { QuestionScreen } from '@/screens/QuestionScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { ScoreboardScreen } from '@/screens/ScoreboardScreen';
import { FinalScreen } from '@/screens/FinalScreen';
import { HowScreen } from '@/screens/HowScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { LegalScreen } from '@/screens/LegalScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
export default function Page() {
  const {screen}=useLocalSearchParams<{screen:string}>();
  switch(screen){
    case 'setup':return <SetupScreen/>;case 'handoff':return <HandoffScreen/>;case 'question':return <QuestionScreen/>;
    case 'result':return <ResultScreen/>;case 'scoreboard':return <ScoreboardScreen/>;case 'final':return <FinalScreen/>;
    case 'how':return <HowScreen/>;case 'shop':return <ShopScreen/>;case 'settings':return <SettingsScreen/>;
    case 'stats':return <StatsScreen/>;case 'consent':return <WelcomeScreen consentOnly/>;
    case 'privacy':return <LegalScreen kind="privacy"/>;case 'terms':return <LegalScreen kind="terms"/>;case 'rate':return <LegalScreen kind="rate"/>;
    default:return <Redirect href="/"/>;
  }
}
