# JobCompass 求职指南针

一个面向在校求职者的 AI 成长路径工具。用户输入目标岗位，系统输出岗位要求拆解、分阶段学习路径、真实面经和课程推荐。

![首页](demo/v4-home.png)

## 功能

- 岗位要求拆解：技能分必会和加分，并给出达标标准
- 分阶段学习路径：每个阶段包含任务、交付物和验收标准，可打勾跟踪进度
- 面经题库：按岗位、公司、年份筛选，题目标注来源与可信度
- 知识库：产品与技术术语解释，支持分类筛选和关键词搜索
- 资料库：按技能分类的课程与教程
- 我的计划：保存生成的成长路径，随时回来继续
- AI 生成：接入 DeepSeek，按岗位实时生成完整路径

## 权限设计

| 身份 | 可用范围 |
| --- | --- |
| 访客 | 输入岗位、生成路径、查看岗位要求与学习路径、查看课程、1 条面经 |
| 登录 | 保存路径、进度同步、我的计划、更多面经 |
| 会员 | 全部面经、标准答题思路、来源链接、按公司年份筛选、导出 |

## 技术栈

- 前端：单文件网页（HTML、CSS、原生 JavaScript）
- 后端：FastAPI
- 数据库：SQLite
- AI：DeepSeek，结构化 JSON 输出

## 目录结构

```
demo/                  前端原型，单文件，双击即可打开
backend/               后端服务与数据库
docs/                  产品文档
PRD-JobCompass.md      产品需求文档
```

## 本地运行

需要 Python 3.10 或以上。

```bash
pip install -r backend/requirements.txt
python backend/run.py
```

然后打开 http://127.0.0.1:8000

不启动后端也可以直接看界面：双击 `demo/jobcompass-prototype.html`，页面会使用内置数据。

## 配置 AI

在 `backend/` 下创建 `.env` 文件，写入：

```
DEEPSEEK_API_KEY=sk-xxxx
```

没有配置时会自动回退到内置数据，功能不受影响。

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | /api/bootstrap | 获取前端所需的全部数据 |
| GET | /api/roles | 岗位列表 |
| GET | /api/roles/{id} | 岗位详情 |
| GET | /api/interviews | 面经列表，支持岗位、公司、年份、关键词筛选 |
| GET | /api/courses | 课程列表，支持分类与关键词筛选 |
| GET | /api/terms | 术语列表，支持分类与关键词筛选 |
| GET | /api/plans | 已保存的学习计划 |
| POST | /api/plans | 保存或更新计划 |
| DELETE | /api/plans/{id} | 删除计划 |
| GET | /api/ai/status | AI 配置状态 |
| POST | /api/generate | 按岗位生成成长路径 |

## 数据库

SQLite，文件位于 `backend/data/jobcompass.db`，首次启动时自动建表并写入初始数据。

表结构见 `backend/schema.sql`，初始内容见 `backend/seed_data.py`。

重置数据：

```bash
python backend/reset_db.py
```