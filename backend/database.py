import sqlite3
import threading
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "jobcompass.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

# 数据库同一时间只让一个请求读写，避免并发写冲突
LOCK = threading.Lock()


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    # check_same_thread=False：FastAPI 在线程池里处理请求，连接需要跨线程使用
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> sqlite3.Connection:
    conn = connect()
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    _migrate(conn)
    conn.commit()
    return conn


def _migrate(conn: sqlite3.Connection) -> None:
    """给老数据库补上后加的字段。"""
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(roles)")}
    if "source" not in columns:
        conn.execute("ALTER TABLE roles ADD COLUMN source TEXT NOT NULL DEFAULT 'seed'")

    course_columns = {row["name"] for row in conn.execute("PRAGMA table_info(courses)")}
    if "role_id" not in course_columns:
        conn.execute("ALTER TABLE courses ADD COLUMN role_id TEXT")


def rows_to_dicts(rows) -> list[dict]:
    return [dict(row) for row in rows]
