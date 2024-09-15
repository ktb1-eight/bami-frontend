import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import ShortTermMap from './components/ShortTermMap';
import Login from './views/login';
import Profile from './views/profile';
import LongTrip from './views/longTrip';
import LongRecommendationResult from './views/longRecommendationResult';
import './App.css';
import ShortTravelPlanner from './components/ShortTravelPlanner';
import GenderAgeSelector from './components/GenderAgeSelector';
import RecommendationPage from './components/RecommendationPage';
import TravelDetailPage from './components/TravelDetailPage';
import MyTravel from './views/myTravel';

function App() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_PROXY + '/api/config');
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

  if (!config) {
    return <div>로딩중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/myTravel' element={<MyTravel />} />
          <Route path="/longstays/recommendations" element={<LongRecommendationResult />} />
          <Route path="/longTrip" element={<LongTrip />} />
          <Route path="/login" element={<Login config={config} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<MainScreen />} />
          <Route path="/short-term" element={<ShortTermMap />} />
          <Route path="/travel-planner" element={<ShortTravelPlanner />} />
          <Route path="/travel-selectInfo" element={<GenderAgeSelector />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/travel-detail" element={<TravelDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;