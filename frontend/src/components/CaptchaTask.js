import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { imageCaptchaChallengesWithImages } from '../data/imageCaptchaChallenges';
import { ValidationService } from '../services/ValidationService';
import { UserInteractionBlocker } from '../utils/userInteractionBlocker';
import Timer from './Timer';
import ProgressTracker from './ProgressTracker';

const CaptchaTask = () => {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(null);
  const inputRef = useRef(null);

  const currentChallenge = imageCaptchaChallengesWithImages[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex >= imageCaptchaChallengesWithImages.length - 1;

  // Initialize task when component mounts
  useEffect(() => {
    // Start the captcha task in session
    actions.startTask('captcha');
    
    // Enable interaction blocking
    UserInteractionBlocker.enableBlocking();
    
    // Start first challenge
    startChallenge();

    // Cleanup on unmount
    return () => {
      UserInteractionBlocker.disableBlocking();
    };
  }, []);

  // Update session progress when challenge changes and start new challenge
  useEffect(() => {
    actions.updateProgress('captcha', currentChallengeIndex);
    if (currentChallengeIndex > 0) { // Don't call startChallenge on initial load
      startChallenge();
    }
  }, [currentChallengeIndex]);

  // Focus input when challenge changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChallengeIndex]);

  const startChallenge = () => {
    setChallengeStartTime(Date.now());
    setIsTimerActive(true);
    setUserResponse('');
    setFeedback({ show: false, isCorrect: false, message: '' });
    
    // Focus input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    
    if (!userResponse.trim()) {
      return;
    }

    const responseTime = Date.now() - challengeStartTime;
    const isCorrect = ValidationService.validateCaptchaResponse(currentChallenge, userResponse);
    
    // Record the response
    const challengeData = {
      questionId: currentChallenge.id,
      question: `Image CAPTCHA: ${currentChallenge.filename}`,
      correctAnswer: currentChallenge.answer,
      userAnswer: userResponse.trim(),
      isCorrect,
      responseTime,
      timedOut: false
    };

    actions.recordResponse('captcha', challengeData);

    if (isCorrect) {
      setFeedback({
        show: true,
        isCorrect: true,
        message: 'Correct!'
      });
      
      // Stop timer and move to next challenge after short delay
      setIsTimerActive(false);
      setTimeout(() => {
        moveToNextChallenge();
      }, 1000);
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Incorrect. Try again!'
      });
      
      // Clear the input but don't advance
      setUserResponse('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleTimerExpire = () => {
    setIsTimerActive(false);
    
    // Record timeout response if user hasn't answered correctly yet
    if (!feedback.isCorrect) {
      const responseTime = Date.now() - challengeStartTime;
      const challengeData = {
        questionId: currentChallenge.id,
        question: `Image CAPTCHA: ${currentChallenge.filename}`,
        correctAnswer: currentChallenge.answer,
        userAnswer: userResponse.trim() || '',
        isCorrect: false,
        responseTime,
        timedOut: true
      };

      actions.recordResponse('captcha', challengeData);

      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Time\'s up! Moving to next challenge...'
      });
    }

    // Move to next challenge after showing timeout message
    setTimeout(() => {
      moveToNextChallenge();
    }, 1500);
  };

  const moveToNextChallenge = () => {
    setIsTimerActive(false); // Stop current timer
    
    if (isLastChallenge) {
      // Complete the captcha task
      actions.completeTask('captcha');
      navigate('/complete');
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
      // startChallenge will be called by useEffect when currentChallengeIndex changes
    }
  };

  const handleInputChange = (e) => {
    setUserResponse(e.target.value);
    
    // Clear feedback when user starts typing again
    if (feedback.show && !feedback.isCorrect) {
      setFeedback({ show: false, isCorrect: false, message: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleResponseSubmit(e);
    }
  };

  // Render image-based CAPTCHA challenge
  const renderChallenge = () => {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">Enter the CAPTCHA:</p>
          <div className="bg-white rounded-lg p-8 shadow-inner mx-auto" style={{ maxWidth: '500px' }}>
            <img 
              src={currentChallenge.image} 
              alt="CAPTCHA Challenge"
              className="w-full h-auto no-select mx-auto"
              style={{ 
                minHeight: '200px',
                maxHeight: '300px',
                objectFit: 'contain',
                imageRendering: 'crisp-edges',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    );
  };

  const getChallengeTypeIcon = () => {
    return (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 task-content">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CAPTCHA Task</h1>
          <p className="text-gray-600">
            Solve each challenge correctly to advance. You have 15 seconds per challenge.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-2xl mx-auto mb-8">
          <ProgressTracker
            current={currentChallengeIndex + 1}
            total={imageCaptchaChallengesWithImages.length}
            taskName="CAPTCHA Challenges"
            variant="warning"
          />
        </div>

        {/* Main Task Area */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Timer */}
            <div className="flex justify-center mb-8">
              <Timer
                key={`captcha-timer-${currentChallengeIndex}`}
                duration={15}
                isActive={isTimerActive}
                onExpire={handleTimerExpire}
                size="large"
                showProgress={true}
              />
            </div>

            {/* Challenge Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {getChallengeTypeIcon()}
                <h2 className="text-2xl font-semibold text-gray-900">
                  Challenge {currentChallengeIndex + 1}
                </h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Image Recognition
                </span>
              </div>
            </div>

            {/* Challenge Display */}
            {renderChallenge()}

            {/* Response Input */}
            <div className="text-center mb-8">
              <form onSubmit={handleResponseSubmit} className="space-y-4">
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userResponse}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter the CAPTCHA"
                    className="w-full max-w-xs mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    disabled={!isTimerActive || feedback.isCorrect}
                    autoComplete="off"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!userResponse.trim() || !isTimerActive || feedback.isCorrect}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Response
                </button>
              </form>

              {/* Feedback */}
              {feedback.show && (
                <div className={`mt-6 p-4 rounded-lg ${
                  feedback.isCorrect 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {feedback.isCorrect ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{feedback.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-500 mt-8">
              <div className="space-y-2">
                <p>Enter the exact characters you see in the CAPTCHA image above</p>
                <p><strong>Note:</strong> Characters are case-sensitive</p>
                <p>Enter your answer and press Enter or click Submit</p>
                <p>You must answer correctly to proceed to the next challenge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Task: CAPTCHA Challenges</span>
              <span>Time per challenge: 15 seconds</span>
              <span>Progress: {currentChallengeIndex + 1}/{imageCaptchaChallengesWithImages.length}</span>
            </div>
          </div>
        </div>

        {/* Challenge Type Info */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="rounded-lg p-4 bg-purple-50 border border-purple-200">
            <div className="flex items-center space-x-3">
              {getChallengeTypeIcon()}
              <div>
                <h3 className="font-semibold text-purple-900">
                  Image Recognition Challenge
                </h3>
                <p className="text-sm text-purple-700">
                  Identify and type the exact characters shown in the CAPTCHA image
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptchaTask;