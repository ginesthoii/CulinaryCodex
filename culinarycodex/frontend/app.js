/* CulinaryCodex — minimal MVP
   - Filterable list
   - Recipe detail modal
   - Historic ↔ Modern substitution toggle
   - Shopping list (dedupe + copy + CSV)
*/

// Load config (API_BASE must be defined in config.js)
const API = window.API_BASE || "";

// --- State ---
const state = {
  modeModern: false,
  filters: { civ: "", type: "", search: "" },
  list: new Map(),
  recipes: [],
  substitutions: []
};

// --- DOM refs ---
const grid = document.getElementById('recipe-grid');
const selCiv = document.getElementById('filter-civ');
const selType = document.getElementById('filter-type');
const txtSearch = document.getElementById('filter-search');
const chkModern = document.getElementById('mode-modern');
const btnSurprise = document.getElementById('btn-surprise');

const modal = document.getElementById('recipe-modal');
const article = document.getElementById('recipe-article');

const drawer = document.getElementById('drawer');
const fabList = document.getElementById('fab-list');
const drawerClose = document.getElementById('drawer-close');
const listItems = document.getElementById('list-items');
const btnCopy = document.getElementById('btn-copy');
const btnCSV = document.getElementById('btn-csv');
const btnClear = document.getElementById('btn-clear');

// --- Helpers ---
const norm = s => (s||"").toLowerCase();

function substitute(ing, useModern){
  if(!useModern) return ing;
  const sub = state.substitutions.find(s => norm(s.ingredient) === norm(ing.name));
  if(!sub) return ing;
  const qty = typeof ing.qty === 'number' ? +(ing.qty * (sub.ratio ?? 1)).toFixed(2) : ing.qty;
  return { ...ing, name: sub.modern_name, qty, notes: [ing.notes, sub.notes].filter(Boolean).join(" ") };
}

function addToList(ing){
  const key = `${norm(ing.name)}|${ing.unit||""}`;
  const existing = state.list.get(key);
  if(existing && typeof ing.qty === 'number' && typeof existing.qty === 'number'){
    existing.qty += ing.qty;
  } else if(!existing){
    state.list.set(key, { name: ing.name, qty: ing.qty ?? 1, unit: ing.unit ?? "" });
  }
  renderList();
}

function listToLines(){
  return [...state.list.values()].map(i => {
    const q = (i.qty !== undefined && i.qty !== "") ? ` ${i.qty}` : "";
    const u = i.unit ? ` ${i.unit}` : "";
    return `${i.name}${q}${u}`.trim();
  });
}

// --- API calls ---
async function fetchMeta(){
  const r = await fetch(`${API}/meta`);
  if(!r.ok) throw new Error("meta fetch failed");
  return r.json();
}

async function fetchSubs(){
  const r = await fetch(`${API}/substitutions`);
  if(!r.ok) throw new Error("subs fetch failed");
  return r.json();
}

async function fetchRecipes(){
  const params = new URLSearchParams();
  if(state.filters.civ) params.set("civ", state.filters.civ);
  if(state.filters.type) params.set("type", state.filters.type);
  if(state.filters.search) params.set("search", state.filters.search);
  const r = await fetch(`${API}/recipes?${params.toString()}`);
  if(!r.ok) throw new Error("recipes fetch failed");
  return r.json();
}

async function fetchRecipe(id){
  const r = await fetch(`${API}/recipes/${id}`);
  if(!r.ok) throw new Error("recipe fetch failed");
  return r.json();
}

// --- Rendering ---
async function renderFilters(){
  const meta = await fetchMeta();
  selCiv.innerHTML = `<option value="">All</option>`;
  selType.innerHTML = `<option value="">All</option>`;
  meta.civilizations.forEach(c => selCiv.append(new Option(c, c)));
  meta.types.forEach(t => selType.append(new Option(t, t)));
}

async function renderCards(){
  const items = await fetchRecipes();
  state.recipes = items;
  grid.innerHTML = "";
  items.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <p class="kicker">${r.civilization} • ${r.period} • ${r.dish_type}</p>
        <h3>${r.title}</h3>
        <p class="story">${r.story_blurb}</p>
      </div>
      <div class="meta">
        <span class="badge">Difficulty: ${r.difficulty}</span>
        ${r.source?.label ? `<a class="badge" href="${r.source.url||'#'}" target="_blank" rel="noopener">Source</a>` : ""}
      </div>
      <footer>
        <button class="btn" data-action="view" data-id="${r.id}">View</button>
        <button class="btn primary" data-action="add-all" data-id="${r.id}">Add all to list</button>
      </footer>
    `;
    grid.appendChild(card);
  });
}

function renderList(){
  listItems.innerHTML = "";
  for(const item of state.list.values()){
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} <span class="small">${item.qty ?? ""} ${item.unit ?? ""}</span></span>
      <button class="ghost" data-remove="${item.name}|${item.unit||""}">Remove</button>
    `;
    listItems.appendChild(li);
  }
}

function renderRecipeModal(recipe){
  const ings = recipe.ingredients.map(i => substitute(i, state.modeModern));
  article.innerHTML = `
    <p class="kicker">${recipe.civilization} • ${recipe.period} • ${recipe.dish_type}</p>
    <h2 style="margin:.2rem 0 0">${recipe.title}</h2>
    <p class="story">${recipe.story_blurb}</p>

    <h3>Ingredients ${state.modeModern ? "(Modern)" : "(Historic)"} </h3>
    <ul class="ingredients">
      ${ings.map(i => `
        <li>
          <span>${i.name} <span class="small">${i.qty ?? ""} ${i.unit ?? ""}</span></span>
          <span>
            <button class="btn" data-add='${JSON.stringify({name:i.name,qty:i.qty,unit:i.unit})}'>Add</button>
          </span>
        </li>
      `).join("")}
    </ul>

    <h3>Steps</h3>
    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>

    ${recipe.source?.label ? `<p class="small">Credit: <a href="${recipe.source.url||'#'}" target="_blank" rel="noopener">${recipe.source.label}</a></p>` : ""}
  `;
  modal.showModal();
}

// --- Events ---
document.addEventListener('click', async (e) => {
  const t = e.target;

  if(t.matches('[data-action="view"]')){
    const id = t.getAttribute('data-id');
    const r = await fetchRecipe(id);
    renderRecipeModal(r);
  }

  if(t.matches('[data-action="add-all"]')){
    const id = t.getAttribute('data-id');
    const r = await fetchRecipe(id);
    r.ingredients.map(i => substitute(i, state.modeModern)).forEach(addToList);
  }

  if(t.matches('#fab-list')){
    drawer.setAttribute('aria-hidden','false');
  }
  if(t.matches('#drawer-close')){
    drawer.setAttribute('aria-hidden','true');
  }

  if(t.matches('[data-remove]')){
    state.list.delete(t.getAttribute('data-remove'));
    renderList();
  }

  if(t.matches('.ingredients .btn')){
    try{
      const ing = JSON.parse(t.getAttribute('data-add'));
      addToList(ing);
    }catch{}
  }
});

selCiv.onchange = () => { state.filters.civ = selCiv.value; renderCards().catch(console.error); };
selType.onchange = () => { state.filters.type = selType.value; renderCards().catch(console.error); };
txtSearch.oninput = () => { state.filters.search = txtSearch.value; renderCards().catch(console.error); };
chkModern.onchange = () => { state.modeModern = chkModern.checked; /* modal re-renders on open */ };

btnSurprise.onclick = async () => {
  // Ask server for current list, pick a Roman
  const items = await fetchRecipes();
  const romans = items.filter(r => r.civilization === "Rome");
  const pick = romans[Math.floor(Math.random()*romans.length)] || items[0];
  const full = await fetchRecipe(pick.id);
  renderRecipeModal(full);
};

btnCopy.onclick = async () => {
  const text = listToLines().join('\n');
  await navigator.clipboard.writeText(text);
  btnCopy.textContent = "Copied!";
  setTimeout(() => btnCopy.textContent = "Copy", 1000);
};

btnCSV.onclick = () => {
  const rows = [["name","qty","unit"], ...[...state.list.values()].map(i => [i.name, i.qty ?? "", i.unit ?? ""])];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type: "text/csv"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "shopping_list.csv";
  a.click();
};

btnClear.onclick = () => { state.list.clear(); renderList(); };

// --- Init ---
async function init(){
  try{
    state.substitutions = await fetchSubs();
    await renderFilters();
    await renderCards();
    renderList();
  }catch(err){
    console.error(err);
    grid.innerHTML = `<div class="card"><p>API not reachable. Is Flask running?</p></div>`;
  }
}
init();