const names = {
  all: "Tout",
  gants: "Gants",
  chaussures: "Chaussures",
  textile: "Textile",
  protections: "Protections",
};
const grid = document.querySelector("#catalogue-grid"),
  count = document.querySelector("#catalogue-count"),
  search = document.querySelector("#catalogue-search"),
  filters = document.querySelector("#catalogue-filters");
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="finder.css">',
);
let products = [],
  active = new URLSearchParams(location.search).get("category") || "all";
const textileFilters = document.querySelector("#catalogue-textile-filters"),
  club = document.querySelector("#catalogue-club"),
  equipmentType = document.querySelector("#catalogue-equipment-type"),
  clubFilter = document.querySelector("#catalogue-club-filter");
const equipmentNames = {
  "maillots-foot": "Maillots de foot",
  "hauts-gardien": "Hauts gardien",
  "bas-gardien": "Bas gardien",
  "ensembles-gardien": "Ensembles gardien",
  "sous-couches": "Sous-couches",
  "autres-textiles": "Autres textiles",
};
function updateClubs() {
  const selected = club.value;
  const clubs = [
    ...new Set(
      products
        .filter(
          (p) =>
            p.category === "textile" &&
            (!equipmentType.value || p.equipmentType === equipmentType.value),
        )
        .map((p) => p.club)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "fr"));
  club.replaceChildren(
    new Option("Tous les clubs", ""),
    ...clubs.map((name) => new Option(name, name)),
  );
  club.value = clubs.includes(selected) ? selected : "";
  clubFilter.hidden = clubs.length === 0;
}
const kitNames = {
  domicile: "Domicile",
  exterieur: "Extérieur",
  third: "Third",
};
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
if (!Object.hasOwn(names, active)) active = "all";
const price = value => new Intl.NumberFormat('fr-CH',{style:'currency',currency:'CHF'}).format(value);
function card(p) {
 const url='produit.html?id='+encodeURIComponent(p.id);
 return '<article class="catalog-product"><a class="catalog-card-link" href="'+url+'"><div class="catalog-image"><img src="'+escapeHtml(p.image)+'" alt="" loading="lazy" width="600" height="600">'+(p.badge?'<span>'+escapeHtml(p.badge)+'</span>':'')+'</div><div class="catalog-info"><p>'+names[p.category]+' · '+escapeHtml(p.brand||p.club||'')+'</p><h2>'+escapeHtml(p.name)+'</h2><small>'+escapeHtml(p.description||p.season||'')+'</small><div>'+(Number.isFinite(p.price)?'<strong>'+price(p.price)+'</strong>':'<small>Prix à consulter chez le fournisseur</small>')+'</div><span class="catalog-discover">Découvrir le produit →</span></div></a></article>';
}
function finderCard() {
  return '<article class="catalog-product finder-catalog-card"><a href="trouve-ton-gant.html" class="finder-card-inner"><span class="finder-card-kicker">OUTIL KEEPERLAB</span><strong>?</strong><h2>PAS SÛR DU<br>MODÈLE ?</h2><p>3 questions. Des recommandations expliquées.</p><b>Trouver mes gants <i>→</i></b></a></article>';
}
function render() {
  textileFilters.hidden = active !== "all" && active !== "textile";
  const term = search.value.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (active === "all" || p.category === active) && matchesAdvanced(p) &&
      (!club.value || p.club === club.value) &&
      (!equipmentType.value || p.equipmentType === equipmentType.value) &&
      [
        p.name,
        p.brand,
        p.modelCode,
        p.description,
        equipmentNames[p.equipmentType] || p.equipmentType,
        p.club,
        kitNames[p.type],
        p.season,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
  );
  count.textContent =
    visible.length + " produit" + (visible.length !== 1 ? "s" : "");
  const sort=document.querySelector('#catalog-sort').value;
  if(sort) visible.sort((a,b)=>{const av=Number.isFinite(a.price)?a.price:null,bv=Number.isFinite(b.price)?b.price:null;return av===null?(bv===null?0:1):bv===null?-1:sort==='asc'?av-bv:bv-av;});
  const cards = visible.map(card);
  if (
    !term && !hasAdvanced() &&
    !club.value &&
    !equipmentType.value &&
    (active === "all" || active === "gants")
  )
    cards.splice(Math.min(3, cards.length), 0, finderCard());
  grid.innerHTML =
    cards.join("") ||
    "<p class='catalog-empty'>Aucun produit ne correspond à votre recherche.</p>";
  filters
    .querySelectorAll("button")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.category === active),
    );
}
filters.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b?.dataset.category) return;
  active = b.dataset.category;
  buildAdvanced();
  if (active !== "all" && active !== "textile") {
    club.value = "";
    equipmentType.value = "";
    updateClubs();
  }
  history.replaceState(
    null,
    "",
    active === "all" ? "catalogue.html" : "catalogue.html?category=" + active,
  );
  render();
});
search.addEventListener("input", render);
club.addEventListener("change", render);
equipmentType.addEventListener("change", () => {
  updateClubs();
  render();
});

const advanced=document.createElement('dialog');
advanced.className='catalog-advanced';
advanced.setAttribute('aria-label','Filtres du catalogue');
advanced.id='catalog-advanced-panel';
document.body.append(advanced);
const filterRow=document.createElement('div');
filterRow.className='catalog-category-row';
filters.before(filterRow);
filterRow.append(filters);
const openFilters=document.createElement('button');
openFilters.type='button';
openFilters.className='catalog-more-filters';
openFilters.setAttribute('aria-haspopup','dialog');
openFilters.setAttribute('aria-controls',advanced.id);
openFilters.innerHTML='<span aria-hidden="true">☷</span> Filtres';
const sortButton=document.createElement('button');
sortButton.type='button';sortButton.id='catalog-sort';sortButton.className='catalog-sort-toggle';sortButton.value='';
filterRow.append(openFilters,sortButton);
openFilters.addEventListener('click',()=>advanced.showModal());
advanced.addEventListener('click',e=>{if(e.target===advanced){const r=advanced.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)advanced.close();}});
function updateSortButton(){
 const mode=sortButton.value;
 const title=mode==='asc'?'Prix croissant':mode==='desc'?'Prix décroissant':'Ordre du catalogue';
 const lines=mode==='asc'?[6,11,16]:mode==='desc'?[16,11,6]:[16,11,16];
 sortButton.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">'+lines.map((w,i)=>'<path d="M3 '+(6+i*6)+'h'+w+'"/>').join('')+(mode?'<path d="'+(mode==='asc'?'M21 20V5m-3 3 3-3 3 3':'M21 4v15m-3-3 3 3 3-3')+'"/>':'')+'</svg><span class="catalog-sort-label">'+title+'</span>';
 sortButton.title=title+' — cliquer pour changer';sortButton.setAttribute('aria-label',sortButton.title);
}
sortButton.addEventListener('click',()=>{sortButton.value=sortButton.value===''?'asc':sortButton.value==='asc'?'desc':'';updateSortButton();render();});
updateSortButton();
const fields={brand:'Marque',size:'Taille disponible (relevée)',cut:'Coupe',latex:'Latex',terrain:'Terrain',conditions:'Conditions',fit:'Ajustement',closure:'Fermeture',fingerProtection:'Protection des doigts',surface:'Surface / semelle',metalStuds:'Crampons métalliques'};
function values(p,key){
 if(key==='size')return p.availability?.selectableSizes||[];
 let value=key==='brand'?p.brand:p.specs?.[key];
 if(key==='cut'&&typeof value==='string'){
  const cut=value.toLowerCase();
  value=cut.includes('hybride')||cut.includes('hybrid')?'Hybride':cut.includes('négative')||cut.includes('negative')?'Négative':cut.includes('roll')?'Roll finger':cut.includes('plate')||cut.includes('positive')?'Plate / positive':value;
 }
 if(key==='metalStuds')value=p.specs?.metalStuds;
 if(typeof value==='boolean')return [value?'Oui':'Non'];
 return value==null||value===''?[]:Array.isArray(value)?value.map(String):[String(value)];
}
function hasAdvanced(){return [...advanced.querySelectorAll('[data-field]')].some(s=>s.value)||document.querySelector('#catalog-budget')?.value;}
function matchesAdvanced(p){
 const budget=document.querySelector('#catalog-budget')?.value;
 return (!budget||(Number.isFinite(p.price)&&p.price<=Number(budget)))&&[...advanced.querySelectorAll('[data-field]')].every(s=>!s.value||values(p,s.dataset.field).includes(s.value));
}
function buildAdvanced(){
 const keys=active==='gants'?['brand','size','cut','latex','terrain','conditions','fit','closure','fingerProtection']:active==='chaussures'?['brand','size','surface','metalStuds']:['brand'];
 const pool=products.filter(p=>active==='all'||p.category===active);
 advanced.innerHTML='<div class="catalog-panel-heading"><h2>Affiner ma recherche</h2><button type="button" data-close-filters aria-label="Fermer les filtres">×</button></div><div class="catalog-filter-fields">'+keys.map(key=>{
 const options=[...new Set(pool.flatMap(p=>values(p,key)))].sort((a,b)=>a.localeCompare(b,'fr',{numeric:true}));
 return '<label>'+fields[key]+'<select data-field="'+key+'" '+(!options.length?'disabled':'')+'><option value="">'+(options.length?'Tous / toutes':'Information non renseignée')+'</option>'+options.map(v=>'<option>'+escapeHtml(v)+'</option>').join('')+'</select></label>';
 }).join('')+'<label>Budget maximum (CHF)<input id="catalog-budget" type="number" min="0" step="1" placeholder="Sans limite"></label></div><p>Les tailles disponibles correspondent au dernier relevé chez le vendeur. Le stock peut évoluer. Les produits sans information ne correspondent pas à un filtre sélectionné.</p><div class="catalog-panel-actions"><button type="button" id="catalog-reset">Réinitialiser</button><button type="button" data-close-filters class="catalog-show-results">Voir les résultats</button></div>';
}
advanced.addEventListener('input',render);
advanced.addEventListener('change',render);
advanced.addEventListener('click',e=>{if(e.target.closest('[data-close-filters]'))advanced.close();if(e.target.id==='catalog-reset'){search.value='';club.value='';equipmentType.value='';updateClubs();buildAdvanced();render();}});

Promise.all(
  ["data/products.json", "data/maillots.json"].map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Catalogue indisponible");
    return response.json();
  }),
)
  .then(([equipment, jerseys]) => {
    products = [
      ...equipment.map((p) =>
        p.category === "textile"
          ? { ...p, equipmentType: p.equipmentType || "autres-textiles" }
          : p,
      ),
      ...jerseys.map((p) => ({
        ...p,
        category: "textile",
        equipmentType: "maillots-foot",
      })),
    ];
    const types = [
      ...new Set(
        products
          .filter((p) => p.category === "textile")
          .map((p) => p.equipmentType),
      ),
    ];
    equipmentType.replaceChildren(
      new Option("Tous les types", ""),
      ...types.map((type) => new Option(equipmentNames[type] || type, type)),
    );
    updateClubs();
    buildAdvanced();
    render();
  })
  .catch(() => {
    count.textContent = "Chargement impossible";
    grid.innerHTML =
      "<p class='catalog-empty'>Le catalogue est momentanément indisponible.</p>";
  });
