import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MathTask from './pages/MathTask';
import StroopTask from './pages/StroopTask';
import CaptchaTask from './pages/CaptchaTask';
import CompletionPage from './pages/CompletionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/math-task" element={<MathTask />} />
          <Route path="/stroop-task" element={<StroopTask />} />
          <Route path="/captcha-task" element={<CaptchaTask />} />
          <Route path="/completion" element={<CompletionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;