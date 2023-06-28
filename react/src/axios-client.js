import axios from "axios";
import { useStateContext } from "./contexts/ContextProvider";

const {setNotification} = useStateContext();

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
        setNotification("Unathorized request");
      } else if (status === 422) {
        toast.error(data.message);
        console.error("Validation errors:", data.errors);
      } else {
        setNotification("An error occurred");
      }
    } else {
      setNotification("Request failed")
		}
		throw error;
  });

export default axiosClient;
