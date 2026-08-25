/* eslint-disable */
/**
 * Builds a combined coverage report from the last upload run:
 *   1. images in the folder that match no word in dc_words
 *   2. words in dc_words that have no image
 *   3. extra image files that collide with a word already covered by another file
 *
 * Usage: node scripts/build-unmatched-report.js
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const report = require('./upload-word-images.report.json');
const OUT_DIR = __dirname;
const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL_ENABLED === 'true' ? { rejectUnauthorized: false } : false,
  });
  await client.connect();

  const wordsWithoutImage = (await client.query(`
    SELECT w.english_word, w.bangla_word, w.part_of_speech, w.status
    FROM dc_words w
    LEFT JOIN dc_word_media m
      ON m.word_id = w.id AND m.image_id IS NOT NULL AND m.deleted_at IS NULL
    WHERE w.deleted_at IS NULL AND m.id IS NULL
    ORDER BY w.english_word
  `)).rows;

  const totalWords = (await client.query(
    'SELECT COUNT(*)::int AS n FROM dc_words WHERE deleted_at IS NULL',
  )).rows[0].n;

  await client.end();

  // Several files can name the same missing word ("track.jpg", "track 2.jpg").
  const missingWords = new Map();
  for (const file of report.unmatched) {
    const name = path.basename(file, path.extname(file)).trim();
    const key = normalize(name);
    if (!missingWords.has(key)) missingWords.set(key, { name, files: [] });
    missingWords.get(key).files.push(file);
  }
  const missing = [...missingWords.values()].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );

  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  // 1. Images with no word -- the list to work from when adding words.
  fs.writeFileSync(
    path.join(OUT_DIR, 'report-images-without-word.csv'),
    ['suggested_english_word,image_file_count,image_files']
      .concat(
        missing.map((m) =>
          [csvCell(m.name), m.files.length, csvCell(m.files.join(' | '))].join(','),
        ),
      )
      .join('\n') + '\n',
  );

  // 2. Words with no image.
  fs.writeFileSync(
    path.join(OUT_DIR, 'report-words-without-image.csv'),
    ['english_word,bangla_word,part_of_speech,status']
      .concat(
        wordsWithoutImage.map((w) =>
          [
            csvCell(w.english_word),
            csvCell(w.bangla_word),
            csvCell(w.part_of_speech),
            csvCell(w.status),
          ].join(','),
        ),
      )
      .join('\n') + '\n',
  );

  // 3. Duplicate files skipped because the word already got an image.
  fs.writeFileSync(
    path.join(OUT_DIR, 'report-duplicate-images.csv'),
    ['english_word,skipped_file,uploaded_file_instead']
      .concat(
        (report.duplicates || []).map((d) =>
          [csvCell(d.english_word), csvCell(d.file), csvCell(d.used_instead)].join(','),
        ),
      )
      .join('\n') + '\n',
  );

  const summary = {
    generated_at: new Date().toISOString(),
    words_total: totalWords,
    words_with_image: totalWords - wordsWithoutImage.length,
    words_without_image: wordsWithoutImage.length,
    images_uploaded_this_run: report.succeeded.length,
    images_failed_this_run: report.failed.length,
    images_already_linked: report.alreadyLinked.length,
    images_duplicate_skipped: (report.duplicates || []).length,
    images_without_word_files: report.unmatched.length,
    images_without_word_unique_names: missing.length,
  };

  fs.writeFileSync(
    path.join(OUT_DIR, 'report-summary.json'),
    JSON.stringify({ summary, missing, wordsWithoutImage }, null, 2),
  );

  console.table(summary);
  console.log('\nwrote:');
  console.log('  scripts/report-images-without-word.csv');
  console.log('  scripts/report-words-without-image.csv');
  console.log('  scripts/report-duplicate-images.csv');
  console.log('  scripts/report-summary.json');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
