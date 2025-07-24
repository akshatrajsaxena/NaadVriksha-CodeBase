import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleColorSelect = (selectedColor) => {
    const correct = selectedColor === stroopStimuli[currentQuestion].correctAnswer;
    const responseTime = Date.now() - startTime;

    setIsCorrect(correct);
    
    if (correct) {
      setFeedback('Correct! Well done.');
      
      // Store response data
      const newResponse = {
        questionIndex: currentQuestion,
        word: stroopStimuli[currentQuestion].word,
        fontColor: stroopStimuli[currentQuestion].correctAnswer,
        userAnswer: selectedColor,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
      setResponses(prev => [...prev, newResponse]);

      // Move to next question after a brief delay
      setTimeout(() => {
        if (currentQuestion < stroopStimuli.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setFeedback('');
          setIsCorrect(null);
        } else {
          // Store final results in localStorage for potential future use
          localStorage.setItem('stroopTaskResults', JSON.stringify([...responses, newResponse]));
          navigate('/captcha-task');
        }
      }, 1500);
    } else {
      setFeedback(`Incorrect. The font color is ${stroopStimuli[currentQuestion].correctAnswer}. Please try again.`);
    }
  };

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
            <p className="text-gray-600 mb-4">
              Click the color that matches the <strong>font color</strong> of the word below.
            </p>
            <p className="text-sm text-gray-500">
              Ignore what the word says - focus only on the color it's displayed in.
            </p>
          </div>

          <div className="mb-8">
            <div className="mb-8 p-8 bg-gray-50 rounded-lg">
              <div className={`stroop-word ${stroopStimuli[currentQuestion].color}`}>
                {stroopStimuli[currentQuestion].word}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`${color.bgColor} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
                  disabled={isCorrect !== null}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg mb-6 flex items-center justify-center space-x-2 animate-fade-in ${
              isCorrect 
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