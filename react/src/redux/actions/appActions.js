import { WINDOW_RESIZE } from "./actionTypes";

export const windowResize = (isMobile) =>({
	type: WINDOW_RESIZE,
	payload: isMobile

})