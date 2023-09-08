import { useLocation, useNavigate } from "react-router-dom";

export function useLocationState() {
  const location = useLocation();
  const navigate = useNavigate();

  function setPreviousRoute() {
    navigate(location.pathname, {
      state: { previousRoute: location.pathname },
    });
  }

  function goBack() {
    const previousRoute = location.state?.previousRoute || "/calendar";
    navigate(previousRoute);
  }
	function navigateTo(route) {
		navigate(route);
	}

  return { setPreviousRoute, goBack, navigateTo };
}
