import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { mathQuestions } from '../data/mathQuestions';
import { ValidationService } from '../services/ValidationService';
import { UserInteractionBlocker } from '../utils/userInteractionBlocker';
import Timer from './Timer';
import ProgressTracker from './ProgressTracker';

const MathTask = () => {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  
  // Core penalty system state
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false); // Track if current question has incorrect attempts
  const [penaltyActive, setPenaltyActive] = useState(false); // Track if penalty should be applied to current question
  const [currentQuestionTime, setCurrentQuestionTime] = useState(60); // Current question's time limit
  
  const inputRef = useRef(null);
  
  const currentQuestion = mathQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= mathQuestions.length - 1;

  // Refresh prevention functionality
  useEffect(() => {
    // Prevent keyboard shortcuts (F5, Ctrl+R, Cmd+R)
    const handleKeyDown = (event) => {
      // F5 key
      if (event.key === 'F5') {
        event.preventDefault();
        return false;
      }
      
      // Ctrl+R or Cmd+R
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        return false;
      }
    };

    // Prevent browser reload via UI (reload button, etc.)
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome
      return ''; // Required for some browsers
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  useEffect(() => {
    actions.startTask('math');
    UserInteractionBlocker.enableBlocking();
    startQuestion();
    return () => {
      UserInteractionBlocker.disableBlocking();
    };
  }, []);

  useEffect(() => {
    actions.updateProgress('math', currentQuestionIndex);
    if (currentQuestionIndex > 0) { 
      startQuestion();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  const startQuestion = () => {
    // Determine time for current question based on penalty status
    const timeForThisQuestion = penaltyActive ? 50 : 60;
    setCurrentQuestionTime(timeForThisQuestion);
    
    setQuestionStartTime(Date.now());
    setIsTimerActive(true);
    setUserAnswer('');
    setFeedback({ show: false, isCorrect: false, message: '' });
    setHasIncorrectAttempt(false); // Reset for new question
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      return;
    }

    const responseTime = Date.now() - questionStartTime;
    const isCorrect = ValidationService.validateMathAnswer(currentQuestion, userAnswer);
    
    const questionData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answer,
      userAnswer: userAnswer.trim(),
      isCorrect,
      responseTime,
      timedOut: false
    };

    actions.recordResponse('math', questionData);

    if (isCorrect) {
      // Correct answer
      setFeedback({
        show: true,
        isCorrect: true,
        message: 'Correct!'
      });
      setIsTimerActive(false);
      
      // Determine penalty for NEXT question
      // If this was answered correctly on first attempt (no prior incorrect attempts), next question gets 60s
      // If there were incorrect attempts before this correct answer, next question gets 50s
      setPenaltyActive(hasIncorrectAttempt);
      
      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    } else {
      // Incorrect answer
      setHasIncorrectAttempt(true); // Mark that this question has had incorrect attempts
      
      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Incorrect. Try again!'
      });
      setUserAnswer('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleTimerExpire = () => {
    setIsTimerActive(false);
    
    if (!feedback.isCorrect) {
      const responseTime = Date.now() - questionStartTime;
      const questionData = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        correctAnswer: currentQuestion.answer,
        userAnswer: userAnswer.trim() || '',
        isCorrect: false,
        responseTime,
        timedOut: true
      };

      actions.recordResponse('math', questionData);
      
      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Time\'s up! Moving to next question...'
      });
      
      // CRITICAL: Apply penalty to next question when timeout occurs
      // This ensures that timeouts always result in 50s for the next question
      setPenaltyActive(true);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    setIsTimerActive(false);
    
    if (isLastQuestion) {
      actions.completeTask('math');
      navigate('/stroop');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
    if (feedback.show && !feedback.isCorrect) {
      setFeedback({ show: false, isCorrect: false, message: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit(e);
    }
  };

  // Helper function to get display information
  const getDisplayInfo = () => {
    const timeClass = currentQuestionTime === 50 ? 'text-orange-600' : 'text-green-600';
    const timeLabel = currentQuestionTime === 50 ? 'Penalty Applied' : 'Full Time';
    const warningMessage = penaltyActive ? 'This question has reduced time due to previous incorrect answer or timeout.' : null;
    const penaltyMessage = hasIncorrectAttempt ? 'Next question will have reduced time if you get this wrong or time runs out.' : null;
    
    return {
      timeClass,
      timeLabel,
      warningMessage,
      penaltyMessage
    };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 task-content">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Math Task</h1>
          <p className="text-gray-600">
            Solve each problem correctly to advance. You start with 60 seconds per question.
          </p>
          <p className="text-sm text-orange-600 mt-2">
            <strong>Unified Penalty System:</strong> Any wrong answer or timeout reduces next question time to 50 seconds.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-2xl mx-auto mb-8">
          <ProgressTracker
            current={currentQuestionIndex + 1}
            total={mathQuestions.length}
            taskName="Math Problems"
            variant="default"
          />
        </div>

        {/* Main Task Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Timer Section */}
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <Timer
                  key={`math-timer-${currentQuestionIndex}-${currentQuestionTime}`}
                  duration={currentQuestionTime}
                  isActive={isTimerActive}
                  onExpire={handleTimerExpire}
                  size="large"
                  showProgress={true}
                />
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Time Remaining: {currentQuestionTime} seconds</span>
                  {displayInfo.warningMessage && (
                    <div className="text-orange-600 font-medium mt-1">
                      {displayInfo.warningMessage}
                    </div>
                  )}
                  {displayInfo.penaltyMessage && (
                    <div className="text-red-600 font-medium mt-1">
                      {displayInfo.penaltyMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question Section */}
            <div className="text-center mb-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Question {currentQuestionIndex + 1} of {mathQuestions.length}
                  </h2>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${displayInfo.timeClass}`}>
                      {currentQuestionTime}s
                    </div>
                    <div className="text-xs text-gray-500">
                      {displayInfo.timeLabel}
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600 no-select">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Input Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your answer"
                    className="w-full max-w-xs mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    disabled={!isTimerActive || feedback.isCorrect}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || !isTimerActive || feedback.isCorrect}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
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
              <p>Enter your answer and press Enter or click Submit</p>
              <p>You must answer correctly to proceed to the next question</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-700 font-medium">Unified Timer Rules:</p>
                <p className="text-blue-600 text-xs mt-1">
                  • Start with 60 seconds per question<br/>
                  • Any wrong answer OR timeout = Next question gets 50 seconds<br/>
                  • Correct first try = Next question keeps 60 seconds<br/>
                  • Only two states: 60s (no penalty) or 50s (penalty)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Task: Math Problems (20 Questions)</span>
              <span>Current Time: {currentQuestionTime}s</span>
              <span>Progress: {currentQuestionIndex + 1}/{mathQuestions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTask;
