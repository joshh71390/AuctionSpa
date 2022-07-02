import React from 'react'
import Spinner from '../../../shared/Spinner/Spinner'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth  from '../../../../hooks/useAuth'
import axios from '../../../../apiAccessor/axiosApi';

const LoginForm = ({submitting, setSubmitting}) => {
    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async() => {
        setSubmitting(true);
        
        try {
            const response = await axios.post('/auth/login',
                JSON.stringify({email, password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            signIn(response.data);
            setEmail('');
            setPassword('');
            navigate(from, {replace: true});
        } catch (error) {
            setError('Login failed');
        } finally {
            setSubmitting(false);
        }
    }

  return (
    submitting ? <div className='spinner-container'><Spinner/></div> :
    <form onSubmit={handleSubmit} className="auth-form">
        {error.length !== 0 && <p className='submit-error'>{error}</p>}
        <div className="auth-form-field">
        <label htmlFor="email" className="auth-label">
            Email:
        </label>
        <input 
            type="text"
            className="auth-input"
            onChange={e => setEmail(e.target.value)}
            value={email}
            required
         />
        </div>
        <div className="auth-form-field">
        <label htmlFor="password" className="auth-label">
            Password:
        </label>
        <input 
            type="password" 
            className="auth-input" 
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
        />
        </div>
        <button className="auth-submit-button">Log in</button>
    </form>
  )
}

export default LoginForm