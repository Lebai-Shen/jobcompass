"use client";

import { useState } from "react";
import { roleList } from "@/lib/mock";

const BACKGROUND = [
  "本科大三",
  "大四 / 应届",
  "零产品经验",
  "会一点 Python",
  "做过课程项目",
  "想转行",
];

const FEATURES = [
  {
    icon: "🎯",
    title: "岗位要求拆解",
    desc: "把 JD 拆成必会技能和加分技能，告诉你学到什么程度算达标。",
  },
  {
    icon: "🪜",
    title: "分阶段学习路径",
    desc: "每个阶段有任务、交付物和验收标准，不再只给你一个名词列表。",
  },
  {
    icon: "💬",
    title: "真实面经题库",
    desc: "题目标注来源和可信度，区分真题、社区经验和 AI 整理。",
  },
];

export default function StepInput({ onGenerate }: { onGenerate: (roleId: string) => void }) {
  const [roleId, setRoleId] = useState("pm");
  const [keyword, setKeyword] = useState("");
  const [picked, setPicked] = useState<string[]>(["大四 / 应届", "零产品经验"]);

  const toggle = (value: string) =>
    setPicked((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );

  return (
    <div className="space-y-10">
      <section className="text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          AI 求职成长路径 · 先做产品经理方向
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-snug text-slate-900 sm:text-4xl">
          输入一个岗位
          <br className="sm:hidden" />
          <span className="text-brand-600">给你一条能走的路</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
          不用再自己拼各种零散经验帖。告诉它你想做什么，它会给你岗位要求、分阶段学习路径、真实面经和教程。
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          我想找的岗位
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="比如：产品经理、AI 产品经理"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => onGenerate(roleId)}
            className="shrink-0 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
          >
            生成我的成长路径
          </button>
        </div>

        <p className="mt-5 text-xs font-semibold text-slate-500">热门岗位</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {roleList.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setRoleId(role.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                roleId === role.id
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              }`}
            >
              {role.emoji} {role.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs font-semibold text-slate-500">
          你是哪种情况（可多选）
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BACKGROUND.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                picked.includes(item)
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl bg-white p-5 shadow-soft">
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="mt-3 text-sm font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col items-start gap-3 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold">组队打卡学习</p>
          <p className="mt-1 text-xs text-white/80">
            下一版会加入「找搭子一起学」：同岗位的人组队打卡、互相监督、共享面经。
          </p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          敬请期待
        </span>
      </section>
    </div>
  );
}
