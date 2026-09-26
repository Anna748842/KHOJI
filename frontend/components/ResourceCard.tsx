import { Resource } from "@/lib/api";

type ResourceCardProps = {
  resource: Resource;
};

function getResourceTypeLabel(resourceType: string) {
  return resourceType.replaceAll("_", " ");
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const qualityScore = Math.round(resource.quality_score);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-[#17211b]/10 p-3 transition hover:border-[#e4572e] hover:bg-[#f4f0e8]/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-bold leading-5">{resource.title}</h4>

          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#17211b]/55">
            <span>{resource.provider}</span>
            <span>•</span>
            <span className="capitalize">
              {getResourceTypeLabel(resource.resource_type)}
            </span>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-[#e4572e]/10 px-2 py-1 text-xs font-bold text-[#e4572e]">
          {qualityScore}/100
        </span>
      </div>

      {resource.description && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#17211b]/60">
          {resource.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#17211b]/60">
        <span className="rounded-full bg-[#f4f0e8] px-2 py-1">
          {resource.price}
        </span>

        <span className="rounded-full bg-[#f4f0e8] px-2 py-1">
          {resource.estimated_hours} hour
          {resource.estimated_hours === 1 ? "" : "s"}
        </span>

        {resource.difficulty && resource.difficulty !== "unknown" && (
          <span className="rounded-full bg-[#f4f0e8] px-2 py-1 capitalize">
            {resource.difficulty}
          </span>
        )}
      </div>
    </a>
  );
}
