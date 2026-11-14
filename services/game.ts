import { Game, Joker, RoundResult, Setup } from './types';
export function newGame(setup: Setup, timer: number): Game {
  return { setup: { ...setup, names: [...setup.names] }, teams: setup.names.map((name, i) => ({ id: `team-${i}`, name: name.trim(), score: 0, streak: 0, eliminated: false, jokers: { plus: false, double: false, skip: false } })), active: 0, turn: 1, phase: 'handoff', question: null, used: [], found: [], remaining: timer, paused: false, joker: null, result: null, suddenDeath: false, tieTeams: [], tieScores: {}, tiePlayed: [], winnerIds: [], recorded: false, extra: {} };
}
export function roundPoints(correct: number, bomb: boolean, joker: Joker | null): number {
  const bonus = correct === 9 && !bomb ? 3 : 0;
  const raw = correct + bonus + (joker === 'plus' ? 2 : 0);
  return raw * (joker === 'double' ? 2 : 1) - (bomb ? 5 : 0);
}
export function finishRound(game: Game, bomb: boolean): Game {
  if (game.phase !== 'question') return game;
  const team = game.teams[game.active];
  const correct = game.found.length;
  const result: RoundResult = { correct, points: roundPoints(correct, bomb, game.joker), bomb, complete: correct === 9, teamId: team.id };
  const teams = game.teams.map(t => t.id !== team.id ? t : { ...t, score: t.score + result.points, streak: t.streak + (correct >= 5 && !game.suddenDeath ? 1 : 0), eliminated: game.setup.mode === 'streak' && !game.suddenDeath ? correct < 5 : t.eliminated });
  return { ...game, teams, phase: 'result', paused: false, result, tieScores: game.suddenDeath ? { ...game.tieScores, [team.id]: result.points } : game.tieScores, tiePlayed: game.suddenDeath ? [...game.tiePlayed, team.id] : game.tiePlayed };
}
export function leaders(game: Game): string[] {
  if (game.suddenDeath) { const high = Math.max(...Object.values(game.tieScores)); return game.tieTeams.filter(id => game.tieScores[id] === high); }
  if (game.setup.mode === 'streak') { const alive = game.teams.filter(t => !t.eliminated); if (alive.length === 1) return [alive[0].id]; const high = Math.max(...game.teams.map(t => t.streak)); return game.teams.filter(t => t.streak === high).map(t => t.id); }
  const high = Math.max(...game.teams.map(t => t.score)); return game.teams.filter(t => t.score === high).map(t => t.id);
}
export function isGameEnding(game: Game): boolean {
  if (game.suddenDeath) return game.tiePlayed.length >= game.tieTeams.length;
  if (game.setup.mode === 'classic') return game.turn >= game.setup.rounds;
  return game.teams.filter(t => !t.eliminated).length <= 1;
}
export function prepareNext(game: Game): Game {
  if (game.suddenDeath) {
    const nextId = game.tieTeams.find(id => !game.tiePlayed.includes(id));
    if (!nextId) return { ...game, phase: 'final', winnerIds: leaders(game) };
    return { ...game, active: game.teams.findIndex(t => t.id === nextId), turn: game.turn + 1, phase: 'handoff', question: null, found: [], joker: null, result: null };
  }
  if (isGameEnding(game)) {
    const winners = leaders(game);
    if (winners.length === 1) return { ...game, phase: 'final', winnerIds: winners };
    return { ...game, suddenDeath: true, tieTeams: winners, tieScores: {}, tiePlayed: [], active: game.teams.findIndex(t => t.id === winners[0]), turn: game.turn + 1, phase: 'handoff', question: null, found: [], joker: null, result: null };
  }
  let active = game.active;
  if (game.setup.mode === 'classic' || game.teams[active].eliminated) {
    do { active = (active + 1) % game.teams.length; } while (game.teams[active].eliminated);
  }
  return { ...game, active, turn: game.turn + 1, phase: 'handoff', question: null, found: [], joker: null, result: null };
}
