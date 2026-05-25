import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { User } from "../model/types";

export const userQueryOptions = () =>
  queryOptions<User | null>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const r = await defaultApi.getMyProfile();
        return r.data as User;
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 401) return null;
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
