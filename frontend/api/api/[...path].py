import httpx
import hashlib
import psycopg
import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

# ==========================================
# 1. DATABASE & PREMIUM API CONFIG
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_cVuy3hBvPr0Q@ep-wandering-wind-ambvtomk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
API_KEY = "40a6a56a4f6f3c3b4a5b52f7d0dda697" 
BASE_URL = "https://v3.football.api-sports.io"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg.connect(DATABASE_URL)

try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), phone VARCHAR(50) UNIQUE, password VARCHAR(255))')
    cursor.execute('CREATE TABLE IF NOT EXISTS system_cache (cache_key VARCHAR(50) PRIMARY KEY, cache_data JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
    cursor.execute('CREATE TABLE IF NOT EXISTS admin_slips (id SERIAL PRIMARY KEY, title VARCHAR(255), code VARCHAR(50), odds VARCHAR(20), bookmaker VARCHAR(50), status VARCHAR(50) DEFAULT \'Active\', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
    conn.commit()
    conn.close()
except: pass

# ==========================================
# 2. AI ANALYSIS ENGINE 
# ==========================================
def premium_ai_engine(home_name, away_name, league_name):
    combined = (home_name + away_name).encode()
    hash_val = int(hashlib.md5(combined).hexdigest(), 16)
    
    tips = ["Home Win (1)", "Away Win (2)", "Over 1.5", "1X", "X2", "GG", "Under 3.5"]
    tip = tips[hash_val % len(tips)]
    
    prob = 75 + (hash_val % 20) 
    return tip, f"{prob}%"

# ==========================================
# 3. FAST FETCH API (SORTED BY POPULARITY)
# ==========================================
@app.get("/api/mikeka")
async def pata_mikeka():
    sasa = datetime.now()
    cache_key = 'premium_world_v2'
    
    # 1. Kinga ya Quota
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT cache_data, updated_at FROM system_cache WHERE cache_key = %s", (cache_key,))
        row = cursor.fetchone()
        conn.close()
        if row and (sasa - row[1]) < timedelta(hours=2):
            return row[0]
    except: pass

    headers = {
        'x-apisports-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
    }
    
    tarehe_leo = sasa.strftime('%Y-%m-%d')
    url = f"{BASE_URL}/fixtures?date={tarehe_leo}"
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=headers, timeout=20.0)
            if res.status_code != 200: raise Exception("API Error")
            
            data = res.json().get("response", [])
            if not data: return {"top": [], "more": [], "other_sports": [], "sidebar_leagues": []}

            processed_leagues = {}
            sidebar_list = []
            
            for item in data:
                league = item['league']
                l_id = league['id']
                l_name = league['name']
                l_country = league['country']
                
                l_key = f"{str(l_country).lower()}_{l_id}"
                
                if l_key not in processed_leagues:
                    processed_leagues[l_key] = {
                        "key": l_key, "name": l_name, "country": l_country,
                        "logo": league.get('logo', ""), "matches": [], "sport_type": "soccer"
                    }
                    sidebar_list.append({"key": l_key, "name": f"{l_country}: {l_name}", "sport": "soccer"})
                
                home = item['teams']['home']['name']
                away = item['teams']['away']['name']
                
                match_time = item['fixture']['date'][11:16] 
                status = item['fixture']['status']['short']
                
                tip, prob = premium_ai_engine(home, away, l_name)
                
                processed_leagues[l_key]["matches"].append({
                    "id": str(item['fixture']['id']),
                    "home": home, "away": away,
                    "status": f"LEO {match_time}" if status == "NS" else status,
                    "ai_tip": tip, "asilimia": prob,
                    "odds": {"1": "2.10", "X": "3.40", "2": "3.80"} 
                })

            # =======================================================
            # 4. MPANGILIO WA KIBABE (SMART SORTING)
            # =======================================================
            top_countries = ['tanzania', 'england', 'spain', 'italy', 'germany', 'france', 'world']
            
            top_leagues = []
            more_leagues = []
            
            # Gawanya kwanza
            for key, val in processed_leagues.items():
                c = str(val['country']).lower()
                n = str(val['name']).lower()
                is_top = any(tc in c for tc in top_countries) or 'champions' in n or 'europa' in n
                
                if is_top: 
                    top_leagues.append(val)
                else: 
                    more_leagues.append(val)

            # Panga Ligi Kubwa kulingana na Ukubwa Wao
            def rank_league(league):
                c = str(league['country']).lower()
                n = str(league['name']).lower()
                
                if 'tanzania' in c: return 1
                if 'england' in c and 'premier league' in n: return 2
                if 'spain' in c and ('la liga' in n or 'primera' in n): return 3
                if 'italy' in c and 'serie a' in n: return 4
                if 'germany' in c and 'bundesliga' in n: return 5
                if 'champions league' in n: return 6
                if 'europa league' in n: return 7
                if 'france' in c and 'ligue 1' in n: return 8
                if 'england' in c: return 9  # Championship etc.
                if 'spain' in c: return 10
                if 'italy' in c: return 11
                if 'germany' in c: return 12
                if 'world' in c: return 13
                return 99

            top_leagues.sort(key=rank_league)
            
            # Panga ligi za kawaida kulingana na wingi wa mechi (Nyingi zikae juu)
            more_leagues.sort(key=lambda x: len(x['matches']), reverse=True)

            res_final = {
                "top": top_leagues,
                "more": more_leagues,
                "other_sports": [], 
                "sidebar_leagues": sidebar_list
            }

            # 5. Save Cache Mpya
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("INSERT INTO system_cache (cache_key, cache_data, updated_at) VALUES (%s, %s, %s) ON CONFLICT (cache_key) DO UPDATE SET cache_data = EXCLUDED.cache_data, updated_at = EXCLUDED.updated_at", (cache_key, json.dumps(res_final), sasa))
                conn.commit()
                conn.close()
            except: pass
            
            return res_final

    except Exception as e:
        print(f"Error: {e}")
        return {"top": [], "more": [], "other_sports": [], "sidebar_leagues": []}

# ==========================================
# AUTH & ADMIN ENDPOINTS
# ==========================================
@app.get("/api/admin/slips")
def get_admin_slips():
    return [{"id": 1, "title": "🔥 SLY VIP MEGA ACCA", "code": "SLY-89K2", "odds": "15.40", "bookmaker": "1xBet", "status": "Active"}]

class ScanRequest(BaseModel): code: str
@app.post("/api/scan-slip")
def scan_slip(req: ScanRequest):
    return {"status": "GOOD", "win_probability": "70%", "analysis": "MZURI", "scanned_code": req.code}

class UserSchema(BaseModel): name: str = None; phone: str; password: str
@app.post("/api/register")
def register(user: UserSchema): return {"status": "success"}

@app.post("/api/login")
def login(user: UserSchema): 
    return {"status": "success", "user": {"id": 1, "name": "Admin", "phone": user.phone}}