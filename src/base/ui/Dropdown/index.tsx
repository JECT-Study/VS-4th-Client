import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Placement = "bottom" | "top" | "left" | "right";

interface DropdownProps {
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
  arrowX: number;
  arrowY: number;
  transformOrigin: string;
}

const MARGIN = 8;
const ARROW_HALF = 8;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION_IN = 220;
const DURATION_OUT = 150;

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
  let arrowX = ARROW_HALF;
  let arrowY = ARROW_HALF;
  let transformOrigin = "top left";

  if (placement === "bottom" || placement === "top") {
    x = Math.max(minX, Math.min(tcx - cr.width / 2, maxX - cr.width));
    arrowX = Math.max(ARROW_HALF * 2, Math.min(tcx - x - ARROW_HALF, cr.width - ARROW_HALF * 4));
    if (placement === "bottom") {
      y = tr.bottom + offset;
      transformOrigin = `${arrowX + ARROW_HALF}px top`;
    } else {
      y = tr.top - cr.height - offset;
      transformOrigin = `${arrowX + ARROW_HALF}px bottom`;
    }
  } else {
    y = Math.max(minY, Math.min(tcy - cr.height / 2, maxY - cr.height));
    arrowY = Math.max(ARROW_HALF * 2, Math.min(tcy - y - ARROW_HALF, cr.height - ARROW_HALF * 4));
    if (placement === "right") {
      x = tr.right + offset;
      transformOrigin = `left ${arrowY + ARROW_HALF}px`;
    } else {
      x = tr.left - cr.width - offset;
      transformOrigin = `right ${arrowY + ARROW_HALF}px`;
    }
  }

  return { x, y, placement, arrowX, arrowY, transformOrigin };
}

function getArrowStyle(pos: PositionState): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: ARROW_HALF * 2,
    height: ARROW_HALF * 2,
    background: "#EDECEF",
    transform: "rotate(45deg)",
  };
  switch (pos.placement) {
    case "bottom":
      return { ...base, top: -ARROW_HALF, left: pos.arrowX };
    case "top":
      return { ...base, bottom: -ARROW_HALF, left: pos.arrowX };
    case "right":
      return { ...base, left: -ARROW_HALF, top: pos.arrowY };
    case "left":
      return { ...base, right: -ARROW_HALF, top: pos.arrowY };
  }
}

function Dropdown({ trigger, children, placement: preferred = "bottom", offset = 16, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState<PositionState | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

  const startClose = () => setIsClosing(true);

  // Unmount after close animation completes
  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setPosition(null);
    }, DURATION_OUT);
    return () => clearTimeout(t);
  }, [isClosing]);

  const toggle = () => {
    if (isOpen) {
      startClose();
    } else {
      setIsClosing(false);
      setIsOpen(true);
    }
  };

  // Calculate position synchronously before browser paint to avoid flicker
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;
    setPosition(computePosition(triggerRef.current, contentRef.current, preferred, offset));
  }, [isOpen, preferred, offset]);

  // Close on outside tap or click (pointerdown covers both mouse and touch)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: PointerEvent) => {
      if (contentRef.current?.contains(e.target as Node) || triggerRef.current?.contains(e.target as Node)) return;
      setIsClosing(true);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsClosing(true);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Close on scroll or viewport resize (e.g. soft keyboard open/close on mobile)
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setIsClosing(true);
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler, { passive: true });
    window.visualViewport?.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      window.visualViewport?.removeEventListener("resize", handler);
    };
  }, [isOpen]);

  // Close when user starts scrolling via touch (drag vs tap distinction)
  useEffect(() => {
    if (!isOpen) return;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) touchOrigin.current = { x: t.clientX, y: t.clientY };
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!touchOrigin.current || !t) return;
      if (Math.hypot(t.clientX - touchOrigin.current.x, t.clientY - touchOrigin.current.y) > 8) {
        setIsClosing(true);
        touchOrigin.current = null;
      }
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
    };
  }, [isOpen]);

  const portal = isOpen
    ? createPortal(
        <div
          ref={contentRef}
          style={{
            position: "fixed",
            top: position?.y ?? 0,
            left: position?.x ?? 0,
            // Hidden until position is computed to prevent (0,0) flash
            visibility: position ? "visible" : "hidden",
            zIndex: 9999,
            transformOrigin: position?.transformOrigin ?? "top left",
            animation: position
              ? isClosing
                ? `dropdown-out ${DURATION_OUT}ms ${EASING} both`
                : `dropdown-in ${DURATION_IN}ms ${EASING} both`
              : undefined,
          }}
        >
          {position && <div aria-hidden style={getArrowStyle(position)} />}
          <div className={clsx("relative bg-grey-stroke rounded-[20px]", "px-5 pt-2 pb-1", className)}>{children}</div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center justify-center"
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
      >
        {trigger}
      </div>
      {portal}
    </>
  );
}

export { Dropdown };
