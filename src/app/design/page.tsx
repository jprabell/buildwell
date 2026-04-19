"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STRUCTURE_OPTIONS, STRUCTURE_CATEGORIES } from "@/lib/structures";
import { getStepsForStructure } from "@/lib/questions";
import { StructureType, ProjectAnswers } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import CostBadge from "@/components/ui/CostBadge";
import { cn } from "@/lib/utils";

type Stage = "select-type" | "questions" | "saving";

export default function DesignPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("select-type");
  const [selectedType, setSelectedType] = useState<StructureType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<ProjectAnswers>({});
  const [saving, setSaving] = useState(false);

  const steps = selectedType ? getStepsForStructure(selectedType) : [];
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  function handleAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleMultiSelect(questionId: string, value: string) {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers((prev) => ({ ...prev, [questionId]: updated }));
  }

  async function handleFinish() {
    setSaving(true);
    const projectName = (answers.projectName as string) || "My Project";

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: projectName,
        structureType: selectedType,
        answers,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/projects/${data.id}`);
    } else {
      setSaving(false);
      alert("Failed to save project. Please sign in and try again.");
      router.push("/login");
    }
  }

  if (stage === "select-type") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <a href="/" className="text-2xl font-black text-slate-900 mb-8 inline-block">
              Build<span className="text-amber-600">well</span>
            </a>
            <h1 className="text-4xl font-black text-slate-900 mt-4 mb-3">
              What are you building?
            </h1>
            <p className="text-slate-500 text-lg">
              Choose a structure type to get started
            </p>
          </div>

          {STRUCTURE_CATEGORIES.map((category) => {
            const structures = STRUCTURE_OPTIONS.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {structures.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        setSelectedType(s.value);
                        setStage("questions");
                        setCurrentStep(0);
                      }}
                      className={cn(
                        "bg-white rounded-xl p-4 border-2 text-left hover:border-amber-400 hover:shadow-md transition-all group",
                        selectedType === s.value
                          ? "border-amber-500 shadow-md"
                          : "border-slate-200"
                      )}
                    >
                      <div className="text-3xl mb-2">{s.icon}</div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-700">
                        {s.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 leading-tight mb-2">
                        {s.description}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">
                          <span className="text-amber-500">{"$".repeat(s.costLevel)}</span>
                          <span className="text-slate-200">{"$".repeat(4 - s.costLevel)}</span>
                        </span>
                        <span className="text-xs text-slate-400">{s.costNote}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!step || !selectedType) return null;

  const structureLabel = STRUCTURE_OPTIONS.find((s) => s.value === selectedType)?.label;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <a href="/" className="text-xl font-black text-slate-900">
            Build<span className="text-amber-600">well</span>
          </a>
          <button
            onClick={() => setStage("select-type")}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Change structure type
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {structureLabel}
            </span>
            <span className="text-xs text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-1">{step.title}</h2>
          {step.description && (
            <p className="text-slate-500 mb-8">{step.description}</p>
          )}

          <div className="flex flex-col gap-8">
            {step.questions.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  {q.label}
                  {q.required && <span className="text-amber-600 ml-1">*</span>}
                </p>

                {q.type === "text" && (
                  <Input
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                  />
                )}

                {q.type === "number" && (
                  <Input
                    type="number"
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    unit={q.unit}
                  />
                )}

                {/* Image card grid — for radio/multiselect/select when options have photos */}
                {(q.type === "radio" || q.type === "multiselect" || q.type === "select") &&
                  q.options?.some((o) => o.image) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {q.options!.map((opt) => {
                        const isSelected =
                          q.type === "multiselect"
                            ? ((answers[q.id] as string[]) || []).includes(opt.value)
                            : answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              q.type === "multiselect"
                                ? handleMultiSelect(q.id, opt.value)
                                : handleAnswer(q.id, opt.value)
                            }
                            className={cn(
                              "rounded-xl border-2 overflow-hidden text-left transition-all",
                              isSelected
                                ? "border-amber-500 shadow-md ring-1 ring-amber-400"
                                : "border-slate-200 hover:border-amber-300 hover:shadow-sm"
                            )}
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                              {opt.image ? (
                                <img
                                  src={opt.image}
                                  alt={opt.label}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                                  🏠
                                </div>
                              )}
                            </div>
                            <div
                              className={cn(
                                "px-3 py-2 text-xs font-semibold leading-tight",
                                isSelected
                                  ? "bg-amber-50 text-amber-800"
                                  : "bg-white text-slate-700"
                              )}
                            >
                              {q.type === "multiselect" && isSelected ? "✓ " : ""}
                              {opt.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {q.type === "select" && q.options && !q.options.some((o) => o.image) && (
                  <Select
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    options={q.options}
                    placeholder="Select an option"
                  />
                )}

                {q.type === "radio" && q.options && !q.options.some((o) => o.image) && (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className={cn(
                          "px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all",
                          answers[q.id] === opt.value
                            ? "border-amber-500 bg-amber-50 text-amber-800"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "multiselect" && q.options && !q.options.some((o) => o.image) && (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const selected = ((answers[q.id] as string[]) || []).includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleMultiSelect(q.id, opt.value)}
                          className={cn(
                            "px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all",
                            selected
                              ? "border-amber-500 bg-amber-50 text-amber-800"
                              : "border-slate-200 hover:border-slate-300 text-slate-700"
                          )}
                        >
                          {selected ? "✓ " : ""}{opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "textarea" && (
                  <textarea
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 0) {
                  setStage("select-type");
                } else {
                  setCurrentStep((s) => s - 1);
                }
              }}
            >
              Back
            </Button>

            {isLastStep ? (
              <Button onClick={handleFinish} disabled={saving}>
                {saving ? "Saving..." : "Finish & Save Project"}
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep((s) => s + 1)}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
