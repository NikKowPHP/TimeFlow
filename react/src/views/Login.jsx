import React from 'react'
import { Link } from 'react-router-dom';

export default function Login() {
	const onSubmit = (ev) => {
		ev.preventDefault();
	}
	return (
		<div className='login-signup-form animated fadeInDown'>
			<div className="form">
				<form action="" onSubmit={onSubmit}>
					<input type="email" placeholder='Email' />
					<input type="password" placeholder='Password' />
					<button className='btn btn-block'>Sign in</button>
					<p className='message'>
						Not Registered? <Link to='/signup'>Create An Account</Link>
					</p>

				</form>
			</div>
		</div>
	)
}
