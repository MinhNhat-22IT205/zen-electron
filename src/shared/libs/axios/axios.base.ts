import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001/v1",
  timeout: 6000,
  withCredentials: true,
});

export default http;
