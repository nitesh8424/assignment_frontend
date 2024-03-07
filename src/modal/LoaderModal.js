import React from 'react';
import './modal.css';

const Loader = () => {
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: '2', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span className="loader"></span>
    </div>
  );
}

export default Loader;
