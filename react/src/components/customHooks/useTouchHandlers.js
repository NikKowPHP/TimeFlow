import React, { useRef } from "react";
const useTouchHandlers = (
	swipeLeftAction,
	swipeRightAction,
	sensitivityThreshold = 80,
	minSwipe = 15,
) => {

	const touchStart = useRef(0);
	const touchEnd = useRef(0);
	const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEnd.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchEnd.current >= minSwipe) {
      const difference = touchEnd.current - touchStart.current;
      if (Math.abs(difference) >= sensitivityThreshold) {
        touchEnd.current = 0;
        if (difference > 0) {
          swipeLeftAction();
        } else {
          swipeRightAction();
        }
      }
    }
  };
	return { handleTouchStart, handleTouchMove, handleTouchEnd}

};
export default useTouchHandlers;
