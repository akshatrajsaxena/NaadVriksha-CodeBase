import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { stroopStimuli, colorOptions } from '../data/stroopStimuli';
import { ValidationService } from '../services/ValidationService';
import { UserInteractionBlocker } from '../utils/userInteractionBlocker';
import Timer from './Timer';
import ProgressTracker from './ProgressTracker';

const StroopTask = () => {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [stimulusStartTime, setStimulusStartTime] = useState(null);

  const currentStimulus = stroopStimuli[currentStimulusIndex];
  const isLastStimulus = currentStimulusIndex >= stroopStimuli.length - 1;

  // Initialize task when component mounts
  useEffect(() => {
    // Start the stroop task in session
    actions.startTask('stroop');
    
    // Enable interaction blocking
    UserInteractionBlocker.enableBlocking();
    
    // Start first stimulus
    startStimulus();

    // Cleanup on unmount
    return () => {
      UserInteractionBlocker.disableBlocking();
    };
  }, []);

  // Update session progress when stimulus changes and start new stimulus
  useEffect(() => {
    actions.updateProgress('stroop', currentStimulusIndex);
    if (currentStimulusIndex > 0) { // Don't call startStimulus on initial load
      startStimulus();
    }
  }, [currentStimulusIndex]);

  const startStimulus = () => {
    setStimulusStartTime(Date.now());
    setIsTimerActive(true);
    setSelectedColor('');
    setFeedback({ show: false, isCorrect: false, message: '' });
  };

  const handleColorSelection = (colorValue) => {
    if (!isTimerActive || feedback.isCorrect) {
      return;
    }

    setSelectedColor(colorValue);
    
    const responseTime = Date.now() - stimulusStartTime;
    const isCorrect = ValidationService.validateStroopResponse(currentStimulus, colorValue);
    
    // Record the response
    const stimulusData = {
      questionId: currentStimulus.id,
      question: `Word: ${currentStimulus.word} (Color: ${currentStimulus.color})`,
      correctAnswer: currentStimulus.correctAnswer,
      userAnswer: colorValue,
      isCorrect,
      responseTime,
      timedOut: false
    };

    actions.recordResponse('stroop', stimulusData);

    if (isCorrect) {
      setFeedback({
        show: true,
        isCorrect: true,
        message: 'Correct!'
      });
      
      // Stop timer and move to next stimulus after short delay
      setIsTimerActive(false);
      setTimeout(() => {
        moveToNextStimulus();
      }, 1000);
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Incorrect. Try again!'
      });
      
      // Clear selection but don't advance
      setTimeout(() => {
        setSelectedColor('');
        setFeedback({ show: false, isCorrect: false, message: '' });
      }, 1000);
    }
  };

  const handleTimerExpire = () => {
    setIsTimerActive(false);
    
    // Record timeout response if user hasn't answered correctly yet
    if (!feedback.isCorrect) {
      const responseTime = Date.now() - stimulusStartTime;
      const stimulusData = {
        questionId: currentStimulus.id,
        question: `Word: ${currentStimulus.word} (Color: ${currentStimulus.color})`,
        correctAnswer: currentStimulus.correctAnswer,
        userAnswer: selectedColor || '',
        isCorrect: false,
        responseTime,
        timedOut: true
      };

      actions.recordResponse('stroop', stimulusData);

      setFeedback({
        show: true,
        isCorrect: false,
        message: 'Time\'s up! Moving to next stimulus...'
      });
    }

    // Move to next stimulus after showing timeout message
    setTimeout(() => {
      moveToNextStimulus();
    }, 1500);
  };

  const moveToNextStimulus = () => {
    setIsTimerActive(false); // Stop current timer
    
    if (isLastStimulus) {
      // Complete the stroop task
      actions.completeTask('stroop');
      navigate('/captcha');
    } else {
      setCurrentStimulusIndex(prev => prev + 1);
      // startStimulus will be called by useEffect when currentStimulusIndex changes
    }
  };

  // Get the color class for the stimulus word
  const getWordColorClass = (color) => {
    const colorMap = {
      red: 'text-red-500',
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return colorMap[color] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 task-content">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stroop Task</h1>
          <p className="text-gray-600">
            Click the color that matches the <strong>font color</strong> of the word, not the word itself.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-2xl mx-auto mb-8">
          <ProgressTracker
            current={currentStimulusIndex + 1}
            total={stroopStimuli.length}
            taskName="Stroop Stimuli"
            variant="success"
          />
        </div>

        {/* Main Task Area */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Timer */}
            <div className="flex justify-center mb-8">
              <Timer
                key={`stroop-timer-${currentStimulusIndex}`}
                duration={15}
                isActive={isTimerActive}
                onExpire={handleTimerExpire}
                size="large"
                showProgress={true}
              />
            </div>

            {/* Stimulus Display */}
            <div className="text-center mb-8">
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Stimulus {currentStimulusIndex + 1}
                </h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">What color is this word displayed in?</p>
                  <div className={`text-6xl font-bold no-select ${getWordColorClass(currentStimulus.color)}`}>
                    {currentStimulus.word}
                  </div>
                </div>
              </div>

              {/* Color Selection Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelection(color.value)}
                    disabled={!isTimerActive || feedback.isCorrect}
                    className={`
                      px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200
                      ${color.className}
                      ${selectedColor === color.value ? 'ring-4 ring-gray-400 scale-105' : ''}
                      ${!isTimerActive || feedback.isCorrect ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
                    `}
                  >
                    {color.label}
                  </button>
                ))}
              </div>

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
              <p className="mb-2">
                <strong>Important:</strong> Click the color that matches the font color, not what the word says!
              </p>
              <p>You must select the correct color to proceed to the next stimulus</p>
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Task: Stroop Test</span>
              <span>Time per stimulus: 15 seconds</span>
              <span>Progress: {currentStimulusIndex + 1}/{stroopStimuli.length}</span>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Example:</h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-800">
              <span>If you see the word</span>
              <span className="text-red-500 font-bold text-lg">BLUE</span>
              <span>you should click</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded font-semibold">Red</span>
              <span>because the word is displayed in red color</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StroopTask;