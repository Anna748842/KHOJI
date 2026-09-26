import { Roadmap } from "@/lib/api";
import ResourceCard from "@/components/ResourceCard";

type RoadmapViewProps = {
  roadmap: Roadmap;
};

export default function RoadmapView({ roadmap }: RoadmapViewProps) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#f3c969]">
            Your roadmap
          </p>

          <h2 className="mt-3 text-4xl font-black leading-tight">
            {roadmap.goal}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center">
          <div className="text-2xl font-black text-[#f3c969]">
            {roadmap.recommended_duration_weeks}
          </div>

          <div className="text-xs uppercase tracking-[0.12em] text-white/60">
            weeks
          </div>
        </div>
      </div>

      <p className="mt-4 leading-7 text-white/70">{roadmap.summary}</p>

      {roadmap.skill_gaps.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f3c969]">
            Skills to develop
          </p>

          <div className="flex flex-wrap gap-2">
            {roadmap.skill_gaps.map((gap) => (
              <span
                key={gap}
                className="rounded-full bg-white/10 px-3 py-2 text-sm"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 space-y-5">
        {roadmap.steps.map((step, index) => (
          <article
            key={`${step.title}-${index}`}
            className="rounded-2xl bg-white p-5 text-[#17211b]"
          >
            <div className="flex gap-4">
              <span className="text-2xl font-black text-[#e4572e]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-xl font-black">{step.title}</h3>

                  <span className="rounded-full bg-[#f4f0e8] px-3 py-1 text-xs font-bold text-[#e4572e]">
                    {step.estimated_hours} hours
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#17211b]/70">
                  {step.objective}
                </p>

                {step.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#17211b]/10 px-2.5 py-1 text-xs text-[#17211b]/65"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {step.resources.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e4572e]">
                      Recommended resources
                    </p>

                    <div className="space-y-3">
                      {step.resources.map((resource) => (
                        <ResourceCard
                          key={`${resource.url}-${resource.title}`}
                          resource={resource}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
