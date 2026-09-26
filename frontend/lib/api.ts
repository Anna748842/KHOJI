
export type RoadmapRequest = {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
  budget: "free" | "low" | "flexible";
  hours_per_week: number;
};

export type Resource = {
  title: string;
  provider: string;
  url: string;
  resource_type: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
  price: string;
  quality_score: number;
};

export type RoadmapStep = {
  title: string;
  objective: string;
  estimated_hours: number;
  skills: string[];
  resources: Resource[];
};

export type Roadmap = {
  goal: string;
  summary: string;
  skill_gaps: string[];
  recommended_duration_weeks: number;
  steps: RoadmapStep[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function createRoadmap(
  payload: RoadmapRequest,
): Promise<Roadmap> {
  const response = await fetch(`${API_URL}/api/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to generate roadmap.");
  }

  return response.json();
}