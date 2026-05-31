import { defaultApi } from "@base/api/defaultApi";

export async function logout(): Promise<void> {
  await defaultApi.logout();
}
