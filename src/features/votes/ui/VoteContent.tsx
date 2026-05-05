import dayjs from "dayjs";

interface VoteContentProps {
  title: string | undefined;
  createdAt: string | undefined;
  content: string | undefined;
  thumbnailUrl: string | null | undefined;
}

export function VoteContent({ title, createdAt, content, thumbnailUrl }: VoteContentProps) {
  return (
    <>
      <h2 className="text-h-s">{title}</h2>
      <div className="text-label-m text-grey-purple mt-2">{dayjs(createdAt).format("YYYY.MM.DD HH:mm")}</div>
      <p className="text-grey-dark text-body-s my-5">{content}</p>
      {thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : <div className="w-full aspect-[320/195] bg-[#A3A3A3]" />}
    </>
  );
}
