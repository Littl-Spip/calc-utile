const fs=require('fs');
const base='https://littl-spip.github.io/';
const all=fs.readdirSync('.').filter(f=>f.endsWith('.html') && f!=='index.html');
const urls=all.sort();
const lines=urls.map(f=>'  <url><loc>'+base+f+'</loc><lastmod>2026-10-16</lastmod><priority>'+( (f==='radar-economies.html'||f==='outils.html')?'1.0':'0.7' )+'</priority></url>');
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>'+base+'</loc><lastmod>2026-10-16</lastmod><priority>1.0</priority></url>\n'+lines.join('\n')+'\n</urlset>\n';
fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log('total urls:', urls.length+1);
