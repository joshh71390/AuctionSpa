import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return ( location.pathname === '/auth' ? <></> :
    <header className='header'>
      <Link to={''} style={{textDecoration: 'none'}}>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      </Link>
      <div className='nav-container'>
      <Link to={'/auth'}>
      <button className='login-button'>{auth.username ? `Hi, ${auth.username}` : 'SIGN IN'}</button>
      </Link>
      <Link to={'lots'} style={{textDecoration: 'none'}}>
      <h3 className='nav-element'>LOTS</h3>
      </Link>
      </div>
    </header>
  )
}

export default Header