import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
export type SoundName = 'tick' | 'correct' | 'bomb' | 'win';
const frequencies = { tick: 650, correct: 880, bomb: 120, win: 1046 };
const sounds = new Set<Audio.Sound>();
function wavData(frequency: number, duration: number): string {
  const sampleRate = 8000, length = Math.floor(sampleRate * duration), bytes = new Uint8Array(44 + length * 2);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) bytes[offset + i] = value.charCodeAt(i); };
  text(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); text(8, 'WAVE'); text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, length * 2, true);
  for (let i = 0; i < length; i++) view.setInt16(44 + i * 2, Math.sin(i / sampleRate * Math.PI * 2 * frequency) * 8000 * (1 - i / length), true);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let encoded = '';
  for (let i = 0; i < bytes.length; i += 3) { const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2]; const bits = (a << 16) | ((b || 0) << 8) | (c || 0); encoded += chars[(bits >> 18) & 63] + chars[(bits >> 12) & 63] + (i + 1 < bytes.length ? chars[(bits >> 6) & 63] : '=') + (i + 2 < bytes.length ? chars[bits & 63] : '='); }
  return 'data:audio/wav;base64,' + encoded;
}
export async function feedback(name: SoundName, sound: boolean, haptics: boolean) {
  if (haptics && name !== 'tick' && Platform.OS !== 'web') {
    try { await Haptics.notificationAsync(name === 'bomb' ? Haptics.NotificationFeedbackType.Error : Haptics.NotificationFeedbackType.Success); } catch {}
  }
  if (!sound) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
    const { sound: player } = await Audio.Sound.createAsync({ uri: wavData(frequencies[name], name === 'tick' ? 0.04 : name === 'win' ? 0.6 : 0.22) }, { shouldPlay: true });
    sounds.add(player);
    player.setOnPlaybackStatusUpdate(status => { if (status.isLoaded && status.didJustFinish) { sounds.delete(player); void player.unloadAsync(); } });
  } catch { /* Some previews block audio before user interaction. */ }
}
export async function stopSounds() { await Promise.all([...sounds].map(async sound => { try { await sound.unloadAsync(); } catch {} })); sounds.clear(); }
