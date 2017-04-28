import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav>
      <div className='brand-logo'>
        <Link to='/'><h1>Mind Fits</h1></Link>
      </div>
      <div className='links'>
        <Link to='/login' className='login-btn'>LOGIN</Link>
      </div>
    </nav>
  </header>
);

export default Header;
