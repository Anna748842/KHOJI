"use client";

import { FormEvent, useState } from "react";
import { RoadmapRequest } from "@/lib/api";

type RoadmapFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (payload: RoadmapRequest) => Promise<void>;
};

const initialForm: RoadmapRequest = {
  goal: "",
  level: "beginner",
  budget: "free",
  hours_per_week: 5,
};

export default function RoadmapForm({
  loading,
  error,
  onSubmit,
}: RoadmapFormProps) {
  const [form, setForm] = useState<RoadmapRequest>(initialForm);
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.goal.trim().length < 3) {
      setValidationError("Enter a goal with at least 3 characters.");
      return;
    }

    setValidationError("");
    await onSubmit({
      ...form,
      goal: form.goal.trim(),
    });
  }

  function updateForm<K extends keyof RoadmapRequest>(
    key: K,
    value: RoadmapRequest[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const formError = validationError || error;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-5 rounded-[2rem] border border-[#17211b]/15 bg-white/70 p-6 shadow-[10px_10px_0_#17211b]"
    >
      <label className="block">
        <span className="mb-2 block text-sm font-bold">
          What do you want to learn?
        </span>

        <input
          value={form.goal}
          onChange={(event) => updateForm("goal", event.target.value)}
          placeholder="e.g. Become a data engineer"
          maxLength={300}
          className="w-full rounded-xl border border-[#17211b]/20 bg-[#f4f0e8] px-4 py-3 outline-none transition placeholder:text-[#17211b]/40 focus:border-[#e4572e] focus:ring-2 focus:ring-[#e4572e]/20"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold">Level</span>

          <select
            value={form.level}
            onChange={(event) =>
              updateForm(
                "level",
                event.target.value as RoadmapRequest["level"],
              )
            }
            className="w-full rounded-xl border border-[#17211b]/20 bg-[#f4f0e8] px-4 py-3 outline-none focus:border-[#e4572e]"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Budget</span>

          <select
            value={form.budget}
            onChange={(event) =>
              updateForm(
                "budget",
                event.target.value as RoadmapRequest["budget"],
              )
            }
            className="w-full rounded-xl border border-[#17211b]/20 bg-[#f4f0e8] px-4 py-3 outline-none focus:border-[#e4572e]"
          >
            <option value="free">Free only</option>
            <option value="low">Free and low-cost</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
      </div>

      <label className="block">
        <div className="mb-2 flex justify-between text-sm font-bold">
          <span>Hours per week</span>
          <span>{form.hours_per_week} hours</span>
        </div>

        <input
          type="range"
          min="1"
          max="40"
          value={form.hours_per_week}
          onChange={(event) =>
            updateForm("hours_per_week", Number(event.target.value))
          }
          className="w-full accent-[#e4572e]"
        />

        <div className="mt-1 flex justify-between text-xs text-[#17211b]/50">
          <span>1 hour</span>
          <span>40 hours</span>
        </div>
      </label>

      {formError && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#e4572e] px-5 py-4 font-black text-white transition hover:bg-[#c9421d] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Building your roadmap..." : "Generate my roadmap"}
      </button>
    </form>
  );
}