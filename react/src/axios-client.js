import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../config.mjs";

const axiosClient = axios.create({
  baseURL: `${baseURL}/api`,
});
axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        localStorage.removeItem("ACCESS_TOKEN");
        toast.error("Unathorized request");
      } else if (status === 422) {
        toast.error(data.message);
      }else if (status === 500) {
        console.error('internal server errors', data);
      }
       else {
        console.log('there is no data from server')
      }
    } else {
			toast.error('Request failed');
		}
		throw error;
  });

export default axiosClient;
