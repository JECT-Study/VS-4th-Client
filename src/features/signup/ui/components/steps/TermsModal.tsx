import { Modal } from "@base/ui/Modal";
import type { ReactNode } from "react";

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function TermsModal({ isOpen, onClose, title, children }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-5 flex justify-end">
        <button type="button" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" className="w-6 h-6" />
        </button>
      </div>
      <div className="text-grey-dark pt-4 px-5 pb-8">
        <p className="text-title-m">{title}</p>
        {children}
      </div>
    </Modal>
  );
}
