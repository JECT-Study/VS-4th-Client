import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { RecommendationItem } from "../model/home.ts";

interface HomeRecommendationsResponse {
  recommendations: RecommendationItem[];
}

const getHomeRecommendations = async () => {
  const { data } = await apiClient.get<HomeRecommendationsResponse>("/api/home/recommendations");
  return data;
};

export const homeRecommendationsQueryOptions = () =>
  queryOptions({
    queryKey: ["home", "recommendations"] as const,
    queryFn: getHomeRecommendations,
  });

export const useHomeRecommendationsQuery = () => useQuery(homeRecommendationsQueryOptions());
