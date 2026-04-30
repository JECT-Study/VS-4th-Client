import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate({ to: "/home" });
  };

  return (
    <main className="flex flex-col items-center justify-center px-5 bg-white min-h-dvh">
      <h1 className="text-2xl font-bold text-neutral-950">로그인</h1>

      <button
        type="button"
        onClick={handleClickLogin}
        className="w-full h-12 mt-8 text-sm font-bold text-white rounded-xl bg-neutral-950"
      >
        로그인하고 홈으로 이동
      </button>
    </main>
  );
}
