import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Placement = "bottom" | "top" | "left" | "right";

interface TooltipProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: Placement;
  offset?: number;
  className?: string;
}

interface PositionState {
  x: number;
  y: number;
  placement: Placement;
}

const MARGIN = 8;
const ARROW_HALF = 6;
const PRIMARY_LIGHT = "#9A9AF6";

function getViewport() {
  if (window.visualViewport) {
    const vp = window.visualViewport;
    return { top: vp.offsetTop, left: vp.offsetLeft, width: vp.width, height: vp.height };
  }
  return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
}

function getSafeArea() {
  const cs = getComputedStyle(document.documentElement);
  const n = (key: string) => Number.parseFloat(cs.getPropertyValue(key)) || 0;
  return { top: n("--sat"), bottom: n("--sab"), left: n("--sal"), right: n("--sar") };
}

function computePosition(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  preferred: Placement,
  offset: number,
): PositionState {
  const tr = triggerEl.getBoundingClientRect();
  const cr = contentEl.getBoundingClientRect();
  const vp = getViewport();
  const sa = getSafeArea();

  const minX = vp.left + sa.left + MARGIN;
  const maxX = vp.left + vp.width - sa.right - MARGIN;
  const minY = vp.top + sa.top + MARGIN;
  const maxY = vp.top + vp.height - sa.bottom - MARGIN;

  const fitsBelow = maxY - tr.bottom - offset >= cr.height;
  const fitsAbove = tr.top - minY - offset >= cr.height;
  const fitsRight = maxX - tr.right - offset >= cr.width;
  const fitsLeft = tr.left - minX - offset >= cr.width;

  let placement = preferred;
  if (placement === "bottom" && !fitsBelow) placement = fitsAbove ? "top" : "bottom";
  else if (placement === "top" && !fitsAbove) placement = fitsBelow ? "bottom" : "top";
  else if (placement === "right" && !fitsRight) placement = fitsLeft ? "left" : "right";
  else if (placement === "left" && !fitsLeft) placement = fitsRight ? "right" : "left";

  const tcx = tr.left + tr.width / 2;
  const tcy = tr.top + tr.height / 2;

  let x = 0;
  let y = 0;

  if (placement === "bottom" || placement === "top") {
    x = Math.max(minX, Math.min(tcx - cr.width / 2, maxX - cr.width));
    y = placement === "bottom" ? tr.bottom + offset : tr.top - cr.height - offset;
  } else {
    y = Math.max(minY, Math.min(tcy - cr.height / 2, maxY - cr.height));
    x = placement === "right" ? tr.right + offset : tr.left - cr.width - offset;
  }

  return { x, y, placement };
}

function getArrowStyle(placement: Placement): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: ARROW_HALF * 2,
    height: ARROW_HALF * 2,
    background: "white",
    transform: "rotate(45deg)",
    zIndex: 2,
  };
  switch (placement) {
    case "bottom":
      return {
        ...base,
        top: -ARROW_HALF,
        left: 30,
        borderLeft: `1px solid ${PRIMARY_LIGHT}`,
        borderTop: `1px solid ${PRIMARY_LIGHT}`,
      };
    case "top":
      return {
        ...base,
        bottom: -ARROW_HALF,
        left: 30,
        borderRight: `1px solid ${PRIMARY_LIGHT}`,
        borderBottom: `1px solid ${PRIMARY_LIGHT}`,
      };
    case "right":
      return {
        ...base,
        left: -ARROW_HALF,
        top: 30,
        borderLeft: `1px solid ${PRIMARY_LIGHT}`,
        borderBottom: `1px solid ${PRIMARY_LIGHT}`,
      };
    case "left":
      return {
        ...base,
        right: -ARROW_HALF,
        top: 30,
        borderRight: `1px solid ${PRIMARY_LIGHT}`,
        borderTop: `1px solid ${PRIMARY_LIGHT}`,
      };
  }
}

function Tooltip({ trigger, children, placement: preferred = "bottom", offset = 16, className }: TooltipProps) {
  const [position, setPosition] = useState<PositionState | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!triggerRef.current || !contentRef.current) return;
    setPosition(computePosition(triggerRef.current, contentRef.current, preferred, offset));
  }, [preferred, offset]);

  useEffect(() => {
    const recompute = () => {
      if (!triggerRef.current || !contentRef.current) return;
      setPosition(computePosition(triggerRef.current, contentRef.current, preferred, offset));
    };
    window.addEventListener("scroll", recompute, { passive: true, capture: true });
    window.addEventListener("resize", recompute, { passive: true });
    window.visualViewport?.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, { capture: true });
      window.removeEventListener("resize", recompute);
      window.visualViewport?.removeEventListener("resize", recompute);
    };
  }, [preferred, offset]);

  const portal = createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        visibility: position ? "visible" : "hidden",
        zIndex: 9999,
      }}
    >
      {position && <div aria-hidden style={getArrowStyle(position.placement)} />}
      <div className={clsx("relative border border-primary-light rounded-[20px] bg-white", "px-4 py-2", className)}>
        {children}
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      <div ref={triggerRef} className="inline-flex items-center justify-center">
        {trigger}
      </div>
      {portal}
    </>
  );
}

export { Tooltip };
