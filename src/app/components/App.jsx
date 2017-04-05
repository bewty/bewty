import React, { PropTypes } from 'react';

function App({ children }) {
  return (
    <div className="container">
      <h1>Home</h1>
    </div>
  );
}

App.propTypes = { children: PropTypes.object };

export default App;
