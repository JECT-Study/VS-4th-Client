import { Button } from "@base/ui/Button";

export function GuestMyPage() {
  return (
    <div className="py-6 px-5">
      <h2 className="text-title-s text-grey-black">비회원으로 이용 중</h2>
      <p className="text-body-s text-grey-dark mt-[6px] mb-6">
        로그인하면 세그먼트 결과, 채팅,
        <br />
        무제한 투표를 즐길 수 있어요
      </p>
      <Button>Google로 시작하기</Button>

      <hr className="w-full h-px bg-grey-divider my-8" />

      <div className="rounded-[10px] bg-grey-divider px-5 py-6 relative">
        <h2 className="text-title-s">비회원 투표 기회</h2>
        <span className="text-label-m absolute top-6 right-5 text-grey-light">2/5</span>
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary">
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="relative -right-[1px]"
            >
              <path
                d="M3.22883 0.261941C3.29211 0.103738 3.44533 0 3.61572 0H7.71853C8.01333 0 8.21491 0.297744 8.10543 0.571459L5.00041 8.33401H0.61548C0.320679 8.33401 0.119097 8.03627 0.228584 7.76255L3.22883 0.261941Z"
                fill="white"
              />
              <path
                d="M1.89265 16.0973L6.33077 5.00195H12.4256C12.7817 5.00195 12.9737 5.41955 12.742 5.68985L3.45559 16.5232C3.37643 16.6156 3.26086 16.6687 3.13922 16.6687H2.27954C1.98474 16.6687 1.78316 16.371 1.89265 16.0973Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#BEBEDD]">
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="relative -right-[1px]"
            >
              <path
                d="M3.22883 0.261941C3.29211 0.103738 3.44533 0 3.61572 0H7.71853C8.01333 0 8.21491 0.297744 8.10543 0.571459L5.00041 8.33401H0.61548C0.320679 8.33401 0.119097 8.03627 0.228584 7.76255L3.22883 0.261941Z"
                fill="#EBEBF5"
              />
              <path
                d="M1.89265 16.0973L6.33077 5.00195H12.4256C12.7817 5.00195 12.9737 5.41955 12.742 5.68985L3.45559 16.5232C3.37643 16.6156 3.26086 16.6687 3.13922 16.6687H2.27954C1.98474 16.6687 1.78316 16.371 1.89265 16.0973Z"
                fill="#EBEBF5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
