import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import HomePage from './components/HomePage';
import MathTask from './components/MathTask';
import StroopTask from './components/StroopTask';
import CaptchaTask from './components/CaptchaTask';
import CompletionPage from './components/CompletionPage';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/math" element={<MathTask />} />
            <Route path="/stroop" element={<StroopTask />} />
            <Route path="/captcha" element={<CaptchaTask />} />
            <Route path="/complete" element={<CompletionPage />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
