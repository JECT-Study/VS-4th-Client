import { useNavigate } from "@tanstack/react-router";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const navigate = useNavigate();
    return (
        <header className="flex items-center h-14 px-4 bg-white">
            <button onClick={() => navigate({ to: ".." })} type="button" className="p-2 -ml-2">
                <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" className="w-6 h-6" />
            </button>
            <h1 className="text-title-m font-bold ml-2">{title}</h1>
        </header>
    );
}