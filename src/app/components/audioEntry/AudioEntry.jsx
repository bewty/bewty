import React from 'react';

var AudioEntry = () => {
  return (
    <div className="container">
      <h1>Audio Entry</h1>
      <audio controls>
        <source src="horse.ogg" type="audio/ogg"></source>
      </audio>
      <div>
        <button>Record</button>
        <button>Stop</button>
        <button>Upload</button>
      </div>

    </div>
  );
};

export default AudioEntry;
