import { createContext, useContext, useState } from "react";

const StateContext = createContext({
	user: null,
	token: null,
	notification: null,
	setUser: () => {},
	setToken: () => {},
	setNotification: () => {},
	setErrors: () => {},
});

export const ContextProvider = ({children}) => {
	const [user, setUser] = useState({});
	const [notification, _setNotification] = useState('');
	const [errors, _setErrors] = useState({});
	const [token, _setToken]= useState(localStorage.getItem('ACCESS_TOKEN'));

	const setNotification = (message) => {
		_setNotification(message);
		setTimeout(() => {
			_setNotification('');
		}, 3000)
	}
	const setErrors = (message, errors) => {
		_setErrors(message, errors);
		setTimeout(() => {
			_setErrors({});
		}, 3000)
	}

	const setToken = (token) => {
		_setToken(token);
		if(token) {
			localStorage.setItem('ACCESS_TOKEN', token);
		} else {
			localStorage.removeItem('ACCESS_TOKEN');
		}
	}

	return (
		<StateContext.Provider value={{
			user,
			token,
			setUser,
			setToken,
			notification,
			setNotification,
			errors,
			setErrors

		}}>
			{children}
			

		</StateContext.Provider>
	)
}
export const useStateContext = () => useContext(StateContext)