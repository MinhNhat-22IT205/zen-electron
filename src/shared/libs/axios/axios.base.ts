import axios from "axios";
import { AXIOS_BASE_URL } from "../../constants/base-paths";

const http = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

export default http;
