import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3004",
  timeout: 5000,
});

// 缓存实现
const cache = {
  data: {},
  get(key) {
    const item = this.data[key];
    if (item && Date.now() - item.timestamp < 300000) {
      // 5分钟缓存
      return item.data;
    }
    return null;
  },
  set(key, data) {
    this.data[key] = {
      data,
      timestamp: Date.now(),
    };
  },
};

// 请求拦截器
api.interceptors.request.use((config) => {
  if (config.method === "get") {
    const cachedData = cache.get(config.url);
    if (cachedData) {
      config.adapter = () => {
        return Promise.resolve({
          data: cachedData,
          status: 200,
          config,
        });
      };
    }
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    if (response.config.method === "get") {
      cache.set(response.config.url, response.data);
    }
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default {
  async getEnergySettings() {
    try {
      const response = await api.get("/energySettings");
      return response;
    } catch (error) {
      console.error("获取能耗设置失败:", error);
      throw error;
    }
  },
  async getBuildings() {
    try {
      return await api.get("/buildings");
    } catch (error) {
      console.error("获取建筑数据失败:", error);
      throw error;
    }
  },
  async getBuilding(id) {
    try {
      // 使用已创建的api实例
      const response = await api.get(`/buildings/${id}`);
      return response;
    } catch (error) {
      console.error("获取建筑详情失败:", error);
      throw error;
    }
  },
};
/*  */
