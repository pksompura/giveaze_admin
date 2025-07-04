import axios from "axios";
import { setAccessToken } from "../slices/authSlice";

const axiosInstance = axios.create({
  // baseURL: `https://devaseva.onrender.com/api`,
  // baseURL: `http://localhost:5001/api`,
  // baseURL: `http://88.222.214.214:3001/api`,
  // baseURL: `https://88.222.214.214/api/api`,
  baseURL: `https://giveaze.com/api/api`, // ✅ No more `/api/api` or IP

  // baseURL: `https://temple-donation.onrender.com/api`,
  headers: {
    accept: `application/json`,
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Include cookies in requests
});

const setUpInterceptors = (getState, dispatch) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token && config.url !== "/auth/session") {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "auth/login" && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const { data } = await axiosInstance.get("/auth/session", {
              withCredentials: true,
            });

            dispatch(setAccessToken(data?.data?.access_token));
            return axiosInstance(originalConfig);
          } catch (_error) {
            dispatch(setAccessToken(null));
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};

const axiosBaseQuery =
  () =>
  async (
    { url, method, body, params, ...requestOpts },
    { getState, dispatch }
  ) => {
    setUpInterceptors(getState, dispatch);
    try {
      const axiosOptions = {
        url: url,
        method,
        data: body,
        params,
        headers: requestOpts.headers,
      };

      if (/^(auth\/)/.test(url)) {
        axiosOptions["withCredentials"] = true;
      }
      const result = await axiosInstance(axiosOptions);
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
export default axiosBaseQuery();
