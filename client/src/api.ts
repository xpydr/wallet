
import axios from "axios";

export const URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const API = axios.create({
  baseURL: URL,
});

export default API;