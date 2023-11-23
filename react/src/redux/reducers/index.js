import { combineReducers } from "redux";
import calendarReducer from "./calendarReducer";
import taskReducer from "./taskReducer";
import { timeReducer } from "./timeReducer";
import appReducer from "./appReducer";

const rootReducer = combineReducers({
  app: appReducer,
  calendar: calendarReducer,
  tasks: taskReducer,
  time: timeReducer,
});
export default rootReducer;
