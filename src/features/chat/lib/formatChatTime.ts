export const formatRemainingTime = (endAt: string) => {
  const endTime = new Date(endAt).getTime();
  const now = Date.now();
  const diff = endTime - now;

  if (diff <= 0) {
    return "투표 종료";
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}일 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 남음`;
  }

  return `${minutes}분 남음`;
};

export const formatTimeLabel = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
