import { UPDATE_CURRENT_TIME } from "../actions/actionTypes";

const initialState = {
  currentTime: new Date(),
};

export const timeReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };
    default:
      return state;
  }
};
