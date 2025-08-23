from __future__ import annotations
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column

class Base(DeclarativeBase): pass

class Recipe(Base):
    __tablename__ = "recipes"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    civilization: Mapped[str] = mapped_column(String)
    period: Mapped[str] = mapped_column(String, default="")
    dish_type: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String, default="Easy")
    story_blurb: Mapped[str] = mapped_column(Text, default="")
    image_url: Mapped[str] = mapped_column(String, default="")
    source_label: Mapped[str] = mapped_column(String, default="")
    source_url: Mapped[str] = mapped_column(String, default="")
    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    steps = relationship("RecipeStep", back_populates="recipe", cascade="all, delete-orphan")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recipe_id: Mapped[str] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String)
    qty: Mapped[float | None] = mapped_column(Float, nullable=True)
    unit: Mapped[str] = mapped_column(String, default="")
    is_core: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str] = mapped_column(String, default="")
    recipe = relationship("Recipe", back_populates="ingredients")

class RecipeStep(Base):
    __tablename__ = "recipe_steps"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recipe_id: Mapped[str] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"))
    idx: Mapped[int] = mapped_column(Integer, default=0)
    text: Mapped[str] = mapped_column(Text)
    recipe = relationship("Recipe", back_populates="steps")

def create_db(url: str):
    engine = create_engine(url, future=True)
    Base.metadata.create_all(engine)
    return engine
