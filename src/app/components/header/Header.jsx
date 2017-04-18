import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
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
          <Link to="/entries">Entries</Link>
        </li>
        <li>
          <Link to="/results">Results</Link>
        </li>
        <li>
          <Link to="/call-home">Call Schedule</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
