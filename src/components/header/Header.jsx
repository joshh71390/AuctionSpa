import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='header'>
      <Link to={''} style={{textDecoration: 'none'}}>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      </Link>
      <div className='nav-container'>
      <button className='login-button'>SIGN IN</button>
      <Link to={'lots'} style={{textDecoration: 'none'}}>
      <h3 className='nav-element'>LOTS</h3>
      </Link>
      <h3 className='nav-element'>OTHER</h3>
      </div>
    </header>
  )
}

export default Header