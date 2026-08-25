require('dotenv').config();
const fs=require('fs'),path=require('path');
const { Client } = require('pg');
const norm=s=>s.toLowerCase().replace(/\s+/g,' ').trim();
(async()=>{
  const c=new Client({host:process.env.DB_HOST,port:+process.env.DB_PORT,user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,ssl:false});
  await c.connect();
  const words=(await c.query(`SELECT id,english_word FROM dc_words WHERE deleted_at IS NULL`)).rows;
  const files=fs.readdirSync('D:/SF/dictonary/WordImage');
  const fset=new Map(files.map(f=>[norm(path.basename(f,path.extname(f))),f]));
  const unmatchedWords=words.filter(w=>!fset.has(norm(w.english_word)));
  console.log('db words WITHOUT an image file:',unmatchedWords.length,'of',words.length);
  console.log(JSON.stringify(unmatchedWords.slice(0,50).map(w=>w.english_word)));
  // loose: strip trailing digits / parenthetical / " - x"
  const loose=s=>norm(s).replace(/\s*-\s*.*$/,'').replace(/\s*\d+$/,'').trim();
  const fLoose=new Map();
  for(const f of files){const k=loose(path.basename(f,path.extname(f))); if(!fLoose.has(k))fLoose.set(k,f);}
  const extra=unmatchedWords.filter(w=>fLoose.has(loose(w.english_word)));
  console.log('\nextra matches with loose normalization:',extra.length);
  console.log(JSON.stringify(extra.map(w=>[w.english_word,fLoose.get(loose(w.english_word))])));
  await c.end();
})();
