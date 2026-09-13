"""JobCompass 后端 API。

启动后会做三件事：
1. 建数据库、写入初始数据
2. 提供 JSON 接口给前端取数据
3. 直接托管前端页面，这样打开 http://127.0.0.1:8000 就能用
"""

import hashlib
import os
from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

import seed_data
import ai
from database import LOCK, init_db, rows_to_dicts

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_FILE = BASE_DIR.parent / "demo" / "jobcompass-prototype.html"

conn = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global conn
    ai.load_env()
    conn = init_db()
    seed_data.seed(conn)
    yield
    if conn:
        conn.close()


app = FastAPI(title="JobCompass API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def query(sql: str, params: tuple = ()) -> list[dict]:
    with LOCK:
        rows = conn.execute(sql, params).fetchall()
    return rows_to_dicts(rows)


def query_one(sql: str, params: tuple = ()) -> dict | None:
    with LOCK:
        row = conn.execute(sql, params).fetchone()
    return dict(row) if row else None


# ---------- 基础 ----------

@app.get("/api/health")
def health():
    return {"ok": True, "roles": query("SELECT COUNT(*) AS n FROM roles")[0]["n"]}


@app.get("/api/nav")
def nav():
    return [
        {"id": "home", "label": "首页"},
        {"id": "plans", "label": "我的计划"},
        {"id": "library", "label": "资料库"},
        {"id": "interview", "label": "面经题库"},
        {"id": "knowledge", "label": "知识库"},
    ]


# ---------- 岗位 ----------

def build_role(role_id: str) -> dict:
    role = query_one("SELECT * FROM roles WHERE id = ?", (role_id,))
    if not role:
        raise HTTPException(status_code=404, detail="role not found")

    skills = query("SELECT kind, name FROM skills WHERE role_id = ? ORDER BY sort", (role_id,))
    stages = query("SELECT * FROM stages WHERE role_id = ? ORDER BY sort", (role_id,))
    for stage in stages:
        stage["tasks"] = [r["content"] for r in query("SELECT content FROM stage_tasks WHERE stage_id = ? ORDER BY sort", (stage["id"],))]
        stage["resources"] = query("SELECT name, url FROM stage_resources WHERE stage_id = ?", (stage["id"],))

    role["skills"] = {
        "required": [s["name"] for s in skills if s["kind"] == "required"],
        "bonus": [s["name"] for s in skills if s["kind"] == "bonus"],
        "standards": [r["content"] for r in query("SELECT content FROM standards WHERE role_id = ? ORDER BY sort", (role_id,))],
    }
    role["stages"] = stages
    role["interviews"] = query("SELECT * FROM interviews WHERE role_id = ?", (role_id,))
    role["courses"] = query("SELECT * FROM courses WHERE role_id = ?", (role_id,))
    return role


@app.get("/api/roles")
def list_roles():
    return query("SELECT id, name, mark, tagline, summary FROM roles")


@app.get("/api/roles/{role_id}")
def get_role(role_id: str):
    return build_role(role_id)


# ---------- 面经题库 ----------

@app.get("/api/interviews")
def list_interviews(
    role: str | None = None,
    company: str | None = None,
    year: str | None = None,
    q: str | None = None,
):
    sql = "SELECT * FROM interviews WHERE 1 = 1"
    params: list = []
    if role and role != "全部":
        sql += " AND role_id = ?"
        params.append(role)
    if company and company != "全部":
        sql += " AND company = ?"
        params.append(company)
    if year and year != "全部":
        sql += " AND year = ?"
        params.append(year)
    if q:
        sql += " AND question LIKE ?"
        params.append(f"%{q}%")
    sql += " ORDER BY year DESC, id"
    return query(sql, tuple(params))


@app.get("/api/interviews/filters")
def interview_filters():
    return {
        "roles": [r["id"] for r in query("SELECT DISTINCT role_id FROM interviews")],
        "companies": [r["company"] for r in query("SELECT DISTINCT company FROM interviews ORDER BY company")],
        "years": [r["year"] for r in query("SELECT DISTINCT year FROM interviews ORDER BY year DESC")],
    }


# ---------- 资料库 ----------

@app.get("/api/courses")
def list_courses(category: str | None = None, q: str | None = None):
    sql = "SELECT * FROM courses WHERE 1 = 1"
    params: list = []
    if category and category != "全部":
        sql += " AND category = ?"
        params.append(category)
    if q:
        sql += " AND title LIKE ?"
        params.append(f"%{q}%")
    sql += " ORDER BY id"
    return query(sql, tuple(params))


@app.get("/api/courses/categories")
def course_categories():
    return [r["category"] for r in query("SELECT DISTINCT category FROM courses ORDER BY category")]


# ---------- 知识库（术语）----------

@app.get("/api/terms")
def list_terms(category: str | None = None, q: str | None = None):
    sql = "SELECT * FROM terms WHERE 1 = 1"
    params: list = []
    if category and category != "全部":
        sql += " AND category = ?"
        params.append(category)
    if q:
        sql += " AND (term LIKE ? OR definition LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])
    sql += " ORDER BY category, id"
    return query(sql, tuple(params))


@app.get("/api/terms/categories")
def term_categories():
    return [r["category"] for r in query("SELECT DISTINCT category FROM terms ORDER BY category")]


# ---------- 我的计划 ----------

class PlanIn(BaseModel):
    role_id: str
    progress: int = 0
    done: dict | None = None


@app.get("/api/plans")
def list_plans():
    import json

    plans = query("SELECT * FROM saved_plans ORDER BY created_at DESC")
    for plan in plans:
        plan["done"] = json.loads(plan.pop("done_json") or "{}")
    return plans


@app.post("/api/plans")
def save_plan(payload: PlanIn):
    import json

    role = query_one("SELECT id, name FROM roles WHERE id = ?", (payload.role_id,))
    if not role:
        raise HTTPException(status_code=404, detail="role not found")
    created = date.today().isoformat()
    with LOCK:
        conn.execute(
            "INSERT INTO saved_plans (role_id, progress, done_json, created_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(role_id) DO UPDATE SET progress = excluded.progress, done_json = excluded.done_json, created_at = excluded.created_at",
            (payload.role_id, payload.progress, json.dumps(payload.done or {}, ensure_ascii=False), created),
        )
        conn.commit()
    return {"ok": True, "role_name": role["name"], "created_at": created}


@app.delete("/api/plans/{plan_id}")
def delete_plan(plan_id: int):
    with LOCK:
        conn.execute("DELETE FROM saved_plans WHERE id = ?", (plan_id,))
        conn.commit()
    return {"ok": True}


# ---------- AI 生成 ----------

class GenerateIn(BaseModel):
    role_name: str
    background: list[str] | None = None


@app.get("/api/ai/status")
def ai_status():
    return {
        "has_key": ai.has_api_key(),
        "model": os.environ.get("DEEPSEEK_MODEL", ai.DEFAULT_MODEL),
    }


def upsert_ai_role(role: dict) -> str:
    """把 AI 生成的岗位写进数据库，同名岗位直接覆盖。"""
    existing = query_one("SELECT id FROM roles WHERE name = ?", (role["name"],))
    role_id = existing["id"] if existing else "gen-" + hashlib.md5(role["name"].encode("utf-8")).hexdigest()[:8]

    with LOCK:
        conn.execute("DELETE FROM roles WHERE id = ?", (role_id,))
        conn.execute(
            "INSERT INTO roles (id, name, mark, tagline, summary, source) VALUES (?, ?, ?, ?, ?, 'ai')",
            (role_id, role["name"], role["mark"], role["tagline"], role["summary"]),
        )
        for i, name in enumerate(role["skills"]["required"]):
            conn.execute("INSERT INTO skills (role_id, kind, name, sort) VALUES (?, 'required', ?, ?)", (role_id, name, i))
        for i, name in enumerate(role["skills"]["bonus"]):
            conn.execute("INSERT INTO skills (role_id, kind, name, sort) VALUES (?, 'bonus', ?, ?)", (role_id, name, i))
        for i, content in enumerate(role["skills"]["standards"]):
            conn.execute("INSERT INTO standards (role_id, content, sort) VALUES (?, ?, ?)", (role_id, content, i))

        for si, stage in enumerate(role["stages"]):
            conn.execute(
                "INSERT INTO stages (role_id, title, duration, deliverable, standard, sort) VALUES (?, ?, ?, ?, ?, ?)",
                (role_id, stage["title"], stage["duration"], stage["deliverable"], stage["standard"], si),
            )
            stage_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            for ti, task in enumerate(stage["tasks"]):
                conn.execute("INSERT INTO stage_tasks (stage_id, content, sort) VALUES (?, ?, ?)", (stage_id, task, ti))
            for resource in stage["resources"]:
                conn.execute("INSERT INTO stage_resources (stage_id, name, url) VALUES (?, ?, ?)", (stage_id, resource["name"], resource["url"]))

        for item in role["interviews"]:
            conn.execute(
                "INSERT INTO interviews (role_id, company, year, type, question, tags, source, credibility, answer) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (role_id, "", "", "", item["question"], ",".join(item["tags"]), item["source"], item["credibility"], item["answer"]),
            )

        for course in role["courses"]:
            conn.execute(
                "INSERT INTO courses (role_id, title, category, platform, level, reason, url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (role_id, course["title"], course["category"], course["platform"], course["level"], course["reason"], course["url"]),
            )
        conn.commit()
    return role_id


def fallback_role_id(name: str) -> str | None:
    exact = query_one("SELECT id FROM roles WHERE name = ?", (name,))
    if exact:
        return exact["id"]
    for row in query("SELECT id, name FROM roles"):
        if row["name"] in name or name in row["name"]:
            return row["id"]
    first = query_one("SELECT id FROM roles ORDER BY rowid LIMIT 1")
    return first["id"] if first else None


@app.post("/api/generate")
def generate(payload: GenerateIn):
    """根据用户输入的岗位生成成长路径。有 key 就调 AI，没有就用已有内容。"""
    name = (payload.role_name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="role_name is required")

    cached = query_one("SELECT id FROM roles WHERE name = ? AND source = 'ai'", (name,))
    if cached:
        return {"source": "cache", "role_id": cached["id"], "data": build_role(cached["id"])}

    note = ""
    if ai.has_api_key():
        try:
            generated = ai.generate_role(name, payload.background)
            role_id = upsert_ai_role(generated)
            return {"source": "ai", "role_id": role_id, "data": build_role(role_id)}
        except ai.AIError as error:
            note = str(error)
        except Exception as error:  # 兜底，别让前端直接崩
            note = f"生成失败：{error}"
    else:
        note = "还没有配置 DEEPSEEK_API_KEY，先用已有内容"

    role_id = fallback_role_id(name)
    if not role_id:
        raise HTTPException(status_code=404, detail="没有可用内容")
    return {"source": "seed", "role_id": role_id, "data": build_role(role_id), "note": note}


# ---------- 前端页面 ----------

@app.get("/api/bootstrap")
def bootstrap():
    """一次拿全前端需要的数据，页面第一次打开时调用。"""
    return {
        "nav": nav(),
        "roles": {r["id"]: build_role(r["id"]) for r in query("SELECT id FROM roles")},
        "interviews": list_interviews(),
        "courses": list_courses(),
        "libraryCategories": ["全部"] + course_categories(),
        "terms": list_terms(),
        "termCategories": ["全部"] + term_categories(),
    }


@app.get("/")
def index():
    if not FRONTEND_FILE.exists():
        raise HTTPException(status_code=404, detail="frontend file not found")
    return FileResponse(FRONTEND_FILE)


@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    """让前端的每个页面地址都能直接打开，刷新也不会 404。"""
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(FRONTEND_FILE)
