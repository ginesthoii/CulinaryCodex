# CulinaryCodex API (Flask)

## Setup
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seeds.py
flask --app app run