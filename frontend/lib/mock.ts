import type { RoleContent } from "./types";

const search = (keyword: string) =>
  `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;

export const roles: Record<string, RoleContent> = {
  pm: {
    id: "pm",
    name: "产品经理",
    emoji: "🧭",
    tagline: "把用户的真实问题翻译成产品方案的人",
    summary:
      "产品经理负责发现用户问题、定义产品方案，并推动研发把方案做出来。实习岗最看重三件事：会不会写 PRD、能不能画原型讲交互、有没有一个能讲清楚的完整项目。",
    skills: {
      required: ["需求分析与用户调研", "PRD 撰写", "原型设计（Figma / Axure）", "竞品分析", "基础数据分析"],
      bonus: ["SQL", "A/B 测试", "AI 工具与 Prompt", "完整项目经历"],
      standards: [
        "能独立写一份合格 PRD，包含背景、目标、用户故事、功能清单和流程图。",
        "能用 Figma 画低保真原型，并讲清楚每个交互为什么这么设计。",
        "能对一个竞品说清它的优劣势，以及可以借鉴和应该避开的地方。",
      ],
    },
    stages: [
      {
        id: "pm-s1",
        title: "第 1 周：搞清楚这个岗位到底做什么",
        duration: "约 1 周",
        tasks: [
          "搞清楚产品经理每天的工作内容",
          "拆解 3 份真实的产品经理 JD",
          "弄明白需求评审会、发版这些真实工作流程",
        ],
        deliverable: "一份《岗位理解笔记》加 3 份 JD 拆解",
        standard: "能用自己的话讲清楚产品经理的工作流程，知道面试会问什么。",
        resources: [{ name: "B站搜索：产品经理入门", url: search("产品经理 入门") }],
      },
      {
        id: "pm-s2",
        title: "第 2 到 3 周：练三个核心技能",
        duration: "约 2 周",
        tasks: ["学 Figma 画原型", "照着模板写 1 份 PRD", "做 1 份竞品分析"],
        deliverable: "1 份 PRD 加 1 份竞品分析加 1 个原型",
        standard: "PRD 要素齐全，原型能讲清交互，竞品分析有明确结论。",
        resources: [
          { name: "B站搜索：Figma 入门", url: search("Figma 入门") },
          { name: "B站搜索：PRD 怎么写", url: search("PRD 怎么写") },
        ],
      },
      {
        id: "pm-s3",
        title: "第 3 到 5 周：做一个完整项目",
        duration: "约 2 周",
        tasks: ["选一个你身边真实的小问题", "用 vibe coding 做一个能演示的 demo", "整理成作品集"],
        deliverable: "一个完整项目：产品文档加原型加可演示 demo",
        standard: "能在 5 分钟内讲清楚项目背景、你的方案和最终结果。",
        resources: [{ name: "B站搜索：产品经理项目实战", url: search("产品经理 项目实战") }],
      },
      {
        id: "pm-s4",
        title: "第 5 到 6 周：准备面试",
        duration: "约 1 周",
        tasks: ["刷高频面经", "整理项目话术和常见八股", "做 2 次模拟面试"],
        deliverable: "面经题库加自我介绍加项目话术",
        standard: "高频问题能答上来，自己的项目经得起追问。",
        resources: [{ name: "B站搜索：产品经理面试", url: search("产品经理 面试") }],
      },
    ],
    interviews: [
      {
        id: "pm-i1",
        question: "你怎么理解产品经理这个岗位？",
        tags: ["高频", "概念题"],
        source: "牛客社区面经",
        credibility: "high",
        answer:
          "分三层答：发现用户问题（调研）、定义产品方案（PRD 和原型）、推动方案落地（和研发协作）。最后用一句话说明你为什么想做，最好结合你做过的一件事。",
      },
      {
        id: "pm-i2",
        question: "挑一个你常用的 App，如果让你加一个功能，你会怎么做？",
        tags: ["高频", "案例分析"],
        source: "大厂真题",
        credibility: "high",
        answer:
          "先定位目标用户和使用场景，再找到具体问题，然后给方案，最后说清楚怎么验证效果。不要一上来就报一个功能名字。",
      },
      {
        id: "pm-i3",
        question: "竞品分析你会怎么做？",
        tags: ["高频", "技能题"],
        source: "牛客社区面经",
        credibility: "medium",
        answer:
          "先把竞品分类：直接竞品、间接竞品、替代方案。再定维度：定位、目标用户、核心功能、体验、商业模式。最后一定要给结论，我们能学什么、要避开什么。",
      },
      {
        id: "pm-i4",
        question: "你怎么判断一个需求该不该做？",
        tags: ["进阶"],
        source: "大厂真题",
        credibility: "high",
        answer:
          "看三件事：用户价值、业务价值、实现成本。再排优先级，可以用 RICE 或 KANO 模型，说清楚你的判断依据。",
      },
      {
        id: "pm-i5",
        question: "你是怎么开始学产品经理的？",
        tags: ["面试常见"],
        source: "AI 整理",
        credibility: "ai",
        answer:
          "讲你从迷茫到做出项目的真实过程。重点说你做了什么、遇到什么困难、怎么解决。这个项目本身就是你最好的答案。",
      },
    ],
    courses: [
      {
        id: "pm-c1",
        title: "Figma 零基础入门",
        platform: "B站",
        level: "入门",
        why: "原型是产品经理的基本功，面试一定会让你讲交互。",
        url: search("Figma 入门"),
      },
      {
        id: "pm-c2",
        title: "PRD 文档怎么写",
        platform: "B站",
        level: "入门",
        why: "实习和面试最常考，也是最能放进作品集的东西。",
        url: search("PRD 怎么写"),
      },
      {
        id: "pm-c3",
        title: "竞品分析实战",
        platform: "B站",
        level: "进阶",
        why: "面试高频题，也是训练产品思维最快的方式。",
        url: search("竞品分析"),
      },
      {
        id: "pm-c4",
        title: "产品经理求职与面试",
        platform: "B站",
        level: "求职",
        why: "了解真实面试流程和高频问题，提前有心理准备。",
        url: search("产品经理 面试"),
      },
    ],
  },
  "ai-pm": {
    id: "ai-pm",
    name: "AI 产品经理",
    emoji: "🤖",
    tagline: "懂一点技术、能把 AI 能力变成产品的人",
    summary:
      "AI 产品经理在普通产品经理的基础上，还要理解模型能力边界、Prompt、RAG 这些概念，知道什么能做什么做不了。面试会追问你对 AI 产品的判断力。",
    skills: {
      required: ["产品经理基本功", "Prompt 工程", "RAG 与知识库概念", "数据与评估意识", "AI 工具实操"],
      bonus: ["Python 基础", "模型 API 调用", "Agent 工作流", "向量数据库"],
      standards: [
        "能说清楚一个 AI 产品和普通产品的区别，以及它的风险。",
        "能设计一个简单的 RAG 方案，解释为什么要检索再回答。",
        "能写出一段可用的 Prompt，并说明怎么评估效果好不好。",
      ],
    },
    stages: [
      {
        id: "aipm-s1",
        title: "第 1 周：补齐 AI 基础概念",
        duration: "约 1 周",
        tasks: ["搞懂大模型、Prompt、Token、RAG 是什么意思", "上手用 AI 工具完成一个真实任务"],
        deliverable: "一份《AI 概念笔记》加一个 AI 工具实操案例",
        standard: "能用大白话给一个完全不懂的人讲清楚 RAG 是什么。",
        resources: [{ name: "B站搜索：大模型入门", url: search("大模型 入门") }],
      },
      {
        id: "aipm-s2",
        title: "第 2 到 3 周：练 AI 产品技能",
        duration: "约 2 周",
        tasks: ["调一次模型 API", "写并迭代一版 Prompt", "设计一个 RAG 知识库方案"],
        deliverable: "一个能跑通的最小 AI 功能",
        standard: "能解释你的 Prompt 为什么这么写，怎么判断输出质量。",
        resources: [{ name: "B站搜索：Prompt 工程", url: search("Prompt 工程") }],
      },
      {
        id: "aipm-s3",
        title: "第 3 到 5 周：做一个 AI 产品项目",
        duration: "约 2 周",
        tasks: ["选一个 AI 能真正解决的问题", "做出可演示的 demo", "写清楚 AI 部分的设计和评估"],
        deliverable: "一个含 AI 功能的完整项目",
        standard: "能讲清楚什么交给 AI、什么不能交给 AI，以及怎么控制幻觉。",
        resources: [],
      },
    ],
    interviews: [
      {
        id: "aipm-i1",
        question: "你怎么判断一个需求适不适合用 AI 做？",
        tags: ["高频", "判断力"],
        source: "大厂真题",
        credibility: "high",
        answer:
          "看任务是不是重复、是不是有大量非结构化数据、容错率高不高。容错率低、要求百分百准确的场景要谨慎，AI 更适合做辅助而不是直接决策。",
      },
      {
        id: "aipm-i2",
        question: "什么是 RAG，为什么要用它？",
        tags: ["高频", "概念题"],
        source: "牛客社区面经",
        credibility: "high",
        answer:
          "RAG 是先从你的资料库里检索相关内容，再让模型基于这些内容回答。好处是降低幻觉、能用上最新和私有数据，比直接问模型更靠谱。",
      },
      {
        id: "aipm-i3",
        question: "AI 产品怎么做效果评估？",
        tags: ["进阶"],
        source: "AI 整理",
        credibility: "ai",
        answer:
          "分两层：离线用一批标准样本抽检准确率，线上看用户行为（采纳率、修改率、满意度）。关键是先定一个能衡量的标准，再谈优化。",
      },
    ],
    courses: [
      {
        id: "aipm-c1",
        title: "大模型与 RAG 入门",
        platform: "B站",
        level: "入门",
        why: "RAG 是 AI 产品面试最高频的概念，必须能讲清楚。",
        url: search("RAG 大模型 入门"),
      },
      {
        id: "aipm-c2",
        title: "Prompt 工程实战",
        platform: "B站",
        level: "入门",
        why: "Prompt 是 AI 产品经理的日常工具，面试会让你现场设计。",
        url: search("Prompt 工程"),
      },
      {
        id: "aipm-c3",
        title: "AI 产品经理求职",
        platform: "B站",
        level: "求职",
        why: "了解这个新岗位的真实要求和面试风格。",
        url: search("AI 产品经理 面试"),
      },
    ],
  },
};

export const roleList = Object.values(roles);

export function getRole(id: string): RoleContent {
  return roles[id] ?? roles.pm;
}
