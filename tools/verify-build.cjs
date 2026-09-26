'use strict';
const fs = require('fs'); const path = require('path'); const assert = require('assert'); const crypto = require('crypto');
const base = path.resolve(__dirname, '..', 'public');
for (const file of ['index.html','gallery/index.html','about/index.html','licensing/index.html','archives/index.html','stories/autumn-terrace/index.html','404.html','atom.xml','sitemap.xml','robots.txt','css/style.css','js/main.js']) assert(fs.existsSync(path.join(base,file)), `Missing route: ${file}`);
const gallery = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../source/_data/gallery.json'),'utf8'));
for (const story of gallery.series) for(const art of story.pages){
 const raw = fs.readFileSync(path.join(base,'images',story.id,art.id+'.png'));
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),art.sha256,`Original changed: ${art.id}`);
 for(const w of [640,1122]) assert(fs.statSync(path.join(base,'images',story.id,`${art.id}-${w}.webp`)).size > 1000);
}
const htmlFiles = [];
function walk(dir) {for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const f = path.join(dir,entry.name); if(entry.isDirectory()) walk(f); else if(f.endsWith('.html')) htmlFiles.push(f);}}
walk(base);
for(const file of htmlFiles){
 const html = fs.readFileSync(file,'utf8');
 assert(html.includes('Jane Wang'), `Missing author: ${file}`);
 assert(!/<%[=-]?/.test(html), `Unrendered template: ${file}`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const pathname = decodeURIComponent(match[1]); const target = path.join(base,pathname.endsWith('/') ? pathname+'index.html' : pathname);
  assert(fs.existsSync(target), `Broken local URL ${pathname} in ${file}`);
 }
}
const reader = fs.readFileSync(path.join(base,'stories/autumn-terrace/index.html'),'utf8');
assert.equal((reader.match(/class="comic-page"/g)||[]).length,9,'Reader must show nine separate pages');
const grid = fs.readFileSync(path.join(base,'gallery/index.html'),'utf8');
assert.equal((grid.match(/class="art-card"/g)||[]).length,9,'Gallery must show nine artworks');
fs.writeFileSync(path.join(base,'.nojekyll'),'');
console.log(`PASS: ${htmlFiles.length} HTML routes, all internal URLs, 9 original SHA-256 hashes, 18 WebP copies, gallery and reader.`);
