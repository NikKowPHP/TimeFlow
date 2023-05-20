import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const {setUser, setToken} = useStateContext();
	const  [errors, setErrors] = useState(null)

	const onSubmit = (ev) => {
		ev.preventDefault();
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value
		}
		axiosClient.post('/login', payload)
		.then(({data}) => {
			setUser(data.user)
			setToken(data.token)
		})
		.catch(err => {
			const response = err.response;
			if(response && response.status === 422) {
				setErrors(response.data.errors);
			}
		})
	}
	return (
		<div className='login-signup-form animated fadeInDown'>
			<div className="form">
				<form action="" onSubmit={onSubmit}>
					<h1 className='title'>Login into your account</h1>
					{
						errors && <div className="alert">
							{
								Object.keys(errors).map(key => (
									<p key={key}>{errors[key][0]}</p>
								))
							}
						</div>
					}
					<input type="email" ref={emailRef} placeholder='Email' />
					<input type="password" ref={passwordRef} placeholder='Password' />
					<button className='btn btn-block'>Sign in</button>
					<p className='message'>
						Not Registered? <Link to='/signup'>Create an account</Link>
					</p>
				</form>
			</div>
		</div>
	)
}
