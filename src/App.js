import MainScreen from './components/MainScreen';
import Login from './views/login';
import Profile from './views/profile';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Failed to fetch config:", error);
        setError(error.message);
      }
    };

    fetchConfig();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if(!config) {
    return <div>로딩중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login config={config} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<MainScreen config={config} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
