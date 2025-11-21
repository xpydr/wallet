
import axios from "axios";

export const URL = "http://localhost:3000/api/v1";

const API = axios.create({
  baseURL: URL,
});

export default API;