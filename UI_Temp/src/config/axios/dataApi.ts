import axios from "axios";
import { DEMO_AUTH_TOKEN } from "../demoAuth";

export const dataApi = axios.create({
  baseURL: import.meta.env.VITE_DATA_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DEMO_AUTH_TOKEN}`,
  },
});
