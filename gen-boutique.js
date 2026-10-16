// Generateur de la "boite a outils" CalcUtile. node gen-boutique.js
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const eurFn = 'var eur=function(n){return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);};';
const eur2Fn = 'var eur2=function(n){return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);};';

function page(o){
  const head = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://littl-spip.github.io/${o.file}">
<meta name="google-site-verification" content="tLI8q_80Hy8_iRrXEFf3IBbdnOSbba6bKjEGPKuAJPA" />
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<meta name="keywords" content="${o.kw || ''}">
<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1087976242537233" crossorigin="anonymous"></script>`;
  const faq = (o.faq || []).map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${head}
</head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="index.html">Calc<span>Utile</span></a>
<nav class="top"><a href="index.html">Accueil</a><a href="outils.html">Outils</a><a href="radar-economies.html">Radar Éco</a><a href="impot-revenu.html">Impôts</a></nav></div></header>
<main><div class="wrap">
<div class="crumb"><a href="index.html">Accueil</a> › <a href="outils.html">Outils</a> › ${o.h1}</div>
<span class="badge">${o.badge || '✅ 100 % gratuit · sans inscription'}</span>
<h1>${o.h1}</h1>
<p class="lead">${o.lead}</p>
<div class="card">${o.calc}</div>
<div class="ad"><!-- Emplacement publicité (AdSense) --></div>
${o.body || ''}
${faq ? '<h2>Questions fréquentes</h2><div class="faq">' + faq + '</div>' : ''}
<h2>Autres outils utiles</h2>
<p><a href="outils.html">Voir tous les calculateurs gratuits →</a> · <a href="radar-economies.html">Radar Économies</a> · <a href="index.html">Accueil</a></p>
</div></main>
<footer class="site"><div class="wrap"><p>CalcUtile — résultats indicatifs. Rien n'est envoyé ni stocké.</p><p><a href="privacy.html">Confidentialité</a> · <a href="index.html">Accueil</a></p></div></footer>
<script>${eurFn}${eur2Fn}${o.script || ''}</script>
</body></html>`;
}

function w(file, html, title){ fs.writeFileSync(path.join(dir, file), html, 'utf8'); console.log('écrit', file); return { file, title }; }

// ---------------- LISTE DES OUTILS ----------------
const TOOLS = []; // filled below (push objects)

// helper push
function T(o){ TOOLS.push(Object.assign({kw:''}, o)); }

// ---------- FINANCE ----------
T({slug:'rendement-locatif', title:'Rendement locatif brut et net', desc:'Calcule le rendement locatif brut et net d\'un bien selon le loyer, les charges et le prix d\'achat. Gratuit et instantané.', h1:'Rendement locatif brut et net', badge:'🏠 Immobilier', lead:'Estime ce que ton bien te rapporte réellement, net de charges et de taxes.', calc:`
<div class="grid">
<div><label for="a">Loyer mensuel (€)</label><input id="a" type="number" value="800"></div>
<div><label for="b">Prix d'achat + frais (€)</label><input id="b" type="number" value="150000"></div>
<div><label for="c">Charges mensuelles (€)</label><input id="c" type="number" value="120"></div>
<div><label for="d">Taxe foncière (€/an)</label><input id="d" type="number" value="900"></div>
</div><button id="calc">Calculer le rendement</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Rendement brut</span><b id="kb">—</b></div>
<div class="kv"><span>Charges + taxe/an</span><b id="kc">—</b></div>
<div class="kv"><span>Rendement net</span><b id="kn">—</b></div>
<div class="kv"><span>Cash-flow annuel estimé</span><b id="kf">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var l=+document.getElementById('a').value||0, p=+document.getElementById('b').value||0;
var ch=+document.getElementById('c').value||0, tf=+document.getElementById('d').value||0;
if(p<=0){alert('Renseigne un prix.');return;}
var ba=l*12, cn=(ch*12+tf), net=ba-cn;
var rb=ba/p*100, rn=net/p*100;
document.getElementById('out').innerHTML=rn.toFixed(2)+' % <small>net</small>';
document.getElementById('kb').textContent=rb.toFixed(2)+' %';
document.getElementById('kc').textContent=eur(cn);
document.getElementById('kn').textContent=rn.toFixed(2)+' %';
document.getElementById('kf').textContent=eur(net);
document.getElementById('res').classList.add('show');
});`,
faq:[['Le rendement brut suffit-il ?','Non, il ignore les charges, les taxes et l\'impôt. Le rendement net est plus réaliste, mais reste une estimation.'],['Que mettre dans « charges mensuelles » ?','Charges de copropriété, assurance côtée, entretien, vacance locative (compte 1 à 2 mois).']],
kw:'rendement locatif, rendement net, investissement locatif, immobilier, loyer, charges'});

T({slug:'taux-endettement', title:'Taux d\'endettement — capacité d\'emprunt (loi 35 %)', desc:'Calcule ton taux d\'endettement selon tes revenus et charges, et la mensualité maximale autorisée (HCSF 35 %). Gratuit et instantané.', h1:'Taux d\'endettement & mensualité maximale', badge:'🏠 Immobilier', lead:'Vérifie en un clic si ton dossier respecte la règle des 35 % et combien tu peux emprunter en plus.', calc:`
<div class="grid">
<div><label for="a">Revenus nets mensuels (€)</label><input id="a" type="number" value="2500"></div>
<div><label for="b">Charges / crédits actuels (€/mois)</label><input id="b" type="number" value="300"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Taux d\'endettement actuel</span><b id="k1">—</b></div>
<div class="kv"><span>Plafond autorisé (35 %)</span><b id="k2">—</b></div>
<div><span id="msg"></span></div>
<div class="kv"><span>Mensualité de crédit max disponible</span><b id="k3">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var r=+document.getElementById('a').value||0, c=+document.getElementById('b').value||0;
if(r<=0){alert('Renseigne un revenu.');return;}
var rate=c/r*100; var plaf=r*0.35; var disp=Math.max(0,plaf-c);
document.getElementById('out').innerHTML=rate.toFixed(1)+' % <small>d&apos;endettement</small>';
document.getElementById('k1').textContent=rate.toFixed(2)+' %';
document.getElementById('k2').textContent=eur(plaf);
document.getElementById('k3').textContent=eur(disp);
var m=document.getElementById('msg');
if(rate<=30){m.innerHTML='<span style="color:#0ea672;font-weight:700">✅ Marge confortable.</span>';}
else if(rate<=35){m.innerHTML='<span style="color:#d68a00;font-weight:700">⚠️ Limite acceptable (zone HCSF).</span>';}
else{m.innerHTML='<span style="color:#c0392b;font-weight:700">❌ Au-delà de la règle des 35 %.</span>';}
document.getElementById('res').classList.add('show');
});`,
kw:'taux endettement, capacité emprunt, mensualité max, HCSF, 35%, crédit'});

T({slug:'budget-mensuel', title:'Budget mensuel — bilan revenus et charges', desc:'Fais le bilan de ton budget mensuel : regroupe tes revenus et tes charges fixes pour connaître ton reste à vivre. Gratuit.', h1:'Budget mensuel : ton bilan et reste à vivre', badge:'💰 Finance', lead:'Regroupe toutes tes charges et revenus d\'un mois pour voir où tu en es.', calc:`
<div class="grid">
<div><label for="a">Revenus nets mensuels (€)</label><input id="a" type="number" value="2500"></div>
<div><label for="b">Loyer / crédit immobilier (€)</label><input id="b" type="number" value="750"></div>
<div><label for="c">Énergie (€)</label><input id="c" type="number" value="140"></div>
<div><label for="d">Transport (€)</label><input id="d" type="number" value="80"></div>
<div><label for="e">Assurances (€)</label><input id="e" type="number" value="60"></div>
<div><label for="f">Télécom + abonnements (€)</label><input id="f" type="number" value="55"></div>
<div><label for="g">Courses / loisirs / autres (€)</label><input id="g" type="number" value="550"></div>
</div><button id="calc">Calculer mon budget</button>
<div class="result" id="res">
<div class="big" id="out">— <small>reste à vivre</small></div>
<div class="kv"><span>Total charges</span><b id="k1">—</b></div>
<div class="kv"><span>Reste à vivre</span><b id="k2">—</b></div>
<div class="kv"><span>Taux d'épargne</span><b id="k3">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var rev=+document.getElementById('a').value||0;
var ch=+document.getElementById('b').value+ +document.getElementById('c').value+ +document.getElementById('d').value+ +document.getElementById('e').value+ +document.getElementById('f').value+ +document.getElementById('g').value;
var reste=rev-ch;
document.getElementById('out').innerHTML=eur(reste)+' <small>reste à vivre</small>';
document.getElementById('k1').textContent=eur(ch);
document.getElementById('k2').textContent=eur(reste);
document.getElementById('k3').textContent=rev>0?(reste/rev*100).toFixed(1)+' %':'—';
document.getElementById('res').classList.add('show');
});`,
kw:'budget mensuel, bilan, charges fixes, reste à vivre, epargne, finance'});

T({slug:'tableau-amortissement', title:'Tableau d\'amortissement de crédit immobilier', desc:'Génère le tableau d\'amortissement month by month pour ton crédit immobilier : mensualité, capital, intérêts, reste à payer. Gratuit.', h1:'Tableau d\'amortissement de crédit immobilier', badge:'🏠 Immobilier', lead:'Détaille mois par mois comment se rembourse ton prêt : capital et intérêts.', calc:`
<div class="grid">
<div><label for="a">Capital emprunté (€)</label><input id="a" type="number" value="200000"></div>
<div><label for="b">Taux annuel (%)</label><input id="b" type="number" step="0.01" value="3.5"></div>
<div><label for="c">Durée (mois)</label><input id="c" type="number" value="240"></div>
</div><button id="calc">Générer le tableau</button>
<div class="result" id="res">
<div class="big" id="mens">— <small>/mois</small></div>
<div style="max-height:260px;overflow:auto;margin-top:14px"><table><thead><tr><th>Mois</th><th>Mensualité</th><th>Intérêts</th><th>Capital</th><th>Reste</th></tr></thead><tbody id="tb"></tbody></table></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var C=+document.getElementById('a').value||0, taux=+document.getElementById('b').value||0, n=+document.getElementById('c').value||0;
if(C<=0||n<=0){alert('Vérifie le montant et la durée.');return;}
var i=taux/100/12, m=i===0?C/n:C*i/(1-Math.pow(1+i,-n));
var rest=C, tb=document.getElementById('tb'), rows='';
for(var k=1;k<=n && k<=200;k++){
var inte=rest*i, cap=m-inte; rest-=cap;
rows+='<tr><td>'+k+'</td><td>'+eur2(m)+'</td><td>'+eur2(inte)+'</td><td>'+eur2(cap)+'</td><td>'+eur(rest<0?0:rest)+'</td></tr>';
}
if(n>200) rows+='<tr><td colspan="5">… '+ (n-200)+' lignes suivantes omises (affichage limité à 200)</td></tr>';
tb.innerHTML=rows;
document.getElementById('mens').innerHTML=eur2(m)+' <small>/mois</small>';
document.getElementById('res').classList.add('show');
});`,
kw:'tableau amortissement, crédit immobilier, capital, interets, mensualite'});

T({slug:'super-brut', title:'Salaire super-brut → brut → net (coût total pour l\'employeur)', desc:'Comprends la différence entre le super-brut, le brut et le net, et le coût réel pour ton employeur. Estimation gratuite.', h1:'Salaire : super-brut, brut et net', badge:'💼 Salaire', lead:'Comprends le coût total de ton poste pour ton employeur et la part qui reste dans ta poche.', calc:`
<div class="grid">
<div><label for="a">Salaire brut mensuel (€)</label><input id="a" type="number" value="2500"></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Super-brut (coût patronal estimé)</span><b id="k1">—</b></div>
<div class="kv"><span>Charges patronales (~42 %)</span><b id="k2">—</b></div>
<div class="kv"><span>Brut</span><b id="k3">—</b></div>
<div class="kv"><span>Charges salariales (~22 %)</span><b id="k4">—</b></div>
<div class="kv"><span>Net avant impôt</span><b id="k5">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var b=+document.getElementById('a').value||0;
var pat=b*0.42, sb=b*1.42, cot=b*0.22, net=b-cot;
document.getElementById('out').innerHTML=eur(net)+' <small>net</small>';
document.getElementById('k1').textContent=eur(sb);
document.getElementById('k2').textContent=eur(pat);
document.getElementById('k3').textContent=eur(b);
document.getElementById('k4').textContent=eur(cot);
document.getElementById('k5').textContent=eur(net);
document.getElementById('res').classList.add('show');
});`,
kw:'super brut, salaire brut net, charges patronales, coût employeur'});

T({slug:'smic-net', title:'SMIC net 2026 (estimation mensuelle et annuelle)', desc:'Estimation du SMIC net à partir du SMIC brut officiel, avec charges salariales déduites. Gratuit et instantané.', h1:'SMIC net : combien en poche ?', badge:'💼 Salaire', lead:'Estime le revenu net mensuel et annuel sur la base du SMIC brut, déduction des cotisations salariales faite.', calc:`
<div class="grid">
<div><label for="a">SMIC brut mensuel (€)</label><input id="a" type="number" value="1801.80"></div>
<div><label for="b">Statut</label><select id="b"><option value="22">Non-cadre (~22 %)</option><option value="25">Cadre (~25 %)</option></select></div>
</div><button id="calc">Calculer le net</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Brut mensuel</span><b id="k1">—</b></div>
<div class="kv"><span>Cotisations salariales</span><b id="k2">—</b></div>
<div class="kv"><span>Net mensuel</span><b id="k3">—</b></div>
<div class="kv"><span>Net annuel</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var b=+document.getElementById('a').value||0, r=+document.getElementById('b').value||22, c=b*r/100, n=b-c;
document.getElementById('out').innerHTML=eur(n)+' <small>net/mois</small>';
document.getElementById('k1').textContent=eur(b);
document.getElementById('k2').textContent=eur(c);
document.getElementById('k3').textContent=eur(n);
document.getElementById('k4').textContent=eur(n*12);
document.getElementById('res').classList.add('show');
});`,
kw:'SMIC net, salaire minimum, cotisations, 2026'});

T({slug:'salaire-horaire', title:'Salaire brut mensuel en taux horaire', desc:'Convertit un salaire mensuel brut en taux horaire net ou brut selon la durée hebdomadaire légale. Gratuit.', h1:'Salaire : conversion en taux horaire', badge:'💼 Salaire', lead:'Convertis un salaire mensuel en taux horaire pour comparer une offre d\'emploi ou un statut à temps partiel.', calc:`
<div class="grid">
<div><label for="a">Salaire mensuel brut (€)</label><input id="a" type="number" value="2500"></div>
<div><label for="b">Heures par semaine</label><input id="b" type="number" value="35"></div>
<div><label for="c">Weeks/an</label><input id="c" type="number" value="52"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>/h brut</small></div>
<div class="kv"><span>Heures par an</span><b id="k1">—</b></div>
<div class="kv"><span>Heures par mois</span><b id="k2">—</b></div>
<div class="kv"><span>Taux horaire brut</span><b id="k3">—</b></div>
<div class="kv"><span>Taux horaire net estimé</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var s=+document.getElementById('a').value||0,h=+document.getElementById('b').value||35,w=+document.getElementById('c').value||52;
var ha=h*w, hm=ha/12, th=s/hm;
document.getElementById('out').innerHTML=eur2(th)+' <small>/h brut</small>';
document.getElementById('k1').textContent=ha.toFixed(0)+' h';
document.getElementById('k2').textContent=hm.toFixed(1)+' h';
document.getElementById('k3').textContent=eur2(th);
document.getElementById('k4').textContent=eur2(th*0.78);
document.getElementById('res').classList.add('show');
});`,
kw:'taux horaire, salaire, conversion heures, temps partiel'});

T({slug:'quotient-familial', title:'Quotient familial (parts fiscales)', desc:'Estime ton quotient familial selon ta situation familiale pour anticiper ton impôt sur le revenu.', h1:'Quotient familial : calcul des parts', badge:'🧾 Impôts', lead:'Estime le nombre de parts fiscales de ton foyer selon ta situation (célibataire, marié/pacsé, enfants).', calc:`
<div class="grid">
<div><label for="a">Statut</label><select id="a"><option value="1">Célibataire / divorcé / séparé</option><option value="2">Marié / pacsé</option></select></div>
<div><label for="b">Enfants à charge</label><input id="b" type="number" value="0"></div>
<div><label for="c">Parent isolé (oui/non)</label><select id="c"><option value="0">Non</option><option value="1">Oui (majoration)</option></select></div>
</div><button id="calc">Calculer les parts</button>
<div class="result" id="res">
<div class="big" id="out">— <small>parts</small></div>
<div class="kv"><span>Adultes</span><b id="k1">—</b></div>
<div class="kv"><span>Enfants</span><b id="k2">—</b></div>
<div class="kv"><span>Majoration (parent isolé / 1er enfant)</span><b id="k3">—</b></div>
<div class="note">Le nombre de parts n'est pas plafonné, mais le gain est encadré par des effets de plafond.</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var s=+document.getElementById('a').value, e=+document.getElementById('b').value, pi=+document.getElementById('c').value;
var ad=s, enc=0;
if(pi && e>=1){ enc+=0.5; } else if(pi && e===0){ enc+=0.5; }
// enfants : 1er et 2e = 0.5 chacun, 3e+ = 1 chacun
var enf=0;
for(var i=0;i<e;i++){ enf += (i<2)?0.5:1; }
var tot=ad+enf+enc;
document.getElementById('out').innerHTML=tot.toString().replace('.',' ,')+' <small>parts</small>';
document.getElementById('k1').textContent=ad;
document.getElementById('k2').textContent=enf;
document.getElementById('k3').textContent=enc;
document.getElementById('res').classList.add('show');
});`,
kw:'quotient familial, parts fiscales, impot revenu, foyer, celibataire, enfant'});

T({slug:'pension-alimentaire', title:'Pension alimentaire estimative (barème fiscal)', desc:'Estimation de la pension alimentaire dans le cadre d\'un divorce ou d\'une séparation, selon la table indicatrice. Gratuit.', h1:'Pension alimentaire : estimation', badge:'⚖️ Juridique', lead:'Estimation indicative de la pension alimentaire à partir des revenus et du nombre d\'enfants.', calc:`
<div class="grid">
<div><label for="a">Revenu net mensuel du payeur (€)</label><input id="a" type="number" value="2000"></div>
<div><label for="b">Nombre d\'enfants</label><input id="b" type="number" value="2"></div>
<div><label for="c">Mode de garde des enfants</label><select id="c"><option value="classic">Garde classique (un parent)</option><option value="alternee">Garde alternée</option></select></div>
</div><button id="calc">Estimer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>/enfant/mois</small></div>
<div class="kv"><span>Total mensuel</span><b id="k1">—</b></div>
<div class="kv"><span>Total annuel</span><b id="k2">—</b></div>
<div class="note">Estimation fondée sur la table indicatrice ; le juge adapte selon les situations.</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var r=+document.getElementById('a').value||0, n=+document.getElementById('b').value||1, mode=document.getElementById('c').value;
// règle simplifiée : ~10 % du revenu par enfant en garde classique, ~6 % en alternée
var unit=mode==='alternee'?0.06:0.10;
var per=r*unit, tot=per*n;
document.getElementById('out').innerHTML=eur(per)+' <small>/enfant/mois</small>';
document.getElementById('k1').textContent=eur(tot);
document.getElementById('k2').textContent=eur(tot*12);
document.getElementById('res').classList.add('show');
});`,
kw:'pension alimentaire, divorce, garde enfants, contribution'});

T({slug:'taux-interets', title:'Taux d\'intérêt : mensualité, intérêts et durée de crédit', desc:'Deux calculs : à partir d\'un capital, d\'un taux et d\'une durée, estime mensualité et coût total ; ou la durée nécessaire.', h1:'Crédit : taux, durée et coût total', badge:'💰 Finance', lead:'Estime la mensualité et le coût total d\'un crédit à taux fixe, pour un capital et une durée donnés.', calc:`
<div class="grid">
<div><label for="a">Capital emprunté (€)</label><input id="a" type="number" value="10000"></div>
<div><label for="b">Taux annuel (%)</label><input id="b" type="number" step="0.01" value="4.5"></div>
<div><label for="c">Durée (mois)</label><input id="c" type="number" value="48"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>/mois</small></div>
<div class="kv"><span>Mensualité</span><b id="k1">—</b></div>
<div class="kv"><span>Total des intérêts</span><b id="k2">—</b></div>
<div class="kv"><span>Montant total remboursé</span><b id="k3">—</b></div>
<div class="kv"><span>Coût du crédit (% du capital)</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var C=+document.getElementById('a').value||0, taux=+document.getElementById('b').value||0, n=+document.getElementById('c').value||0;
if(C<=0||n<=0){alert('Vérifie le montant et la durée.');return;}
var i=taux/100/12, m=i===0?C/n:C*i/(1-Math.pow(1+i,-n)), inter=m*n-C;
document.getElementById('out').innerHTML=eur2(m)+' <small>/mois</small>';
document.getElementById('k1').textContent=eur2(m);
document.getElementById('k2').textContent=eur(inter);
document.getElementById('k3').textContent=eur(m*n);
document.getElementById('k4').textContent=(inter/C*100).toFixed(2)+' %';
document.getElementById('res').classList.add('show');
});`,
kw:'crédit, mensualité, intérêts, durée, taux'});

T({slug:'cout-voiture', title:'Coût réel d\'un trajet en voiture (carburant + péages + amortissement)', desc:'Estime le coût total d\'un trajet en voiture : carburant, péages et coût au kilomètre. Gratuit.', h1:'Coût d\'un trajet en voiture', badge:'🚗 Transport', lead:'Calcule combien coûte réellement un trajet en voiture, pour le comparer au train ou au covoiturage.', calc:`
<div class="grid">
<div><label for="a">Distance aller-retour (km)</label><input id="a" type="number" value="200"></div>
<div><label for="b">Consommation (L/100 km)</label><input id="b" type="number" step="0.1" value="6.5"></div>
<div><label for="c">Prix du carburant (€/L)</label><input id="c" type="number" step="0.01" value="1.90"></div>
<div><label for="d">Péages (€ aller-retour)</label><input id="d" type="number" step="0.01" value="15"></div>
<div><label for="e">Coût usure (€/km)</label><input id="e" type="number" step="0.01" value="0.10"></div>
</div><button id="calc">Calculer le coût</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Carburant</span><b id="k1">—</b></div>
<div class="kv"><span>Péages</span><b id="k2">—</b></div>
<div class="kv"><span>Usure</span><b id="k3">—</b></div>
<div class="kv"><span>Coût au km</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var km=+document.getElementById('a').value||0,cons=+document.getElementById('b').value||0,px=+document.getElementById('c').value||0,pea=+document.getElementById('d').value||0,us=+document.getElementById('e').value||0;
var carb=km*cons/100*px, u=km*us, tot=carb+pea+u;
document.getElementById('out').innerHTML=eur(tot);
document.getElementById('k1').textContent=eur(carb);
document.getElementById('k2').textContent=eur(pea);
document.getElementById('k3').textContent=eur(u);
document.getElementById('k4').textContent=km>0?eur2(tot/km):'—';
document.getElementById('res').classList.add('show');
});`,
kw:'coût trajet voiture, carburant, péage, usure, transport'});

T({slug:'trajet-temps', title:'Temps de trajet : distance, vitesse et pause', desc:'Estime la durée d\'un trajet selon la distance, la vitesse moyenne et les pauses. Convertit en heures et minutes.', h1:'Temps de trajet en voiture', badge:'🚗 Transport', lead:'Calcule combien de temps prendra ton trajet, pause comprise.', calc:`
<div class="grid">
<div><label for="a">Distance (km)</label><input id="a" type="number" value="320"></div>
<div><label for="b">Vitesse moyenne (km/h)</label><input id="b" type="number" value="110"></div>
<div><label for="c">Pauses / bouchons (min)</label><input id="c" type="number" value="30"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Temps de conduite</span><b id="k1">—</b></div>
<div class="kv"><span>Pause / bouchons</span><b id="k2">—</b></div>
<div class="kv"><span>Arrivée estimée si départ maintenant</span><b id="k3">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var d=+document.getElementById('a').value||0,v=+document.getElementById('b').value||1,p=+document.getElementById('c').value||0;
if(v<=0){alert('Vitesse > 0.');return;}
var mins=d/v*60+p, h=Math.floor(mins/60), m=Math.round(mins%60);
document.getElementById('out').innerHTML=h+' h '+m+' min';
document.getElementById('k1').textContent=Math.floor(d/v)+' h '+Math.round((d/v*60)%60)+' min';
document.getElementById('k2').textContent=p+' min';
var arr=new Date(Date.now()+mins*60000); arr=arr.getHours()+':'+String(arr.getMinutes()).padStart(2,'0');
document.getElementById('k3').textContent=arr;
document.getElementById('res').classList.add('show');
});`,
kw:'temps trajet, distance, vitesse moyenne, pause'});

T({slug:'jours-entre-dates', title:'Nombre de jours entre deux dates (ouvrables inclus)', desc:'Calcule le nombre de jours entre deux dates, en jours calendaires et en jours ouvrables. Gratuit et instantané.', h1:'Jours entre deux dates', badge:'📅 Temps', lead:'Combien de jours séparent deux dates ? Utile pour un préavis, un délai, une grossesse ou une vacance.', calc:`
<div class="grid">
<div><label for="a">Date de départ</label><input id="a" type="date"></div>
<div><label for="b">Date d\'arrivée</label><input id="b" type="date"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>jours</small></div>
<div class="kv"><span>Jours calendaires</span><b id="k1">—</b></div>
<div class="kv"><span>Week-ends dans l\'intervalle</span><b id="k2">—</b></div>
<div class="kv"><span>Jours ouvrés estimés</span><b id="k3">—</b></div>
</div>`,
script:`document.getElementById('a').value=new Date().toISOString().slice(0,10);
document.getElementById('calc').addEventListener('click',function(){
var s=new Date(document.getElementById('a').value), e=new Date(document.getElementById('b').value);
if(isNaN(s)||isNaN(e)||e<s){alert('Vérifie les dates.');return;}
var ms=e-s, days=Math.floor(ms/86400000);
var we=0;
for(var d=new Date(s);d<e;d.setDate(d.getDate()+1)){var w=d.getDay(); if(w===0||w===6)we++;}
document.getElementById('out').innerHTML=days+' <small>jours</small>';
document.getElementById('k1').textContent=days;
document.getElementById('k2').textContent=we;
document.getElementById('k3').textContent=days-we;
document.getElementById('res').classList.add('show');
});`,
kw:'jours entre dates, ouvrables, délai, différence dates'});

T({slug:'date-plus-jours', title:'Ajouter des jours ouvrés à une date (délai, préavis, résiliation)', desc:'Ajoute un nombre de jours (ouvrés) à une date pour calculer une date d\'échéance, de préavis ou de résiliation.', h1:'Date + N jours (ouvrés)', badge:'📅 Temps', lead:'Calcule la date d\'échéance d\'un délai, d\'un préavis ou d\'une résiliation.', calc:`
<div class="grid">
<div><label for="a">Date de départ</label><input id="a" type="date"></div>
<div><label for="b">Délai (jours)</label><input id="b" type="number" value="14"></div>
<div><label for="c">Type de comptage</label><select id="c"><option value="cal">Jours calendaires</option><option value="ouv">Jours ouvrés</option></select></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Date finale</span><b id="k1">—</b></div>
<div class="kv"><span>Week-ends sautés</span><b id="k2">—</b></div>
</div>`,
script:`document.getElementById('a').value=new Date().toISOString().slice(0,10);
document.getElementById('calc').addEventListener('click',function(){
var start=new Date(document.getElementById('a').value), n=+document.getElementById('b').value||0, mode=document.getElementById('c').value;
if(isNaN(start)){alert('Vérifie la date.');return;}
var d=new Date(start), skipped=0;
if(mode==='cal'){ d.setDate(d.getDate()+n); }
else { while(n>0){ d.setDate(d.getDate()+1); var w=d.getDay(); if(w!==0 && w!==6) n--; else skipped++; } }
var out=d.toISOString().slice(0,10);
document.getElementById('out').innerHTML=out;
document.getElementById('k1').textContent=out;
document.getElementById('k2').textContent=skipped;
document.getElementById('res').classList.add('show');
});`,
kw:'délai, préavis, date échéance, jours ouvrés, résiliation'});

T({slug:'vacances-scolaires', title:'Vacances scolaires 2026 (toutes zones)', desc:'Calendrier des vacances scolaires en France en 2026, par zone. Mis à jour et gratuit, pas de nouvelle page à chercher.', h1:'Vacances scolaires 2026 (France)', badge:'📅 Temps', lead:'Dates des vacances scolaires pour les zones A, B et C en 2026.', calc:`
<p class="note">Dates communiquées par le Ministère de l'Éducation nationale. Vérifie à la rentrée pour les ajustements.</p>
<table>
<thead><tr><th>Vacances</th><th>Zone A</th><th>Zone B</th><th>Zone C</th></tr></thead>
<tbody>
<tr><td>Toussaint</td><td>18 oct → 3 nov</td><td>18 oct → 3 nov</td><td>18 oct → 3 nov</td></tr>
<tr><td>Noël</td><td>20 déc → 4 janv</td><td>20 déc → 4 janv</td><td>20 déc → 4 janv</td></tr>
<tr><td>Hiver</td><td>7 → 23 fév</td><td>14 fév → 2 mars</td><td>21 fév → 9 mars</td></tr>
<tr><td>Printemps</td><td>4 → 20 avr</td><td>11 → 27 avr</td><td>18 avr → 4 mai</td></tr>
<tr><td>Été</td><td>4 juil → 1 sept</td><td>4 juil → 1 sept</td><td>4 juil → 1 sept</td></tr>
</tbody></table>
<p class="note">Rentre chaque année ces dates de mémoire — elles bougent légèrement.</p>`,
script:``, kw:'vacances scolaires 2026, zones A B C, dates'});

T({slug:'journees-special-2026', title:'Jours fériés 2026 et week-ends prolongés', desc:'Liste des jours fériés en France en 2026 et des week-ends prolongés associés.', h1:'Jours fériés 2026 & week-ends prolongés', badge:'📅 Temps', lead:'Les jours fériés en France pour 2026, avec les week-ends prolongés à cocher.', calc:`
<table>
<thead><tr><th>Date</th><th>Fête</th><th>Jour</th></tr></thead>
<tbody>
<tr><td>1 jan</td><td>Nouvel An</td><td>jeudi</td></tr>
<tr><td>6 avr</td><td>Lundi de Pâques</td><td>lundi</td></tr>
<tr><td>1 mai</td><td>Fête du Travail</td><td>vendredi</td></tr>
<tr><td>8 mai</td><td>Victoire 1945</td><td>vendredi</td></tr>
<tr><td>14 mai</td><td>Ascension</td><td>jeudi</td></tr>
<tr><td>25 mai</td><td>Lundi de Pentecôte</td><td>lundi</td></tr>
<tr><td>14 juil</td><td>Fête nationale</td><td>mardi</td></tr>
<tr><td>15 aoû</td><td>Assomption</td><td>samedi</td></tr>
<tr><td>1 nov</td><td>Toussaint</td><td>dimanche</td></tr>
<tr><td>11 nov</td><td>Armistice</td><td>mercredi</td></tr>
<tr><td>25 déc</td><td>Noël</td><td>vendredi</td></tr>
</tbody></table>
<p class="note">Ponts possibles : Ascension (jeudi) et 1er mai + 8 mai prolongés.</p>`, script:``, kw:'jours feries 2026, ponts, vacances'});

// ---------- SANTE ----------
T({slug:'calories-bmr', title:'Calories : besoins journaliers (BMR & TDEE)', desc:'Estime ton métabolisme de base et tes besoins caloriques quotidiens selon ton âge, sexe, poids, taille et activité.', h1:'Besoins caloriques journaliers', badge:'🏃 Santé', lead:'Estime combien de calories tu dépenses par jour, au repos et selon ton niveau d\'activité.', calc:`
<div class="grid">
<div><label for="a">Sexe</label><select id="a"><option value="h">Homme</option><option value="f">Femme</option></select></div>
<div><label for="b">Âge (ans)</label><input id="b" type="number" value="30"></div>
<div><label for="c">Poids (kg)</label><input id="c" type="number" value="70"></div>
<div><label for="d">Taille (cm)</label><input id="d" type="number" value="175"></div>
<div><label for="e">Activité</label><select id="e"><option value="1.2">Sédentaire</option><option value="1.375">Légère (1-3 j/sem)</option><option value="1.55">Modérée (3-5 j/sem)</option><option value="1.725">Intense (6-7 j/sem)</option><option value="1.9">Très intense</option></select></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>kcal/jour</small></div>
<div class="kv"><span>Métabolisme de base (BMR)</span><b id="k1">—</b></div>
<div class="kv"><span>Besoins totaux (TDEE)</span><b id="k2">—</b></div>
<div class="kv"><span>Pour perdre 0,5 kg/semaine</span><b id="k3">—</b></div>
<div class="kv"><span>Pour prendre 0,5 kg/semaine</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var s=document.getElementById('a').value, a=+document.getElementById('b').value||0, w=+document.getElementById('c').value||0, h=+document.getElementById('d').value||0, act=+document.getElementById('e').value||1.2;
var bmr = (s==='h')?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;
var tdee=bmr*act;
document.getElementById('out').innerHTML=Math.round(tdee)+' <small>kcal/jour</small>';
document.getElementById('k1').textContent=Math.round(bmr);
document.getElementById('k2').textContent=Math.round(tdee);
document.getElementById('k3').textContent=Math.round(tdee-500);
document.getElementById('k4').textContent=Math.round(tdee+500);
document.getElementById('res').classList.add('show');
});`,
kw:'calories, métabolisme de base, BMR, TDEE, poids, santé'});

T({slug:'besoin-eau', title:'Besoin en eau quotidien selon ton poids et ton activité', desc:'Estime ta consommation d\'eau recommandée par jour selon ton poids et ton niveau d\'activité.', h1:'Besoin en eau par jour', badge:'🏃 Santé', lead:'Estime ta consommation d\'eau recommandée par jour.', calc:`
<div class="grid">
<div><label for="a">Poids (kg)</label><input id="a" type="number" value="70"></div>
<div><label for="b">Activité physique</label><select id="b"><option value="1.0">Faible</option><option value="1.2">Modérée</option><option value="1.4">Intense</option></select></div>
<div><label for="c">Climat chaud ?</label><select id="c"><option value="0">Non</option><option value="0.5">Oui</option></select></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>L/jour</small></div>
<div class="kv"><span>En litres</span><b id="k1">—</b></div>
<div class="kv"><span>En verres (25 cl)</span><b id="k2">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var w=+document.getElementById('a').value||0, act=+document.getElementById('b').value||1, hot=+document.getElementById('c').value||0;
var l=w*0.033*act+hot;
document.getElementById('out').innerHTML=l.toFixed(2)+' <small>L/jour</small>';
document.getElementById('k1').textContent=l.toFixed(2)+' L';
document.getElementById('k2').textContent=Math.round(l/0.25);
document.getElementById('res').classList.add('show');
});`,
kw:'besoin en eau, hydratation, litres par jour'});

T({slug:'poids-ideal', title:'Poids idéal (formule de Devine, Robinson, Miller, Hamwi)', desc:'Estime ton poids idéal selon ta taille, avec 4 formules reconnues. Gratuit et instantané.', h1:'Poids idéal selon ta taille', badge:'🏃 Santé', lead:'Estime ton poids idéal selon quatre formules scientifiques reconnues.', calc:`
<div class="grid">
<div><label for="a">Sexe</label><select id="a"><option value="h">Homme</option><option value="f">Femme</option></select></div>
<div><label for="b">Taille (cm)</label><input id="b" type="number" value="175"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>kg</small></div>
<div class="kv"><span>Devine</span><b id="k1">—</b></div>
<div class="kv"><span>Robinson</span><b id="k2">—</b></div>
<div class="kv"><span>Miller</span><b id="k3">—</b></div>
<div class="kv"><span>Hamwi</span><b id="k4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var s=document.getElementById('a').value, h=(+document.getElementById('b').value||170)/2.54-60;
var d=s==='h'?50+2.3*h:45.5+2.3*h, r=s==='h'?52+1.9*h:49+1.7*h, m=s==='h'?56.2+1.41*h:53.1+1.36*h, hw=s==='h'?48+2.7*h:45.5+2.2*h;
document.getElementById('out').innerHTML=Math.round((d+r+m+hw)/4)+' <small>kg</small>';
document.getElementById('k1').textContent=Math.round(d)+' kg';
document.getElementById('k2').textContent=Math.round(r)+' kg';
document.getElementById('k3').textContent=Math.round(m)+' kg';
document.getElementById('k4').textContent=Math.round(hw)+' kg';
document.getElementById('res').classList.add('show');
});`,
kw:'poids ideal, devise, robinson, miller, hamwi'});

T({slug:'frequencemax', title:'Fréquence cardiaque max et zones d\'entraînement', desc:'Estime ta fréquence cardiaque maximale et tes zones d\'entraînement (fat burn, cardio, anaérobie).', h1:'Fréquence cardiaque max et zones', badge:'🏃 Santé', lead:'Estime ta fréquence cardiaque maximale et tes zones d\'entraînement.', calc:`
<div class="grid">
<div><label for="a">Âge (ans)</label><input id="a" type="number" value="30"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">— <small>bpm max</small></div>
<div class="kv"><span>Zone repos (50-60 %)</span><b id="z1">—</b></div>
<div class="kv"><span>Zone brûle-graisse (60-70 %)</span><b id="z2">—</b></div>
<div class="kv"><span>Zone cardio (70-85 %)</span><b id="z3">—</b></div>
<div class="kv"><span>Zone anaérobie (85-100 %)</span><b id="z4">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var a=+document.getElementById('a').value||30, max=220-a;
var rng=function(x,y){return Math.round(max*x)+'–'+Math.round(max*y)+' bpm';};
document.getElementById('out').innerHTML=max+' <small>bpm max</small>';
document.getElementById('z1').textContent=rng(.5,.6);
document.getElementById('z2').textContent=rng(.6,.7);
document.getElementById('z3').textContent=rng(.7,.85);
document.getElementById('z4').textContent=rng(.85,1);
document.getElementById('res').classList.add('show');
});`,
kw:'fréquence cardiaque, FC max, zones entraînement, sport'});

T({slug:'dpa', title:'Date d\'accouchement présumée (règle de Naegele)', desc:'Estime la date d\'accouchement présumée à partir de la date des dernières règles, selon la règle de Naegele.', h1:'Date d\'accouchement présumée', badge:'👶 Famille', lead:'Estime la date prévue d\'accouchement à partir de la date de tes dernières règles.', calc:`
<div class="grid">
<div><label for="a">Date des dernières règles</label><input id="a" type="date"></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Date prévue d\'accouchement</span><b id="k1">—</b></div>
<div class="kv"><span>Terme à ajouter (280 jours)</span><b id="k2">280 jours</b></div>
</div>`,
script:`document.getElementById('a').value=new Date().toISOString().slice(0,10);
document.getElementById('calc').addEventListener('click',function(){
var s=new Date(document.getElementById('a').value); if(isNaN(s)){alert('Vérifie la date.');return;}
var d=new Date(s.getTime()+280*86400000);
var out=d.toISOString().slice(0,10);
document.getElementById('out').innerHTML=out;
document.getElementById('k1').textContent=out;
document.getElementById('res').classList.add('show');
});`,
kw:'date accouchement, dpa, grossesse, règle de Naegele'});

// ---------- DEV / UTIL ----------
T({slug:'mot-de-passe', title:'Générateur de mot de passe sécurisé', desc:'Génère un mot de passe robuste directement dans ton navigateur, sans jamais l\'envoyer nulle part. Personnalisable.', h1:'Générateur de mot de passe sécurisé', badge:'🔐 Sécurité', lead:'Génère un mot de passe robuste, avec les paramètres de ton choix. Aucune donnée n\'est envoyée.', calc:`
<div class="grid">
<div><label for="a">Longueur</label><input id="a" type="number" value="16"></div>
<div><label for="b">Inclure</label><select id="b"><option value="1">Majuscules + minuscules + chiffres + symboles</option><option value="2">Majuscules + minuscules + chiffres</option><option value="3">Minuscules + chiffres</option><option value="4">Chiffres uniquement</option></select></div>
</div><button id="calc">Générer</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:1.2rem;letter-spacing:.5px;word-break:break-all">—</div>
<div class="kv"><span>Longueur</span><b id="k1">—</b></div>
<div class="kv"><span>Entropie estimée</span><b id="k2">—</b></div>
</div>
<button class="btn2" id="copy">📋 Copier</button>`,
script:`var sets={1:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}',2:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',3:'abcdefghijklmnopqrstuvwxyz0123456789',4:'0123456789'};
var buf=new Uint32Array(256);
function run(){
var len=+document.getElementById('a').value||16, set=sets[document.getElementById('b').value], L=set.length, out='';
crypto.getRandomValues(buf);
for(var i=0;i<len;i++) out+=set[buf[i]%L];
document.getElementById('out').textContent=out;
document.getElementById('k1').textContent=len;
document.getElementById('k2').textContent=Math.round(len*Math.log2(L))+' bits';
document.getElementById('res').classList.add('show');
return out;
}
document.getElementById('calc').addEventListener('click',run);
document.getElementById('copy').addEventListener('click',function(){var t=document.getElementById('out').textContent;if(!t||t==='—')return; var d=function(){alert('Copié');}; if(navigator.clipboard) navigator.clipboard.writeText(t).then(d,function(){document.execCommand('copy');d();}); else {document.execCommand('copy');d();}});
run();`,
kw:'mot de passe securisé, generer, password, securite, entropie'});

T({slug:'hash-md5-sha', title:'Hash SHA-256 / SHA-512 / SHA-1 en ligne', desc:'Calcule le hash cryptographique SHA-1, SHA-256, SHA-384 ou SHA-512 d\'un texte. Totalement dans ton navigateur.', h1:'Hash cryptographique en ligne', badge:'🔐 Sécurité', lead:'Calcule un hash SHA-1, SHA-256, SHA-512 pour un texte, sans l\'envoyer nulle part.', calc:`
<div class="grid">
<div><label for="a">Texte à hasher</label><textarea id="a" rows="3" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:1rem">Hello CalcUtile</textarea></div>
<div><label for="b">Algorithme</label><select id="b"><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option><option>SHA-1</option></select></div>
</div><button id="calc">Calculer</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.85rem;word-break:break-all">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var txt=document.getElementById('a').value, algo=document.getElementById('b').value;
crypto.subtle.digest(algo, new TextEncoder().encode(txt)).then(function(b){
var h=Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
document.getElementById('out').textContent=h;
document.getElementById('res').classList.add('show');
});
});`,
kw:'hash SHA256, SHA512, SHA1, cryptographique'});

T({slug:'codebase64', title:'Base64 : encoder ou décoder', desc:'Encode ou décode du texte en Base64, directement dans ton navigateur, sans envoyer la donnée.', h1:'Base64 : encoder / décoder', badge:'🔧 Dev', lead:'Encode ou décode du texte en Base64, avec prise en charge de l\'Unicode.', calc:`
<div class="grid">
<div><label for="a">Texte ou Base64</label><textarea id="a" rows="3" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:1rem">Bonjour le monde</textarea></div>
<div><label for="b">Action</label><select id="b"><option value="enc">Encoder → Base64</option><option value="dec">Décoder ← Base64</option></select></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.9rem;word-break:break-all">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
try{
var t=document.getElementById('a').value, act=document.getElementById('b').value, out;
if(act==='enc'){ out=btoa(unescape(encodeURIComponent(t))); }
else { out=decodeURIComponent(escape(atob(t))); }
document.getElementById('out').textContent=out;
document.getElementById('res').classList.add('show');
}catch(e){alert('Entrée invalide pour le décodage.');}
});`,
kw:'base64, encode, decode, base 64'});

T({slug:'url-encode', title:'URL encode / decode (encodeURIComponent)', desc:'Encode ou décode une URL (espaces, accents, caractères spéciaux) avec encodeURIComponent.', h1:'URL encode / decode', badge:'🔧 Dev', lead:'Encode ou décode une URL pour la rendre valide et transmissible.', calc:`
<div class="grid">
<div><label for="a">Texte ou URL</label><textarea id="a" rows="2" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:1rem">https://littl-spip.github.io/calc-utile/?q=é té</textarea></div>
<div><label for="b">Action</label><select id="b"><option value="enc">encoder</option><option value="dec">décoder</option></select></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.9rem;word-break:break-all">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
try{
var t=document.getElementById('a').value, a=document.getElementById('b').value, out;
out = a==='enc' ? encodeURIComponent(t) : decodeURIComponent(t);
document.getElementById('out').textContent=out;
document.getElementById('res').classList.add('show');
}catch(e){alert('Entrée invalide pour le décodage.');}
});`,
kw:'url encode, url decode, encodeURIComponent, url escaping'});

T({slug:'timestamp-unix', title:'Timestamp Unix ↔ date (convertir époque en date)', desc:'Convertit un timestamp Unix en date lisible et une date en timestamp Unix. Instantané.', h1:'Timestamp Unix ↔ date', badge:'🔧 Dev', lead:'Convertit entre l\'epoch Unix et une date lisible (heure locale).', calc:`
<div class="grid">
<div><label for="a">Unix timestamp (secondes)</label><input id="a" type="number" value="1730000000"></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
<div class="kv"><span>Date locale</span><b id="k1">—</b></div>
<div class="kv"><span>Date UTC</span><b id="k2">—</b></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var t=+document.getElementById('a').value; var d=new Date(t*1000);
document.getElementById('out').innerHTML=d.toLocaleString('fr-FR');
document.getElementById('k1').textContent=d.toLocaleString('fr-FR');
document.getElementById('k2').textContent=d.toUTCString();
document.getElementById('res').classList.add('show');
});`, kw:'unix timestamp, epoch, date, convertir'});

T({slug:'qrcode', title:'Générateur de QR code (texte, URL, contact)', desc:'Génère un QR code pour un texte ou une URL, téléchargeable en PNG. Gratuit et sans inscription.', h1:'Générateur de QR code', badge:'🔧 Dev', lead:'Crée un QR code à partir d\'un texte ou d\'une URL, prêt à télécharger.', calc:`
<div class="grid">
<div><label for="a">Texte ou URL</label><input id="a" type="text" value="https://littl-spip.github.io/"></div>
<div><label for="b">Taille (px)</label><input id="b" type="number" value="256"></div>
</div><button id="calc">Générer le QR code</button>
<div style="text-align:center;margin-top:14px" id="box"></div>
<div class="result" id="res"><div class="note">Clique sur le QR code pour l'ouvrir en grand et le télécharger (clic droit → enregistrer).</div></div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var txt=encodeURIComponent(document.getElementById('a').value), sz=+document.getElementById('b').value||256;
var url='https://api.qrserver.com/v1/create-qr-code/?size='+sz+'x'+sz+'&data='+txt;
document.getElementById('box').innerHTML='<a href="'+url+'" target="_blank"><img src="'+url+'" alt="QR code" width="'+sz+'" height="'+sz+'" style="border:1px solid #e6ebf3;border-radius:12px"></a>';
document.getElementById('res').classList.add('show');
});`,
kw:'QR code, generer qr, scan, qr code gratuit'});

T({slug:'compteur-mots', title:'Compteur de mots et caractères (avec espaces)', desc:'Compte les mots, caractères (avec et sans espaces), phrases et paragraphes d\'un texte.', h1:'Compteur de mots et caractères', badge:'📝 Texte', lead:'Compte mots, caractères, phrases et paragraphes en direct.', calc:`
<div><label for="a">Texte</label><textarea id="a" rows="6" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:1rem" oninput="go()">Bonjour, c'est un test. Voici une deuxième phrase.</textarea></div>
<div class="result show" id="res">
<div class="kv"><span>Mots</span><b id="k1">—</b></div>
<div class="kv"><span>Caractères (avec espaces)</span><b id="k2">—</b></div>
<div class="kv"><span>Caractères (sans espaces)</span><b id="k3">—</b></div>
<div class="kv"><span>Phrases</span><b id="k4">—</b></div>
<div class="kv"><span>Paragraphes</span><b id="k5">—</b></div>
<div class="kv"><span>Temps de lecture estimé</span><b id="k6">—</b></div>
</div>`,
script:`function go(){
var t=document.getElementById('a').value;
var words=t.trim()?(t.trim().split(/\s+/).length):0;
var chars=t.length, noSpace=t.replace(/\s/g,'').length;
var sent=t.split(/[.!?]+/).filter(function(x){return x.trim();}).length;
var para=t.split(/\\n\\s*\\n/).filter(function(x){return x.trim();}).length|| (t.trim()?1:0);
document.getElementById('k1').textContent=words;
document.getElementById('k2').textContent=chars;
document.getElementById('k3').textContent=noSpace;
document.getElementById('k4').textContent=sent;
document.getElementById('k5').textContent=para;
document.getElementById('k6').textContent=Math.max(1,Math.round(words/200))+' min';
}
go();
document.getElementById('a').addEventListener('input',go);`,
kw:'compteur mots, caracteres, phrases, paragraphes, lecture'});

T({slug:'min-maj', title:'Convertir texte : majuscules, minuscules, titre, inverse', desc:'Convertis un texte en MAJUSCULES, minuscules, Title Case ou texte inversé.', h1:'Convertisseur de casse (maj/min)', badge:'📝 Texte', lead:'Change la casse d\'un texte d\'un clic.', calc:`
<div class="grid">
<div><label for="a">Texte</label><textarea id="a" rows="3" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:1rem">bonjour, ceci est un TITRE d'exemple.</textarea></div>
<div><label for="b">Opération</label><select id="b"><option value="u">MAJUSCULES</option><option value="l">minuscules</option><option value="t">Title Case</option><option value="inv">Inverser</option><option value="s">Alterné sEnSeI</option></select></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.9rem;white-space:pre-wrap;word-break:break-word">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var t=document.getElementById('a').value, mode=document.getElementById('b').value, out;
if(mode==='u') out=t.toUpperCase();
else if(mode==='l') out=t.toLowerCase();
else if(mode==='t') out=t.toLowerCase().replace(/(^|\s)\S/g,function(m){return m.toUpperCase();});
else if(mode==='inv') out=t.split('').reverse().join('');
else out=t.split('').map(function(c,i){return i%2?c.toUpperCase():c.toLowerCase();}).join('');
document.getElementById('out').textContent=out;
document.getElementById('res').classList.add('show');
});`,
kw:'convertir majuscules, minuscules, title case, invert'});

T({slug:'lorem-ipsum', title:'Générateur de Lorem Ipsum (paragraphes, phrases, mots)', desc:'Génère du texte de remplissage Lorem Ipsum, selon le nombre de mots, phrases ou paragraphes.', h1:'Générateur Lorem Ipsum', badge:'📝 Texte', lead:'Génère du texte de remplissage selon tes besoins.', calc:`
<div class="grid">
<div><label for="a">Quantité</label><input id="a" type="number" value="3"></div>
<div><label for="b">Unité</label><select id="b"><option value="p">paragraphes</option><option value="s">phrases</option><option value="w">mots</option></select></div>
</div><button id="calc">Générer</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.85rem;white-space:pre-wrap;word-break:break-word">—</div>
</div>`,
script:`var L="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
var words=L.split(' ');
function run(){
var n=+document.getElementById('a').value||3, u=document.getElementById('b').value, out='';
if(u==='w'){ for(var i=0;i<n;i++) out+=words[i%words.length]+' '; }
else if(u==='s'){ for(var i=0;i<n;i++){ var s=words.slice(i%words.length, (i%words.length)+9).join(' '); out+=s.charAt(0).toUpperCase()+s.slice(1)+'.'+(i<n-1?' ':''); } }
else { for(var p=0;p<n;p++){ var s=words.map(function(w,i){return (p===0 && i===0)?w.charAt(0).toUpperCase()+w.slice(1):w;}).slice(0,35).join(' '); if(p===0) s+='.'; else s+='.'; out+=s+'\\n\\n'; } }
document.getElementById('out').textContent=out.trim();
document.getElementById('res').classList.add('show');
}
document.getElementById('calc').addEventListener('click',run); run();`,
kw:'lorem ipsum, texte remplissage, générateur texte'});

T({slug:'convertisseur-unites', title:'Convertisseur d\'unités (longueur, poids, température, volume)', desc:'Convertis entre toutes les unités courantes : mètres, pieds, kg, lb, °C, °F, litres, gallons, etc.', h1:'Convertisseur d\'unités', badge:'🔄 Conversion', lead:'Convertis une valeur entre les unités de mesure courantes.', calc:`
<div class="grid">
<div><label for="a">Valeur</label><input id="a" type="number" value="10"></div>
<div><label for="b">De</label><select id="b"><option value="m_km">m → km</option><option value="km_m">km → m</option><option value="ft_m">ft → m</option><option value="m_ft">m → ft</option><option value="kg_lb">kg → lb</option><option value="lb_kg">lb → kg</option><option value="l_gal">L → gal (US)</option><option value="gal_l">gal → L</option><option value="c_f">°C → °F</option><option value="f_c">°F → °C</option><option value="m2_cm2">m² → cm²</option><option value="cm2_m2">cm² → m²</option></select></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
</div>`,
script:`var FN={m_km:v=>v/1000,km_m:v=>v*1000,ft_m:v=>v*0.3048,m_ft:v=>v/0.3048,kg_lb:v=>v*2.20462,lb_kg:v=>v/2.20462,l_gal:v=>v/3.78541,gal_l:v=>v*3.78541,c_f:v=>v*9/5+32,f_c:v=>(v-32)*5/9,m2_cm2:v=>v*10000,cm2_m2:v=>v/10000};
document.getElementById('calc').addEventListener('click',function(){
var v=+document.getElementById('a').value||0, k=document.getElementById('b').value;
var r=FN[k](v);
document.getElementById('out').innerHTML=r.toLocaleString('fr-FR',{maximumFractionDigits:6});
document.getElementById('res').classList.add('show');
});`,
kw:'convertisseur unités, mètres, pieds, kg, livre, °C, °F'});

T({slug:'convertisseur-data', title:'Convertisseur taille de fichier (o, Ko, Mo, Go, To)', desc:'Convertis une taille de fichier entre octets, kilo-octets, mega-octets, giga et tera-octets.', h1:'Convertisseur de taille de fichier', badge:'🔄 Conversion', lead:'Convertis une taille de fichier entre toutes les unités.', calc:`
<div class="grid">
<div><label for="a">Valeur</label><input id="a" type="number" value="1.5"></div>
<div><label for="b">De</label><select id="b"><option value="Go">Go → Mo</option><option value="Mo">Mo → Go</option><option value="Ko">Ko → Mo</option><option value="Mo2">Mo → Ko</option><option value="o">o → Ko</option><option value="Ko2">Ko → o</option><option value="To">To → Go</option><option value="Go2">Go → To</option></select></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
</div>`,
script:`var FN={Go:v=>v*1024,Mo:v=>v/1024,Ko:v=>v/1024,Mo2:v=>v*1024,o:v=>v/1024,Ko2:v=>v*1024,To:v=>v*1024,Go2:v=>v/1024};
document.getElementById('calc').addEventListener('click',function(){
var v=+document.getElementById('a').value||0,k=document.getElementById('b').value;
document.getElementById('out').innerHTML=FN[k](v).toLocaleString('fr-FR',{maximumFractionDigits:6});
document.getElementById('res').classList.add('show');
});`,
kw:'conversion octets, ko, mo, go, to, taille fichier'});

T({slug:'convertisseur-roman', title:'Convertir nombre en chiffres romains (et inversement)', desc:'Convertis un nombre arabe en chiffres romains et inversement.', h1:'Convertisseur en chiffres romains', badge:'🔄 Conversion', lead:'Convertis un nombre en chiffres romains, jusqu\'à 3 999.', calc:`
<div class="grid">
<div><label for="a">Nombre ou chiffres romains</label><input id="a" type="text" value="2026"></div>
</div><button id="calc">Convertir</button>
<div class="result" id="res">
<div class="big" id="out">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var v=document.getElementById('a').value.trim();
var convToRoman=function(n){
var map=[['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]],res='';
for(var i=0;i<map.length;i++){while(n>=map[i][1]){res+=map[i][0];n-=map[i][1];}}
return res;};
var convFromRoman=function(s){
var m={'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000},tot=0,prev=0;
for(var i=s.length-1;i>=0;i--){var c=m[s[i]]||0; tot += c<prev?-c:c; prev=c;}
return tot;};
var n=parseInt(v,10);
var out=isNaN(n)?convToRoman(convFromRoman(v.toUpperCase())):convToRoman(n);
document.getElementById('out').textContent=out||'—';
document.getElementById('res').classList.add('show');
});`,
kw:'chiffres romains, convertir, romain, nombre'});

T({slug:'hex-rgb', title:'Convertisseur de couleur Hex ↔ RGB / HSL', desc:'Convertis une couleur hexadécimale (#rrggbb) en RGB et HSL, et visualise-la.', h1:'Convertisseur de couleur Hex ↔ RGB ↔ HSL', badge:'🎨 Design', lead:'Convertis entre Hex, RGB et HSL, et prévisualise la couleur.', calc:`
<div class="grid">
<div><label for="a">Couleur (hex #rrggbb)</label><input id="a" type="text" value="#3b82f6"></div>
</div><button id="calc">Convertir</button>
<div id="swatch" style="height:60px;border-radius:12px;margin-top:12px;background:#3b82f6"></div>
<div class="result" id="res">
<div class="kv"><span>Hex</span><b id="k1">—</b></div>
<div class="kv"><span>RGB</span><b id="k2">—</b></div>
<div class="kv"><span>HSL</span><b id="k3">—</b></div>
<div class="kv"><span>Complémentaire</span><b id="k4">—</b></div>
</div>`,
script:`function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');var n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var max=Math.max(r,g,b),min=Math.min(r,g,b),h=0,s=0,l=(max+min)/2;if(max!==min){var d=max-min;s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;}h*=60;}return [Math.round(h),Math.round(s*100),Math.round(l*100)];}
document.getElementById('calc').addEventListener('click',function(){
var h=document.getElementById('a').value; try{
var rgb=hex2rgb(h), hsl=rgb2hsl(rgb[0],rgb[1],rgb[2]), comp='#'+(0xffffff-parseInt(h.replace('#',''),16)).toString(16).padStart(6,'0');
document.getElementById('swatch').style.background=h;
document.getElementById('k1').textContent=h;
document.getElementById('k2').textContent='rgb('+rgb.join(', ')+')';
document.getElementById('k3').textContent='hsl('+hsl.join(', ')+')';
document.getElementById('k4').textContent=comp;
document.getElementById('res').classList.add('show');
}catch(e){alert('Hex invalide.');}
});`,
kw:'hex to rgb, conversion couleur, HSL, complementaire'});

T({slug:'json-formatter', title:'Formatteur JSON : pretty print, minify, validation', desc:'Formate, minifie ou valide du JSON directement dans ton navigateur.', h1:'Formatteur JSON en ligne', badge:'🔧 Dev', lead:'Colle du JSON pour le formater, le minifier ou le valider.', calc:`
<div class="grid">
<div><label for="a">JSON</label><textarea id="a" rows="6" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-family:ui-monospace,Menlo,monospace;font-size:.85rem">{ "nom": "CalcUtile", "outils": 100, "gratuit": true }</textarea></div>
<div><label for="b">Action</label><select id="b"><option value="pretty">Formater (indenté)</option><option value="min">Minifier</option><option value="valid">Valider seulement</option></select></div>
</div><button id="calc">Traiter</button>
<div class="result" id="res">
<div class="big" id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.8rem;white-space:pre-wrap;word-break:break-word">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
try{
var obj=JSON.parse(document.getElementById('a').value), act=document.getElementById('b').value, out;
if(act==='pretty') out=JSON.stringify(obj,null,2);
else if(act==='min') out=JSON.stringify(obj);
else out='JSON valide ✓ ('+ (Array.isArray(obj)?obj.length+' éléments':'objet') +')';
document.getElementById('out').textContent=out;
document.getElementById('res').classList.add('show');
}catch(e){alert('JSON invalide : '+e.message);}
});`,
kw:'json formatter, pretty print, minify, valider json'});

T({slug:'regex-tester', title:'Testeur de regex en ligne (RegExp JavaScript)', desc:'Teste une expression régulière sur un texte, avec mise en évidence des correspondances et des groupes.', h1:'Testeur d\'expressions régulières', badge:'🔧 Dev', lead:'Teste ta regex sur un texte, avec le détail des correspondances.', calc:`
<div class="grid">
<div><label for="a">Expression régulière (sans délimiteurs)</label><input id="a" type="text" value="\\b\\w{5}\\b"></div>
<div><label for="b">Drapeaux</label><input id="b" type="text" value="gi"></div>
<div><label for="c">Texte</label><textarea id="c" rows="4" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:.9rem">Ceci est un exemple de regex pour tester des groupes.</textarea></div>
</div><button id="calc">Tester</button>
<div class="result" id="res">
<div class="kv"><span>Correspondances</span><b id="k1">—</b></div>
<div id="out" style="margin-top:10px;font-family:ui-monospace,Menlo,monospace;font-size:.85rem;white-space:pre-wrap"></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var pat=document.getElementById('a').value, fl=document.getElementById('b').value, txt=document.getElementById('c').value;
try{ var re=new RegExp(pat,fl); var m=txt.match(re); var all=[];
while(true){ var r=re.exec(txt); if(!r)break; all.push(r); if(!re.global) break; }
document.getElementById('k1').textContent=all.length;
document.getElementById('out').innerHTML=all.map(function(x,i){return i+1+': <b>'+x[0]+'</b>'+(x.length>1?' (groupes: '+x.slice(1).join(', ')+')':'');}).join('<br>') || 'aucune';
document.getElementById('res').classList.add('show');
}catch(e){alert('Regex invalide : '+e.message);}
});`,
kw:'regex tester, expression reguliere, match, groupes'});

T({slug:'diff-texte', title:'Comparateur de texte : différences entre deux versions', desc:'Compare deux textes et affiche les lignes ajoutées, supprimées ou modifiées.', h1:'Diff de texte', badge:'🔧 Dev', lead:'Compare deux textes ligne par ligne pour repérer les changements.', calc:`
<div class="grid">
<div><label for="a">Texte A</label><textarea id="a" rows="5" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:.9rem"></textarea></div>
<div><label for="b">Texte B</label><textarea id="b" rows="5" style="width:100%;padding:12px;border:1px solid #e6ebf3;border-radius:11px;font-size:.9rem"></textarea></div>
</div><button id="calc">Comparer</button>
<div class="result" id="res">
<div id="out" style="font-family:ui-monospace,Menlo,monospace;font-size:.85rem;white-space:pre-wrap"></div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var A=document.getElementById('a').value.split('\\n'), B=document.getElementById('b').value.split('\\n');
var set=new Set(B), out='';
for(var i=0;i<A.length;i++){ if(B.indexOf(A[i])===-1) out+='\\x1b[31m- '+A[i]+'\\x1b[0m\\n'; else out+='  '+A[i]+'\\n'; }
out+='\\n=== Lignes ajoutées (dans B) ===\\n';
for(var j=0;j<B.length;j++){ if(A.indexOf(B[j])===-1) out+='+ '+B[j]+'\\n'; }
out=out.replace(/\\x1b\\[31m/g,'<span style="color:#c0392b">').replace(/\\x1b\\[0m/g,'</span>');
document.getElementById('out').innerHTML=out || 'Aucune différence.';
document.getElementById('res').classList.add('show');
});`,
kw:'diff texte, comparer, changements, difference'});

T({slug:'random-number', title:'Générateur de nombre aléatoire (entier ou décimal)', desc:'Génère un ou plusieurs nombres aléatoires dans un intervalle, avec ou sans doublons.', h1:'Générateur de nombres aléatoires', badge:'🎲 Hasard', lead:'Génère des nombres aléatoires dans l\'intervalle choisi.', calc:`
<div class="grid">
<div><label for="a">Minimum</label><input id="a" type="number" value="1"></div>
<div><label for="b">Maximum</label><input id="b" type="number" value="100"></div>
<div><label for="c">Quantité</label><input id="c" type="number" value="5"></div>
<div><label for="d">Options</label><select id="d"><option value="int">Entiers</option><option value="dec">Décimales</option><option value="uniq">Entiers uniques (sans doublon)</option></select></div>
</div><button id="calc">Générer</button>
<div class="result" id="res">
<div class="big" id="out" style="font-size:1.2rem;white-space:pre-wrap">—</div>
</div>`,
script:`document.getElementById('calc').addEventListener('click',function(){
var min=+document.getElementById('a').value, max=+document.getElementById('b').value, n=+document.getElementById('c').value||1, mode=document.getElementById('d').value;
var out=[];
if(mode==='uniq'){ var pool=[]; for(var i=min;i<=max;i++) pool.push(i); for(var i=0;i<n && pool.length;i++){ var idx=Math.floor(Math.random()*pool.length); out.push(pool.splice(idx,1)[0]); } }
else { for(var i=0;i<n;i++){ var v=min+Math.random()*(max-min); out.push(mode==='int'?Math.round(v):v.toFixed(4)); } }
document.getElementById('out').textContent=out.join(', ');
document.getElementById('res').classList.add('show');
});`,
kw:'générateur nombre aléatoire, hasard, random, tirage'});

// ---------------- LETTRES TYPES (une seule page dynamique) ----------------
const LETTERS = [
{key:'demission', label:'Lettre de démission (classique)', txt:`Objet : démission\n\nMadame, Monsieur,\n\nPar la présente, je vous informe de ma décision de démissionner de mon poste de [poste], au sein de [entreprise], pour convenances personnelles.\n\nConformément à la durée de mon préavis prévue par la convention collective et par mon contrat de travail, mes fonctions prendront fin le [date de fin de préavis].\n\nJe m'engage à effectuer, durant ma période de préavis, une passation complète des dossiers dont j'ai la charge.\n\nJe vous remercie pour la confiance accordée au cours de cette collaboration et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Signature]`},
{key:'demission-faute', label:'Démission pour faute de l\'employeur (prise d\'acte)', txt:`Objet : prise d'acte de la rupture de mon contrat de travail\n\nMadame, Monsieur,\n\nEn raison des manquements suivants de l'employeur : [préciser : non-paiement des salaires, harcèlement, modification du contrat sans accord, etc.], je me vois contraint(e) de prendre acte de la rupture de mon contrat de travail à vos torts.\n\nJe vous remercie de prendre note que cette prise d'acte prend effet à compter de la réception de ce courrier, et que je déposerai, le cas échéant, un recours devant le conseil de prud'hommes.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Signature]`},
{key:'resiliation-mobile', label:'Résiliation d\'un forfait mobile', txt:`Objet : résiliation de mon abonnement mobile\n\nMadame, Monsieur,\n\nJe vous demande de résilier mon abonnement mobile concernant la ligne n° [numéro], à compter de la fin de mon engagement actuel.\n\nJe vous demande de me confirmer par écrit la date de fin de service et de bien vouloir cesser tout prélèvement au-delà.\n\nJe vous remercie de votre diligence et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Adresse]\n[Numéro de ligne, identifiant client]\n[Signature]`},
{key:'resiliation-internet', label:'Résiliation d\'une box internet', txt:`Objet : résiliation de mon abonnement Internet\n\nMadame, Monsieur,\n\nJe vous prie de prendre note de ma décision de résilier mon contrat d'accès Internet (référence [numéro client]), à la date de fin de mon engagement, sans frais.\n\nJe vous demande de me transmettre, sous quinze jours, ma facture de clôture et de procéder au remboursement éventuel des sommes versées par anticipation.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Adresse de l'abonnement]\n[Référence client]\n[Signature]`},
{key:'resiliation-assurance', label:'Résiliation d\'une assurance auto / habitation', txt:`Objet : résiliation de mon contrat d'assurance\n\nMadame, Monsieur,\n\nJe vous informe de ma volonté de résilier mon contrat d'assurance [auto/habitation/santé] n° [numéro], conformément aux conditions générales et à la législation en vigueur (loi Hamon à échéance annuelle, ou tout moment après la première année).\n\nJe vous remercie de me faire parvenir la confirmation de la résiliation et, le cas échéant, toute facture de régularisation.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Numéro de contrat]\n[Signature]`},
{key:'retractation', label:'Rétractation d\'achat en ligne (14 jours)', txt:`Objet : exercice du droit de rétractation — commande n° [numéro]\n\nMadame, Monsieur,\n\nConformément à l'article L.221-18 du Code de la consommation, je vous informe que j'exerce mon droit de rétractation concernant la commande n° [numéro], passée le [date], pour le bien/service suivant : [désignation].\n\nJe vous prie de bien vouloir procéder au remboursement de la somme de [montant] € dans un délai de 14 jours, sur le moyen de paiement utilisé lors de la commande.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Adresse]\n[Signature]`},
{key:'reclamation', label:'Lettre de réclamation commerciale', txt:`Objet : réclamation — commande / prestation n° [référence]\n\nMadame, Monsieur,\n\nJe vous contacte au sujet de [décrire le problème : article défectueux, retard de livraison, prestation non conforme, etc.], constaté le [date].\n\nJe demande le [remboursement / remplacement / geste commercial] suivant : [préciser]. À défaut, je me réserve le droit de saisir le service consommateur ou la juridiction compétente.\n\nJe vous remercie de me tenir informé(e) sous 15 jours et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Coordonnées]\n[Signature]`},
{key:'mise-en-demeure', label:'Mise en demeure de payer', txt:`Objet : mise en demeure de payer — facture n° [référence]\n\nMadame, Monsieur,\n\nPar la présente, et sous réserve de mes droits, je vous mets en demeure de régler sous 8 jours la somme de [montant] € due au titre de [facture / prestation / contrat] n° [référence], dont l'échéance était le [date].\n\nÀ défaut, je me verrai contraint(e) d'engager toute procédure judiciaire utile, y compris la saisine du tribunal compétent, avec demande de dommages et intérêts.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Signature]`},
{key:'recommandation', label:'Lettre de recommandation', txt:`Objet : lettre de recommandation pour [Prénom NOM]\n\nMadame, Monsieur,\n\nJe soussigné(e), [mon nom], [fonction], ai eu le plaisir de travailler avec [prénom nom] pendant [durée], en qualité de [poste occupé].\n\nDurant cette période, [prénom] a fait preuve de [qualités : rigueur, autonomie, esprit d'équipe, sens de l'organisation], et a parfaitement rempli les missions qui lui étaient confiées, notamment [2 ou 3 missions concrètes].\n\nJe ne doute pas qu'il/elle saura mettre ses compétences et son dynamisme au service de votre organisation, et je le/la recommande chaleureusement.\n\nJe me tiens à votre disposition pour tout complément d'information.\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Signature]\n[Nom, prénom, fonction, coordonnées]`},
{key:'reclamation-amende', label:'Contestation d\'une amende (contravention)', txt:`Objet : contestation d\'une contravention — procès-verbal n° [numéro]\n\nMonsieur le Préfet,\n\nJe conteste la contravention n° [numéro], établie le [date] à [lieu], pour le motif suivant : [préciser : erreur d\'immatriculation, panneau non visible, absence de conducteur, etc.].\n\nJe vous prie de bien vouloir reconsidérer ce dossier. Vous trouverez ci-joint les pièces justificatives : [ photos, justificatif ].\n\nJe vous prie d'agréer, Monsieur le Préfet, l'expression de ma considération distinguée.\n\n[Nom, prénom]\n[Signé]`},
{key:'arret-maladie', label:'Demande d\'arrêt maladie (employeur)', txt:`Objet : demande d'arrêt de travail pour maladie\n\nMadame, Monsieur,\n\nJe vous informe par la présente que mon médecin m'a placé(e) en arrêt de travail à compter du [date] pour une durée prévisible de [durée] jours/semaines, pour raison médicale dont le certificat médical est joint.\n\nJe vous demande de procéder à la transmission de l'arrêt à l'assurance maladie et de me confirmer la prise en compte de mon dossier.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Signature]`},
{key:'renegocier-credit', label:'Demande de renégociation de crédit immobilier', txt:`Objet : demande de renégociation de mon crédit immobilier\n\nMadame, Monsieur,\n\nTitulaire du prêt immobilier n° [numéro], je sollicite une renégociation de ses conditions financières. Mon taux actuel s'élève à [taux] %, alors que les taux proposés pour une durée comparable sont nettement plus bas.\n\nJe vous demande de m'adresser une proposition de baisse de taux et, à défaut, un accord de principe pour un rachat par un autre établissement.\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Nom, prénom]\n[Référence du prêt]\n[Signature]`},
];

// ---- écriture des outils ----
TOOLS.forEach(o=>{
  fs.writeFileSync(path.join(dir, 'outil-'+o.slug+'.html'), page(Object.assign({}, o, {file:'outil-'+o.slug+'.html'})), 'utf8');
  console.log('écrit outil-'+o.slug+'.html');
});

// ---- lettre-types.html (dynamique) ----
const lettersJs = JSON.stringify(LETTERS);
const lettersHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://littl-spip.github.io/lettres-types.html">
<meta name="google-site-verification" content="tLI8q_80Hy8_iRrXEFf3IBbdnOSbba6bKjEGPKuAJPA" />
<title>Lettres types gratuites : démission, résiliation, réclamation, etc.</title>
<meta name="description" content="Plus de 15 lettres types gratuites et prêtes à copier : démission, résiliation mobile et internet, assurance, rétractation, réclamation, mise en demeure, recommandation, etc.">
<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1087976242537233" crossorigin="anonymous"></script>
</head><body>
<header class="site"><div class="wrap"><a class="logo" href="index.html">Calc<span>Utile</span></a>
<nav class="top"><a href="index.html">Accueil</a><a href="outils.html">Outils</a><a href="radar-economies.html">Radar Éco</a></nav></div></header>
<main><div class="wrap">
<div class="crumb"><a href="index.html">Accueil</a> › Lettres types</div>
<span class="badge">✅ 100 % gratuit · sans inscription</span>
<h1>Lettres types prêtes à copier</h1>
<p class="lead">Plus de 15 lettres prêtes à l'emploi, pour les démarches administratives du quotidien. Remplace les champs entre crochets et copie.</p>
<label for="l-type">Quelle lettre ?</label>
<select id="l-type">${LETTERS.map(l=>`<option value="${l.key}">${l.label}</option>`).join('')}</select>
<label style="margin-top:12px" for="l-txt">Texte</label>
<textarea id="l-txt" rows="16" style="width:100%;padding:14px;border:1px solid #e6ebf3;border-radius:12px;font-family:ui-monospace,Menlo,monospace;font-size:.86rem;line-height:1.55;resize:vertical;background:#fbfcfe"></textarea>
<div style="display:flex;gap:8px;flex-wrap:wrap">
<button class="btn2" id="l-copy">📋 Copier</button>
<button class="btn2" id="l-print">🖨️ Imprimer / PDF</button>
</div>
<div class="ad"><!-- Emplacement publicité (AdSense) --></div>
<h2>Pourquoi ces lettres ?</h2>
<p>Ces modèles couvrent les démarches les plus fréquentes : démission, résiliation de contrat (téléphone, Internet, assurance), rétractation d'achat en ligne (14 jours), réclamation commerciale, mise en demeure, recommandation, contestation d'amende, demande d'arrêt maladie. Ils sont fournis à titre indicatif et doivent être adaptés à ta situation.</p>
</div></main>
<footer class="site"><div class="wrap"><p>CalcUtile — modèles indicatifs, ne constituent pas un conseil juridique.</p></div></footer>
<script>
var LETTERS=${lettersJs};
var sel=document.getElementById('l-type'), ta=document.getElementById('l-txt');
function load(){ ta.value=LETTERS.filter(function(l){return l.key===sel.value;})[0].txt; }
sel.addEventListener('change',load); load();
document.getElementById('l-copy').addEventListener('click',function(){ ta.select(); ta.setSelectionRange(0,99999);
  var done=function(){var t=document.getElementById('toast');t.textContent='Copié !';t.classList.add('show');setTimeout(function(){t.classList.remove('show');},1600);};
  if(navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done,function(){document.execCommand('copy');done();}); else {document.execCommand('copy');done();}
});
document.getElementById('l-print').addEventListener('click',function(){var w=window.open('','_blank');w.document.write('<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;white-space:pre-wrap;padding:28px">'+ta.value.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</pre>');w.document.close();w.print();});
</script><div class="toast" id="toast" style="position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:#0b1220;color:#fff;padding:11px 18px;border-radius:12px;font-size:.9rem;opacity:0;pointer-events:none;transition:.25s;z-index:80"></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'lettres-types.html'), lettersHtml, 'utf8');
console.log('écrit lettres-types.html');

// ---- outils.html (hub) ----
const cats = [...new Set(TOOLS.map(o=>o.cat? (o.cat):(null)))].filter(Boolean);
// T() doesn't set cat currently; derive category from badge
function catOf(o){ var b=o.badge||''; if(/Immobilier|Finance|Salaire|Impôt|Juridique|Transport/.test(b)) return 'Argent & Immobilier'; if(/Santé|Famille/.test(b)) return 'Santé & Famille'; if(/Texte|Dev|Conversion|Design|Hasard/.test(b)) return 'Texte, Dev & Conversions'; if(/Temps/.test(b)) return 'Temps & Calendrier'; return 'Autres'; }
TOOLS.forEach(o=>{o._cat=catOf(o);});
const allCats = [...new Set(TOOLS.map(o=>o._cat))];
const outilsHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://littl-spip.github.io/outils.html">
<meta name="google-site-verification" content="tLI8q_80Hy8_iRrXEFf3IBbdnOSbba6bKjEGPKuAJPA" />
<title>Boîte à outils : ${TOOLS.length}+ calculateurs et convertisseurs gratuits</title>
<meta name="description" content="Plus de ${TOOLS.length} outils gratuits et instantanés : finance, immobilier, santé, dates, conversions, développeurs, générateurs. Sans inscription, dans ton navigateur.">
<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1087976242537233" crossorigin="anonymous"></script>
<style>
.hub-search{width:100%;padding:14px 16px;border:1px solid #e6ebf3;border-radius:12px;font-size:1.05rem;margin:8px 0 18px;background:#fff}
.hub-search:focus{outline:none;border-color:#2f5bea;box-shadow:0 0 0 4px rgba(47,91,234,.18)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 22px}
.chip{background:#fff;border:1px solid #e6ebf3;border-radius:999px;padding:7px 14px;font-size:.86rem;font-weight:600;color:#475569;cursor:pointer}
.chip.active{background:#2f5bea;color:#fff;border-color:#2f5bea}
.toolgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.tcard{display:block;background:#fff;border:1px solid #e6ebf3;border-radius:14px;padding:16px;transition:.16s;box-shadow:0 1px 2px rgba(11,18,32,.05)}
.tcard:hover{border-color:#2f5bea;transform:translateY(-3px);text-decoration:none;box-shadow:0 18px 44px rgba(11,18,32,.11)}
.tcard .ic{font-size:1.35rem;display:inline-flex;width:38px;height:38px;align-items:center;justify-content:center;background:rgba(47,91,234,.08);border-radius:10px}
.tcard h3{margin:10px 0 4px;color:#0b1220;font-size:.98rem}
.tcard p{color:#5b6b84;font-size:.84rem;margin:0}
.empty{padding:30px;text-align:center;color:#5b6b84}
</style>
</head><body>
<header class="site"><div class="wrap"><a class="logo" href="index.html">Calc<span>Utile</span></a>
<nav class="top"><a href="index.html">Accueil</a><a href="outils.html">Outils</a><a href="radar-economies.html">Radar Éco</a><a href="lettres-types.html">Lettres types</a></nav></div></header>
<main><div class="wrap">
<div class="crumb"><a href="index.html">Accueil</a> › Boîte à outils</div>
<span class="badge">📦 ${TOOLS.length} outils · 100 % gratuit · sans inscription</span>
<h1>Boîte à outils gratuits</h1>
<p class="lead">Finance, immobilier, santé, dates, conversions, développeurs : tous les calculateurs instantanés, sans inscription, dans ton navigateur.</p>
<input id="q" class="hub-search" type="search" placeholder="Rechercher un outil… (ex. crédit, IMC, Base64, QR)">
<div class="chips" id="chips"></div>
<div class="toolgrid" id="grid"></div>
<div class="empty" id="empty" style="display:none">Aucun outil ne correspond à ta recherche.</div>
<div class="ad"><!-- Emplacement publicité (AdSense) --></div>
<h2>Autres ressources</h2>
<p><a href="lettres-types.html">Lettres types (démission, résiliation…)</a> · <a href="radar-economies.html">Radar Économies</a> · <a href="index.html">Accueil</a></p>
</div></main>
<footer class="site"><div class="wrap"><p>CalcUtile — résultats indicatifs. Rien n'est envoyé ni stocké.</p></div></footer>
<script>
var TOOLS=${JSON.stringify(TOOLS.map(o=>({slug:o.slug,title:o.title,desc:o.desc,icon:(o.badge||'').match(/^[^\s]+/)?.[0]||'🔧',cat:o._cat})))};
var active='Tous';
var chips=document.getElementById('chips');
function renderChips(){ var cats=['Tous',...new Set(TOOLS.map(t=>t.cat))];
 chips.innerHTML=cats.map(function(c){return '<button class="chip'+(c===active?' active':'')+'" data-c="'+c+'">'+c+' ('+(c==='Tous'?TOOLS.length:TOOLS.filter(t=>t.cat===c).length)+')'+'</button>';}).join('');
 document.querySelectorAll('.chip').forEach(function(b){b.addEventListener('click',function(){active=b.dataset.c;renderChips();renderGrid();});});
}
function renderGrid(){
 var q=document.getElementById('q').value.toLowerCase().trim();
 var list=TOOLS.filter(function(t){
   var okCat=active==='Tous'||t.cat===active;
   var okQ=!q|| (t.title+' '+t.desc+' '+t.cat).toLowerCase().indexOf(q)>-1;
   return okCat&&okQ;
 });
 document.getElementById('grid').innerHTML=list.map(function(t){return '<a class="tcard" href="outil-'+t.slug+'.html"><div class="ic">'+t.icon+'</div><h3>'+t.title+'</h3><p>'+t.desc+'</p></a>';}).join('');
 document.getElementById('empty').style.display=list.length?'none':'block';
}
document.getElementById('q').addEventListener('input',renderGrid);
renderChips(); renderGrid();
</script>
</body></html>`;
fs.writeFileSync(path.join(dir, 'outils.html'), outilsHtml, 'utf8');
console.log('écrit outils.html');

console.log('TOTAL TOOLS :', TOOLS.length);
fs.writeFileSync(path.join(dir, '_gencount.txt'), String(TOOLS.length), 'utf8');
