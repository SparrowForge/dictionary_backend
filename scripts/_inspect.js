require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const c = new Client({ host: process.env.DB_HOST, port: +process.env.DB_PORT, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, ssl: false });
  await c.connect();
  const r = await c.query(`SELECT english_word FROM dc_words WHERE deleted_at IS NULL ORDER BY english_word`);
  console.log('sample 60:', JSON.stringify(r.rows.slice(0,60).map(x=>x.english_word)));
  for (const t of ['eye','fan','far','fast','exit','every']) {
    const q = await c.query(`SELECT id, english_word FROM dc_words WHERE english_word ILIKE $1`, ['%'+t+'%']);
    console.log(t, '->', JSON.stringify(q.rows.map(x=>x.english_word)));
  }
  await c.end();
})();
