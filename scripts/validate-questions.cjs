/* Development tooling only; the app needs no server or Node runtime. */
const fs = require('node:fs');
const path = require('node:path');
const { buildQuestions } = require('../data/buildQuestions');
const banks = require('../data/banks.json');
const categories = ['general','arts','entertainment','sports','history','geography','food','science','social'];
const exportMode = process.argv.includes('--export');
for (const language of ['en','fr','ar']) {
  const extras = require(`../data/questions_${language}.json`);
  const generated = buildQuestions(banks, language);
  const ids = new Set();
  // Exported entries are deduplicated against the bank compiler when read by the app.
  const questions = [...generated, ...extras.filter(q => !generated.some(g => g.id === q.id))];
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error(`Duplicate ID: ${language}/${q.id}`);
    ids.add(q.id);
    if (!q.id || !q.question || !categories.includes(q.category) || ![1,2,3].includes(q.difficulty) || !['base','football','movies','tunisia'].includes(q.pack)) throw new Error(`Invalid schema: ${q.id}`);
    if (!Array.isArray(q.answers) || q.answers.length !== 9 || q.answers.some(a => typeof a !== 'string' || !a.trim()) || new Set(q.answers).size !== 9) throw new Error(`Need nine distinct answers: ${q.id}`);
    if (q.bomb !== null && (typeof q.bomb !== 'string' || q.answers.includes(q.bomb))) throw new Error(`Invalid bomb: ${q.id}`);
  }
  for (const category of categories) if (questions.filter(q => q.pack === 'base' && q.category === category).length < 15) throw new Error(`Too few questions: ${language}/${category}`);
  if (exportMode) fs.writeFileSync(path.join(__dirname, `../data/questions_${language}.json`), JSON.stringify(questions, null, 2) + '\n');
  console.log(`${language}: ${questions.length} questions, nine answers each, all categories >= 15. ${exportMode ? 'JSON exported.' : 'Valid.'}`);
}
const en = require('../i18n/en.json');
for (const language of ['fr','ar']) {
  const dictionary = require(`../i18n/${language}.json`);
  for (const key of Object.keys(en)) if (typeof dictionary[key] !== 'string') throw new Error(`Missing translation: ${language}/${key}`);
}
console.log('UI translation keys match. Factual review and device testing still required before release.');
