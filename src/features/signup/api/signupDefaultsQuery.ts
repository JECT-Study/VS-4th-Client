import { queryOptions } from "@tanstack/react-query";
import type { ImageColor } from "../model/types";

export interface SignupDefaults {
  nickname: string;
  imageColor: ImageColor;
}

/* MOCK_START */
const MOCK_DEFAULTS: SignupDefaults = {
  nickname: "아리아나그란데사이즈",
  imageColor: "GREEN",
};
/* MOCK_END */

export const signupDefaultsQueryOptions = () =>
  queryOptions<SignupDefaults>({
    queryKey: ["signup", "defaults"],
    queryFn: async () => {
      /* MOCK_START */
      return MOCK_DEFAULTS;
      /* MOCK_END */
      // return apiClient.get<SignupDefaults>("/api/users/info").then((r) => r.data);
    },
    staleTime: 1000 * 60 * 5,
  });
