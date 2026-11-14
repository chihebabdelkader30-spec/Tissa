import { createStore } from 'zustand/vanilla';
import { categories, Pack, ProductId } from '@/constants/config';
import { Game, Joker, LocalData, Preferences, Setup } from '@/services/types';
import { defaultData, readLocal, saveLocal } from '@/services/storage';
import { drawQuestion, questionPool } from '@/services/questions';
import { finishRound, leaders, newGame, prepareNext } from '@/services/game';
import { expandEntitlement } from '@/services/iap';
export interface TissaState extends LocalData {
  hydrated: boolean; storageError: boolean; game: Game | null; rewardedTurn: number;
  hydrate: () => Promise<void>; setPreference: (patch: Partial<Preferences>) => void;
  resetHistory: () => void; buy: (id: ProductId) => void; restore: (ids: ProductId[]) => void;
  begin: (setup: Setup) => 'ok' | 'duplicateTeams' | 'emptyPool';
  chooseJoker: (joker: Joker) => void; addReward: () => void; startTurn: () => void;
  tapAnswer: (answer: string) => void; endTurn: (bomb?: boolean) => void;
  setTime: (remaining: number) => void; setPaused: (paused: boolean) => void;
  showScoreboard: () => void; next: () => void; clearGame: () => void; markRated: () => void;
}
export function createTissaStore() {
  return createStore<TissaState>()((set, get) => {
    const persist = () => { const s = get(); void saveLocal({ preferences: s.preferences, stats: s.stats, seen: s.seen, owned: s.owned, extraJokers: s.extraJokers }).catch(() => set({ storageError: true })); };
    const recordFinal = (game: Game): Game => {
      if (game.recorded) return game;
      const state = get(); const wins = { ...state.stats.wins };
      for (const id of game.winnerIds) { const name = game.teams.find(t => t.id === id)?.name; if (name) wins[name] = (wins[name] || 0) + 1; }
      set({ stats: { ...state.stats, games: state.stats.games + 1, wins, bestStreak: Math.max(state.stats.bestStreak, ...game.teams.map(t => t.streak)) } });
      persist(); return { ...game, recorded: true };
    };
    const draw = (game: Game): Game => {
      const state = get(); const result = drawQuestion(game.setup, game.used, state.seen);
      set({ seen: result.seen }); persist();
      if (!result.question) {
        const winnerIds = game.suddenDeath && Object.keys(game.tieScores).length < game.tieTeams.length ? game.tieTeams : leaders(game);
        return recordFinal({ ...game, phase: 'final', winnerIds });
      }
      return { ...game, question: result.question, used: [...game.used, result.question.id], remaining: state.preferences.timer, paused: false };
    };
    return {
      ...defaultData, hydrated: false, storageError: false, game: null, rewardedTurn: -1,
      hydrate: async () => { const data = await readLocal(); set({ ...data, hydrated: true }); },
      setPreference: patch => { set(s => ({ preferences: { ...s.preferences, ...patch } })); persist(); },
      resetHistory: () => { set({ seen: [] }); persist(); },
      buy: id => { set(s => ({ owned: [...new Set([...s.owned, ...expandEntitlement(id)])], extraJokers: s.extraJokers + (id === 'jokers_pack' ? 5 : 0) })); persist(); },
      restore: ids => { set(s => ({ owned: [...new Set([...s.owned, ...ids.flatMap(expandEntitlement)])] })); persist(); },
      begin: setup => {
        const names = setup.names.map(name => name.trim());
        if (names.some(name => !name) || new Set(names.map(name => name.toLocaleLowerCase())).size !== names.length || names.length < 2 || names.length > 6) return 'duplicateTeams';
        const owned = get().owned;
        const packs = setup.packs.filter(p => p === 'base' || owned.includes(`pack_${p}` as ProductId));
        const safeSetup: Setup = { ...setup, names, packs, categories: setup.categories.filter(c => categories.includes(c)) };
        if (!safeSetup.categories.length || !packs.length || questionPool(safeSetup).length < 2) return 'emptyPool';
        set({ game: draw(newGame(safeSetup, get().preferences.timer)), rewardedTurn: -1 }); return 'ok';
      },
      chooseJoker: joker => {
        const s = get(), g = s.game;
        if (!g || g.phase !== 'handoff' || (g.joker === 'skip')) return;
        const team = g.teams[g.active];
        if (g.joker === joker) { set({ game: { ...g, joker: null } }); return; }
        const extra = (g.extra[team.id] || 0) + s.extraJokers;
        if (team.jokers[joker] && (joker === 'skip' || extra <= 0)) return;
        if (joker === 'skip') {
          const teams = g.teams.map(t => t.id === team.id ? { ...t, jokers: { ...t.jokers, skip: true } } : t);
          set({ game: draw({ ...g, teams, joker: 'skip' }) });
        } else set({ game: { ...g, joker } });
      },
      addReward: () => { const s = get(), g = s.game; if (!g || g.phase !== 'handoff' || s.rewardedTurn === g.turn || s.owned.includes('remove_ads')) return; const id = g.teams[g.active].id; set({ game: { ...g, extra: { ...g.extra, [id]: (g.extra[id] || 0) + 1 } }, rewardedTurn: g.turn }); },
      startTurn: () => {
        const s = get(), g = s.game;
        if (!g || g.phase !== 'handoff' || !g.question) return;
        const team = g.teams[g.active]; let extra = g.extra; let extraJokers = s.extraJokers;
        if (g.joker && g.joker !== 'skip' && team.jokers[g.joker]) {
          if ((extra[team.id] || 0) > 0) extra = { ...extra, [team.id]: extra[team.id] - 1 };
          else if (extraJokers > 0) extraJokers--;
          else return;
        }
        const joker = g.joker;
        const teams = g.teams.map(t => t.id === team.id && joker ? { ...t, jokers: { ...t.jokers, [joker]: true } } : t);
        set({ game: { ...g, teams, extra, phase: 'question', paused: false }, extraJokers }); persist();
      },
      tapAnswer: answer => {
        const g = get().game;
        if (!g || g.phase !== 'question' || g.paused || g.found.includes(answer) || !g.question) return;
        if (answer === g.question.bomb) { get().endTurn(true); return; }
        if (!g.question.answers.includes(answer)) return;
        const found = [...g.found, answer]; set({ game: { ...g, found } });
        if (found.length === 9) get().endTurn(false);
      },
      endTurn: (bomb = false) => { const s = get(); if (!s.game || s.game.phase !== 'question') return; const game = finishRound(s.game, bomb); set({ game, stats: { ...s.stats, correct: s.stats.correct + (game.result?.correct || 0) } }); persist(); },
      setTime: remaining => set(s => ({ game: s.game?.phase === 'question' ? { ...s.game, remaining: Math.max(0, remaining) } : s.game })),
      setPaused: paused => set(s => ({ game: s.game?.phase === 'question' ? { ...s.game, paused } : s.game })),
      showScoreboard: () => set(s => ({ game: s.game ? { ...s.game, phase: 'scoreboard' } : null })),
      next: () => { const g = get().game; if (!g || g.phase !== 'scoreboard') return; let next = prepareNext(g); next = next.phase === 'final' ? recordFinal(next) : draw(next); set({ game: next }); },
      clearGame: () => set({ game: null, rewardedTurn: -1 }),
      markRated: () => { set(s => ({ stats: { ...s.stats, ratePrompted: true } })); persist(); },
    };
  });
}
export type TissaStore = ReturnType<typeof createTissaStore>;
