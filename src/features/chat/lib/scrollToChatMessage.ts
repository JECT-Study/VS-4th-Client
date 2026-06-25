const HIGHLIGHT_CLASS = "chat-message-highlight";

export function scrollToChatMessage(messageId: number) {
  const target = document.querySelector<HTMLElement>(`[data-chat-message-id="${messageId}"]`);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.remove(HIGHLIGHT_CLASS);
  window.setTimeout(() => {
    target.classList.add(HIGHLIGHT_CLASS);
    window.setTimeout(() => target.classList.remove(HIGHLIGHT_CLASS), 1200);
  }, 250);
}
