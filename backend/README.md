# JobCompass 后端

用 FastAPI + SQLite 写的后端，负责三件事：

1. 建数据库并写入初始数据
2. 提供接口给前端取数据
3. 直接托管前端页面

## 怎么跑

在这个文件夹里执行：

```
python run.py
```

然后浏览器打开 http://127.0.0.1:8000

## 数据库

第一次启动会自动建表、写数据，文件在 `data/jobcompass.db`。

表结构见 `schema.sql`，初始内容见 `seed_data.py`。

初始数据只在数据库为空时写入一次，之后重启不会覆盖你保存的学习计划。想重新灌一遍，跑：

```
python backend/reset_db.py
```

## 接入 DeepSeek

1. 在 `backend/` 下新建一个文件 `.env`（可以复制 `.env.example` 改名）
2. 写入一行：

```
DEEPSEEK_API_KEY=sk-你的key
```

3. 重启后端。之后在首页输入岗位，后端就会真的调 DeepSeek 生成，并把结果写进数据库。

同一个岗位名只会生成一次，第二次直接用数据库里的结果，省 token。

没有配置 key 也不会报错，会自动用数据库里已有的内容。

查看当前状态：http://127.0.0.1:8000/api/ai/status

## 接口

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | /api/health | 健康检查 |
| GET | /api/bootstrap | 一次拿全前端需要的数据 |
| GET | /api/roles | 岗位列表 |
| GET | /api/roles/{id} | 某个岗位的全部内容 |
| GET | /api/interviews | 面经列表，支持 role、company、year、q 筛选 |
| GET | /api/interviews/filters | 面经的可选筛选项 |
| GET | /api/courses | 课程列表，支持 category、q 筛选 |
| GET | /api/courses/categories | 课程分类 |
| GET | /api/terms | 术语列表，支持 category、q 筛选 |
| GET | /api/terms/categories | 术语分类 |
| GET | /api/plans | 已保存的学习计划 |
| POST | /api/plans | 保存或更新一条计划 |
| DELETE | /api/plans/{id} | 删除一条计划 |
| GET | /api/ai/status | 看有没有配置 key、用的哪个模型 |
| POST | /api/generate | 根据岗位名生成成长路径；有 key 调 AI，没有就用已有内容 |
