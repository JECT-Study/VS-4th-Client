import { apiClient } from "@base/api/client";

export async function logout(): Promise<void> {
  await apiClient.post("/api/users/logout");
}
