import { WINDOW_RESIZE } from "../actions/actionTypes";
const initialState = {
	isMobileLayout: false,

}
const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case WINDOW_RESIZE:
			return {
				...state,
				isMobileLayout: action.payload,
			}
		default:
			return state;
	}

}

export default appReducer;