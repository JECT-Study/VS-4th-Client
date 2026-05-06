import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION_IN = 220;
const DURATION_OUT = 180;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const hasOpenedRef = useRef(false);

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsClosing(false);
      setMounted(true);
      return;
    }
    if (!hasOpenedRef.current) return;
    setIsClosing(true);
    const t = setTimeout(() => {
      setMounted(false);
      setIsClosing(false);
      previousFocusRef.current?.focus();
    }, DURATION_OUT);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Scroll lock — iOS Safari needs position:fixed + stored scrollY
  useEffect(() => {
    if (!mounted) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    return () => {
      style.overflow = "";
      style.position = "";
      style.top = "";
      style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [mounted]);

  // Focus initial element when panel mounts
  useEffect(() => {
    if (!mounted || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (first ?? panelRef.current).focus();
  }, [mounted]);

  // Focus trap + Escape
  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!first || !last) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === first || !panelRef.current.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !panelRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
      style={{
        animation: isClosing
          ? `modal-backdrop-out ${DURATION_OUT}ms ${EASING} both`
          : `modal-backdrop-in ${DURATION_IN}ms ${EASING} both`,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      onPointerDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <dialog
        ref={panelRef}
        open
        aria-modal="true"
        tabIndex={-1}
        className={clsx("relative border-0 p-0 m-0 bg-white rounded-[20px] w-full max-w-sm outline-none", className)}
        style={{
          animation: isClosing
            ? `modal-panel-out ${DURATION_OUT}ms ${EASING} both`
            : `modal-panel-in ${DURATION_IN}ms ${EASING} both`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </dialog>
    </div>,
    document.body,
  );
}

export { Modal };
