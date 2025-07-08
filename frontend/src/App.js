import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/test`)

      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error(err);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Frontend Connected to Backend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
