import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const goToLots = () => navigate("/lots");

  return (
    <header className='header'>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      <div className='nav-container'>
      <button className='login-button'>SIGN IN</button>
      <h3 className='nav-element' onClick={goToLots}>LOTS</h3>
      <h3 className='nav-element'>OTHER</h3>
      </div>
    </header>
  )
}

export default Header