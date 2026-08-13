import { type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";

interface VoteContentSectionProps {
  content: string;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
}

export function VoteTitle({ title }: { title: string }) {
  return <h1 className="line-clamp-3 px-5 text-center text-h-m text-grey-divider">{title}</h1>;
}

export function VoteContentSection({ content, isExpanded, onExpandedChange }: VoteContentSectionProps) {
  const [isExpandable, setIsExpandable] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const checkExpandable = () => {
      if (!isExpanded) setIsExpandable(el.scrollHeight > el.clientHeight + 1);
    };

    checkExpandable();

    const observer = new ResizeObserver(checkExpandable);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isExpanded]);

  useLayoutEffect(() => {
    if (!isExpanded && pRef.current) pRef.current.scrollTop = 0;
  }, [isExpanded]);

  const canToggle = isExpandable || isExpanded;
  const handleToggle = () => {
    if (canToggle) onExpandedChange(!isExpanded);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!canToggle || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onExpandedChange(!isExpanded);
  };

  return (
    <section
      className={`relative min-h-0 px-5 text-left ${isExpanded ? "flex flex-col" : ""} ${
        canToggle ? "cursor-pointer" : ""
      }`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role={canToggle ? "button" : undefined}
      tabIndex={canToggle ? 0 : undefined}
      aria-expanded={canToggle ? isExpanded : undefined}
    >
      <p
        ref={pRef}
        className={`min-h-7 text-body-s text-grey-disabled transition-[max-height] duration-300 ${
          isExpanded ? "max-h-[168px] shrink overflow-y-auto hs-scroll" : "max-h-12 line-clamp-2"
        }`}
      >
        {content}
      </p>
    </section>
  );
}
