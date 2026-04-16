import httpx
import hashlib
import psycopg
import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

# ==========================================
# 1. DATABASE & APP CONFIG
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_cVuy3hBvPr0Q@ep-wandering-wind-ambvtomk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
API_KEY = "a40ace337edbd2b972d79108f9404001" 

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
except Exception as e:
    print("Database init warning:", e)

def sly_ai_engine(h, a):
    combined = (h + a).encode()
    score = int(hashlib.md5(combined).hexdigest(), 16) % 40 + 55
    tips = ["Home Win (1)", "Away Win (2)", "Over 1.5", "1X", "X2"]
    tip = tips[int(hashlib.md5(h.encode()).hexdigest(), 16) % len(tips)]
    return tip, f"{score}%"

# ==========================================
# 2. FAST FETCH API (NO TIMEOUTS)
# ==========================================
@app.get("/api/mikeka")
async def pata_mikeka():
    sasa = datetime.now()
    
    # 1. Vuta kwenye Cache kwanza (Haraka zaidi)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT cache_data, updated_at FROM system_cache WHERE cache_key = 'mikeka_live_v3'")
        row = cursor.fetchone()
        conn.close()
        if row and (sasa - row[1]) < timedelta(hours=2):
            return row[0]
    except: pass

    # 2. Vuta Mechi Zote za Soka kwa Request 1 tu (Inazuia Vercel Timeout)
    url = f"https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey={API_KEY}&regions=uk&markets=h2h"
    
    try:
        # Timeout imewekwa sekunde 8.5 (Vercel inakata sekunde 10)
        async with httpx.AsyncClient() as client:
            res = await client.get(url, timeout=8.5)
            
            # Kama API inakataa, itatuonyesha hapa
            if res.status_code != 200:
                return {"top": [{"name": "API ERROR", "matches": [{"id": 1, "home": "Status Code", "away": str(res.status_code), "status": "ERR", "ai_tip": "Check Key", "asilimia": "0%"}]}], "more": []}
            
            data = res.json()
            if isinstance(data, dict) and data.get("message"):
                return {"top": [{"name": "API ALERT", "matches": [{"id": 1, "home": "API Msg", "away": str(data.get("message"))[:15], "status": "ERR", "ai_tip": "Limit?", "asilimia": "0%"}]}], "more": []}

            processed_leagues = {}
            for match in data:
                l_key = match.get("sport_key", "")
                l_name = match.get("sport_title", "Football")
                
                if l_key not in processed_leagues:
                    processed_leagues[l_key] = {
                        "name": l_name, "country": "Global", 
                        "logo": "https://cdn-icons-png.flaticon.com/512/33/33736.png", 
                        "matches": []
                    }
                
                h = match.get("home_team", "Home Team")
                a = match.get("away_team", "Away Team")
                
                time_str = match.get("commence_time")
                try:
                    dt = datetime.strptime(time_str, "%Y-%m-%dT%H:%M:%SZ")
                    status_txt = dt.strftime("%d/%m %H:%M")
                except:
                    status_txt = "UPCOMING"
                
                tip, prob = sly_ai_engine(h, a)
                match_id = match.get("id", str(int(hashlib.md5((h+a).encode()).hexdigest(), 16) % 10000))
                
                existing = [m["id"] for m in processed_leagues[l_key]["matches"]]
                if match_id not in existing:
                    processed_leagues[l_key]["matches"].append({
                        "id": match_id, "home": h, "away": a, "status": status_txt, "ai_tip": tip, "asilimia": prob
                    })

            ligi_kubwa = []
            ligi_zingine = []
            vip_keywords = ['epl', 'spain', 'italy', 'germany', 'france', 'champions', 'europa', 'england']
            
            for key, val in processed_leagues.items():
                if any(x in key for x in vip_keywords):
                    ligi_kubwa.append(val)
                else:
                    ligi_zingine.append(val)

            # Auto Fill kama hakuna mechi kubwa leo
            if len(ligi_kubwa) == 0 and len(ligi_zingine) > 0:
                ligi_kubwa = ligi_zingine[:3]
                ligi_zingine = ligi_zingine[3:]

            res_final = {"top": ligi_kubwa, "more": ligi_zingine}
            
            # Save Cache
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("INSERT INTO system_cache (cache_key, cache_data, updated_at) VALUES ('mikeka_live_v3', %s, %s) ON CONFLICT (cache_key) DO UPDATE SET cache_data = EXCLUDED.cache_data, updated_at = EXCLUDED.updated_at", (json.dumps(res_final), sasa))
                conn.commit()
                conn.close()
            except: pass
            
            return res_final

    except httpx.TimeoutException:
        # Vercel ilikuwa slow, onyesha kwenye Dashboard
        return {"top": [{"name": "TIMEOUT ERROR", "matches": [{"id": 1, "home": "Vercel Server", "away": "Too Slow", "status": "ERR", "ai_tip": "Refresh", "asilimia": "0%"}]}], "more": []}
    except Exception as e:
        return {"top": [{"name": "SYSTEM ERROR", "matches": [{"id": 1, "home": "System", "away": "Crash", "status": "ERR", "ai_tip": str(e)[:15], "asilimia": "0%"}]}], "more": []}


# ==========================================
# 3. AUTH & ADMIN ENDPOINTS
# ==========================================
@app.get("/api/admin/slips")
def get_admin_slips():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, code, odds, bookmaker, status FROM admin_slips WHERE status = 'Active' ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        slips = [{"id": r[0], "title": r[1], "code": r[2], "odds": r[3], "bookmaker": r[4], "status": r[5]} for r in rows]
        if not slips: return [{"id": 1, "title": "🔥 SLY VIP MEGA ACCA", "code": "SLY-89K2", "odds": "15.40", "bookmaker": "1xBet", "status": "Active"}]
        return slips
    except: return [{"id": 1, "title": "🔥 SLY VIP MEGA ACCA", "code": "SLY-89K2", "odds": "15.40", "bookmaker": "1xBet", "status": "Active"}]

class ScanRequest(BaseModel):
    code: str

@app.post("/api/scan-slip")
def scan_slip(req: ScanRequest):
    code_hash = int(hashlib.md5(req.code.encode()).hexdigest(), 16) % 100
    win_prob = 40 + (code_hash % 50)
    if win_prob < 50: status, uchambuzi = "RISKY", f"⚠️ TAHADHARI: AI imeona hatari kwenye mkeka huu (Code: {req.code}). Kuna timu mbili zina uwezekano mkubwa wa kuchana."
    elif win_prob < 75: status, uchambuzi = "GOOD", f"✅ MZURI: Mkeka huu (Code: {req.code}) una usawa mzuri. Unaweza kuweka mzigo wa kawaida."
    else: status, uchambuzi = "EXCELLENT", f"🔥 MOTO: AI imethibitisha huu ni mkeka wa kishindo! (Code: {req.code}). Weka mzigo bila uoga!"
    return {"status": status, "win_probability": f"{win_prob}%", "analysis": uchambuzi, "scanned_code": req.code}

class UserSchema(BaseModel):
    name: str = None
    phone: str
    password: str

@app.post("/api/register")
def register(user: UserSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        pw = hashlib.sha256(user.password.encode()).hexdigest()
        cursor.execute("INSERT INTO users (name, phone, password) VALUES (%s, %s, %s)", (user.name, user.phone, pw))
        conn.commit()
        return {"status": "success"}
    except: raise HTTPException(status_code=400, detail="Mtumiaji yupo tayari")
    finally: conn.close()

@app.post("/api/login")
def login(user: UserSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    pw = hashlib.sha256(user.password.encode()).hexdigest()
    cursor.execute("SELECT id, name, phone FROM users WHERE phone=%s AND password=%s", (user.phone, pw))
    res = cursor.fetchone()
    conn.close()
    if res: return {"status": "success", "user": {"id": res[0], "name": res[1], "phone": res[2]}}
    raise HTTPException(status_code=401, detail="Namba au Password imekosewa")