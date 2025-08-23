import os
from flask import Flask, jsonify, abort, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sqlalchemy.orm import Session
from sqlalchemy import select
from dotenv import load_dotenv
from models import create_db, Recipe

load_dotenv()
DB_URL = os.getenv("DATABASE_URL", "sqlite:///culinarycodex.db")
app = Flask(__name__)
engine = create_db(DB_URL)

origins = [o.strip() for o in os.getenv("CORS_ORIGINS","").split(",") if o.strip()]
CORS(app, resources={r"/api/*":{"origins": origins or "*"}})

limiter = Limiter(get_remote_address, app=app, default_limits=[os.getenv("RATE_LIMIT","200/hour")])

def recipe_summary(r: Recipe):
    return {
        "id": r.id, "title": r.title, "civilization": r.civilization, "period": r.period,
        "dish_type": r.dish_type, "difficulty": r.difficulty, "story_blurb": r.story_blurb,
        "source": {"label": r.source_label, "url": r.source_url} if r.source_label or r.source_url else None
    }

def recipe_full(rid: str):
    from models import RecipeIngredient, RecipeStep  # avoid circular import at top
    with Session(engine) as s:
        r = s.get(Recipe, rid)
        if not r: return None
        ings = [{"name": i.name, "qty": i.qty, "unit": i.unit, "is_core": i.is_core, "notes": i.notes} for i in r.ingredients]
        steps = [st.text for st in sorted(r.steps, key=lambda x: x.idx)]
        return {
            **recipe_summary(r),
            "image_url": r.image_url,
            "ingredients": ings,
            "steps": steps,
        }

@app.get("/api/recipes")
def list_recipes():
    civ = request.args.get("civ","").strip()
    dish = request.args.get("type","").strip()
    search = request.args.get("search","").strip().lower()
    with Session(engine) as s:
        recs = s.scalars(select(Recipe)).all()
        out = []
        for r in recs:
            if civ and r.civilization != civ: continue
            if dish and r.dish_type != dish: continue
            hay = f"{r.title} {r.story_blurb} {r.dish_type} {r.civilization}".lower()
            if search and search not in hay: continue
            out.append(recipe_summary(r))
        return jsonify(out)

@app.get("/api/recipes/<rid>")
def get_recipe(rid):
    data = recipe_full(rid)
    if not data: abort(404)
    return jsonify(data)

@app.get("/api/meta")
def meta():
    with Session(engine) as s:
        recs = s.scalars(select(Recipe)).all()
        civs = sorted({r.civilization for r in recs})
        types = sorted({r.dish_type for r in recs})
        return jsonify({"civilizations": civs, "types": types})

if __name__ == "__main__":
    app.run(debug=True)
