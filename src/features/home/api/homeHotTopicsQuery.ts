import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { HotTopicItem } from "../model/home.ts";

interface HomeHotTopicsResponse {
  hotTopics: HotTopicItem[];
}

const getHomeHotTopics = async () => {
  const { data } = await apiClient.get<HomeHotTopicsResponse>("/api/home/hot-topics");
  return data;
};

export const homeHotTopicsQueryOptions = () =>
  queryOptions({
    queryKey: ["home", "hot-topics"] as const,
    queryFn: getHomeHotTopics,
  });

export const useHomeHotTopicsQuery = () => useQuery(homeHotTopicsQueryOptions());
