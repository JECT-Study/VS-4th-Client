import { useLayoutEffect, useRef, useState } from "react";

interface VoteContentSectionProps {
  title: string;
  content: string;
}

export function VoteContentSection({ title, content }: VoteContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const checkTruncation = () => {
      if (isExpanded) {
        setShowFade(el.scrollHeight > el.clientHeight);
      } else {
        setIsTruncated(el.scrollHeight > el.clientHeight);
        setShowFade(false);
      }
    };

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isExpanded]);

  const handleScroll = () => {
    const el = pRef.current;
    if (!el) return;
    setShowFade(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  const showToggleButton = isTruncated || isExpanded;

  return (
    <section className="relative px-5 text-center">
      <h1 className="text-h-l text-grey-divider line-clamp-3">{title}</h1>
      <div className="relative mt-3 h-[72px] overflow-visible">
        <div className="absolute inset-x-0 top-0 z-10">
          <p
            ref={pRef}
            onScroll={handleScroll}
            className={`text-body-s text-grey-disabled ${isExpanded ? "max-h-[120px] overflow-y-auto hs-scroll" : "line-clamp-2"}`}
            style={
              isExpanded && showFade
                ? {
                    WebkitMaskImage: "linear-gradient(to bottom, black 87.5%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 87.5%, transparent 100%)",
                  }
                : undefined
            }
          >
            {content}
          </p>
          {showToggleButton && (
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
          )}
        </div>
      </div>
    </section>
  );
}
