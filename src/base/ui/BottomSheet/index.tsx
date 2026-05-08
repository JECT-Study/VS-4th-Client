import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CLOSE_THRESHOLD_RATIO = 0.3;

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  const startYRef = useRef(0);

  const propsRef = useRef({ onClose });
  propsRef.current = { onClose };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isOpen) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") propsRef.current.onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDragEnd = useCallback((endClientY: number) => {
    const offset = Math.max(0, endClientY - startYRef.current);
    const sheetHeight = sheetRef.current?.offsetHeight ?? 200;
    setIsDragging(false);
    if (offset > sheetHeight * CLOSE_THRESHOLD_RATIO) {
      propsRef.current.onClose();
    }
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    const offset = Math.max(0, clientY - startYRef.current);
    setDragOffset(offset);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = (e: MouseEvent) => handleDragEnd(e.clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    startYRef.current = touch.clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handleDragMove(touch.clientY);
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      handleDragEnd(touch.clientY);
    },
    [handleDragEnd],
  );

  if (!mounted) return null;

  const sheetStyle = isDragging
    ? { transform: `translateY(${dragOffset}px)` }
    : { transform: isOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 300ms ease-out" };

  return createPortal(
    <div
      ref={containerRef}
      className={`fixed inset-0 z-overlay transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        role="button"
        tabIndex={-1}
        aria-label="Close bottom sheet"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.15)] touch-none select-none"
        style={sheetStyle}
      >
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-grey-disabled rounded-full" />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
