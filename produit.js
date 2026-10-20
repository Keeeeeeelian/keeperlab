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
const labels={cut:'Coupe',latex:'Latex / paume',grip:'Adhérence',durability:'Durabilité',terrain:'Terrain',conditions:'Conditions',fit:'Ajustement',closure:'Fermeture',sizes:'Tailles proposées',fingerProtection:'Protection des doigts',surface:'Surface / semelle',metalStuds:'Crampons métalliques',material:'Matière',keeperlabScore:'Note KeeperLab'};
async function show(p){
 document.title=p.name+' — KeeperLab';updateProductSeo({...p,description:p.description||p.name});
 const specs={...p.specs};if(p.modelCode)specs['Référence fabricant']=p.modelCode;if(p.color)specs['Coloris']=p.color;if(p.club)specs['Club']=p.club;if(p.season)specs['Saison']=p.season;if(p.sizes&&!specs.sizes)specs.sizes=p.sizes;
 const rows=Object.entries(specs).filter(([,v])=>v!=null&&v!=='').map(([key,v])=>'<article><span>'+esc(labels[key]||key)+'</span><strong>'+esc(Array.isArray(v)?v.join(' · '):typeof v==='boolean'?v?'Oui':'Non':v)+'</strong></article>').join('');
 const available=p.availability?.selectableSizes;
 const sizes=available||p.specs?.sizes||p.sizes||[];
 const buy=p.affiliateUrl||p.sourceUrl;
 const images=[...new Set([p.image,...(p.images||[]).map(x=>typeof x==='string'?x:x.url)].filter(Boolean))];
 root.innerHTML='<section class="product-detail"><a class="back-link" href="catalogue.html?category='+encodeURIComponent(p.category)+'">← Retour au catalogue</a><div class="product-detail-grid"><div class="product-gallery"><div class="product-detail-image"><img id="product-photo" src="'+esc(images[0])+'" alt="'+esc(p.name)+'"></div>'+(images.length>1?'<div class="product-thumbnails">'+images.map((src,i)=>'<button type="button" data-photo="'+esc(src)+'" aria-label="Photo '+(i+1)+'" aria-pressed="'+(i===0)+'"><img src="'+esc(src)+'" alt=""></button>').join('')+'</div>':'')+'</div><div class="product-detail-copy"><p class="eyebrow">'+esc(p.category)+' · '+esc(p.brand||p.club||'')+'</p><h1>'+esc(p.name)+'</h1><p class="product-detail-description">'+esc(p.description||'')+'</p><div class="product-detail-price">'+(Number.isFinite(p.price)?'<strong>'+money(p.price)+'</strong>'+(Number.isFinite(p.originalPrice)?'<del>'+money(p.originalPrice)+'</del>':'')+(p.priceCheckedAt?'<p>Prix relevé le '+esc(new Date(p.priceCheckedAt+'T12:00:00Z').toLocaleDateString('fr-CH'))+'</p>':''):'<p>Prix à consulter chez le fournisseur</p>')+'</div><div class="size-block"><span>'+ (available?'TAILLES DISPONIBLES AU DERNIER RELEVÉ':'TAILLES PROPOSÉES')+'</span><div>'+sizes.map(s=>'<span class="product-size">'+esc(s)+'</span>').join('')+'</div><small>'+esc(available?'Relevé du '+(p.availability.checkedAt||'date non renseignée')+'. Stock à revérifier chez le fournisseur.':sizes.length?'Disponibilité à vérifier chez le fournisseur.':'Tailles non renseignées. Consultez le fournisseur.')+'</small></div>'+(buy?'<a class="affiliate-button" href="'+esc(buy)+'" target="_blank" rel="'+(p.affiliateUrl?'sponsored ':'')+'noopener noreferrer">Acheter <span aria-hidden="true">↗</span></a><p class="affiliate-note">Achat chez '+esc(p.merchant||'le fournisseur')+'. Le prix final, la taille et la disponibilité sont à confirmer sur son site.</p>':'<p>Offre fournisseur indisponible pour le moment.</p>')+(p.category==='gants'?'<a class="product-compare-button" href="comparateur.html?left='+encodeURIComponent(p.id)+'">Comparer ce gant →</a>':'')+'</div></div><section class="product-specs"><h2>FICHE <em>TECHNIQUE.</em></h2><div>'+ (rows||'<p>Caractéristiques non renseignées pour ce produit.</p>')+'</div><div id="product-technical-details" class="product-technical-details"></div></section></section>';
 root.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{root.querySelector('#product-photo').src=button.dataset.photo;root.querySelectorAll('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
 if(p.productPage){try{
 const response=await fetch(p.productPage);if(!response.ok)return;
 const doc=new DOMParser().parseFromString(await response.text(),'text/html');
 const target=root.querySelector('#product-technical-details');
 // Preserve the existing manufacturer specifications, composition and care details.
 doc.querySelectorAll('.product-content > section').forEach(section=>{if(section.id==='caracteristiques'||section.querySelector('.product-composition,.product-care')&&!section.hasAttribute('aria-label')){const clone=section.cloneNode(true);clone.querySelectorAll('script').forEach(s=>s.remove());clone.querySelectorAll('.product-specs').forEach(s=>s.className='technical-definition');target.appendChild(clone);}});
 }catch{/* The structured technical sheet remains available offline. */}}
}
Promise.all(['data/products.json','data/maillots.json'].map(async url=>{const response=await fetch(url);if(!response.ok)throw Error('Chargement');return response.json();})).then(([equipment,jerseys])=>{
 const p=[...equipment,...jerseys.map(p=>({...p,category:'textile'}))].find(p=>p.id===id);
 if(p)show(p);else root.innerHTML='<section class="product-not-found"><h1>PRODUIT INTROUVABLE.</h1><a href="catalogue.html">Retour au catalogue</a></section>';
}).catch(()=>{root.innerHTML='<p class="catalog-empty">Le produit est momentanément indisponible.</p>';});
