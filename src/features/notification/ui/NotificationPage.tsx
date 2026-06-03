import { Spinner } from "@base/ui/Spinner";
import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useReadAllNotificationsMutation, useReadNotificationMutation } from "../api/notificationMutations";
import { useNotificationListQuery } from "../api/notificationQueries";
import type { NotificationItem } from "../model/types";
import { NotificationAuthRequiredModal } from "./NotificationAuthRequiredModal";
import { NotificationList } from "./NotificationList";

export function NotificationPage() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: user, isPending: isUserPending } = useQuery(userQueryOptions());
  const notificationListQuery = useNotificationListQuery(!!user);
  const readNotificationMutation = useReadNotificationMutation();
  const readAllNotificationsMutation = useReadAllNotificationsMutation();

  const notifications = useMemo(
    () => notificationListQuery.data?.pages.flatMap((page) => page.notifications) ?? [],
    [notificationListQuery.data?.pages],
  );

  useEffect(() => {
    if (!isUserPending && !user) setIsAuthModalOpen(true);
  }, [isUserPending, user]);

  useEffect(() => {
    if (
      notificationListQuery.error &&
      isAxiosError(notificationListQuery.error) &&
      notificationListQuery.error.response?.status === 401
    ) {
      setIsAuthModalOpen(true);
    }
  }, [notificationListQuery.error]);

  useEffect(() => {
    const handleScroll = () => {
      const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (distanceFromBottom > 400 || !notificationListQuery.hasNextPage || notificationListQuery.isFetchingNextPage)
        return;
      notificationListQuery.fetchNextPage();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [notificationListQuery]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate({ to: "/home" });
  };

  const handleReadAll = () => {
    readAllNotificationsMutation.mutate(undefined, {
      onError: () => showToast.warning("알림을 읽음 처리하지 못했어요."),
    });
  };

  const handleClickItem = async (item: NotificationItem) => {
    try {
      if (!item.isRead) await readNotificationMutation.mutateAsync(item.notificationId);
      if (item.voteId > 0) navigate({ to: `/votes/${item.voteId}` });
    } catch {
      showToast.warning("알림을 읽음 처리하지 못했어요.");
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    navigate({ to: "/home" });
  };

  const isLoading = isUserPending || (!!user && notificationListQuery.isLoading);
  const isError = !!user && notificationListQuery.isError;

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="sticky top-0 z-20 flex h-14 items-center border-b border-grey-stroke bg-white px-5">
        <button type="button" onClick={handleGoBack} className="-ml-2 p-2">
          <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" className="h-6 w-6" />
        </button>
        <h1 className="ml-2 font-bold text-title-m">알림</h1>
      </header>

      <div className="flex-1 pb-20">
        {isLoading && (
          <div className="flex py-32 justify-center">
            <Spinner />
          </div>
        )}

        {isError && !isAuthModalOpen && (
          <div className="py-10 text-center text-label-m text-grey-light">알림을 불러오지 못했습니다.</div>
        )}

        {!isLoading && !isError && user && (
          <NotificationList notifications={notifications} onReadAll={handleReadAll} onClickItem={handleClickItem} />
        )}
      </div>

      <NotificationAuthRequiredModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </main>
  );
}
