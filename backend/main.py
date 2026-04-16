import httpx
import hashlib
import psycopg
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import date, timedelta, datetime
from fastapi.middleware.cors import CORSMiddleware
from psycopg import IntegrityError

# ==========================================
# 1. NEON DATABASE CONNECTION (LIVE)
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_cVuy3hBvPr0Q@ep-wandering-wind-ambvtomk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

def get_db_connection():
    return psycopg.connect(DATABASE_URL)

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Meza ya Wateja
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    ''')
    # Meza ya Mikeka ya Admin
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin_slips (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            odds VARCHAR(50) NOT NULL,
            code VARCHAR(50) NOT NULL,
            bookmaker VARCHAR(100) NOT NULL,
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Washa Database wakati app inapoanza
try:
    init_db()
    print("✅ Neon Database Imeunganishwa Kikamilifu!")
except Exception as e:
    print(f"❌ Tatizo la Database: {e}")

class UserRegister(BaseModel):
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

class AdminSlipCreate(BaseModel):
    title: str
    odds: str
    code: str
    bookmaker: str

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

app = FastAPI(title="Sly Sports Tips API")

# CORS (Inaruhusu Frontend iwasiliane na Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "8631d26b92267b34c8c5fd6071349824"
TOP_LEAGUES_IDS = [39, 140, 135, 78, 61, 2, 3, 40, 345, 88, 94]

# ==========================================
# 2. CACHING SYSTEM & AI ENGINE
# ==========================================
API_CACHE = {
    "mikeka": {"data": [], "timestamp": None},
    "results": {"data": [], "timestamp": None},
    "standings": {} 
}
CACHE_EXPIRY = timedelta(hours=3)

def sly_ai_engine(home_team: str, away_team: str):
    h_hash = int(hashlib.md5(home_team.encode()).hexdigest(), 16) % 100
    a_hash = int(hashlib.md5(away_team.encode()).hexdigest(), 16) % 100
    home_power = h_hash + 20 
    total = home_power + a_hash + 30
    home_prob = int((home_power / total) * 100)
    away_prob = int((a_hash / total) * 100)
    draw_prob = 100 - (home_prob + away_prob)
    
    if home_prob > 48: return "Home Win (1)", f"{home_prob}%"
    elif away_prob > 42: return "Away Win (2)", f"{away_prob}%"
    elif draw_prob > 35: return "Draw (X)", f"{draw_prob}%"
    elif home_prob > away_prob: return "1X", f"{home_prob + draw_prob}%"
    else: return "X2", f"{away_prob + draw_prob}%"

# ==========================================
# 3. ENDPOINTS
# ==========================================
@app.get("/")
def read_root(): 
    return {"message": "Sly Sports API is Live and Connected to Neon!"}

@app.post("/api/register")
def register_user(user: UserRegister):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        hashed_pw = hash_password(user.password)
        cursor.execute("INSERT INTO users (name, phone, password) VALUES (%s, %s, %s)", (user.name, user.phone, hashed_pw))
        conn.commit()
        return {"status": "success"}
    except IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Namba hii imesajiliwa tayari.")
    finally: 
        conn.close()

@app.post("/api/login")
def login_user(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_pw = hash_password(user.password)
    cursor.execute("SELECT id, name, phone FROM users WHERE phone=%s AND password=%s", (user.phone, hashed_pw))
    result = cursor.fetchone()
    conn.close()
    if result: return {"status": "success", "user": {"id": result[0], "name": result[1], "phone": result[2]}}
    raise HTTPException(status_code=401, detail="Kuingia kumeshindikana. Namba au Password si sahihi.")

@app.get("/api/mikeka")
async def pata_mikeka():
    sasa = datetime.now()
    cache_mechi = API_CACHE["mikeka"]
    if cache_mechi["data"] and cache_mechi["timestamp"] and (sasa - cache_mechi["timestamp"] < CACHE_EXPIRY):
        return cache_mechi["data"]

    leo = date.today().strftime("%Y-%m-%d")
    url = f"https://v3.football.api-sports.io/fixtures?date={leo}"
    headers = {"x-apisports-key": API_KEY}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=20.0)
            data = response.json()
            ligis = {}
            for match in data.get("response", []):
                l_id = match["league"]["id"]
                if l_id not in ligis:
                    ligis[l_id] = {"id": l_id, "name": match["league"]["name"], "logo": match["league"]["logo"], "matches": []}
                h, a = match["teams"]["home"]["name"], match["teams"]["away"]["name"]
                tip, prob = sly_ai_engine(h, a)
                ligis[l_id]["matches"].append({"id": match["fixture"]["id"], "home": h, "away": a, "status": match["fixture"]["status"]["short"], "ai_tip": tip, "asilimia": prob})
            
            res = list(ligis.values())
            res.sort(key=lambda x: TOP_LEAGUES_IDS.index(x["id"]) if x["id"] in TOP_LEAGUES_IDS else 999)
            if res:
                API_CACHE["mikeka"]["data"] = res
                API_CACHE["mikeka"]["timestamp"] = sasa
            return res
    except Exception as e:
        print("Error fetching API:", e)
        if API_CACHE["mikeka"]["data"]: return API_CACHE["mikeka"]["data"]
        return []

@app.get("/api/results")
async def pata_matokeo():
    sasa = datetime.now()
    cache_results = API_CACHE["results"]
    if cache_results["data"] and cache_results["timestamp"] and (sasa - cache_results["timestamp"] < CACHE_EXPIRY):
        return cache_results["data"]

    jana = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    url = f"https://v3.football.api-sports.io/fixtures?date={jana}"
    headers = {"x-apisports-key": API_KEY}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=20.0)
            data = response.json()
            ligis = {}
            for match in data.get("response", []):
                status = match["fixture"]["status"]["short"]
                if status not in ["FT", "PEN", "AET"]: continue
                l_id = match["league"]["id"]
                if l_id not in ligis:
                    ligis[l_id] = {"id": l_id, "name": match["league"]["name"], "logo": match["league"]["logo"], "matches": []}
                h, a = match["teams"]["home"]["name"], match["teams"]["away"]["name"]
                hg, ag = match["goals"]["home"], match["goals"]["away"]
                tip, _ = sly_ai_engine(h, a)
                won = False
                if tip.startswith("Home") and hg > ag: won = True
                elif tip.startswith("Away") and ag > hg: won = True
                elif tip.startswith("Draw") and hg == ag: won = True
                elif "1X" in tip and hg >= ag: won = True
                elif "X2" in tip and ag >= hg: won = True
                ligis[l_id]["matches"].append({"id": match["fixture"]["id"], "home": h, "away": a, "hg": hg, "ag": ag, "tip": tip, "won": won})
            res = list(ligis.values())
            res.sort(key=lambda x: TOP_LEAGUES_IDS.index(x["id"]) if x["id"] in TOP_LEAGUES_IDS else 999)
            if res:
                API_CACHE["results"]["data"] = res
                API_CACHE["results"]["timestamp"] = sasa
            return res
    except:
        if API_CACHE["results"]["data"]: return API_CACHE["results"]["data"]
        return []