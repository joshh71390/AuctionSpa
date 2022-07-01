import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  console.log(location.pathname);
  return ( location.pathname === '/auth' ? <></> :
    <header className='header'>
      <Link to={''} style={{textDecoration: 'none'}}>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      </Link>
      <div className='nav-container'>
      <button className='login-button'>SIGN IN</button>
      <Link to={'lots'} style={{textDecoration: 'none'}}>
      <h3 className='nav-element'>LOTS</h3>
      </Link>
      </div>
    </header>
  )
}

export default Header