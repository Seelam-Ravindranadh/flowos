import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export default api;