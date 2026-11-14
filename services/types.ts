import { Category, Language, Pack, ProductId } from '@/constants/config';
export interface Question { id: string; category: Category; difficulty: 1 | 2 | 3; question: string; answers: string[]; bomb: string | null; pack: Pack }
export type Joker = 'plus' | 'double' | 'skip';
export interface Team { id: string; name: string; score: number; streak: number; eliminated: boolean; jokers: Record<Joker, boolean> }
export interface Setup { names: string[]; rounds: number; mode: 'classic' | 'streak'; language: Language; categories: Category[]; packs: Pack[] }
export interface RoundResult { correct: number; points: number; bomb: boolean; complete: boolean; teamId: string }
export interface Game { teams: Team[]; setup: Setup; active: number; turn: number; phase: 'handoff' | 'question' | 'result' | 'scoreboard' | 'final'; question: Question | null; used: string[]; found: string[]; remaining: number; paused: boolean; joker: Joker | null; result: RoundResult | null; suddenDeath: boolean; tieTeams: string[]; tieScores: Record<string, number>; tiePlayed: string[]; winnerIds: string[]; recorded: boolean; extra: Record<string, number> }
export interface Preferences { language: Language | null; sound: boolean; haptics: boolean; timer: 45 | 60 | 90; consent: 'personalized' | 'limited' | null }
export interface Stats { games: number; wins: Record<string, number>; bestStreak: number; correct: number; ratePrompted: boolean }
export interface LocalData { preferences: Preferences; stats: Stats; seen: string[]; owned: ProductId[]; extraJokers: number }
