import { useLocation, useNavigate } from "react-router-dom";


export function useLocationState() {

  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = location.state?.previousLocation || '/calendar';

  const goBack = () => {
    navigate(previousLocation);
  }

	return { previousLocation: previousLocation, navigate, goBack }


}
