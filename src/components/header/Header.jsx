import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className='header'>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      <div className='nav-container'>
      <button className='login-button'>Sign In</button>
      <h3 className='nav-element'>Lots</h3>
      <h3 className='nav-element'>Other</h3>
      </div>
    </header>
  )
}

export default Header