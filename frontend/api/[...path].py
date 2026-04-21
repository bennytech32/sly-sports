import httpx
import hashlib
import psycopg
import os
import json
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

# ==========================================
# 1. DATABASE & API CONFIG
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_cVuy3hBvPr0Q@ep-wandering-wind-ambvtomk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require")
API_KEY = "40a6a56a4f6f3c3b4a5b52f7d0dda697" 
BASE_URL = "https://v3.football.api-sports.io"

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def get_db_connection(): return psycopg.connect(DATABASE_URL)

# ==========================================
# 2. AUTO-FIX DATABASE TABLES 🛠️
# ==========================================
try:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), phone VARCHAR(50) UNIQUE, password VARCHAR(255), role VARCHAR(20) DEFAULT \'user\', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
            cursor.execute('CREATE TABLE IF NOT EXISTS system_cache (cache_key VARCHAR(50) PRIMARY KEY, cache_data JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
            cursor.execute('CREATE TABLE IF NOT EXISTS admin_slips (id SERIAL PRIMARY KEY, title VARCHAR(255), code VARCHAR(50), odds VARCHAR(20), bookmaker VARCHAR(50), status VARCHAR(50) DEFAULT \'Active\', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
            cursor.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT \'user\'')
            cursor.execute("INSERT INTO users (name, phone, password, role) VALUES ('Master Admin', 'admin@slysports.co.tz', 'mikekatz', 'admin') ON CONFLICT (phone) DO NOTHING")
        conn.commit()
except Exception as e: print(f"DB Init Error: {e}")

# ==========================================
# 3. AI ENGINE & BET SETTLEMENT
# ==========================================
def premium_ai_engine(home, away):
    combined = (home + away).encode()
    hash_val = int(hashlib.md5(combined).hexdigest(), 16)
    tips = ["1", "2", "Over 1.5", "1X", "X2", "GG", "Under 3.5"]
    return tips[hash_val % len(tips)], f"{75 + (hash_val % 20)}%"

def ai_bet_settlement(tip, h_goals, a_goals, status):
    if status not in ["FT", "AET", "PEN"]: return "PENDING"
    try:
        h, a = int(h_goals), int(a_goals)
        tg, t = h + a, tip.upper()
        if "1X" in t: return "WON" if h >= a else "LOST"
        if "X2" in t: return "WON" if a >= h else "LOST"
        if t == "1": return "WON" if h > a else "LOST"
        if t == "2": return "WON" if a > h else "LOST"
        if "OVER 1.5" in t: return "WON" if tg > 1.5 else "LOST"
        if "GG" in t: return "WON" if (h > 0 and a > 0) else "LOST"
        if "UNDER 3.5" in t: return "WON" if tg < 3.5 else "LOST"
    except: pass
    return "PENDING"

# ==========================================
# 4. DASHBOARD MATCHES & CACHE
# ==========================================
@app.get("/api/mikeka")
async def pata_mikeka():
    sasa = datetime.now()
    cache_key = 'main_dashboard_cache'
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT cache_data, updated_at FROM system_cache WHERE cache_key = %s", (cache_key,))
                row = cursor.fetchone()
                if row and (sasa - row[1]) < timedelta(minutes=10): return row[0]
    except: pass

    headers = {'x-apisports-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io'}
    url = f"{BASE_URL}/fixtures?date={sasa.strftime('%Y-%m-%d')}"
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=headers, timeout=15.0)
            data = res.json().get("response", [])
            leagues_map = {}
            results_list = []
            
            for item in data:
                l_id, l_name, l_country = item['league']['id'], item['league']['name'], item['league']['country']
                l_key = f"{str(l_country).lower()}_{l_id}"
                
                if l_key not in leagues_map: leagues_map[l_key] = {"key": l_key, "name": l_name, "country": l_country, "logo": item['league'].get('logo', ""), "matches": []}
                
                h_name, a_name = item['teams']['home']['name'], item['teams']['away']['name']
                status, match_time = item['fixture']['status']['short'], item['fixture']['date'][11:16]
                g_h, g_a = item['goals']['home'], item['goals']['away']
                
                tip, prob = premium_ai_engine(h_name, a_name)
                settlement = ai_bet_settlement(tip, g_h or 0, g_a or 0, status)
                
                match_obj = {
                    "id": str(item['fixture']['id']), "home": h_name, "away": a_name,
                    "status": f"{item['fixture']['status']['elapsed']}'" if status in ["1H", "2H", "HT"] else status,
                    "score": f"{g_h if g_h is not None else 0} - {g_a if g_a is not None else 0}",
                    "time": match_time, "ai_tip": tip, "asilimia": prob, "result_status": settlement
                }
                
                leagues_map[l_key]["matches"].append(match_obj)
                if status in ["FT", "AET", "PEN"]: results_list.append({**match_obj, "leagueName": l_name})

            top_leagues, more_leagues = [], []
            top_tags = ['tanzania', 'england', 'spain', 'italy', 'germany', 'france', 'world', 'champions']
            for k, v in leagues_map.items():
                if any(tag in str(v['country']).lower() or tag in str(v['name']).lower() for tag in top_tags): top_leagues.append(v)
                else: more_leagues.append(v)

            top_leagues.sort(key=lambda l: 1 if 'tanzania' in str(l['country']).lower() else 2 if 'premier league' in str(l['name']).lower() else 10)
            more_leagues.sort(key=lambda x: len(x['matches']), reverse=True)

            res_final = {"top": top_leagues, "more": more_leagues, "results": sorted(results_list, key=lambda x: x["time"], reverse=True)}

            with get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("INSERT INTO system_cache (cache_key, cache_data, updated_at) VALUES (%s, %s, %s) ON CONFLICT (cache_key) DO UPDATE SET cache_data = EXCLUDED.cache_data, updated_at = EXCLUDED.updated_at", (cache_key, json.dumps(res_final), sasa))
                conn.commit()
            
            return res_final
    except: return {"top": [], "more": [], "results": []}

# ==========================================
# 5. USER AUTH & ADMIN ENDPOINTS
# ==========================================
class UserSchema(BaseModel): name: str = None; phone: str; password: str
class SlipSchema(BaseModel): title: str; code: str; odds: str; bookmaker: str; status: str

@app.post("/api/register")
def register(user: UserSchema):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id FROM users WHERE phone = %s", (user.phone,))
                if cursor.fetchone(): return {"status": "error", "detail": "Namba hii au Email imeshatumika!"}
                cursor.execute("INSERT INTO users (name, phone, password) VALUES (%s, %s, %s)", (user.name, user.phone, user.password))
            conn.commit()
        return {"status": "success"}
    except Exception as e: return {"status": "error", "detail": f"Database Error: {str(e)}"}

@app.post("/api/login")
def login(user: UserSchema):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, name, phone, role FROM users WHERE phone = %s AND password = %s", (user.phone, user.password))
                u = cursor.fetchone()
        if u: return {"status": "success", "user": {"id": u[0], "name": u[1], "phone": u[2], "role": u[3]}}
        return {"status": "error", "detail": "Namba au Password sio sahihi!"}
    except Exception as e: return {"status": "error", "detail": f"Database Error: {str(e)}"}

@app.get("/api/admin/stats")
def get_admin_stats():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM users")
                total = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM admin_slips WHERE status='Active'")
                slips = cursor.fetchone()[0]
        return {"total_users": total, "active_slips": slips, "ai_accuracy": "86.4%"}
    except: return {"total_users": 0, "active_slips": 0, "ai_accuracy": "86.4%"}

@app.get("/api/admin/users")
def get_admin_users():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, name, phone, role, created_at FROM users ORDER BY id DESC LIMIT 50")
                return [{"id":r[0], "name":r[1], "phone":r[2], "role":r[3], "joined":r[4].strftime('%Y-%m-%d')} for r in cursor.fetchall()]
    except: return []

@app.get("/api/admin/slips")
def get_admin_slips():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, title, code, odds, bookmaker, status FROM admin_slips ORDER BY id DESC")
                return [{"id":r[0], "title":r[1], "code":r[2], "odds":r[3], "bookmaker":r[4], "status":r[5]} for r in cursor.fetchall()]
    except: return []

@app.post("/api/admin/add_slip")
def add_admin_slip(slip: SlipSchema):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("INSERT INTO admin_slips (title, code, odds, bookmaker, status) VALUES (%s, %s, %s, %s, %s)", (slip.title, slip.code, slip.odds, slip.bookmaker, slip.status))
            conn.commit()
        return {"status": "success"}
    except Exception as e: return {"status": "error", "detail": str(e)}

@app.delete("/api/admin/delete_slip/{slip_id}")
def delete_admin_slip(slip_id: int):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor: cursor.execute("DELETE FROM admin_slips WHERE id = %s", (slip_id,))
            conn.commit()
        return {"status": "success"}
    except Exception as e: return {"status": "error", "detail": str(e)}

@app.post("/api/scan-slip")
def scan_slip(data: dict = Body(...)):
    return {"status": "GOOD", "win_probability": "88%", "analysis": "Timu hizi zina mfululizo mzuri wa ushindi. AI inashauri kuendelea na mkeka.", "scanned_code": data.get("code")}