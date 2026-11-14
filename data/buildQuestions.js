// Pure, deterministic content compiler, shared by the app and the validation/export script.
// Each entry is [English clue, French clue, Arabic clue, English answer, French answer, Arabic answer].
function buildQuestions(banks, language) {
  const locale = { en: 0, fr: 1, ar: 2 }[language];
  return banks.flatMap((bank, bankIndex) => {
    const signatures = new Set();
    const result = [];
    for (let variant = 0, attempt = 1; variant < 15; attempt++) {
      if (attempt > 10000) throw new Error('Not enough distinct nine-answer sets');
      let seed = (bankIndex + 1) * 8191 + attempt * 131;
      const indices = bank.entries.map((_, index) => index);
      for (let i = indices.length - 1; i > 0; i--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const j = seed % (i + 1);
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const selected = indices.slice(0, 9);
      const signature = [...selected].sort((a, b) => a - b).join(',');
      if (signatures.has(signature)) continue;
      signatures.add(signature);
      const entries = selected.map(index => bank.entries[index]);
      result.push({
        id: `${bank.pack}-${bank.category}-${variant + 1}`,
        category: bank.category,
        difficulty: bank.difficulty,
        question: bank.prompt[locale] + '\n\n' + entries.map(entry => entry[locale]).join(' • '),
        answers: entries.map(entry => entry[locale + 3]),
        bomb: variant % 10 < 3 ? bank.bomb[locale] : null,
        pack: bank.pack,
      });
      variant++;
    }
    return result;
  });
}
module.exports = { buildQuestions };
