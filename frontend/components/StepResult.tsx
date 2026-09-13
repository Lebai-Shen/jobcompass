"use client";

import { useState } from "react";
import type { Credibility, RoleContent } from "@/lib/types";

const CRED: Record<Credibility, { label: string; className: string }> = {
  high: { label: "已核实真题", className: "bg-accent-100 text-accent-600" },
  medium: { label: "社区经验", className: "bg-warm-100 text-warm-600" },
  ai: { label: "AI 整理", className: "bg-slate-100 text-slate-500" },
};

const TABS = [
  { id: "skills", label: "岗位要求" },
  { id: "path", label: "学习路径" },
  { id: "interview", label: "面经题库" },
  { id: "course", label: "教程推荐" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StepResult({
  role,
  onRestart,
}: {
  role: RoleContent;
  onRestart: () => void;
}) {
  const [tab, setTab] = useState<TabId>("skills");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [openAnswer, setOpenAnswer] = useState<string | null>(null);

  const totalTasks = role.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const doneCount = Object.values(done).filter(Boolean).length;
  const progress = totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);

  const toggleTask = (key: string) =>
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
              {role.emoji}
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{role.name}</h2>
              <p className="text-xs text-slate-500">{role.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
          >
            换一个岗位
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{role.summary}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-brand-50 p-3">
            <p className="text-lg font-extrabold text-brand-700">{role.stages.length}</p>
            <p className="text-xs text-slate-600">学习阶段</p>
          </div>
          <div className="rounded-2xl bg-accent-50 p-3">
            <p className="text-lg font-extrabold text-accent-600">{role.interviews.length}</p>
            <p className="text-xs text-slate-600">面经题</p>
          </div>
          <div className="rounded-2xl bg-warm-50 p-3">
            <p className="text-lg font-extrabold text-warm-600">{progress}%</p>
            <p className="text-xs text-slate-600">路径完成度</p>
          </div>
        </div>
      </section>

      <div className="sticky top-2 z-10 flex gap-2 overflow-x-auto rounded-2xl bg-white/80 p-2 backdrop-blur">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
              tab === item.id
                ? "bg-brand-600 text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "skills" && (
        <section className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-sm font-bold text-slate-900">必会技能</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {role.skills.required.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <h3 className="mt-6 text-sm font-bold text-slate-900">加分技能</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {role.skills.bonus.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-sm font-bold text-slate-900">学到什么程度算达标</h3>
            <ul className="mt-3 space-y-3">
              {role.skills.standards.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-100 text-[10px] font-bold text-accent-600">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === "path" && (
        <section className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">我的进度</p>
              <p className="text-xs font-semibold text-brand-600">
                已完成 {doneCount} / {totalTasks}
              </p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {role.stages.map((stage, stageIndex) => (
            <div key={stage.id} className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {stageIndex + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{stage.title}</h3>
                  <p className="text-xs text-slate-500">{stage.duration}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {stage.tasks.map((task, taskIndex) => {
                  const key = `${stage.id}-${taskIndex}`;
                  const checked = Boolean(done[key]);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => toggleTask(key)}
                        className="flex w-full items-start gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-slate-50"
                      >
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[10px] font-bold ${
                            checked
                              ? "border-accent-500 bg-accent-500 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span
                          className={`text-sm leading-relaxed ${
                            checked ? "text-slate-400 line-through" : "text-slate-700"
                          }`}
                        >
                          {task}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-brand-50 p-3">
                  <p className="text-xs font-semibold text-brand-700">交付物</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">{stage.deliverable}</p>
                </div>
                <div className="rounded-2xl bg-accent-50 p-3">
                  <p className="text-xs font-semibold text-accent-600">验收标准</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">{stage.standard}</p>
                </div>
              </div>

              {stage.resources.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
                    >
                      {resource.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {tab === "interview" && (
        <section className="space-y-4">
          {role.interviews.map((item) => {
            const cred = CRED[item.credibility];
            const open = openAnswer === item.id;
            return (
              <div key={item.id} className="rounded-3xl bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cred.className}`}>
                    {cred.label}
                  </span>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] text-slate-400">来源：{item.source}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold leading-relaxed text-slate-900">
                  {item.question}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenAnswer(open ? null : item.id)}
                  className="mt-3 text-xs font-semibold text-brand-600"
                >
                  {open ? "收起答题思路 ↑" : "看答题思路 ↓"}
                </button>
                {open && (
                  <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
          <p className="rounded-2xl bg-warm-50 p-4 text-xs leading-relaxed text-warm-600">
            标注说明：已核实真题来自公开面经整理，社区经验来自用户分享，AI 整理为模型汇总。接上真数据后，每道题都会附来源链接。
          </p>
        </section>
      )}

      {tab === "course" && (
        <section className="space-y-4">
          {role.courses.map((course) => (
            <a
              key={course.id}
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-3xl bg-white p-5 shadow-soft transition hover:shadow-card"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-600">
                  {course.platform}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{course.why}</p>
              <p className="mt-3 text-[11px] font-medium text-slate-400">难度：{course.level}</p>
            </a>
          ))}
        </section>
      )}

      <section className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
        <p className="text-sm font-bold">组队打卡学习</p>
        <p className="mt-1 text-xs text-white/80">
          下一版会加入「找搭子一起学」：同岗位的人组队打卡、互相监督、共享面经。
        </p>
      </section>
    </div>
  );
}
