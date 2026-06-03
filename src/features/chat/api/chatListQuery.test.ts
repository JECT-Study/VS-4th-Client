// @vitest-environment node

import { describe, expect, it } from "vitest";
import type { ChatListResponse } from "../model/types";
import { resetChatUnreadCount, sortChatListItems } from "./chatListQuery";

describe("chatListQuery", () => {
  it("최근 메시지 시간 내림차순으로 정렬하고 동일 시간이면 생성일 내림차순으로 정렬한다", () => {
    const chats = [
      {
        voteId: 1,
        title: "older message",
        thumbnailUrl: "",
        optionA: "",
        optionB: "",
        participantCount: 1,
        lastMessage: "",
        lastMessageAt: "2026-06-04T09:00:00Z",
        createdAt: "2026-06-04T12:00:00Z",
        endAt: "",
        unreadCount: 0,
      },
      {
        voteId: 2,
        title: "same message newer created",
        thumbnailUrl: "",
        optionA: "",
        optionB: "",
        participantCount: 1,
        lastMessage: "",
        lastMessageAt: "2026-06-04T10:00:00Z",
        createdAt: "2026-06-04T12:00:00Z",
        endAt: "",
        unreadCount: 0,
      },
      {
        voteId: 3,
        title: "same message older created",
        thumbnailUrl: "",
        optionA: "",
        optionB: "",
        participantCount: 1,
        lastMessage: "",
        lastMessageAt: "2026-06-04T10:00:00Z",
        createdAt: "2026-06-04T11:00:00Z",
        endAt: "",
        unreadCount: 0,
      },
    ];

    expect(sortChatListItems(chats).map((chat) => chat.voteId)).toEqual([2, 3, 1]);
  });

  it("읽음 처리된 채팅방의 unreadCount만 0으로 보정한다", () => {
    const data: ChatListResponse = {
      chats: [
        {
          voteId: 1,
          title: "",
          thumbnailUrl: "",
          optionA: "",
          optionB: "",
          participantCount: 1,
          lastMessage: "",
          lastMessageAt: "",
          endAt: "",
          unreadCount: 5,
        },
        {
          voteId: 2,
          title: "",
          thumbnailUrl: "",
          optionA: "",
          optionB: "",
          participantCount: 1,
          lastMessage: "",
          lastMessageAt: "",
          endAt: "",
          unreadCount: 3,
        },
      ],
    };

    expect(resetChatUnreadCount(data, 1)?.chats.map((chat) => chat.unreadCount)).toEqual([0, 3]);
  });
});
