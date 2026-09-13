"""调用 DeepSeek 生成岗位成长路径。

API key 从 backend/.env 或系统环境变量里读，不写死在代码里。
没有 key 或者调用失败时，调用方会回退到数据库里已有的内容。
"""

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
DEFAULT_MODEL = "deepseek-chat"


class AIError(Exception):
    pass


def load_env() -> None:
    """读 backend/.env，把它里面的键值对塞进环境变量。已经存在的变量不覆盖。"""
    if not ENV_PATH.exists():
        return
    for raw_line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def has_api_key() -> bool:
    return bool(os.environ.get("DEEPSEEK_API_KEY"))


SCHEMA_SPEC = """
{
  "name": "岗位名称，例如 产品经理",
  "mark": "两个字符的标记，例如 PM",
  "tagline": "一句话说明这个岗位做什么",
  "summary": "3 到 4 句话，说明这个岗位的职责和实习岗最看重什么",
  "skills": {
    "required": ["必会技能，5 项左右"],
    "bonus": ["加分技能，4 项左右"],
    "standards": ["达标标准，3 条，每条都要能验证"]
  },
  "stages": [
    {
      "title": "阶段标题，带周次，例如 第 1 周：搞清楚这个岗位到底做什么",
      "duration": "约 1 周",
      "tasks": ["这一阶段要做的具体动作，2 到 4 条"],
      "deliverable": "这个阶段结束时要交出来的东西",
      "standard": "怎么算这个阶段过关",
      "resources": [{"name": "B站搜索：关键词", "url": "https://search.bilibili.com/all?keyword=关键词"}]
    }
  ],
  "interviews": [
    {
      "question": "面试题",
      "tags": ["高频", "概念题"],
      "source": "来源类型，例如 大厂真题 / 社区经验 / AI 整理",
      "credibility": "从 high、medium、ai 里选一个",
      "answer": "答题思路，2 到 3 句"
    }
  ],
  "courses": [
    {"title": "课程名", "category": "所属技能，例如 原型设计", "platform": "B站", "level": "入门", "reason": "为什么学这门课"}
  ]
}
""".strip()

SYSTEM_PROMPT = (
    "你是一个帮助在校生准备求职的助手。"
    "你熟悉招聘岗位的真实要求，会把一个岗位拆成可执行的学习路径。"
    "你只输出 JSON，不要输出任何解释文字或代码块标记。"
)


def build_user_prompt(role_name: str, background: list[str] | None = None) -> str:
    bg = "、".join(background) if background else "未填写"
    return f"""请为「{role_name}」这个岗位生成一份求职成长路径。

用户的求职背景：{bg}

要求：
1. 内容要贴近真实招聘要求，写实习岗和校招岗看重的东西，不要写空话。
2. stages 写 3 到 4 个，从搞清楚岗位到准备面试，按时间先后排。
3. interviews 写 4 到 5 道真实高频题，包含概念题和案例题。
4. courses 写 4 到 5 门，reason 要说明这门课解决什么问题。
5. 所有 url 都写成 B站搜索链接，格式 https://search.bilibili.com/all?keyword=关键词
6. 全部用简体中文。

严格按下面这个 JSON 结构输出，字段名不要改，不要多也不要少：

{SCHEMA_SPEC}"""


def _post_json(payload: dict, timeout: int = 120) -> dict:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise AIError("没有配置 DEEPSEEK_API_KEY")

    request = urllib.request.Request(
        DEEPSEEK_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")[:400]
        raise AIError(f"DeepSeek 返回 {error.code}：{detail}") from error
    except urllib.error.URLError as error:
        raise AIError(f"连不上 DeepSeek：{error.reason}") from error
    except json.JSONDecodeError as error:
        raise AIError("DeepSeek 返回的不是合法 JSON") from error


def generate_role(role_name: str, background: list[str] | None = None) -> dict:
    """调用 DeepSeek，返回一个岗位字典。失败时抛 AIError。"""
    payload = {
        "model": os.environ.get("DEEPSEEK_MODEL", DEFAULT_MODEL),
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(role_name, background)},
        ],
        "temperature": 0.4,
        "max_tokens": 4000,
        "response_format": {"type": "json_object"},
    }
    data = _post_json(payload)

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as error:
        raise AIError(f"DeepSeek 返回结构不对：{str(data)[:300]}") from error

    try:
        role = json.loads(content)
    except json.JSONDecodeError as error:
        raise AIError("模型输出的内容不是合法 JSON") from error

    return normalize_role(role, role_name)


def normalize_role(role: dict, fallback_name: str) -> dict:
    """把模型输出补齐成统一的形状，缺字段就用默认值，避免前端渲染崩掉。"""
    skills = role.get("skills") or {}
    stages = role.get("stages") or []
    interviews = role.get("interviews") or []
    courses = role.get("courses") or []

    normalized_stages = []
    for stage in stages:
        if not isinstance(stage, dict):
            continue
        resources = stage.get("resources") or []
        normalized_stages.append({
            "title": str(stage.get("title", "")).strip() or "未命名阶段",
            "duration": str(stage.get("duration", "")).strip() or "待定",
            "tasks": [str(t).strip() for t in (stage.get("tasks") or []) if str(t).strip()],
            "deliverable": str(stage.get("deliverable", "")).strip() or "待补充",
            "standard": str(stage.get("standard", "")).strip() or "待补充",
            "resources": [
                {"name": str(r.get("name", "学习资源")).strip(), "url": str(r.get("url", "")).strip()}
                for r in resources if isinstance(r, dict) and r.get("url")
            ],
        })

    normalized_interviews = []
    for item in interviews:
        if not isinstance(item, dict) or not item.get("question"):
            continue
        cred = str(item.get("credibility", "ai")).strip()
        if cred not in {"high", "medium", "ai"}:
            cred = "ai"
        tags = item.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        normalized_interviews.append({
            "question": str(item["question"]).strip(),
            "tags": [str(t).strip() for t in tags if str(t).strip()],
            "source": str(item.get("source", "AI 整理")).strip() or "AI 整理",
            "credibility": cred,
            "answer": str(item.get("answer", "")).strip(),
        })

    normalized_courses = []
    for item in courses:
        if not isinstance(item, dict) or not item.get("title"):
            continue
        title = str(item["title"]).strip()
        normalized_courses.append({
            "title": title,
            "category": str(item.get("category", "综合")).strip() or "综合",
            "platform": str(item.get("platform", "B站")).strip() or "B站",
            "level": str(item.get("level", "入门")).strip() or "入门",
            "reason": str(item.get("reason", "")).strip(),
            "url": "https://search.bilibili.com/all?keyword=" + title,
        })

    name = str(role.get("name") or fallback_name).strip()
    return {
        "name": name,
        "mark": (str(role.get("mark") or name[:2]).strip())[:4],
        "tagline": str(role.get("tagline", "")).strip(),
        "summary": str(role.get("summary", "")).strip(),
        "skills": {
            "required": [str(s).strip() for s in (skills.get("required") or []) if str(s).strip()],
            "bonus": [str(s).strip() for s in (skills.get("bonus") or []) if str(s).strip()],
            "standards": [str(s).strip() for s in (skills.get("standards") or []) if str(s).strip()],
        },
        "stages": normalized_stages,
        "interviews": normalized_interviews,
        "courses": normalized_courses,
    }
