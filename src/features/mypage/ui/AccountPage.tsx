import { Header } from "./MypageHeader";
import { Link } from "@tanstack/react-router";
import type { User } from "@features/auth/model/types";

interface AccountPageProps {
    user: User;
}

export function AccountPage({ user }: AccountPageProps) {
    // birthDate가 "1990-01-01" 형태라고 가정하고 앞의 4자리(연도)만 추출합니다.
    const displayBirthYear = user.birthDate ? user.birthDate.substring(0, 4) : "정보 없음";

    const infoItems = [
        { label: "성별", value: user.gender === "FEMALE" ? "여성" : "남성" },
        { label: "출생 연도", value: displayBirthYear },
        { label: "이메일", value: user.email },
        // provider 정보가 없으므로, 필요하다면 백엔드에 추가 요청을 하거나 해당 항목을 숨겨야 합니다.
        // 일단 기획안을 유지하기 위해 임시 텍스트로 처리해 두었습니다.
        { label: "소셜 연동", value: "연동 정보 없음" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header title="계정" />

            <main className="flex-1 px-5 py-4">
                <div className="flex flex-col gap-6">
                    {infoItems.map((item) => (
                        <div key={item.label} className="flex flex-col gap-2 border-b border-grey-divider pb-4">
                            <span className="text-label-s text-grey-light">{item.label}</span>
                            <span className="text-body-m">{item.value}</span>
                        </div>
                    ))}

                    <Link
                        to="/mypage/withdrawal"
                        className="text-body-s text-grey-light mt-4 inline-block w-fit"
                    >
                        회원 탈퇴
                    </Link>
                </div>
            </main>
        </div>
    );
}