import { UPDATE_CURRENT_TIME } from "./actionTypes";

export const updateCurrentTime = (currentTime) => ({
  type: UPDATE_CURRENT_TIME,
  payload: currentTime,
});