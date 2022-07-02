import React, { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { currentUser, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  return ( location.pathname === '/auth' ? <></> :
    <header className='header'>
      <Link to={''} style={{textDecoration: 'none'}}>
      <h3 className='logo-text'>Trade<span className='colored'>Me</span></h3>
      </Link>
      <div className='nav-container'>
      {
        currentUser ? 
        <div className="user-navigate" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {`Hi, ${currentUser.name}`}
          {
            dropdownOpen &&
            <ul className="dropdown">
              <li className="dropdown-item" style={{'fontSize': '0.8rem'}}>Profile</li>
              <li 
                className="dropdown-item"
                style={{'fontSize': '0.8rem'}}
                onClick={signOut}
              >
                SignOut
              </li>
            </ul>
          }
        </div> 
        : 
        <Link to={'/auth'}>
        <button className='login-button'>SIGN IN</button>
        </Link>
      }
      <Link to={'lots'} style={{textDecoration: 'none'}}>
      <h3 className='nav-element'>LOTS</h3>
      </Link>
      </div>
    </header>
  )
}

export default Header