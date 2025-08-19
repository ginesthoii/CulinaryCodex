# CulinaryCodex

Medieval Morsel
Ancient Appetites
 history + food + automation + security + design.
 Python, APIs, data viz, maybe even NLP if you parse ancient texts.
showcase Python (backend), Django/Flask (API), React or plain HTML/CSS (frontend), plus optional ML if you do recipe recommendation.

Ancient Recipes Project Ideas
	1.	Digital Ancient Cookbook (Secure Archive)
	•	Scrape or collect ancient recipes (Roman, Egyptian, Mesopotamian, etc.) and store them in a searchable database.
	•	Build a front-end where users can browse by civilization, ingredient, or type (e.g., bread, stew, drink).
	•	Add an “authorship protection” twist → think encrypted recipe cards or watermarking, tying into your StoryShield vibe.
	2.	“Cooking Through Time” API
	•	Make a public API that serves ancient recipes (formatted JSON).
	•	Example: GET /recipes/rome/bread returns Apicius’s Roman bread recipe with modern substitutions.
	•	Bonus: Show off backend + API security with rate-limiting, auth tokens, etc.
	3.	Food Timeline Visualizer
	•	Interactive timeline app that maps recipes by year/region.
	•	Could show trade routes (spices, grains, olive oil) and how recipes spread — history + data visualization.

Adding Your “Security + Automation” Spin
 	•	Ingredient Substitution Bot → a Python bot that automatically swaps unavailable ancient ingredients (like garum) with modern ones and emails you a shopping list.
	•	QR-Code Ancient Menu → generate QR codes that link to random recipes, so you can “order like a Roman” at a dinner party.


 Project Concept: Tasting History Digital Archive

Think of it as Tasting History meets GitHub + Cybersecurity.

Core Features
	1.	Recipe Archive
	•	Collect recipes from Tasting History episodes (with proper credit & links) + other historical cookbooks (Apicius, medieval manuscripts, etc.).
	•	Store them in a structured database (ingredients, origin, time period, source).
	2.	Interactive Front-End
	•	Users can filter recipes by civilization (Rome, Egypt, Aztec, etc.), ingredient, or time period.
	•	Add a “surprise me” button → random recipe from the archive.
	3.	Automation Twist
	•	Python bot that generates a modernized shopping list for any recipe (swaps “garum” for “fish sauce,” etc.).
	•	Option to export as CSV or send it via email.
	4.	Security Twist
	•	Protect recipes with “digital seals” (signatures / watermarks).
	•	Maybe even a “recipe vault” feature where you encrypt your personal notes or tweaks.
	5.	Fun Extras
	•	Generate QR codes → scan one at dinner and get a random ancient recipe.
	•	Timeline visualization → see how recipes evolved over time.



 First Steps
	•	Start simple: a JSON/CSV dataset of 10–15 recipes from Tasting History.
	•	Build a Flask or Django app to serve them via an API.
	•	Add front-end filters/search.
	•	Then expand with automation (shopping list bot, QR codes).







 Project: Tasting History–Style Ancient Cookbook (with Shopping List + Substitutions)

1) Core UX (what users can do)
	•	Browse & filter by civilization, period, dish type, difficulty.
	•	Open a recipe → see story blurb, ingredients (with suggested modern swaps), steps, source.
	•	One-click “Add to list” per ingredient (or “Add all”).
	•	Shopping list drawer with deduping (3× garlic → “garlic (3 cloves)”), unit normalization, and export (CSV/print/copy).
	•	Substitution toggle: garum → fish sauce, silphium → asafoetida, etc. Users can flip between “Historic” and “Modern Pantry.”
	•	Attribution: If it’s inspired by Tasting History, show credit + episode link. Keep your own wording; don’t copy their full text.

Small delight: a “Surprise me (Roman)” button that picks a random Roman recipe.

⸻

2) Data model (simple, future-proof)

Tables/Collections
	•	recipes
	•	id, title, civilization, period, dish_type, difficulty, story_blurb, steps, image_url, source_id, author_notes
	•	ingredients
	•	id, name, category
	•	recipe_ingredients
	•	recipe_id, ingredient_id, quantity, unit, notes, is_core
	•	substitutions
	•	ingredient_id, modern_name, ratio (e.g., 1.0), notes
	•	sources
	•	id, label (e.g., “Tasting History – Episode 142”), url, license, credit_required (bool)
	•	users (optional for saved lists)
	•	id, email_hash, display_name
	•	shopping_list
	•	user_id, items: [{ingredient_id/name, qty, unit, recipe_id}]

Example substitution rows
	•	garum → fish sauce (1:1) — “start with ¾× and adjust”
	•	silphium → asafoetida (pinch) — “aromatic substitute”
	•	sapa (reduced must) → balsamic reduction (1:1) — “sweet-acidic”

⸻

3) Tech stack (fast + comfy)
	•	Backend: Python Flask (light) or Django (built-ins + admin).
	•	API: REST endpoints (/recipes, /recipes/:id, /shopping-list, /subs/:ingredient).
	•	DB: SQLite to start → Postgres later.
	•	Frontend: Plain HTML + Alpine/HTMX or React if you want.
	•	Auth (optional): Anonymous lists via localStorage; upgrade to simple email login later.
	•	Styling: Tailwind or Bootstrap.
	•	Deploy: Render/Heroku/Fly.io.

⸻

4) Minimal API design

GET /recipes?civ=rome&search=bread
GET /recipes/:id (returns ingredients + resolved substitutions)
POST /shopping-list/add { item: { name, qty, unit, recipe_id } }
GET /shopping-list (for current session/user)
POST /substitutions/resolve { name: "garum", mode: "modern" } → { substitute: "fish sauce", ratio: 1 }

No auth needed for MVP if you use localStorage for the list and keep a serverless/edge cache of recipes.

⸻

5) MVP first-pass (weekend-build friendly)
	1.	Seed 10–15 recipes (mix your originals + a few historically inspired).
	2.	Build Recipe List → Recipe Detail page.
	3.	Add Add to Shopping List (single + add-all).
	4.	Implement substitution toggle on the recipe page.
	5.	Shopping list dedupe + unit merge (basic: sum grams/cups when units match).
	6.	Export list (copy/print/CSV).

Then iterate:
	•	Search + filters, pretty images, episode links, “Surprise me” button.
	•	User saves (localStorage first, login later).
	•	QR code: generate a QR from the shopping list for quick phone access.

⸻

6) Attribution & content ethics (important)
	•	For “Tasting History–inspired” entries, write your own summaries & steps, and link/credit the episode in sources.
	•	Avoid posting verbatim scripts or any copyrighted imagery you don’t have rights to. Screenshots → no; link to YouTube instead.
	•	Public-domain historical texts (e.g., translations of Apicius) are generally safe—still provide source + translator.

⸻

7) Security touches (on-brand for you)
	•	Rate limit write endpoints (shopping list) to prevent spam.
	•	Input validation on quantity/unit fields.
	•	If you add accounts later: CSRF protection, SameSite cookies, and basic auth hardening.
	•	CORS locked to your domain.

⸻

8) Little datasets to get you rolling

Recipe JSON (trimmed)
{
  "id": "rome-panem",
  "title": "Roman Panem (Bread)",
  "civilization": "Rome",
  "period": "1st c. CE",
  "dish_type": "Bread",
  "difficulty": "Easy",
  "story_blurb": "Everyday Roman bread inspired by archaeological loaves from Pompeii.",
  "ingredients": [
    {"name": "wheat flour", "qty": 500, "unit": "g", "is_core": true},
    {"name": "water", "qty": 320, "unit": "ml"},
    {"name": "salt", "qty": 10, "unit": "g"},
    {"name": "sourdough starter", "qty": 100, "unit": "g"}
  ],
  "steps": [
    "Mix flour and water; autolyse 30 min.",
    "Add salt and starter; knead 8–10 min.",
    "Ferment until doubled; shape; proof; bake 230°C ~30–35 min."
  ],
  "source_id": "src_th_ep142"
}



Substitutions JSON

[
  {"ingredient": "garum", "modern_name": "fish sauce", "ratio": 1.0, "notes": "Start at 0.75×"},
  {"ingredient": "sapa", "modern_name": "balsamic reduction", "ratio": 1.0},
  {"ingredient": "silphium", "modern_name": "asafoetida", "ratio": 0.1, "notes": "Pinch only"}
]




ancient-recipes/
  README.md
  data/
    recipes.json
    substitutions.json
  api/
    app.py              # Flask/Django API
    models.py
  web/
    index.html          # list + filters
    recipe.html         # detail page
    js/
      list.js           # shopping list (localStorage + API)
      subs.js           # substitution toggle
  scripts/
    seed.py             # load JSON into DB
  docs/
    SOURCES.md          # links/credits (Tasting History episodes, texts)


 
