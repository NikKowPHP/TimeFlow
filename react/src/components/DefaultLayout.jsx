import React from 'react'
import {useStateContext} from '../contexts/ContextProvider'
import { Navigate, Outlet } from 'react-router-dom'

function DefaultLayout() {
	const {user, token} = useStateContext();
	if(!token) {
		return <Navigate to='/login' />
	}
	return (
		<>
		<Outlet />

		</>
	)
}

export default DefaultLayout