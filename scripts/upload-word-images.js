/* eslint-disable */
/**
 * One-off migration: upload word images from a local folder to Cloudinary and
 * link each uploaded file to its word via dc_files + dc_word_media.
 *
 * A file is linked only when its basename matches an existing dc_words.english_word
 * (case- and whitespace-insensitive). Unmatched files are reported and skipped --
 * nothing is uploaded for them.
 *
 * Usage:
 *   node scripts/upload-word-images.js --dry-run     # report only, no uploads/writes
 *   node scripts/upload-word-images.js               # upload + link
 *
 * Safe to re-run: words that already have a dc_word_media.image_id are skipped.
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { v2: cloudinary } = require('cloudinary');

const IMAGE_DIR = process.env.WORD_IMAGE_DIR || 'D:/SF/dictonary/WordImage';
const CONCURRENCY = 4;
const DRY_RUN = process.argv.includes('--dry-run');
const REPORT_PATH = path.join(__dirname, 'upload-word-images.report.json');

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.jfif': 'image/jpeg',
};

const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer, publicId, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error('Upload completed but no result returned'));
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

async function runPool(items, worker, concurrency) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

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

  // --- Build the filename -> word index -------------------------------------
  const words = (await client.query(
    'SELECT id, english_word FROM dc_words WHERE deleted_at IS NULL',
  )).rows;

  const wordsByName = new Map();
  for (const word of words) {
    const key = normalize(word.english_word);
    if (!wordsByName.has(key)) wordsByName.set(key, word);
  }

  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((f) => MIME_BY_EXT[path.extname(f).toLowerCase()]);

  // Words that already carry an image are left alone so the script can be re-run.
  const linkedWordIds = new Set(
    (await client.query(
      'SELECT word_id FROM dc_word_media WHERE image_id IS NOT NULL AND deleted_at IS NULL',
    )).rows.map((r) => r.word_id),
  );

  const jobs = [];
  const unmatched = [];
  const alreadyLinked = [];
  const duplicates = [];
  const claimedWordIds = new Map();

  for (const file of files) {
    const word = wordsByName.get(normalize(path.basename(file, path.extname(file))));
    if (!word) {
      unmatched.push(file);
      continue;
    }
    if (linkedWordIds.has(word.id)) {
      alreadyLinked.push({ file, english_word: word.english_word });
      continue;
    }
    // A word has one image slot, so only the first of several files naming the
    // same word is uploaded. The rest are matches, not unmatched files.
    if (claimedWordIds.has(word.id)) {
      duplicates.push({
        file,
        english_word: word.english_word,
        used_instead: claimedWordIds.get(word.id),
      });
      continue;
    }
    claimedWordIds.set(word.id, file);
    jobs.push({ file, word_id: word.id, english_word: word.english_word });
  }

  console.log(`image files:            ${files.length}`);
  console.log(`words in db:            ${words.length}`);
  console.log(`to upload + link:       ${jobs.length}`);
  console.log(`already linked:         ${alreadyLinked.length}`);
  console.log(`duplicate of a match:   ${duplicates.length}`);
  console.log(`unmatched (no such word):${unmatched.length}`);

  if (DRY_RUN) {
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify({ dry_run: true, jobs, alreadyLinked, duplicates, unmatched }, null, 2),
    );
    console.log(`\nDry run -- nothing uploaded. Report: ${REPORT_PATH}`);
    await client.end();
    return;
  }

  // --- Upload and link ------------------------------------------------------
  const succeeded = [];
  const failed = [];
  let done = 0;

  await runPool(
    jobs,
    async (job) => {
      const ext = path.extname(job.file).toLowerCase();
      const filePath = path.join(IMAGE_DIR, job.file);

      try {
        const buffer = fs.readFileSync(filePath);
        const size = fs.statSync(filePath).size;
        // Mirrors the naming/folder convention in FilesService.uploadFile.
        const fileName = `${Date.now()}_words_${job.word_id}${ext}`;
        const uploaded = await uploadToCloudinary(buffer, fileName, `words/${job.word_id}`);

        const fileRow = (await client.query(
          `INSERT INTO dc_files
             (file_name, original_name, file_path, file_size, mime_type,
              file_type, file_category, uploaded_by, public_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8)
           RETURNING id`,
          [
            fileName,
            job.file,
            uploaded.public_id,
            size,
            MIME_BY_EXT[ext],
            'image',
            'other',
            uploaded.secure_url,
          ],
        )).rows[0];

        // A word may already have a media row holding only audio -- fill its image slot.
        const existing = (await client.query(
          `SELECT id FROM dc_word_media
           WHERE word_id = $1 AND deleted_at IS NULL
           ORDER BY created_at ASC LIMIT 1`,
          [job.word_id],
        )).rows[0];

        if (existing) {
          await client.query(
            'UPDATE dc_word_media SET image_id = $1, updated_at = NOW() WHERE id = $2',
            [fileRow.id, existing.id],
          );
        } else {
          await client.query(
            'INSERT INTO dc_word_media (word_id, image_id) VALUES ($1, $2)',
            [job.word_id, fileRow.id],
          );
        }

        succeeded.push({
          ...job,
          file_id: fileRow.id,
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        });
      } catch (error) {
        failed.push({ ...job, error: error.message });
        console.error(`  FAIL ${job.file}: ${error.message}`);
      }

      done += 1;
      if (done % 10 === 0 || done === jobs.length) {
        console.log(`  ${done}/${jobs.length} processed`);
      }
    },
    CONCURRENCY,
  );

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      { dry_run: false, succeeded, failed, alreadyLinked, duplicates, unmatched },
      null,
      2,
    ),
  );

  console.log(`\nuploaded + linked: ${succeeded.length}`);
  console.log(`failed:            ${failed.length}`);
  console.log(`report:            ${REPORT_PATH}`);

  await client.end();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
