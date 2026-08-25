const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/SF/dictonary/dictionary_backend/.env' });
const { Client } = require('pg');

const IMG_DIR = 'D:/SF/dictonary/WordImage';

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

  const words = (await client.query(
    `SELECT id, english_word FROM dc_words WHERE deleted_at IS NULL`
  )).rows;
  console.log('total words in db:', words.length);

  const byNorm = new Map();
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  for (const w of words) {
    const k = norm(w.english_word);
    if (!byNorm.has(k)) byNorm.set(k, []);
    byNorm.get(k).push(w);
  }

  const files = fs.readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
  console.log('image files:', files.length);

  const matched = [], unmatched = [], dupWordFiles = [];
  const seen = new Map();
  for (const f of files) {
    const base = norm(path.basename(f, path.extname(f)));
    const hit = byNorm.get(base);
    if (hit) {
      if (seen.has(base)) { dupWordFiles.push([seen.get(base), f]); continue; }
      seen.set(base, f);
      matched.push({ file: f, word_id: hit[0].id, english_word: hit[0].english_word, ambiguous: hit.length > 1 });
    } else {
      unmatched.push(f);
    }
  }

  // existing media
  const media = (await client.query(
    `SELECT word_id, image_id FROM dc_word_media WHERE deleted_at IS NULL`
  )).rows;
  const withImage = new Set(media.filter(m => m.image_id != null).map(m => m.word_id));
  const mediaRow = new Map(media.map(m => [m.word_id, m]));

  const alreadyHasImage = matched.filter(m => withImage.has(m.word_id));

  console.log('\n=== MATCHED:', matched.length, '===');
  console.log('   already have image_id:', alreadyHasImage.length);
  console.log('   has word_media row (any):', matched.filter(m => mediaRow.has(m.word_id)).length);
  console.log('   ambiguous (multiple words same text):', matched.filter(m => m.ambiguous).length);
  console.log('\n=== UNMATCHED FILES:', unmatched.length, '===');
  console.log(unmatched.join('\n'));
  console.log('\n=== DUPLICATE-FILE COLLISIONS:', dupWordFiles.length, '===');
  console.log(dupWordFiles.map(d => d.join(' <-> ')).join('\n'));

  fs.writeFileSync(path.join(__dirname, 'matched.json'), JSON.stringify(matched, null, 2));
  fs.writeFileSync(path.join(__dirname, 'unmatched.json'), JSON.stringify(unmatched, null, 2));
  await client.end();
})().catch(e => { console.error(e); process.exit(1); });
