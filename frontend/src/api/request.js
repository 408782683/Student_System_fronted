import axios from "axios";
import { ElMessage } from "element-plus";

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data && data.code !== 0) {
      ElMessage.error(data.message || "请求失败");
      return Promise.reject(data);
    }
    return data;
  },
  (error) => {
    ElMessage.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

export default service;
