import { combineReducers } from "redux";
import calendarReducer from "./calendarReducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
  calendar: calendarReducer,
  tasks: taskReducer
});
export default rootReducer;
