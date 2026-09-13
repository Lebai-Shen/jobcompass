"use client";

import { useState } from "react";
import StepInput from "@/components/StepInput";
import StepLoading from "@/components/StepLoading";
import StepResult from "@/components/StepResult";
import { getRole } from "@/lib/mock";

type Step = "input" | "loading" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [roleId, setRoleId] = useState("pm");

  const role = getRole(roleId);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-20 pt-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-600 text-lg text-white shadow-card">
            🧭
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">JobCompass</p>
            <p className="text-xs text-slate-500">求职指南针</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-600 shadow-soft">
          MVP 原型 · mock 数据
        </span>
      </header>

      {step === "input" && (
        <StepInput
          onGenerate={(id) => {
            setRoleId(id);
            setStep("loading");
          }}
        />
      )}

      {step === "loading" && <StepLoading role={role} onDone={() => setStep("result")} />}

      {step === "result" && <StepResult role={role} onRestart={() => setStep("input")} />}
    </main>
  );
}
