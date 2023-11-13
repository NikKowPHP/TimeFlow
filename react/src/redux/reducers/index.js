import { combineReducers } from "redux";
import calendarReducer from "./calendarReducer";
import taskReducer from "./taskReducer";
import { timeReducer } from "./timeReducer";

const rootReducer = combineReducers({
  calendar: calendarReducer,
  tasks: taskReducer,
  time: timeReducer,
});
export default rootReducer;
