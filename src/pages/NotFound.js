import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate('/');
    }
  }, [count, navigate]);

  return (
    <div>

    <div style={{ position: 'fixed', width:'100%', display: 'flex', margin: 'auto', textAlign:'center', flexDirection:'column', justifyContent: 'center' }}>
      <h2> Page Not Found </h2>
      <p> Redirecting to Home Page in {count} Seconds....</p>
    </div>
    </div>
  );
}

export default NotFound;