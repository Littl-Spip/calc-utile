// Générateur de pages CalcUtile (Node.js). Usage: node gen-pages.js
const fs = require('fs');
const path = require('path');
const dir = __dirname;

const eurFn = 'var eur=function(n){return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);};';
const eur2Fn = 'var eur2=function(n){return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);};';

function page(o){
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="index.html">Calc<span>Utile</span></a>
<nav class="top"><a href="index.html">Accueil</a><a href="simulateur-credit-immobilier.html">Crédit</a><a href="impot-revenu.html">Impôts</a><a href="salaire-brut-net.html">Salaire</a></nav></div></header>
<main><div class="wrap">
<div class="crumb"><a href="index.html">Accueil</a> › ${o.crumb || o.h1}</div>
<h1>${o.h1}</h1>
<p class="lead">${o.lead}</p>
<div class="card">${o.calc}</div>
<div class="ad"><!-- Emplacement publicité (AdSense) --></div>
${o.body || ''}
<h2>Questions fréquentes</h2>
<div class="faq">${o.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div>
</div></main>
<footer class="site"><div class="wrap"><p>CalcUtile — résultats indicatifs, ne constituent pas un conseil professionnel.</p><p><a href="privacy.html">Confidentialité</a> · <a href="index.html">Accueil</a></p></div></footer>
<script>${o.script}</script>
<script src="counter.js" defer></script></body></html>`;
}

const registry = [];
function write(file, html, title){
  fs.writeFileSync(path.join(dir, file), html, 'utf8');
  registry.push({ file, title });
  console.log('écrit', file);
}

// ---------- 1. Salaire brut en net (pages valeurs) ----------
[1500, 2000, 2500, 3000, 3500, 4000, 4500].forEach(v => {
  const f = v.toLocaleString('fr-FR');
  const html = page({
    title: `Salaire brut en net : ${f} € par mois (2026, gratuit)`,
    desc: `Combien fait ${f} € brut en net ? Estimation du salaire net mensuel et annuel après cotisations salariales. Simulation gratuite et instantanée.`,
    h1: `Salaire brut en net : ${f} € par mois`,
    crumb: `Salaire ${f} € brut en net`,
    lead: `Voici l'estimation de ce que représente ${f} € brut en net par mois.`,
    calc: `<div class="grid">
  <div><label for="brut">Salaire brut mensuel (€)</label><input id="brut" type="number" value="${v}"></div>
  <div><label for="statut">Statut</label><select id="statut"><option value="22">Non-cadre (~22 %)</option><option value="25">Cadre (~25 %)</option></select></div>
</div>
<button id="calc">Calculer le net</button>
<div class="result" id="res">
  <div class="big" id="net">— <small>net mensuel estimé</small></div>
  <div style="margin-top:12px">
    <div class="kv"><span>Brut mensuel</span><b id="b">—</b></div>
    <div class="kv"><span>Cotisations salariales estimées</span><b id="c">—</b></div>
    <div class="kv"><span>Net mensuel (avant impôt)</span><b id="nm">—</b></div>
    <div class="kv"><span>Net annuel (avant impôt)</span><b id="a">—</b></div>
  </div>
  <p class="note">Estimation indicative pour un salarié du privé. Ton bulletin de paie fait foi.</p>
</div>`,
    body: `<h2>Avec ${f} € brut, quel net ?</h2>
<p>Un salarié du privé non-cadre voit environ 22 % de son brut partir en cotisations salariales (Sécurité sociale, retraite, chômage, CSG/CRDS, mutuelle). Un cadre cotise davantage, autour de 25 %. C'est ce net <em>avant impôt</em> : le prélèvement à la source s'applique ensuite. Pour l'estimer, utilise notre <a href="impot-revenu.html">simulateur d'impôt sur le revenu</a>.</p>`,
    faq: [
      ['Le résultat est-il exact ?', 'C\'est une estimation moyenne. Le taux réel dépend de ta convention collective, de ta mutuelle et de ton entreprise.'],
      ['Le net inclut-il l\'impôt ?', 'Non, c\'est le net avant prélèvement à la source.'],
      ['Et si je suis cadre ?', 'Choisis « Cadre » dans le menu : le taux de cotisations est plus élevé.']
    ],
    script: `${eurFn}
document.getElementById('calc').addEventListener('click',function(){
  var brut=+document.getElementById('brut').value||0;
  var rate=+document.getElementById('statut').value||22;
  if(brut<=0){alert('Renseigne un salaire brut.');return;}
  var cot=brut*rate/100, net=brut-cot;
  document.getElementById('net').innerHTML=eur(net)+' <small>net mensuel estimé</small>';
  document.getElementById('b').textContent=eur(brut);
  document.getElementById('c').textContent=eur(cot);
  document.getElementById('nm').textContent=eur(net);
  document.getElementById('a').textContent=eur(net*12);
  document.getElementById('res').classList.add('show');
});`
  });
  write(`salaire-brut-net-${v}.html`, html, `Salaire ${f} € brut en net`);
});

// ---------- 2. Crédit immobilier par durée ----------
[10, 15, 20, 25].forEach(d => {
  const html = page({
    title: `Crédit immobilier sur ${d} ans — mensualité et coût total`,
    desc: `Calcule la mensualité et le coût total d'un crédit immobilier sur ${d} ans. Tableau d'amortissement et assurance inclus. Gratuit.`,
    h1: `Crédit immobilier sur ${d} ans`,
    crumb: `Crédit ${d} ans`,
    lead: `Estime ta mensualité et le coût total de ton crédit sur ${d} ans.`,
    calc: `<div class="grid">
  <div><label for="capital">Montant emprunté (€)</label><input id="capital" type="number" value="200000"></div>
  <div><label for="taux">Taux annuel (%)</label><input id="taux" type="number" step="0.01" value="3.5"></div>
  <div><label for="assurance">Assurance annuelle (% du capital)</label><input id="assurance" type="number" step="0.01" value="0.34"></div>
  <div><label>Durée</label><input type="text" value="${d} ans" disabled></div>
</div>
<button id="calc">Calculer la mensualité</button>
<div class="result" id="res">
  <div class="big" id="mens">— <small>par mois (assurance incluse)</small></div>
  <div style="margin-top:12px">
    <div class="kv"><span>Mensualité hors assurance</span><b id="h">—</b></div>
    <div class="kv"><span>Total des intérêts</span><b id="i">—</b></div>
    <div class="kv"><span>Total de l'assurance</span><b id="at">—</b></div>
    <div class="kv"><span>Coût total du crédit</span><b id="ct">—</b></div>
    <div class="kv"><span>Montant total remboursé</span><b id="tt">—</b></div>
  </div>
</div>`,
    body: `<h2>${d} ans : bon compromis ?</h2>
<p>Allonger la durée réduit la mensualité mais augmente les intérêts totaux. Sur ${d} ans, tu rembourses ${d <= 15 ? 'moins d\'intérêts mais des mensualités plus élevées' : 'des mensualités plus basses mais davantage d\'intérêts au total'}. Compare plusieurs durées dans notre <a href="simulateur-credit-immobilier.html">simulateur de crédit immobilier</a>.</p>`,
    faq: [
      ['L\'assurance est-elle incluse ?', 'Oui, elle s\'ajoute à la mensualité principale.'],
      [`Pourquoi choisir ${d} ans ?`, 'C\'est un équilibre entre mensualité et coût total, à comparer avec d\'autres durées.'],
      ['Le TAEG est-il calculé ?', 'Non, il inclut des frais (dossier, garantie) que ta banque indique dans son offre.']
    ],
    script: `${eurFn}${eur2Fn}
document.getElementById('calc').addEventListener('click',function(){
  var C=+document.getElementById('capital').value||0;
  var taux=+document.getElementById('taux').value||0;
  var ass=+document.getElementById('assurance').value||0;
  var n=${d}*12, i=taux/100/12;
  if(C<=0){alert('Renseigne un montant.');return;}
  var m=i===0?C/n:C*i/(1-Math.pow(1+i,-n));
  var ma=C*(ass/100)/12;
  var inter=m*n-C, at=ma*n;
  document.getElementById('mens').innerHTML=eur2(m+ma)+' <small>par mois (assurance incluse)</small>';
  document.getElementById('h').textContent=eur2(m);
  document.getElementById('i').textContent=eur(inter);
  document.getElementById('at').textContent=eur(at);
  document.getElementById('ct').textContent=eur(inter+at);
  document.getElementById('tt').textContent=eur(C+inter+at);
  document.getElementById('res').classList.add('show');
});`
  });
  write(`credit-immobilier-${d}-ans.html`, html, `Crédit immobilier ${d} ans`);
});

// ---------- 3. Frais de notaire par prix ----------
[150000, 200000, 250000, 300000, 400000].forEach(p => {
  const f = p.toLocaleString('fr-FR');
  const html = page({
    title: `Frais de notaire pour un bien à ${f} € (ancien et neuf)`,
    desc: `Combien de frais de notaire pour un logement à ${f} € ? Estimation dans l'ancien (~7,5 %) et le neuf (~2,5 %). Gratuit et instantané.`,
    h1: `Frais de notaire pour un bien à ${f} €`,
    crumb: `Frais de notaire ${f} €`,
    lead: `Estime les frais d'acquisition d'un logement affiché à ${f} €.`,
    calc: `<div class="grid">
  <div><label for="prix">Prix d'achat (€)</label><input id="prix" type="number" value="${p}"></div>
  <div><label for="type">Type de bien</label><select id="type"><option value="ancien">Ancien (7 à 8 %)</option><option value="neuf">Neuf / VEFA (2 à 3 %)</option></select></div>
</div>
<button id="calc">Estimer les frais</button>
<div class="result" id="res">
  <div class="big" id="tot">— <small>de frais estimés</small></div>
  <div style="margin-top:12px">
    <div class="kv"><span>Droits de mutation</span><b id="l1">—</b></div>
    <div class="kv"><span>Émoluments du notaire</span><b id="l2">—</b></div>
    <div class="kv"><span>Contribution de sécurité immobilière</span><b id="l3">—</b></div>
    <div class="kv"><span>Débours et frais divers</span><b id="l4">—</b></div>
    <div class="kv"><span><b>Total frais de notaire</b></span><b id="l5">—</b></div>
    <div class="kv"><span>Budget total (prix + frais)</span><b id="l6">—</b></div>
  </div>
</div>`,
    body: `<h2>Pour un bien à ${f} €</h2>
<p>Dans l'ancien, compte environ <b>${Math.round(p*0.077).toLocaleString('fr-FR')} €</b> de frais ; dans le neuf, environ <b>${Math.round(p*0.0242).toLocaleString('fr-FR')} €</b>. La différence vient surtout des droits de mutation, bien plus faibles dans le neuf. Voir aussi notre <a href="frais-de-notaire.html">simulateur complet</a> et notre <a href="capacite-emprunt-immobilier.html">calcul de capacité d'emprunt</a>.</p>`,
    faq: [
      ['Ces frais sont-ils négociables ?', 'Les émoluments sont encadrés par décret ; les taxes, elles, sont fixes.'],
      ['Quand paie-t-on les frais de notaire ?', 'Le jour de la signature de l\'acte définitif.'],
      ['Le neuf est-il vraiment moins cher ?', 'Oui, autour de 2 à 3 % contre 7 à 8 % dans l\'ancien.']
    ],
    script: `${eurFn}
document.getElementById('calc').addEventListener('click',function(){
  var prix=+document.getElementById('prix').value||0, t=document.getElementById('type').value;
  if(prix<=0){alert('Renseigne un prix.');return;}
  var r=t==='neuf'?{mut:0.00715,emo:0.00814,csi:0.001,div:0.005}:{mut:0.058,emo:0.00814,csi:0.001,div:0.010};
  var l1=prix*r.mut,l2=prix*r.emo,l3=prix*r.csi,l4=prix*r.div,tot=l1+l2+l3+l4;
  document.getElementById('tot').innerHTML=eur(tot)+' <small>de frais estimés</small>';
  document.getElementById('l1').textContent=eur(l1);
  document.getElementById('l2').textContent=eur(l2);
  document.getElementById('l3').textContent=eur(l3);
  document.getElementById('l4').textContent=eur(l4);
  document.getElementById('l5').textContent=eur(tot);
  document.getElementById('l6').textContent=eur(prix+tot);
  document.getElementById('res').classList.add('show');
});`
  });
  write(`frais-de-notaire-${p}.html`, html, `Frais de notaire ${f} €`);
});

// ---------- 4. Calculateurs autonomes ----------
// IMC
write('calcul-imc.html', page({
  title: 'Calcul de l\'IMC (indice de masse corporelle) — gratuit',
  desc: 'Calcule ton IMC à partir de ton poids et de ta taille, avec interprétation (insuffisance, normal, surpoids, obésité). Gratuit.',
  h1: 'Calcul de l\'IMC', crumb: 'Calcul IMC',
  lead: 'Calcule ton indice de masse corporelle (IMC) et sa signification.',
  calc: `<div class="grid">
  <div><label for="poids">Poids (kg)</label><input id="poids" type="number" value="70"></div>
  <div><label for="taille">Taille (cm)</label><input id="taille" type="number" value="175"></div>
</div>
<button id="calc">Calculer mon IMC</button>
<div class="result" id="res">
  <div class="big" id="imc">— <small>IMC</small></div>
  <div class="kv"><span>Interprétation</span><b id="interp">—</b></div>
  <p class="note">L'IMC est un indicateur général ; il ne remplace pas l'avis d'un médecin.</p>
</div>`,
  body: '<h2>Comment est calculé l\'IMC ?</h2><p>IMC = poids (kg) ÷ taille² (m). Selon l\'OMS : &lt; 18,5 insuffisance pondérale · 18,5–25 corpulence normale · 25–30 surpoids · &gt; 30 obésité.</p>',
  faq: [['L\'IMC suffit-il ?','Non, il ne tient pas compte de la masse musculaire ni de la répartition des graisses.'],['Pour qui n\'est-il pas valable ?','Enfants, femmes enceintes et sportifs très musclés.']],
  script: `document.getElementById('calc').addEventListener('click',function(){
  var p=+document.getElementById('poids').value||0, t=(+document.getElementById('taille').value||0)/100;
  if(p<=0||t<=0){alert('Renseigne un poids et une taille.');return;}
  var imc=p/(t*t);
  var i= imc<18.5?'Insuffisance pondérale': imc<25?'Corpulence normale': imc<30?'Surpoids':'Obésité';
  document.getElementById('imc').innerHTML=imc.toFixed(1)+' <small>IMC</small>';
  document.getElementById('interp').textContent=i;
  document.getElementById('res').classList.add('show');
});`
}), 'Calcul IMC');

// Pourcentage
write('calcul-pourcentage.html', page({
  title: 'Calcul de pourcentage — outil gratuit',
  desc: 'Calcule un pourcentage d\'un nombre, une augmentation ou une diminution, et la variation entre deux valeurs. Gratuit et instantané.',
  h1: 'Calcul de pourcentage', crumb: 'Calcul pourcentage',
  lead: 'Trois calculateurs : pourcentage d\'un nombre, variation, et passage d\'une valeur à une autre.',
  calc: `<h3>Pourcentage d'un nombre</h3>
<div class="grid">
  <div><label for="pct">Pourcentage (%)</label><input id="pct" type="number" value="20"></div>
  <div><label for="val">Nombre</label><input id="val" type="number" value="150"></div>
</div>
<button id="calc">Calculer</button>
<div class="result" id="res">
  <div class="big" id="out">—</div>
  <div class="kv"><span>Augmentation de <span id="lp">—</span></span><b id="aug">—</b></div>
  <div class="kv"><span>Diminution de <span id="lp2">—</span></span><b id="dim">—</b></div>
</div>
<h3 style="margin-top:22px">Variation entre deux valeurs</h3>
<div class="grid">
  <div><label for="v1">Valeur de départ</label><input id="v1" type="number" value="120"></div>
  <div><label for="v2">Valeur d'arrivée</label><input id="v2" type="number" value="150"></div>
</div>
<button id="calc2">Calculer la variation</button>
<div class="result" id="res2"><div class="big" id="var">— <small>variation</small></div></div>`,
  body: '<h2>Formules</h2><p>Pourcentage d\'un nombre : <em>nombre × (pourcentage ÷ 100)</em>. Variation : <em>((arrivée − départ) ÷ départ) × 100</em>.</p>',
  faq: [['Comment calculer une remise ?','Multiplie le prix par (1 − remise/100), ou utilise la diminution ci-dessus.'],['Comment calculer une hausse ?','Multiplie par (1 + hausse/100).']],
  script: `document.getElementById('calc').addEventListener('click',function(){
  var p=+document.getElementById('pct').value||0, v=+document.getElementById('val').value||0;
  document.getElementById('out').textContent=p+' % de '+v+' = '+(v*p/100);
  document.getElementById('lp').textContent=p+' %';
  document.getElementById('lp2').textContent=p+' %';
  document.getElementById('aug').textContent=(v*(1+p/100)).toFixed(2);
  document.getElementById('dim').textContent=(v*(1-p/100)).toFixed(2);
  document.getElementById('res').classList.add('show');
});
document.getElementById('calc2').addEventListener('click',function(){
  var a=+document.getElementById('v1').value||0, b=+document.getElementById('v2').value||0;
  if(a===0){alert('La valeur de départ doit être différente de 0.');return;}
  var vr=(b-a)/a*100;
  document.getElementById('var').innerHTML=(vr>=0?'+':'')+vr.toFixed(2)+' % <small>variation</small>';
  document.getElementById('res2').classList.add('show');
});`
}), 'Calcul pourcentage');

// Âge
write('calcul-age.html', page({
  title: 'Calcul d\'âge — à partir de la date de naissance (gratuit)',
  desc: 'Calcule ton âge exact en années, mois et jours à partir de ta date de naissance. Gratuit, instantané, sans inscription.',
  h1: 'Calcul d\'âge', crumb: 'Calcul âge',
  lead: 'Découvre ton âge exact (années, mois, jours) à une date choisie.',
  calc: `<div class="grid">
  <div><label for="naissance">Date de naissance</label><input id="naissance" type="date"></div>
  <div><label for="ref">À la date du</label><input id="ref" type="date"></div>
</div>
<button id="calc">Calculer l'âge</button>
<div class="result" id="res">
  <div class="big" id="age">— <small>ans</small></div>
  <div class="kv"><span>Âge détaillé</span><b id="det">—</b></div>
  <div class="kv"><span>Total en jours</span><b id="jours">—</b></div>
</div>`,
  body: '<h2>Usage</h2><p>Utile pour connaître un âge exact, calculer une ancienneté ou l\'âge d\'un enfant. Le calcul tient compte des années bissextiles.</p>',
  faq: [['Le calcul gère-t-il les mois de durées différentes ?','Oui, il compte en jours réels puis convertit en années, mois et jours.'],['Puis-je calculer à une date passée ?','Oui, choisis n\'importe quelle date de référence.']],
  script: `document.getElementById('ref').value=new Date().toISOString().slice(0,10);
document.getElementById('calc').addEventListener('click',function(){
  var n=new Date(document.getElementById('naissance').value);
  var r=new Date(document.getElementById('ref').value);
  if(isNaN(n)||isNaN(r)||r<n){alert('Vérifie les dates.');return;}
  var y=r.getFullYear()-n.getFullYear();
  var m=r.getMonth()-n.getMonth();
  var d=r.getDate()-n.getDate();
  if(d<0){m--; d+=new Date(r.getFullYear(),r.getMonth(),0).getDate();}
  if(m<0){y--; m+=12;}
  var jours=Math.floor((r-n)/86400000);
  document.getElementById('age').innerHTML=y+' <small>ans</small>';
  document.getElementById('det').textContent=y+' ans, '+m+' mois et '+d+' jours';
  document.getElementById('jours').textContent=jours.toLocaleString('fr-FR')+' jours';
  document.getElementById('res').classList.add('show');
});`
}), 'Calcul âge');

// Prêt auto
write('mensualite-pret-auto.html', page({
  title: 'Mensualité d\'un prêt auto — simulateur gratuit',
  desc: 'Calcule la mensualité et le coût total d\'un crédit auto selon le montant, l\'apport, le taux et la durée. Gratuit et instantané.',
  h1: 'Mensualité d\'un prêt auto', crumb: 'Prêt auto',
  lead: 'Estime la mensualité de ton crédit voiture.',
  calc: `<div class="grid">
  <div><label for="prix">Prix du véhicule (€)</label><input id="prix" type="number" value="20000"></div>
  <div><label for="apport">Apport (€)</label><input id="apport" type="number" value="3000"></div>
  <div><label for="taux">Taux annuel (%)</label><input id="taux" type="number" step="0.01" value="4.5"></div>
  <div><label for="duree">Durée (mois)</label><input id="duree" type="number" value="60"></div>
</div>
<button id="calc">Calculer</button>
<div class="result" id="res">
  <div class="big" id="mens">— <small>par mois</small></div>
  <div class="kv"><span>Montant financé</span><b id="fin">—</b></div>
  <div class="kv"><span>Total des intérêts</span><b id="int">—</b></div>
  <div class="kv"><span>Coût total du crédit</span><b id="tt">—</b></div>
</div>`,
  body: '<h2>Comment ça marche ?</h2><p>On finance la différence entre le prix et l\'apport, puis on applique la formule des mensualités constantes. Un apport plus élevé réduit les intérêts. Voir aussi notre <a href="simulateur-credit-immobilier.html">simulateur de crédit immobilier</a>.</p>',
  faq: [['Faut-il un apport ?','Ce n\'est pas obligatoire mais cela réduit le coût du crédit.'],['Le taux dépend de quoi ?','De la durée, de ton profil et du véhicule (neuf ou occasion).']],
  script: `${eurFn}${eur2Fn}
document.getElementById('calc').addEventListener('click',function(){
  var prix=+document.getElementById('prix').value||0, app=+document.getElementById('apport').value||0;
  var taux=+document.getElementById('taux').value||0, n=+document.getElementById('duree').value||0;
  var C=prix-app; if(C<=0||n<=0){alert('Vérifie le montant et la durée.');return;}
  var i=taux/100/12, m=i===0?C/n:C*i/(1-Math.pow(1+i,-n));
  document.getElementById('mens').innerHTML=eur2(m)+' <small>par mois</small>';
  document.getElementById('fin').textContent=eur(C);
  document.getElementById('int').textContent=eur(m*n-C);
  document.getElementById('tt').textContent=eur(m*n);
  document.getElementById('res').classList.add('show');
});`
}), 'Prêt auto');

// ---------- 5. Sitemap ----------
const existing = ['index.html','simulateur-credit-immobilier.html','capacite-emprunt-immobilier.html','frais-de-notaire.html','salaire-brut-net.html','impot-revenu.html','interets-composes.html','tva.html'];
const all = existing.concat(registry.map(r=>r.file));
const base = 'https://littl-spip.github.io/calc-utile/';
const urls = all.map(f=>`  <url><loc>${base+(f==='index.html'?'':f)}</loc><priority>${f==='index.html'?'1.0':'0.8'}</priority></url>`).join('\n');
fs.writeFileSync(path.join(dir,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
fs.writeFileSync(path.join(dir,'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`, 'utf8');
console.log('Total pages :', all.length);
