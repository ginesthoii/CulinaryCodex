import os
from sqlalchemy.orm import Session
from models import create_db, Recipe, RecipeIngredient, RecipeStep

DB_URL = os.getenv("DATABASE_URL", "sqlite:///culinarycodex.db")
engine = create_db(DB_URL)

with Session(engine) as s:
    # reset
    s.query(RecipeStep).delete()
    s.query(RecipeIngredient).delete()
    s.query(Recipe).delete()

    # 1) Roman Bread
    r1 = Recipe(
        id="rome-panem",
        title="Roman Panem (Bread)",
        civilization="Rome",
        period="1st c. CE",
        dish_type="Bread",
        difficulty="Easy",
        story_blurb="Everyday Roman bread inspired by archaeological loaves from Pompeii.",
        source_label="Apicius-inspired (modern practice)",
        source_url="https://en.wikipedia.org/wiki/Apicius",
    )
    r1.ingredients = [
        RecipeIngredient(name="wheat flour", qty=500, unit="g", is_core=True),
        RecipeIngredient(name="water", qty=320, unit="ml"),
        RecipeIngredient(name="salt", qty=10, unit="g"),
        RecipeIngredient(name="sourdough starter", qty=100, unit="g"),
    ]
    r1.steps = [
        RecipeStep(idx=1, text="Mix flour and water; autolyse 30 min."),
        RecipeStep(idx=2, text="Add salt and starter; knead 8–10 min."),
        RecipeStep(idx=3, text="Ferment until doubled; shape; proof; bake 230°C ~30–35 min."),
    ]

    # 2) Soldier's Stew (garum)
    r2 = Recipe(
        id="rome-liquamen-stew",
        title="Soldier’s Stew with Garum",
        civilization="Rome",
        period="1st c. CE",
        dish_type="Stew",
        difficulty="Medium",
        story_blurb="Hearty legume stew seasoned with garum (liquamen).",
        source_label="Roman seasonings (garum)",
        source_url="https://en.wikipedia.org/wiki/Garum",
    )
    r2.ingredients = [
        RecipeIngredient(name="lentils", qty=300, unit="g", is_core=True),
        RecipeIngredient(name="garum", qty=15, unit="ml"),
        RecipeIngredient(name="olive oil", qty=20, unit="ml"),
        RecipeIngredient(name="garlic", qty=2, unit="cloves"),
    ]
    r2.steps = [
        RecipeStep(idx=1, text="Simmer lentils until tender."),
        RecipeStep(idx=2, text="Stir in garum and olive oil."),
        RecipeStep(idx=3, text="Finish with crushed garlic."),
    ]

    # 3) Medieval Sapa syrup
    r3 = Recipe(
        id="medieval-syrup-sapa",
        title="Sweet Sapa Syrup",
        civilization="Medieval Europe",
        period="13th c.",
        dish_type="Condiment",
        difficulty="Easy",
        story_blurb="Reduced grape must (sapa) used for sweetness and glaze.",
        source_label="Historical syrup technique",
        source_url="",
    )
    r3.ingredients = [
        RecipeIngredient(name="grape must", qty=500, unit="ml", is_core=True),
        RecipeIngredient(name="spices", qty=1, unit="pinch"),
    ]
    r3.steps = [RecipeStep(idx=1, text="Reduce must on low heat until syrupy; season lightly.")]

    s.add_all([r1, r2, r3])
    s.commit()
    print("Seeded 3 recipes ")