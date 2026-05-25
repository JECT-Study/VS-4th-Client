import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImageColor } from "../model/types";

export interface SignupDefaults {
  nickname: string;
  imageColor: ImageColor;
}

export const signupDefaultsQueryOptions = () =>
  queryOptions<SignupDefaults>({
    queryKey: ["signup", "defaults"],
    queryFn: () => apiClient.get<SignupDefaults>("/api/users/info").then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
