export const formatRemainingTime = (endAt: string) => {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return "투표 종료";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}일 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return `${minutes}분 남음`;
};
