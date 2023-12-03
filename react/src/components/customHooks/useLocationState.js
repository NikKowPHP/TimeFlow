import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useLocationState() {
  const location = useLocation();
  const navigate = useNavigate();

  const [previousLocation, setPreviousLocation] = useState(location.pathname);
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  useEffect(() => {
    if (currentLocation !== location.pathname) {
      setPreviousLocation(currentLocation);
      setCurrentLocation(location.pathname);
    }
  }, [location.pathname, currentLocation]);

  const goBack = () => {
    navigate(-1);
  };

  return {
    previousLocation: previousLocation,
    navigate,
    goBack,
    currentLocation,
  };
}
