"""JobCompass 的初始数据。

这些内容就是前端页面展示的东西：岗位、技能、学习阶段、面经、课程、术语。
改这里的内容，重新启动后端就会写进数据库。
"""

ROLES = [
    {
        "id": "pm",
        "name": "产品经理",
        "mark": "PM",
        "tagline": "把用户的真实问题翻译成产品方案的人",
        "summary": "产品经理负责发现用户问题、定义产品方案，并推动研发把方案做出来。实习岗最看重三件事：会不会写 PRD、能不能画原型讲交互、有没有一个能讲清楚的完整项目。",
        "required_skills": ["需求分析与用户调研", "PRD 撰写", "原型设计（Figma / Axure）", "竞品分析", "基础数据分析"],
        "bonus_skills": ["SQL", "A/B 测试", "AI 工具与 Prompt", "完整项目经历"],
        "standards": [
            "能独立写一份合格 PRD，包含背景、目标、用户故事、功能清单和流程图。",
            "能用 Figma 画低保真原型，并讲清楚每个交互为什么这么设计。",
            "能对一个竞品说清它的优劣势，以及可以借鉴和应该避开的地方。",
        ],
        "stages": [
            {
                "title": "第 1 周：搞清楚这个岗位到底做什么",
                "duration": "约 1 周",
                "tasks": ["搞清楚产品经理每天的工作内容", "拆解 3 份真实的产品经理 JD", "弄明白需求评审会、发版这些真实工作流程"],
                "deliverable": "一份《岗位理解笔记》加 3 份 JD 拆解",
                "standard": "能用自己的话讲清楚产品经理的工作流程，知道面试会问什么。",
                "resources": [{"name": "B站搜索：产品经理入门", "url": "https://search.bilibili.com/all?keyword=%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%20%E5%85%A5%E9%97%A8"}],
            },
            {
                "title": "第 2 到 3 周：练三个核心技能",
                "duration": "约 2 周",
                "tasks": ["学 Figma 画原型", "照着模板写 1 份 PRD", "做 1 份竞品分析"],
                "deliverable": "1 份 PRD 加 1 份竞品分析加 1 个原型",
                "standard": "PRD 要素齐全，原型能讲清交互，竞品分析有明确结论。",
                "resources": [
                    {"name": "B站搜索：Figma 入门", "url": "https://search.bilibili.com/all?keyword=Figma%20%E5%85%A5%E9%97%A8"},
                    {"name": "B站搜索：PRD 怎么写", "url": "https://search.bilibili.com/all?keyword=PRD%20%E6%80%8E%E4%B9%88%E5%86%99"},
                ],
            },
            {
                "title": "第 3 到 5 周：做一个完整项目",
                "duration": "约 2 周",
                "tasks": ["选一个你身边真实的小问题", "用 vibe coding 做一个能演示的 demo", "整理成作品集"],
                "deliverable": "一个完整项目：产品文档加原型加可演示 demo",
                "standard": "能在 5 分钟内讲清楚项目背景、你的方案和最终结果。",
                "resources": [{"name": "B站搜索：产品经理项目实战", "url": "https://search.bilibili.com/all?keyword=%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%20%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98"}],
            },
            {
                "title": "第 5 到 6 周：准备面试",
                "duration": "约 1 周",
                "tasks": ["刷高频面经", "整理项目话术和常见八股", "做 2 次模拟面试"],
                "deliverable": "面经题库加自我介绍加项目话术",
                "standard": "高频问题能答上来，自己的项目经得起追问。",
                "resources": [{"name": "B站搜索：产品经理面试", "url": "https://search.bilibili.com/all?keyword=%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%20%E9%9D%A2%E8%AF%95"}],
            },
        ],
    },
    {
        "id": "ai-pm",
        "name": "AI 产品经理",
        "mark": "AI",
        "tagline": "懂一点技术、能把 AI 能力变成产品的人",
        "summary": "AI 产品经理在普通产品经理的基础上，还要理解模型能力边界、Prompt、RAG 这些概念，知道什么能做什么做不了。面试会追问你对 AI 产品的判断力。",
        "required_skills": ["产品经理基本功", "Prompt 工程", "RAG 与知识库概念", "数据与评估意识", "AI 工具实操"],
        "bonus_skills": ["Python 基础", "模型 API 调用", "Agent 工作流", "向量数据库"],
        "standards": [
            "能说清楚一个 AI 产品和普通产品的区别，以及它的风险。",
            "能设计一个简单的 RAG 方案，解释为什么要检索再回答。",
            "能写出一段可用的 Prompt，并说明怎么评估效果好不好。",
        ],
        "stages": [
            {
                "title": "第 1 周：补齐 AI 基础概念",
                "duration": "约 1 周",
                "tasks": ["搞懂大模型、Prompt、Token、RAG 是什么意思", "上手用 AI 工具完成一个真实任务"],
                "deliverable": "一份《AI 概念笔记》加一个 AI 工具实操案例",
                "standard": "能用大白话给一个完全不懂的人讲清楚 RAG 是什么。",
                "resources": [{"name": "B站搜索：大模型入门", "url": "https://search.bilibili.com/all?keyword=%E5%A4%A7%E6%A8%A1%E5%9E%8B%20%E5%85%A5%E9%97%A8"}],
            },
            {
                "title": "第 2 到 3 周：练 AI 产品技能",
                "duration": "约 2 周",
                "tasks": ["调一次模型 API", "写并迭代一版 Prompt", "设计一个 RAG 知识库方案"],
                "deliverable": "一个能跑通的最小 AI 功能",
                "standard": "能解释你的 Prompt 为什么这么写，怎么判断输出质量。",
                "resources": [{"name": "B站搜索：Prompt 工程", "url": "https://search.bilibili.com/all?keyword=Prompt%20%E5%B7%A5%E7%A8%8B"}],
            },
            {
                "title": "第 3 到 5 周：做一个 AI 产品项目",
                "duration": "约 2 周",
                "tasks": ["选一个 AI 能真正解决的问题", "做出可演示的 demo", "写清楚 AI 部分的设计和评估"],
                "deliverable": "一个含 AI 功能的完整项目",
                "standard": "能讲清楚什么交给 AI、什么不能交给 AI，以及怎么控制幻觉。",
                "resources": [],
            },
        ],
    },
]

INTERVIEWS = [
    {"role": "pm", "company": "字节跳动", "year": "2025", "type": "行为面试", "question": "你怎么理解产品经理这个岗位？", "tags": "高频,概念题", "source": "牛客社区面经", "credibility": "high",
     "answer": "分三层答：发现用户问题（调研）、定义产品方案（PRD 和原型）、推动方案落地（和研发协作）。最后用一句话说明你为什么想做，最好结合你做过的一件事。"},
    {"role": "pm", "company": "腾讯", "year": "2025", "type": "案例分析", "question": "挑一个你常用的 App，如果让你加一个功能，你会怎么做？", "tags": "高频,案例分析", "source": "大厂真题", "credibility": "high",
     "answer": "先定位目标用户和使用场景，再找到具体问题，然后给方案，最后说清楚怎么验证效果。不要一上来就报一个功能名字。"},
    {"role": "pm", "company": "美团", "year": "2024", "type": "技能题", "question": "竞品分析你会怎么做？", "tags": "高频,技能题", "source": "牛客社区面经", "credibility": "medium",
     "answer": "先把竞品分类：直接竞品、间接竞品、替代方案。再定维度：定位、目标用户、核心功能、体验、商业模式。最后一定要给结论。"},
    {"role": "pm", "company": "阿里巴巴", "year": "2025", "type": "技能题", "question": "你怎么判断一个需求该不该做？", "tags": "高频,进阶", "source": "大厂真题", "credibility": "high",
     "answer": "看三件事：用户价值、业务价值、实现成本。再排优先级，可以用 RICE 或 KANO 模型，说清楚你的判断依据。"},
    {"role": "pm", "company": "小红书", "year": "2025", "type": "项目追问", "question": "讲一个你做过的项目，你在里面负责什么？", "tags": "必问", "source": "社区经验", "credibility": "medium",
     "answer": "用背景、目标、你的动作、结果四步讲。重点说你的判断和取舍，而不是流程。"},
    {"role": "pm", "company": "网易", "year": "2024", "type": "行为面试", "question": "你和开发意见不一致时怎么处理？", "tags": "软技能", "source": "牛客社区面经", "credibility": "medium",
     "answer": "先说共同目标，再摆数据和用户证据，最后给取舍方案。强调你是解决问题而不是争输赢。"},
    {"role": "pm", "company": "百度", "year": "2024", "type": "概念题", "question": "产品和运营的区别是什么？", "tags": "概念", "source": "社区经验", "credibility": "medium",
     "answer": "产品侧重定义做什么和为什么，运营侧重让更多用户用起来。两者边界在很多公司是模糊的。"},
    {"role": "pm", "company": "小红书", "year": "2025", "type": "行为面试", "question": "你是怎么开始学产品经理的？", "tags": "面试常见", "source": "AI 整理", "credibility": "ai",
     "answer": "讲你从迷茫到做出项目的真实过程。重点说你做了什么、遇到什么困难、怎么解决。这个项目本身就是你最好的答案。"},
    {"role": "ai-pm", "company": "字节跳动", "year": "2025", "type": "判断力", "question": "你怎么判断一个需求适不适合用 AI 做？", "tags": "高频,判断力", "source": "大厂真题", "credibility": "high",
     "answer": "看任务是不是重复、是不是有大量非结构化数据、容错率高不高。容错率低、要求百分百准确的场景要谨慎，AI 更适合做辅助。"},
    {"role": "ai-pm", "company": "腾讯", "year": "2025", "type": "概念题", "question": "什么是 RAG，为什么要用它？", "tags": "高频,概念题", "source": "牛客社区面经", "credibility": "high",
     "answer": "RAG 是先从你的资料库里检索相关内容，再让模型基于这些内容回答。好处是降低幻觉、能用上最新和私有数据。"},
    {"role": "ai-pm", "company": "阿里巴巴", "year": "2025", "type": "进阶", "question": "AI 产品怎么做效果评估？", "tags": "进阶", "source": "AI 整理", "credibility": "ai",
     "answer": "分两层：离线用一批标准样本抽检准确率，线上看用户行为（采纳率、修改率、满意度）。关键是先定一个能衡量的标准。"},
]

COURSES = [
    {"role": "pm", "title": "Figma 零基础入门", "category": "原型设计", "platform": "B站", "level": "入门", "reason": "原型是产品经理的基本功，面试一定会让你讲交互。"},
    {"role": "pm", "title": "PRD 文档怎么写", "category": "文档能力", "platform": "B站", "level": "入门", "reason": "实习和面试最常考，也是最能放进作品集的东西。"},
    {"role": "pm", "title": "竞品分析实战", "category": "分析能力", "platform": "B站", "level": "进阶", "reason": "面试高频题，也是训练产品思维最快的方式。"},
    {"role": "pm", "title": "用户调研与访谈", "category": "分析能力", "platform": "B站", "level": "入门", "reason": "产品经理的起点，不会做调研就没法定义问题。"},
    {"role": "pm", "title": "Axure 交互原型", "category": "原型设计", "platform": "B站", "level": "进阶", "reason": "有些公司还在用 Axure，会了不亏。"},
    {"role": "pm", "title": "数据分析与 SQL 入门", "category": "数据能力", "platform": "B站", "level": "入门", "reason": "产品经理要能看懂数据，SQL 是加分项。"},
    {"role": "pm", "title": "产品经理求职与面试", "category": "求职准备", "platform": "B站", "level": "求职", "reason": "了解真实面试流程和高频问题。"},
    {"role": "ai-pm", "title": "大模型与 RAG 入门", "category": "AI 能力", "platform": "B站", "level": "入门", "reason": "RAG 是 AI 产品面试最高频的概念。"},
    {"role": "ai-pm", "title": "Prompt 工程实战", "category": "AI 能力", "platform": "B站", "level": "入门", "reason": "Prompt 是 AI 产品经理的日常工具。"},
    {"role": "ai-pm", "title": "大模型 API 调用实操", "category": "技术基础", "platform": "B站", "level": "进阶", "reason": "自己动手调一次 API，理解会完全不一样。"},
]

TERMS = [
    {"term": "PRD", "category": "产品概念", "definition": "产品需求文档，写清楚一个功能要做什么、为什么做、做成什么样。", "example": "面试常问：你写过 PRD 吗？能给结构吗？", "related": "用户故事,原型"},
    {"term": "MVP", "category": "产品概念", "definition": "最小可行产品，用最小的成本做出一个能验证核心想法的版本。", "example": "先做一页能生成学习路径的页面，就是 MVP。", "related": "迭代,验证"},
    {"term": "用户画像", "category": "产品概念", "definition": "根据真实调研抽象出来的典型用户形象，用来帮你判断需求该不该做。", "example": "小陈：大三，想找产品实习，零经验。", "related": "用户调研,Persona"},
    {"term": "竞品分析", "category": "产品概念", "definition": "研究同类产品，找出别人做对了什么、做错了什么，以及你能切入的地方。", "example": "对比牛客网和面经类工具的功能差异。", "related": "差异化,定位"},
    {"term": "用户旅程", "category": "产品概念", "definition": "用户从第一次接触到完成目标的完整过程，用来找中间的卡点。", "example": "输入岗位到看到成长路径的这几步。", "related": "漏斗,体验"},
    {"term": "大模型", "category": "技术概念", "definition": "用海量文本训练出来的模型，能理解和生成语言。", "example": "DeepSeek、GPT 都属于大模型。", "related": "LLM,Token"},
    {"term": "Prompt", "category": "技术概念", "definition": "你给大模型的指令。写得越清楚，输出越稳定。", "example": "让 AI 输出 JSON 格式，就是 Prompt 里的一条约束。", "related": "提示词,系统提示"},
    {"term": "Token", "category": "技术概念", "definition": "模型处理文字的最小单位，长度限制和计费都按它算。", "example": "一段 1000 字的回答，大概会消耗上千个 Token。", "related": "上下文,成本"},
    {"term": "RAG", "category": "技术概念", "definition": "检索增强生成。先从资料库里找出相关内容，再让模型基于这些内容回答，能明显减少胡说。", "example": "先检索真实面经，再让 AI 总结考点。", "related": "检索,向量数据库"},
    {"term": "向量数据库", "category": "技术概念", "definition": "存文本向量、支持按语义相似度查找的数据库。RAG 常用它来检索。", "example": "用户问面试问题，先从库里找最接近的几条。", "related": "Embedding,RAG"},
    {"term": "Embedding", "category": "技术概念", "definition": "把一段文字变成一串数字向量，用来表示它的意思。", "example": "意思相近的两句话，向量距离会很近。", "related": "向量数据库,语义检索"},
    {"term": "Fine-tuning", "category": "技术概念", "definition": "用你自己的数据继续训练模型，让它更贴合某个具体任务。", "example": "想让它专门输出产品面试题风格，可以微调。", "related": "训练,大模型"},
    {"term": "Agent", "category": "技术概念", "definition": "能自己拆任务、调用工具、多步执行的 AI 程序。", "example": "自动抓面经、清洗、入库、再总结，就是一个 Agent 流程。", "related": "工作流,工具调用"},
    {"term": "需求评审会", "category": "流程术语", "definition": "产品把需求讲给研发、测试和设计，大家确认要不要做、怎么做。", "example": "很多经验帖不会提这个，但它是 PM 的日常。", "related": "需求,协作"},
    {"term": "发版", "category": "流程术语", "definition": "把新版本发布到线上，让用户用上。", "example": "版本上线前要做回归测试。", "related": "上线,灰度发布"},
    {"term": "灰度发布", "category": "流程术语", "definition": "先让一小部分用户用新版本，确认没问题再全量。", "example": "先放 5% 用户，观察两天再全开。", "related": "发版,回滚"},
    {"term": "埋点", "category": "流程术语", "definition": "在用户行为上记录数据，用来分析大家是怎么用产品的。", "example": "记录有多少人点了保存按钮。", "related": "数据,指标"},
    {"term": "需求池", "category": "流程术语", "definition": "收集和存放所有待评估需求的地方，避免漏掉也避免什么都做。", "example": "把用户反馈先丢进需求池，再排优先级。", "related": "优先级,排期"},
    {"term": "北极星指标", "category": "数据指标", "definition": "最能代表产品价值的那个核心指标，全团队都盯它。", "example": "本产品的北极星可以是每周生成并保存路径的人数。", "related": "KPI,指标"},
    {"term": "DAU / MAU", "category": "数据指标", "definition": "日活用户数和月活用户数，衡量产品有多少人在用。", "example": "DAU 高说明用户回访频繁。", "related": "留存,活跃"},
    {"term": "留存率", "category": "数据指标", "definition": "用过的用户里，过一段时间还会回来的比例。", "example": "第二天回访比例就是次日留存。", "related": "回访,活跃"},
    {"term": "转化率", "category": "数据指标", "definition": "走完某个流程的人，占进入流程总人数的比例。", "example": "输入岗位的人里，有多少真的看到了路径。", "related": "漏斗,注册"},
    {"term": "漏斗", "category": "数据指标", "definition": "把用户从进入到完成目标拆成几步，看每一步流失了多少人。", "example": "访问到注册到保存，就是一条漏斗。", "related": "转化率,流失"},
    {"term": "A/B 测试", "category": "数据指标", "definition": "把用户分成两组用不同方案，对比哪个效果更好。", "example": "面经免费 1 条和免费 3 条，哪个注册率高。", "related": "实验,转化率"},
    {"term": "八股文", "category": "求职术语", "definition": "面试里反复出现、需要提前背下来的标准答案。", "example": "产品和运营的区别，就属于常见八股。", "related": "面经,面试"},
    {"term": "面经", "category": "求职术语", "definition": "别人分享的真实面试题目和面试过程。", "example": "牛客上有很多产品经理面经。", "related": "题库,八股文"},
    {"term": "JD", "category": "求职术语", "definition": "职位描述，招聘方写的岗位职责和任职要求。", "example": "看 JD 能反推这个岗位要会什么。", "related": "岗位要求,简历"},
    {"term": "内推", "category": "求职术语", "definition": "通过公司内部员工推荐来投递，简历通常更容易被看到。", "example": "找学长学姐内推，比自己投效率高。", "related": "投递,简历"},
    {"term": "转正", "category": "求职术语", "definition": "实习结束后留在公司，成为正式员工。", "example": "实习期表现好，有机会拿到转正名额。", "related": "实习,offer"},
]


def seed(conn) -> None:
    """只在数据库还是空的时候写入初始数据。

    这样重启后端不会覆盖你已经保存的学习计划。
    想重新灌一遍数据，先删掉 backend/data/jobcompass.db，或者跑 python backend/reset_db.py。
    """
    cur = conn.cursor()
    if cur.execute("SELECT COUNT(*) FROM roles").fetchone()[0] > 0:
        return

    for table in ["stage_resources", "stage_tasks", "stages", "standards", "skills",
                  "interviews", "courses", "terms", "saved_plans", "roles"]:
        cur.execute(f"DELETE FROM {table}")

    for role in ROLES:
        cur.execute(
            "INSERT INTO roles (id, name, mark, tagline, summary) VALUES (?, ?, ?, ?, ?)",
            (role["id"], role["name"], role["mark"], role["tagline"], role["summary"]),
        )
        for i, name in enumerate(role["required_skills"]):
            cur.execute("INSERT INTO skills (role_id, kind, name, sort) VALUES (?, 'required', ?, ?)", (role["id"], name, i))
        for i, name in enumerate(role["bonus_skills"]):
            cur.execute("INSERT INTO skills (role_id, kind, name, sort) VALUES (?, 'bonus', ?, ?)", (role["id"], name, i))
        for i, content in enumerate(role["standards"]):
            cur.execute("INSERT INTO standards (role_id, content, sort) VALUES (?, ?, ?)", (role["id"], content, i))
        for si, stage in enumerate(role["stages"]):
            cur.execute(
                "INSERT INTO stages (role_id, title, duration, deliverable, standard, sort) VALUES (?, ?, ?, ?, ?, ?)",
                (role["id"], stage["title"], stage["duration"], stage["deliverable"], stage["standard"], si),
            )
            stage_id = cur.lastrowid
            for ti, task in enumerate(stage["tasks"]):
                cur.execute("INSERT INTO stage_tasks (stage_id, content, sort) VALUES (?, ?, ?)", (stage_id, task, ti))
            for res in stage["resources"]:
                cur.execute("INSERT INTO stage_resources (stage_id, name, url) VALUES (?, ?, ?)", (stage_id, res["name"], res["url"]))

    for item in INTERVIEWS:
        cur.execute(
            "INSERT INTO interviews (role_id, company, year, type, question, tags, source, credibility, answer) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (item["role"], item["company"], item["year"], item["type"], item["question"],
             item["tags"], item["source"], item["credibility"], item["answer"]),
        )

    for course in COURSES:
        url = "https://search.bilibili.com/all?keyword=" + course["title"]
        cur.execute(
            "INSERT INTO courses (role_id, title, category, platform, level, reason, url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (course.get("role"), course["title"], course["category"], course["platform"], course["level"], course["reason"], url),
        )

    for term in TERMS:
        cur.execute(
            "INSERT INTO terms (term, category, definition, example, related) VALUES (?, ?, ?, ?, ?)",
            (term["term"], term["category"], term["definition"], term["example"], term["related"]),
        )

    conn.commit()
