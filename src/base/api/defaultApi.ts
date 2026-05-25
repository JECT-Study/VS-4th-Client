import { DefaultApi } from "@ject-4-vs-team/api-client";
import { apiClient } from "./client";

export const defaultApi = new DefaultApi(undefined, undefined, apiClient);
