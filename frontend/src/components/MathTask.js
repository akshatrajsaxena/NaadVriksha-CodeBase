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
  const inputRef = useRef(null);

  const currentQuestion = mathQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= mathQuestions.length - 1;

  // Initialize task when component mounts
  useEffect(() => {
    // Start the math task in session
    actions.startTask('math');
    
    // Enable interaction blocking
    UserInteractionBlocker.enableBlocking();
    
    // Start first question
    startQuestion();

    // Cleanup on unmount
    return () => {
      UserInteractionBlocker.disableBlocking();
    };
  }, []);

  // Update session progress when question changes and start new question
  useEffect(() => {
    actions.updateProgress('math', currentQuestionIndex);
    if (currentQuestionIndex > 0) { // Don't call startQuestion on initial load
      startQuestion();
    }
  }, [currentQuestionIndex]);

  // Focus input when question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  const startQuestion = () => {
    setQuestionStartTime(Date.now());
    setIsTimerActive(true);
    setUserAnswer('');
    setFeedback({ show: false, isCorrect: false, message: '' });
    
    // Focus input after a short delay to ensure it's rendered
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
    
    // Record the response
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
      setFeedback({
        show: true,
        isCorrect: true,
        message: 'Correct!'
      });
      
      // Stop timer and move to next question after short delay
      setIsTimerActive(false);
      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Incorrect. Try again!'
      });
      
      // Clear the input but don't advance
      setUserAnswer('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleTimerExpire = () => {
    setIsTimerActive(false);
    
    // Record timeout response if user hasn't answered correctly yet
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
    }

    // Move to next question after showing timeout message
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    setIsTimerActive(false); // Stop current timer
    
    if (isLastQuestion) {
      // Complete the math task
      actions.completeTask('math');
      navigate('/stroop');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      // startQuestion will be called by useEffect when currentQuestionIndex changes
    }
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
    
    // Clear feedback when user starts typing again
    if (feedback.show && !feedback.isCorrect) {
      setFeedback({ show: false, isCorrect: false, message: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 task-content">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Math Task</h1>
          <p className="text-gray-600">
            Solve each problem correctly to advance. You have 15 seconds per question.
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

        {/* Main Task Area */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Timer */}
            <div className="flex justify-center mb-8">
              <Timer
                key={`math-timer-${currentQuestionIndex}`}
                duration={15}
                isActive={isTimerActive}
                onExpire={handleTimerExpire}
                size="large"
                showProgress={true}
              />
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-3xl font-bold text-blue-600 no-select">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Input */}
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
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Task: Math Problems</span>
              <span>Time per question: 15 seconds</span>
              <span>Progress: {currentQuestionIndex + 1}/{mathQuestions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTask;