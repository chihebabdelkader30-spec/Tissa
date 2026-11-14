import banks from '@/data/banks.json';
import en from '@/data/questions_en.json';
import fr from '@/data/questions_fr.json';
import ar from '@/data/questions_ar.json';
import { Language } from '@/constants/config';
import { Question, Setup } from './types';
const { buildQuestions } = require('../data/buildQuestions') as { buildQuestions: (banks: unknown, language: Language) => Question[] };
const extras = { en, fr, ar };
const cache: Partial<Record<Language, Question[]>> = {};
export function allQuestions(language: Language): Question[] {
  if (!cache[language]) {
    const generated = buildQuestions(banks, language);
    const ids = new Set(generated.map(q => q.id));
    cache[language] = [...generated, ...(extras[language] as Question[]).filter(q => !ids.has(q.id))];
  }
  return cache[language]!;
}
export function questionPool(setup: Setup): Question[] { return allQuestions(setup.language).filter(q => setup.categories.includes(q.category) && setup.packs.includes(q.pack)); }
export function drawQuestion(setup: Setup, used: string[], history: string[]): { question: Question | null; seen: string[] } {
  const remaining = questionPool(setup).filter(q => !used.includes(q.id));
  if (!remaining.length) return { question: null, seen: history };
  let seen = history;
  let fresh = remaining.filter(q => !seen.includes(`${setup.language}:${q.id}`));
  if (!fresh.length) {
    const eligible = new Set(questionPool(setup).map(q => `${setup.language}:${q.id}`));
    seen = seen.filter(id => !eligible.has(id));
    fresh = remaining;
  }
  const question = fresh[Math.floor(Math.random() * fresh.length)];
  return { question, seen: [...seen, `${setup.language}:${question.id}`].slice(-5000) };
}
export function shuffledAnswers(question: Question): string[] {
  const answers = [...question.answers, ...(question.bomb ? [question.bomb] : [])];
  let seed = [...question.id].reduce((sum, char) => sum + char.charCodeAt(0), 997);
  for (let i = answers.length - 1; i > 0; i--) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const j = seed % (i + 1); [answers[i], answers[j]] = [answers[j], answers[i]]; }
  return answers;
}
