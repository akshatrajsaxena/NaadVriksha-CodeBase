import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, ArrowRight } from '../components/Icons';
import ProgressTracker from '../components/ProgressTracker';
import TaskCard from '../components/TaskCard';

const StroopTask = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple submissions

  // Predefined Stroop stimuli
  const stroopStimuli = [
    { word: "RED", color: "text-blue-600", correctAnswer: "blue" },
    { word: "BLUE", color: "text-red-600", correctAnswer: "red" },
    { word: "GREEN", color: "text-yellow-600", correctAnswer: "yellow" },
    { word: "YELLOW", color: "text-green-600", correctAnswer: "green" },
    { word: "RED", color: "text-green-600", correctAnswer: "green" },
    { word: "BLUE", color: "text-yellow-600", correctAnswer: "yellow" },
    { word: "GREEN", color: "text-red-600", correctAnswer: "red" },
    { word: "YELLOW", color: "text-blue-600", correctAnswer: "blue" },
    { word: "RED", color: "text-yellow-600", correctAnswer: "yellow" },
    { word: "BLUE", color: "text-green-600", correctAnswer: "green" },
    { word: "GREEN", color: "text-blue-600", correctAnswer: "blue" },
    { word: "YELLOW", color: "text-red-600", correctAnswer: "red" },
    { word: "RED", color: "text-red-600", correctAnswer: "red" },
    { word: "BLUE", color: "text-blue-600", correctAnswer: "blue" },
    { word: "GREEN", color: "text-green-600", correctAnswer: "green" },
    { word: "YELLOW", color: "text-yellow-600", correctAnswer: "yellow" },
    { word: "RED", color: "text-blue-600", correctAnswer: "blue" },
    { word: "BLUE", color: "text-red-600", correctAnswer: "red" },
    { word: "GREEN", color: "text-yellow-600", correctAnswer: "yellow" },
    { word: "YELLOW", color: "text-green-600", correctAnswer: "green" }
  ];

  const colorOptions = [
    { value: "red", label: "Red", bgColor: "bg-red-500 hover:bg-red-600" },
    { value: "blue", label: "Blue", bgColor: "bg-blue-500 hover:bg-blue-600" },
    { value: "green", label: "Green", bgColor: "bg-green-500 hover:bg-green-600" },
    { value: "yellow", label: "Yellow", bgColor: "bg-yellow-500 hover:bg-yellow-600" }
  ];

  // Move to next question or complete task
  const moveToNext = useCallback((updatedResponses) => {
    if (currentQuestion < stroopStimuli.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      localStorage.setItem('stroopTaskResults', JSON.stringify(updatedResponses));
      navigate('/captcha-task');
    }
  }, [currentQuestion, stroopStimuli.length, navigate]);

  // Handle time up - using useCallback to prevent stale closures
  const handleTimeUp = useCallback(() => {
    if (isProcessing) return; // Prevent multiple calls
    setIsProcessing(true);
    
    setTimerActive(false);
    setFeedback('Time limit reached! Moving to next question.');
    setIsCorrect(false);

    // Get current stimulus safely
    const currentStimulus = stroopStimuli[currentQuestion];
    if (!currentStimulus) {
      console.error('Current stimulus is undefined for question:', currentQuestion);
      setIsProcessing(false);
      return;
    }

    // Store response data for timeout
    const newResponse = {
      questionIndex: currentQuestion,
      word: currentStimulus.word,
      fontColor: currentStimulus.correctAnswer,
      userAnswer: 'timeout',
      responseTime: 15000, // 15 seconds
      timestamp: new Date().toISOString(),
      timedOut: true
    };

    setResponses(prev => {
      const updatedResponses = [...prev, newResponse];
      // Move to next question after showing timeout message
      setTimeout(() => {
        moveToNext(updatedResponses);
        setIsProcessing(false);
      }, 2000);
      return updatedResponses;
    });
  }, [currentQuestion, stroopStimuli, moveToNext, isProcessing]);

  // Timer and question initialization
  useEffect(() => {
    setStartTime(Date.now());
    setTimeLeft(15);
    setTimerActive(true);
    setHasTimedOut(false);
    setIsCorrect(null);
    setFeedback('');
    setIsProcessing(false);
  }, [currentQuestion]);

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || hasTimedOut || isProcessing) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, hasTimedOut, isProcessing]);

  // Handle timeout effect
  useEffect(() => {
    if (hasTimedOut && !isProcessing) {
      handleTimeUp();
    }
  }, [hasTimedOut, handleTimeUp, isProcessing]);

  const handleColorSelect = (selectedColor) => {
    if (!timerActive || isProcessing) return; // Don't allow clicks if timer expired or processing

    setIsProcessing(true);
    const currentStimulus = stroopStimuli[currentQuestion];
    
    if (!currentStimulus) {
      console.error('Current stimulus is undefined');
      setIsProcessing(false);
      return;
    }

    const correct = selectedColor === currentStimulus.correctAnswer;
    const responseTime = Date.now() - startTime;

    setIsCorrect(correct);

    if (correct) {
      setTimerActive(false); // Stop timer on correct answer
      setFeedback('Correct! Well done.');

      // Store response data
      const newResponse = {
        questionIndex: currentQuestion,
        word: currentStimulus.word,
        fontColor: currentStimulus.correctAnswer,
        userAnswer: selectedColor,
        responseTime,
        timestamp: new Date().toISOString()
      };

      setResponses(prev => {
        const updatedResponses = [...prev, newResponse];
        // Move to next question after a brief delay
        setTimeout(() => {
          moveToNext(updatedResponses);
          setIsProcessing(false);
        }, 1500);
        return updatedResponses;
      });
    } else {
      setFeedback(`Incorrect. The font color is ${currentStimulus.correctAnswer}. Please try again.`);
      // Reset isCorrect to null after a brief delay so user can try again
      setTimeout(() => {
        setIsCorrect(null);
        setFeedback('');
        setIsProcessing(false);
      }, 2000);
    }
  };

  // Add bounds checking
  if (currentQuestion >= stroopStimuli.length) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  const currentStimulus = stroopStimuli[currentQuestion];

  if (!currentStimulus) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">Unable to load Stroop stimulus. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressTracker
          current={currentQuestion + 1}
          total={stroopStimuli.length}
          taskName="Stroop Task"
        />

        <TaskCard className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Stroop Test {currentQuestion + 1}
            </h1>

            {/* Timer Display */}
            <div className={`mb-4 text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
              Time: {timeLeft}s
            </div>

            <p className="text-gray-600 mb-4">
              Click the color that matches the <strong>font color</strong> of the word below.
            </p>
            <p className="text-sm text-gray-500">
              Ignore what the word says - focus only on the color it's displayed in.
            </p>
          </div>

          <div className="mb-8">
            <div className="mb-8 p-8 bg-gray-50 rounded-lg">
              <div className={`stroop-word ${currentStimulus.color}`}>
                {currentStimulus.word}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`${color.bgColor} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
                  disabled={!timerActive || isCorrect === true || isProcessing}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg mb-6 flex items-center justify-center space-x-2 animate-fade-in ${isCorrect
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {isCorrect ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{feedback}</span>
            </div>
          )}

          {isCorrect && currentQuestion < stroopStimuli.length - 1 && (
            <div className="flex items-center justify-center text-primary-600 animate-fade-in">
              <span className="mr-2">Moving to next stimulus</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          {isCorrect && currentQuestion === stroopStimuli.length - 1 && (
            <div className="flex items-center justify-center text-green-600 animate-fade-in">
              <span className="mr-2">Stroop Task Complete! Moving to CAPTCHA Task</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </TaskCard>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Focus on the font color, not the word meaning. This tests your selective attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StroopTask;
