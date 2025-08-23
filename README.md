<div align="center">

![Image](https://github.com/user-attachments/assets/cf26e871-55f3-42fb-aa53-baaac91cfdf0)

# CulinaryCodex

</div>

<br>

- Ancient recipes meet modern code.  
- CulinaryCodex is an experiment where food history (Roman bread, medieval syrups, stews with garum) meets software design.
- Part cooking-history project, part coding sandbox, with a security twist.
- This project is inspired by food historians, the Tasting History YouTube channel (I adore you, Max Miller), and the idea that coding projects can be fun, flavorful, and give us a taste of the past.

<br>

<div align="center">
	
[![Python](https://img.shields.io/badge/python-3.12-blue)](https://www.python.org/) [![Flask](https://img.shields.io/badge/flask-3.0-lightgrey)](https://flask.palletsprojects.com/) [![Security](https://img.shields.io/badge/security-CORS%20%7C%20rate--limit%20%7C%20dotenv-green)]()

</div>


---

## What it is

- A small API + front end that serves historical recipes  
- Browse dishes by civilization (Rome, Medieval Europe, etc.), view ingredients, and follow steps  
- Built to be expandable — today it is bread and stew, tomorrow it could be a whole timeline of ancient cuisines  

Instead of collecting recipe cards in a box, recipes are stored in JSON, Flask, and SQLite.

---

## Why I built it

1. History is fascinating, especially food history. Ancient Rome had sourdoughs, medieval kitchens had syrups, and all of it connects us to how people actually lived their day-to-day lives.  
2. I love to cook and I wanted to combine my love of history, cooking and coding/automation. 
3. I wanted a portfolio project that demonstrates:  
   - Backend with Flask + SQLAlchemy  
   - Frontend with vanilla JavaScript + fetch API  
   - Secure coding habits (CORS, rate limits, dotenv configs)  


---

## Features (current)

- Browse seeded recipes via a simple front end  
- Roman Panem (bread) — inspired by archaeological loaves from Pompeii  
- Soldier’s stew — lentils and garum, hearty Roman cooking  
- Medieval sapa syrup — sweet reduced grape must  

---

## Roadmap

- Additional seeded recipes across civilizations  
- Filters (by era, dish type, difficulty)  
- Shopping list generator with modern substitutions (e.g., garum → fish sauce)  
- QR codes to pull recipes up on a phone  
- Timeline visualization of cuisines across history  
- Security hardening: input validation, CORS, rate limiting

---

## Tech Stack

- Backend: Flask, SQLAlchemy, python-dotenv  
- Frontend: HTML, CSS, vanilla JavaScript  
- Database: SQLite (lightweight, easy to swap later)  
- Security: CORS controls, basic rate limiting, environment variables

---

<div align="center">

<img width="593" height="436" alt="Image" src="https://github.com/user-attachments/assets/bed7fc22-d41a-4cf1-8a40-9935d228555b" />

</div>

---



## Running locally

Clone and set up the backend:

```bash
git clone https://github.com/ginesthoii/culinarycodex
cd culinarycodex/backend

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 seeds.py
flask --app app run

The backend runs at:
http://127.0.0.1:5000/api

Start the frontend:
cd ../frontend
python3 -m http.server 5500

The frontend opens at:
http://127.0.0.1:5500





