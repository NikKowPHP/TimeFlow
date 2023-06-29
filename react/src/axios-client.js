import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

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
        console.error("Validation errors:", data.errors);
      } else {
        toast.error("An error occurred");
      }
    } else {
			toast.error('Request failed');
		}
		throw error;
  });

export default axiosClient;
