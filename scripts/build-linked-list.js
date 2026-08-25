/* eslint-disable */
/**
 * Dumps every word that currently has an image linked, with its Cloudinary URL.
 * Writes scripts/report-words-with-image.csv and scripts/words-with-image.json.
 *
 * Usage: node scripts/build-linked-list.js
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

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

  const rows = (await client.query(`
    SELECT
      w.id            AS word_id,
      w.english_word,
      w.bangla_word,
      w.part_of_speech,
      f.id            AS file_id,
      f.original_name,
      f.public_url,
      f.file_path     AS cloudinary_public_id,
      f.file_size,
      f.mime_type
    FROM dc_word_media m
    JOIN dc_words w ON w.id = m.word_id AND w.deleted_at IS NULL
    JOIN dc_files f ON f.id = m.image_id
    WHERE m.deleted_at IS NULL AND m.image_id IS NOT NULL
    ORDER BY LOWER(w.english_word)
  `)).rows;

  await client.end();

  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = [
    'english_word', 'bangla_word', 'part_of_speech',
    'image_url', 'original_file', 'cloudinary_public_id', 'file_id', 'word_id',
  ];

  fs.writeFileSync(
    path.join(__dirname, 'report-words-with-image.csv'),
    [header.join(',')]
      .concat(rows.map((r) => [
        csvCell(r.english_word),
        csvCell(r.bangla_word),
        csvCell(r.part_of_speech),
        csvCell(r.public_url),
        csvCell(r.original_name),
        csvCell(r.cloudinary_public_id),
        r.file_id,
        csvCell(r.word_id),
      ].join(',')))
      .join('\n') + '\n',
  );

  fs.writeFileSync(
    path.join(__dirname, 'words-with-image.json'),
    JSON.stringify(rows, null, 2),
  );

  // Words holding more than one media row with an image -- worth a look.
  const seen = new Map();
  for (const r of rows) seen.set(r.word_id, (seen.get(r.word_id) || 0) + 1);
  const doubled = [...seen.entries()].filter(([, n]) => n > 1);

  console.log('words with an image:', rows.length, '| distinct words:', seen.size);
  if (doubled.length) {
    console.log('words with more than one media row:');
    for (const [id, n] of doubled) {
      console.log('  ', rows.find((r) => r.word_id === id).english_word, `(${n} rows)`);
    }
  }
  console.log('\nwrote:');
  console.log('  scripts/report-words-with-image.csv');
  console.log('  scripts/words-with-image.json');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
