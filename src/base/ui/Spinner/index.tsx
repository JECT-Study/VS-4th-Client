export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 border-transparent border-t-primary animate-spin ${className ?? ""}`}
    />
  );
}
