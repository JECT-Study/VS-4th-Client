import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.vs.io.kr";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10_000,
});
