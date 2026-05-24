import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL|| "http://localhost:5000/api", // or process.env.REACT_APP_API_URL for CRA
  withCredentials: true,
});
