-- JobCompass 数据库结构（SQLite）
-- 一条岗位（role）下面挂着：技能、达标标准、学习阶段、面经、课程。

CREATE TABLE IF NOT EXISTS roles (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  mark      TEXT NOT NULL,
  tagline   TEXT,
  summary   TEXT,
  source    TEXT NOT NULL DEFAULT 'seed'
);

CREATE TABLE IF NOT EXISTS skills (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id  TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  kind     TEXT NOT NULL CHECK (kind IN ('required', 'bonus')),
  name     TEXT NOT NULL,
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS standards (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id  TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  content  TEXT NOT NULL,
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id     TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  duration    TEXT,
  deliverable TEXT,
  standard    TEXT,
  sort        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stage_tasks (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  stage_id INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  content  TEXT NOT NULL,
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stage_resources (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  stage_id INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  name     TEXT NOT NULL,
  url      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS interviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id     TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  company     TEXT,
  year        TEXT,
  type        TEXT,
  question    TEXT NOT NULL,
  tags        TEXT,
  source      TEXT,
  credibility TEXT CHECK (credibility IN ('high', 'medium', 'ai')),
  answer      TEXT
);

CREATE TABLE IF NOT EXISTS courses (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id  TEXT REFERENCES roles(id) ON DELETE CASCADE,
  title    TEXT NOT NULL,
  category TEXT,
  platform TEXT,
  level    TEXT,
  reason   TEXT,
  url      TEXT
);

CREATE TABLE IF NOT EXISTS terms (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  term       TEXT NOT NULL,
  category   TEXT NOT NULL,
  definition TEXT NOT NULL,
  example    TEXT,
  related    TEXT
);

CREATE TABLE IF NOT EXISTS saved_plans (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id    TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  progress   INTEGER NOT NULL DEFAULT 0,
  done_json  TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_plans_role ON saved_plans(role_id);
