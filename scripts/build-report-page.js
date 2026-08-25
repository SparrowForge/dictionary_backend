/* eslint-disable */
/** Injects the report data into scripts/report-template.html -> scripts/word-image-coverage.html */
const fs = require('fs');
const path = require('path');

const summary = require('./report-summary.json');
const run = require('./upload-word-images.report.json');
const linked = require('./words-with-image.json');

const data = {
  summary: summary.summary,
  // One row per word so the count matches the summary -- a word with two media
  // rows (same image, duplicated row) would otherwise be listed twice. Only the
  // fields the page renders; the full dump stays in the JSON/CSV.
  linked: [...new Map(linked.map((r) => [r.word_id, r])).values()].map((r) => ({
    english_word: r.english_word,
    bangla_word: r.bangla_word,
    original_name: r.original_name,
    public_url: r.public_url,
  })),
  missing: summary.missing,
  wordsWithoutImage: summary.wordsWithoutImage,
  duplicates: run.duplicates || [],
};

// Escape sequences that would terminate or break out of the inline <script>.
// U+2028/U+2029 are legal in JSON but count as line terminators in JS source.
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

const payload = JSON.stringify(data)
  .split('<').join('\\u003c')
  .split(LINE_SEP).join('\\u2028')
  .split(PARA_SEP).join('\\u2029');

const template = fs.readFileSync(path.join(__dirname, 'report-template.html'), 'utf8');
const outPath = path.join(__dirname, 'word-image-coverage.html');
fs.writeFileSync(outPath, template.replace('__DATA__', payload));

console.log('wrote', outPath, (fs.statSync(outPath).size / 1024).toFixed(1) + ' KB');
