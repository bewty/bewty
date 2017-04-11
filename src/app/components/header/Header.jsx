import React from 'react';
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/text-entry">Text</Link>
          </li>          
          <li>
            <Link to="/audio-entry">Audio</Link>
          </li>
          <li>
            <Link to="/video-entry">Video</Link>
          </li>          
          <li>
            <Link to="/results">Results</Link>
          </li>
          <li>
            <Link to="/call-schedule">Call Schedule</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
