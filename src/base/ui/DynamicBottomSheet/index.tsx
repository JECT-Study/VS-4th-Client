import cn from "classnames";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface DynamicBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  closeOnBackdropClick?: boolean;
  closeThreshold?: number;
  className?: string;
  showHandle?: boolean;
  topOffset?: number;
}

export function DynamicBottomSheet({
  isOpen,
  onClose,
  children,
  defaultHeight = 70,
  minHeight = 20,
  maxHeight = 85,
  closeOnBackdropClick = true,
  closeThreshold = 0.3,
  className,
  showHandle = true,
  topOffset = 0,
}: DynamicBottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const velocityRef = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  const currentHeightRef = useRef(currentHeight);
  currentHeightRef.current = currentHeight;

  const propsRef = useRef({
    minHeight,
    maxHeight,
    defaultHeight,
    closeThreshold,
    topOffset,
    onClose,
  });
  propsRef.current = {
    minHeight,
    maxHeight,
    defaultHeight,
    closeThreshold,
    topOffset,
    onClose,
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(defaultHeight);
    }
  }, [isOpen, defaultHeight]);

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
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const getCappedMax = useCallback(() => {
    const { maxHeight: max, topOffset: offset } = propsRef.current;
    if (offset > 0) {
      return Math.min(max, ((window.innerHeight - offset) / window.innerHeight) * 100);
    }
    return max;
  }, []);

  const updateVelocity = useCallback((currentY: number) => {
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocityRef.current = (currentY - lastY.current) / dt;
    }
    lastY.current = currentY;
    lastTime.current = now;
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    dragStartHeight.current = currentHeightRef.current;
    lastY.current = clientY;
    lastTime.current = Date.now();
    velocityRef.current = 0;
  }, []);

  const handleDragMove = useCallback(
    (clientY: number) => {
      updateVelocity(clientY);

      const viewportHeight = window.innerHeight;
      if (viewportHeight === 0) return;

      const deltaY = dragStartY.current - clientY;
      const deltaPercent = (deltaY / viewportHeight) * 100;
      const cappedMax = getCappedMax();
      const newHeight = Math.min(cappedMax, Math.max(0, dragStartHeight.current + deltaPercent));

      setCurrentHeight(newHeight);
    },
    [updateVelocity, getCappedMax],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    const { minHeight: min, defaultHeight: def, closeThreshold: threshold, onClose: close } = propsRef.current;
    const cappedMax = getCappedMax();
    const height = currentHeightRef.current;

    const velocity = velocityRef.current;
    const isSwipingDown = velocity > 0.5;
    const isSwipingUp = velocity < -0.5;

    if (isSwipingDown || height < min * threshold) {
      close();
    } else if (isSwipingUp) {
      setCurrentHeight(cappedMax);
    } else if (height < (min + def) / 2) {
      setCurrentHeight(min);
    } else if (height < (def + cappedMax) / 2) {
      setCurrentHeight(def);
    } else {
      setCurrentHeight(cappedMax);
    }
  }, [getCappedMax]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handleDragStart(touch.clientY);
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handleDragMove(touch.clientY);
    },
    [handleDragMove],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientY);
    },
    [handleDragStart],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  if (!mounted) return null;

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-overlay",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        role="button"
        tabIndex={-1}
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleBackdropClick();
          }
        }}
        aria-label="Close bottom sheet"
      />

      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "flex flex-col rounded-t-2xl bg-white",
          "shadow-[0_-4px_25px_rgba(0,0,0,0.15)]",
          "touch-none select-none",
          !isDragging && "transition-[height,transform] duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
          className,
        )}
        style={{
          height: topOffset > 0 ? `min(${currentHeight}dvh, calc(100dvh - ${topOffset}px))` : `${currentHeight}dvh`,
          maxHeight: topOffset > 0 ? `min(${maxHeight}dvh, calc(100dvh - ${topOffset}px))` : `${maxHeight}dvh`,
        }}
      >
        <div
          className="flex-shrink-0 cursor-grab touch-none active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
        >
          {showHandle ? (
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-grey-disabled rounded-full" />
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 touch-pan-y">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
