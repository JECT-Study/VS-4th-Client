import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.vs.io.kr",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
