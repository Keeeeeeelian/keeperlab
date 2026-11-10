const id = new URLSearchParams(location.search).get("id"),
  root = document.querySelector("#product-root"),
  money = (v) =>
    new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
    }).format(v);
function setMeta(selector, attribute, value) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/);
    element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}
function updateProductSeo(p) {
  const description =
      p.description +
      " Découvrez les caractéristiques, tailles et informations utiles de ce produit sélectionné par KeeperLab.",
    url = "https://keeperlab.ch/produit.html?id=" + encodeURIComponent(p.id);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:type"]', "content", "website");
  setMeta('meta[property="og:locale"]', "content", "fr_CH");
  setMeta('meta[property="og:site_name"]', "content", "KeeperLab");
  setMeta('meta[property="og:title"]', "content", p.name + " — KeeperLab");
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:image"]', "content", p.image);
  setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
}

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={cut:'Coupe',latex:'Latex / paume',grip:'Adhérence',durability:'Durabilité',terrain:'Terrain',conditions:'Conditions',fit:'Ajustement',closure:'Fermeture',sizes:'Tailles proposées',fingerProtection:'Protection des doigts',surface:'Surface / semelle',metalStuds:'Crampons métalliques',material:'Matière',keeperlabScore:'Note KeeperLab',backhand:'Corps / dos du gant',entry:'Entrée du gant',punchZone:'Zone de frappe',flexibility:'Flexion',wraps:'Enveloppement',collection:'Collection'};
const specDefinitions = {
 cut: ["Coupe", "La coupe décrit la construction autour des doigts. Vérifiez le volume disponible et la liberté de fermeture de la main."],
 latex: ["Paume", "Surface de contact avec le ballon. Comparez cette indication avec la coupe, les retours de matière et les consignes d’entretien."],
 grip: ["Accroche indiquée au catalogue", "Cette appréciation n’est pas une mesure issue d’un test terrain KeeperLab."],
 durability: ["Durabilité indiquée au catalogue", "Cette indication ne correspond pas à un nombre garanti de séances. Le terrain, les appuis et l’entretien influencent l’usure."],
 terrain: ["Terrain indiqué", "Comparez cette indication à votre surface habituelle et vérifiez les consignes du fabricant."],
 conditions: ["Conditions indiquées", "Vérifiez également la préparation de la paume recommandée avant la séance."],
 fit: ["Ajustement", "La sensation dépend de votre morphologie : les doigts doivent pouvoir se plier sans compression ni déplacement excessif du gant."],
 closure: ["Fermeture", "Le réglage stabilise le gant au poignet. Il ne doit pas compenser une taille inadaptée."]
};
const productGuides = {
 gants: [
  ["Ajustement et mobilité", "Comparez vos mesures au guide du fabricant. Essayez main ouverte puis poing fermé : contrôlez les extrémités des doigts, la mobilité du pouce et la tenue au poignet. Deux coupes d’une même taille peuvent donner des sensations différentes."],
  ["Terrain et fréquence de jeu", "Prenez en compte votre terrain principal, votre fréquence de séances et les conditions habituelles. Une épaisseur ou un nom de latex ne suffit pas à prévoir l’accroche et la durée de vie. Vérifiez les informations de la référence exacte chez le partenaire."],
  ["Entretien de la paume", "Suivez les consignes du fabricant pour la préparation et le nettoyage. Évitez les sources de chaleur au séchage. Surveillez les coutures et les zones de contact avec le sol pour suivre l’usure de votre paire."]
 ],
 chaussures: [
  ["Semelle et surface", "Vérifiez le type de semelle et sa compatibilité avec votre terrain sur la référence vendue. Les variantes d’un même modèle peuvent utiliser des crampons différents. Le nom commercial seul ne permet pas de choisir la version adaptée."],
  ["Chaussant et maintien", "Essayez avec vos chaussettes de jeu. Contrôlez le maintien du talon, la largeur à l’avant-pied et l’espace pour les orteils. Pendant les appuis, le pied doit rester stable sans point de pression gênant."],
  ["Construction et entretien", "Consultez la matière de la tige, le système de laçage et les consignes de nettoyage du vendeur. Le poids, la composition et les renforts doivent être vérifiés sur le modèle exact."]
 ],
 textile: [
  ["Mesures et aisance", "Mesurez à plat un vêtement qui vous convient selon la méthode du marchand. Comparez poitrine, longueur et manches, puis prévoyez l’aisance nécessaire aux mouvements et aux couches portées en dessous."],
  ["Composition et ventilation", "Vérifiez les pourcentages de fibres et les zones de ventilation annoncées. La mention « technique » ne précise pas à elle seule la matière, l’épaisseur ou la capacité d’évacuation de la transpiration."],
  ["Finitions et lavage", "Observez les coutures, les marquages et les éventuelles zones renforcées. Pour le lavage et le séchage, suivez l’étiquette du vêtement et les consignes particulières aux logos ou au flocage."]
 ],
 protections: [
  ["Zone couverte", "Identifiez la partie du corps couverte et la position des renforts. Essayez la protection dans les mouvements du gardien : les zones rembourrées doivent rester en place sans gêner la flexion."],
  ["Taille et maintien", "Utilisez les mesures demandées par le fabricant et contrôlez la tenue avec votre équipement habituel. Une protection qui glisse ou comprime excessivement mérite un autre réglage ou une autre taille."],
  ["Construction et suivi", "Consultez la composition, l’épaisseur des renforts et les éventuelles normes publiées. La présence de mousse ne permet pas de déduire un niveau de protection certifié. Vérifiez régulièrement les coutures et le maintien élastique."]
 ]
};


function renderTechnicalContent(p) {
 const detail = p.technicalContent;
 if (!detail) return "";
 const sections = detail.sections.map(section =>
  '<section class="technical-section"><p class="eyebrow">'+esc(section.eyebrow)+'</p><h3>'+esc(section.title)+'</h3>'+
  (section.paragraphs || []).map(text=>'<p>'+esc(text)+'</p>').join('')+
  (section.items ? '<ol>'+section.items.map(text=>'<li>'+esc(text)+'</li>').join('')+'</ol>' : '')+
  '</section>').join('');
 const otherGloves = [
  ['gigasport-7769534','SUPERGRIP+ HN'],
  ['gigasport-7769533','ABSOLUTGRIP'],
  ['gigasport-7656574','Prediction Supersoft']
 ].filter(([id])=>id!==p.id);
 return '<div class="model-technical-content">'+sections+
  '<section class="technical-section technical-sources"><p class="eyebrow">POUR VÉRIFIER</p><h3>Sources et informations disponibles</h3><p>'+esc(detail.note)+'</p><p>Recherche documentaire du <time datetime="'+esc(detail.checkedAt)+'">'+esc(new Date(detail.checkedAt+'T12:00:00Z').toLocaleDateString('fr-CH'))+'</time>. Prix et stock à vérifier chez le partenaire.</p><ul>'+
  detail.sources.map(source=>'<li><a href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">'+esc(source.label)+' ↗</a></li>').join('')+
  '</ul></section><section class="technical-section"><p class="eyebrow">LES AUTRES GANTS DE LA SÉLECTION</p><h3>Comparer les deux autres modèles</h3><div class="technical-related">'+otherGloves.map(([id,name])=>'<a href="produit.html?id='+encodeURIComponent(id)+'#fiche-technique">'+esc(name)+' →</a>').join('')+'</div></section></div>';
}

async function show(p){
 document.title=p.name+' — KeeperLab';updateProductSeo({...p,description:p.description||p.name});
 const specs={...p.specs};if(p.modelCode)specs['Référence fabricant']=p.modelCode;if(p.color)specs['Coloris']=p.color;if(p.club)specs['Club']=p.club;if(p.season)specs['Saison']=p.season;if(p.sizes&&!specs.sizes)specs.sizes=p.sizes;
 const rows=Object.entries(specs).filter(([,v])=>v!=null&&v!=='').map(([key,v])=>'<article><span>'+esc(labels[key]||key)+'</span><strong>'+esc(Array.isArray(v)?v.join(' · '):typeof v==='boolean'?v?'Oui':'Non':v)+'</strong>'+(p.specNotes?.[key] || specDefinitions[key] ? '<p>'+esc(p.specNotes?.[key] || specDefinitions[key][1])+'</p>' : '')+'</article>').join('');
 const available=p.availability?.selectableSizes;
 const sizes=available||p.specs?.sizes||p.sizes||[];
 const buy=p.affiliateUrl||p.sourceUrl;
 const images=[...new Set([p.image,...(p.images||[]).map(x=>typeof x==='string'?x:x.url)].filter(Boolean))];
 root.innerHTML='<section class="product-detail"><a class="back-link" href="catalogue.html?category='+encodeURIComponent(p.category)+'">← Retour au catalogue</a><div class="product-detail-grid"><div class="product-gallery"><div class="product-detail-image">'+(images.length?'<img id="product-photo" src="'+esc(images[0])+'" alt="'+esc(p.name)+'" onerror="this.remove()">':'')+'</div>'+(images.length>1?'<div class="product-thumbnails">'+images.map((src,i)=>'<button type="button" data-photo="'+esc(src)+'" aria-label="Photo '+(i+1)+'" aria-pressed="'+(i===0)+'"><img src="'+esc(src)+'" alt=""></button>').join('')+'</div>':'')+'</div><div class="product-detail-copy"><p class="eyebrow">'+esc(p.category)+' · '+esc(p.brand||p.club||'')+'</p><h1>'+esc(p.name)+'</h1><p class="product-detail-description">'+esc(p.description||'')+'</p><div class="product-detail-price">'+(Number.isFinite(p.price)?'<strong>'+money(p.price)+'</strong>'+(Number.isFinite(p.originalPrice)?'<del>'+money(p.originalPrice)+'</del>':'')+(p.priceCheckedAt?'<p>Prix relevé le '+esc(new Date(p.priceCheckedAt+'T12:00:00Z').toLocaleDateString('fr-CH'))+'</p>':''):'<p>Prix à consulter chez le fournisseur</p>')+'</div><div class="size-block"><span>'+ (available?'TAILLES DISPONIBLES AU DERNIER RELEVÉ':'TAILLES PROPOSÉES')+'</span><div>'+(sizes.length>1?sizes:[]).map(s=>'<span class="product-size">'+esc(s)+'</span>').join('')+'</div><small>'+esc(available?'Relevé du '+(p.availability.checkedAt||'date non renseignée')+'. Stock à revérifier chez le fournisseur.':sizes.length?'Disponibilité à vérifier chez le fournisseur.':'Tailles non renseignées. Consultez le fournisseur.')+'</small></div>'+(buy?'<a class="affiliate-button" href="'+esc(buy)+'" target="_blank" rel="'+(p.affiliateUrl?'sponsored ':'')+'noopener noreferrer">Acheter <span aria-hidden="true">↗</span></a><p class="affiliate-note">Achat chez '+esc(p.merchant||'le fournisseur')+'. Le prix final, la taille et la disponibilité sont à confirmer sur son site.</p>':'<p>Offre fournisseur indisponible pour le moment.</p>')+(p.category==='gants'?'<a class="product-compare-button" href="comparateur.html?left='+encodeURIComponent(p.id)+'">Comparer ce gant →</a>':'')+'</div></div><section class="product-specs" id="fiche-technique"><h2>FICHE <em>TECHNIQUE.</em></h2><div>'+ (rows||'<p>Caractéristiques non renseignées pour ce produit.</p>')+'</div><div id="product-technical-details" class="product-technical-details">'+renderTechnicalContent(p)+'</div></section>' + (p.technicalContent ? '' : '<section class="product-advice"><p class="eyebrow">POUR ALLER PLUS LOIN</p><h2>BIEN CHOISIR <em>ET UTILISER.</em></h2><div>' + (productGuides[p.category] || []).map(([title,copy])=>'<article><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></article>').join('') + '</div></section>') + '</section>';
 if(location.hash === '#fiche-technique') requestAnimationFrame(() => root.querySelector('#fiche-technique')?.scrollIntoView({block:'start'}));
 if(sizes.length<=1)root.querySelector('.size-block')?.remove();root.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{root.querySelector('#product-photo').src=button.dataset.photo;root.querySelectorAll('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
 if(p.productPage){try{
 const response=await fetch(p.productPage);if(!response.ok)return;
 const doc=new DOMParser().parseFromString(await response.text(),'text/html');
 const target=root.querySelector('#product-technical-details');
 // Preserve the existing manufacturer specifications, composition and care details.
 doc.querySelectorAll('.product-content > section').forEach(section=>{if(section.id==='caracteristiques'||section.classList.contains('product-reading')||section.querySelector('.product-composition,.product-care')&&!section.hasAttribute('aria-label')){const clone=section.cloneNode(true);clone.querySelectorAll('script').forEach(s=>s.remove());clone.querySelectorAll('.product-specs').forEach(s=>s.className='technical-definition');target.appendChild(clone);}});
 }catch{/* The structured technical sheet remains available offline. */}}
}
Promise.all(['data/products.json','data/maillots.json'].map(async url=>{const response=await fetch(url);if(!response.ok)throw Error('Chargement');return response.json();})).then(([equipment,jerseys])=>{
 const p=[...equipment,...jerseys.map(p=>({...p,category:'textile'}))].find(p=>p.id===id);
 if(p)show(p);else root.innerHTML='<section class="product-not-found"><h1>PRODUIT INTROUVABLE.</h1><a href="catalogue.html">Retour au catalogue</a></section>';
}).catch(()=>{root.innerHTML='<p class="catalog-empty">Le produit est momentanément indisponible.</p>';});
