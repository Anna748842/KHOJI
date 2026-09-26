"use client";

import { useState } from "react";
import RoadmapForm from "@/components/RoadmapForm";
import RoadmapView from "@/components/RoadmapView";
import { createRoadmap, Roadmap, RoadmapRequest } from "@/lib/api";

export default function HomePage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateRoadmap(payload: RoadmapRequest) {
    setLoading(true);
    setError("");

    try {
      const result = await createRoadmap(payload);
      setRoadmap(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Roadmap generation failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#17211b]">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <nav className="flex items-center justify-between border-b border-[#17211b]/15 pb-6">
          <div className="text-xl font-black tracking-tight">
            LearnPath<span className="text-[#e4572e]">AI</span>
          </div>

          <span className="rounded-full border border-[#17211b]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            Personalized learning
          </span>
        </nav>

        <div className="grid gap-16 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-[#e4572e]">
              Learn with direction
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">
              Stop collecting courses.
              <span className="block text-[#e4572e]">
                Start building skills.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#17211b]/70">
              Tell us what you want to learn. LearnPath AI finds useful
              resources, identifies your skill gaps, and turns them into a
              realistic weekly roadmap.
            </p>

            <RoadmapForm
              loading={loading}
              error={error}
              onSubmit={handleGenerateRoadmap}
            />
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#f3c969]" />

            <div className="relative rounded-[2rem] bg-[#17211b] p-6 text-[#f4f0e8] shadow-[10px_10px_0_#e4572e] md:p-10">
              {!roadmap ? (
                <EmptyDashboard />
              ) : (
                <RoadmapView roadmap={roadmap} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyDashboard() {
  const features = ["Skill gaps", "Best resources", "Weekly plan"];

  return (
    <div className="flex min-h-[520px] flex-col justify-between">
      <div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em]">
          Your future dashboard
        </span>

        <h2 className="mt-8 max-w-lg text-4xl font-black leading-tight">
          A clear path from curious to capable.
        </h2>

        <p className="mt-5 max-w-lg leading-7 text-white/65">
          Complete the form and receive an AI-generated learning plan tailored
          to your current level, available time, and budget.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature}
            className="rounded-2xl border border-white/15 bg-white/5 p-4"
          >
            <div className="mb-8 text-3xl font-black text-[#f3c969]">
              0{index + 1}
            </div>

            <p className="text-sm font-bold">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}