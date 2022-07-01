import React, { useState } from 'react'
import './AuthPage.css'
import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

const AuthPage = () => {
  const [loginViewSelected, setLoginViewSelected] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className='auth-container'>
      <div className="form-container">
      {
        !submitting && 
        <div className="toggle-container">
      <h3 
        className={loginViewSelected ? 'auth-option option-selected' : 'auth-option'}
        onClick={() => setLoginViewSelected(true)}
        >
        Login
        </h3>
      <h3 
       className={!loginViewSelected ? 'auth-option option-selected' : 'auth-option'}
       onClick={() => setLoginViewSelected(false)}
       >
        Register
        </h3>
      </div>
      }
      {loginViewSelected ? 
      <LoginForm submitting={submitting} setSubmitting={setSubmitting}/> : 
      <RegisterForm submitting={submitting} setSubmitting={setSubmitting}/>}
      </div>
    </div>
  )
}

export default AuthPage