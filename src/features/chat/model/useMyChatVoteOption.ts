import { voteDetailQueryOptions } from "@features/votes/api/voteDetailQuery";
import { useQuery } from "@tanstack/react-query";
import { resolveMyChatSelectedOption } from "./chatVoteOption";

export function useMyChatVoteOption(voteId: number, optionA: string, optionB: string) {
  const voteDetailQuery = useQuery({
    ...voteDetailQueryOptions(String(voteId)),
    enabled: Number.isFinite(voteId),
  });

  return {
    selectedOption: resolveMyChatSelectedOption(voteDetailQuery.data, optionA, optionB),
    isLoading: voteDetailQuery.isLoading,
  };
}
