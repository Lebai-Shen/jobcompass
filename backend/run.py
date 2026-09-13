"""启动后端。

可以在这个文件夹里跑 `python run.py`，
也可以在项目根目录跑 `python backend/run.py`，两种都行。
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import uvicorn  # noqa: E402

from main import app  # noqa: E402

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
