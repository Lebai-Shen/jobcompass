"use client";

import { useEffect, useState } from "react";
import type { RoleContent } from "@/lib/types";

const STEPS = [
  "正在读取目标岗位的要求",
  "正在整理真实面经和高频考点",
  "正在匹配适合你的教程",
  "正在生成分阶段学习路径",
];

export default function StepLoading({
  role,
  onDone,
}: {
  role: RoleContent;
  onDone: () => void;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => {
        if (value >= STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(onDone, 550);
          return value;
        }
        return value + 1;
      });
    }, 620);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-card">
      <span className="floaty inline-block text-4xl">{role.emoji}</span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">
        正在为你生成「{role.name}」的成长路径
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        这里展示的是 mock 数据，接上真 AI 后内容会实时生成。
      </p>

      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <ul className="mt-6 space-y-3 text-left">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                index <= current ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {index < current ? "✓" : index + 1}
            </span>
            <span className={index <= current ? "text-slate-800" : "text-slate-400"}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
