import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiURL = ""; //Production url

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// const users = {
//   a1: { name: "Alice", age: 22 },
//   b2: { name: "Bob", age: 28 },
//   c3: { name: "Charlie", age: 25 },
// };

// const fer = Object.entries(users).filter(([key, value]) => value.age > 23);
// console.log(fer);

// const fr = Object.fromEntries(fer);
// console.log(fr);
