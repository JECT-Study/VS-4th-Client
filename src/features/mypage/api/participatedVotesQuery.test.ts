// @vitest-environment node

import { defaultApi } from "@base/api/defaultApi";
import type { AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getActiveParticipatedVotes, getClosedParticipatedVotes } from "./participatedVotesQuery";

vi.mock("@base/api/defaultApi", () => ({
  defaultApi: {
    getVoteListParticipated: vi.fn(),
    getVoteListEndParticipated: vi.fn(),
    getDetail: vi.fn(),
  },
}));

const axiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: {} },
  }) as AxiosResponse<T>;

describe("participatedVotesQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(defaultApi.getVoteListParticipated).mockResolvedValue(
      axiosResponse({
        count: 1,
        voteList: [{ id: 1, title: "참여한 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" }],
      }),
    );
    vi.mocked(defaultApi.getVoteListEndParticipated).mockResolvedValue(axiosResponse({ count: 0, voteList: [] }));
    vi.mocked(defaultApi.getDetail).mockResolvedValue(axiosResponse({ myVote: { voted: true }, status: "ONGOING" }));
  });

  it("진행중 참여 투표는 참여 투표 전용 API와 정렬 값을 사용한다", async () => {
    await getActiveParticipatedVotes("LATEST");
    await getActiveParticipatedVotes("END_AT");
    await getActiveParticipatedVotes("POPULAR");

    expect(defaultApi.getVoteListParticipated).toHaveBeenNthCalledWith(1, "LATEST");
    expect(defaultApi.getVoteListParticipated).toHaveBeenNthCalledWith(2, "END_AT");
    expect(defaultApi.getVoteListParticipated).toHaveBeenNthCalledWith(3, "POPULAR");
    expect(defaultApi.getVoteListEndParticipated).not.toHaveBeenCalled();
  });

  it("종료 참여 투표는 종료 참여 투표 전용 API와 정렬 값을 사용한다", async () => {
    await getClosedParticipatedVotes("LATEST");
    await getClosedParticipatedVotes("END_AT");

    expect(defaultApi.getVoteListEndParticipated).toHaveBeenNthCalledWith(1, "LATEST");
    expect(defaultApi.getVoteListEndParticipated).toHaveBeenNthCalledWith(2, "END_AT");
    expect(defaultApi.getVoteListParticipated).not.toHaveBeenCalled();
  });

  it("진행중 참여 투표 목록에서 실제 참여하지 않은 투표를 제거한다", async () => {
    vi.mocked(defaultApi.getVoteListParticipated).mockResolvedValue(
      axiosResponse({
        count: 3,
        voteList: [
          { id: 1, title: "참여한 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
          { id: 2, title: "미참여 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
          { id: 3, title: "종료된 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
        ],
      }),
    );
    vi.mocked(defaultApi.getDetail).mockImplementation((voteId) =>
      Promise.resolve(
        axiosResponse(
          voteId === 1
            ? { myVote: { voted: true }, status: "ONGOING" }
            : voteId === 2
              ? { myVote: { voted: false }, status: "ONGOING" }
              : { myVote: { voted: true }, status: "ENDED" },
        ),
      ),
    );

    const result = await getActiveParticipatedVotes("POPULAR");

    expect(result.count).toBe(1);
    expect(result.voteList).toEqual([
      { id: 1, title: "참여한 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
    ]);
    expect(defaultApi.getDetail).toHaveBeenCalledTimes(3);
  });

  it("최신순/종료임박순 응답이 비어 있으면 인기순 응답을 fallback으로 사용하고 선택한 정렬을 적용한다", async () => {
    vi.mocked(defaultApi.getVoteListParticipated)
      .mockResolvedValueOnce(axiosResponse({ count: 0, voteList: [] }))
      .mockResolvedValueOnce(
        axiosResponse({
          count: 2,
          voteList: [
            {
              id: 1,
              title: "이전 투표",
              content: "",
              thumbnailUrl: "",
              localDate: "2026-06-01T00:00:00",
              endAt: "2026-06-05T00:00:00",
            },
            {
              id: 2,
              title: "최신 투표",
              content: "",
              thumbnailUrl: "",
              localDate: "2026-06-03T00:00:00",
              endAt: "2026-06-04T00:00:00",
            },
          ],
        }),
      );
    vi.mocked(defaultApi.getDetail).mockResolvedValue(axiosResponse({ myVote: { voted: true }, status: "ONGOING" }));

    const result = await getActiveParticipatedVotes("LATEST");

    expect(defaultApi.getVoteListParticipated).toHaveBeenNthCalledWith(1, "LATEST");
    expect(defaultApi.getVoteListParticipated).toHaveBeenNthCalledWith(2, "POPULAR");
    expect(result.voteList.map((vote) => vote.id)).toEqual([2, 1]);
  });

  it("종료 참여 투표 목록에서 실제 참여하지 않았거나 진행중인 투표를 제거한다", async () => {
    vi.mocked(defaultApi.getVoteListEndParticipated).mockResolvedValue(
      axiosResponse({
        count: 2,
        voteList: [
          { id: 1, title: "종료 참여 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
          { id: 2, title: "진행중 참여 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
        ],
      }),
    );
    vi.mocked(defaultApi.getDetail).mockImplementation((voteId) =>
      Promise.resolve(
        axiosResponse(
          voteId === 1 ? { myVote: { voted: true }, status: "ENDED" } : { myVote: { voted: true }, status: "ONGOING" },
        ),
      ),
    );

    const result = await getClosedParticipatedVotes("LATEST");

    expect(result.count).toBe(1);
    expect(result.voteList).toEqual([
      { id: 1, title: "종료 참여 투표", content: "", thumbnailUrl: "", localDate: "", endAt: "" },
    ]);
  });
});
