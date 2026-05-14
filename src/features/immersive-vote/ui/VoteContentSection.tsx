import { useState } from "react";

interface VoteContentSectionProps {
  title: string;
  content: string;
}

export function VoteContentSection({ title, content }: VoteContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative px-5 text-center">
      <h1 className="text-h-l text-grey-divider">{title}</h1>
      <div className="relative mt-3 h-[72px] overflow-visible">
        <div className="absolute inset-x-0 top-0 z-10">
          <p className={`text-body-s text-grey-disabled ${isExpanded ? "" : "line-clamp-2"}`}>{content}</p>
          <button
            type="button"
            className="ml-auto mt-2 flex items-center gap-1 text-label-s text-grey-purple"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접어두기" : "전체보기"}
            <img
              src="/assets/icons/dropdown-arrow.svg"
              alt=""
              aria-hidden
              className={`${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
