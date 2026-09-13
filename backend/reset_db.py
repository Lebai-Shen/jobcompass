"""清空数据库，下次启动后端会重新写入初始数据。"""

from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "jobcompass.db"

if DB_PATH.exists():
    DB_PATH.unlink()
    print(f"已删除 {DB_PATH}")
else:
    print("数据库还不存在，不用删")
