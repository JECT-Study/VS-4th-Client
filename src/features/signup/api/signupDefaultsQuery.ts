import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImageColor } from "../model/types";

export const nicknameSuggestQueryOptions = () =>
  queryOptions<{ nickname: string }>({
    queryKey: ["signup", "nickname", "suggest"],
    queryFn: () => apiClient.get<{ nickname: string }>("/api/users/nickname/suggest").then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const imageColorSuggestQueryOptions = () =>
  queryOptions<{ imageColor: ImageColor }>({
    queryKey: ["signup", "imagecolor", "suggest"],
    queryFn: () => apiClient.get<{ imageColor: ImageColor }>("/api/users/imagecolor/suggest").then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
