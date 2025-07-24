import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CheckCircle, XCircle, ArrowRight } from '../components/Icons';
import ProgressTracker from '../components/ProgressTracker';
import TaskCard from '../components/TaskCard';

const MathTask = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [responses, setResponses] = useState([]);

  // Predefined math problems
  const mathProblems = [
    { question: "15 + 27 = ?", answer: 42 },
    { question: "64 - 18 = ?", answer: 46 },
    { question: "8 × 9 = ?", answer: 72 },
    { question: "144 ÷ 12 = ?", answer: 12 },
    { question: "23 + 45 = ?", answer: 68 },
    { question: "89 - 34 = ?", answer: 55 },
    { question: "7 × 13 = ?", answer: 91 },
    { question: "96 ÷ 8 = ?", answer: 12 },
    { question: "56 + 29 = ?", answer: 85 },
    { question: "73 - 28 = ?", answer: 45 },
    { question: "6 × 14 = ?", answer: 84 },
    { question: "108 ÷ 9 = ?", answer: 12 },
    { question: "38 + 47 = ?", answer: 85 },
    { question: "92 - 35 = ?", answer: 57 },
    { question: "9 × 11 = ?", answer: 99 },
    { question: "132 ÷ 11 = ?", answer: 12 },
    { question: "49 + 36 = ?", answer: 85 },
    { question: "81 - 29 = ?", answer: 52 },
    { question: "12 × 7 = ?", answer: 84 },
    { question: "156 ÷ 13 = ?", answer: 12 }
  ];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentProblem = mathProblems[currentQuestion];
    
    if (!currentProblem) {
      console.error('Current problem is undefined');
      return;
    }
    
    const answer = parseInt(userAnswer);
    const correct = answer === currentProblem.answer;
    const responseTime = Date.now() - startTime;

    setIsCorrect(correct);
    
    if (correct) {
      setFeedback('Correct! Well done.');
      
      // Store response data
      const newResponse = {
        questionIndex: currentQuestion,
        question: currentProblem.question,
        userAnswer: answer,
        correctAnswer: currentProblem.answer,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
      setResponses(prev => [...prev, newResponse]);

      // Move to next question after a brief delay
      setTimeout(() => {
        if (currentQuestion < mathProblems.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setUserAnswer('');
          setFeedback('');
          setIsCorrect(null);
        } else {
          // Store final results in localStorage for potential future use
          localStorage.setItem('mathTaskResults', JSON.stringify([...responses, newResponse]));
          navigate('/stroop-task');
        }
      }, 1500);
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentProblem.answer}. Please try again.`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Add bounds checking
  if (currentQuestion >= mathProblems.length) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  const currentProblem = mathProblems[currentQuestion];
  
  if (!currentProblem) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">Unable to load math problem. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressTracker 
          current={currentQuestion + 1} 
          total={mathProblems.length} 
          taskName="Math Task"
        />

        <TaskCard className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Math Problem {currentQuestion + 1}
            </h1>
            <p className="text-gray-600">
              Solve the problem below. You must get it correct to proceed.
            </p>
          </div>

          <div className="mb-8">
            <div className="text-4xl font-bold text-gray-800 mb-6 p-6 bg-gray-50 rounded-lg">
              {currentProblem.question}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-field text-center text-2xl font-semibold"
                  placeholder="Enter your answer"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </form>
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

          {isCorrect && currentQuestion < mathProblems.length - 1 && (
            <div className="flex items-center justify-center text-primary-600 animate-fade-in">
              <span className="mr-2">Moving to next question</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          {isCorrect && currentQuestion === mathProblems.length - 1 && (
            <div className="flex items-center justify-center text-green-600 animate-fade-in">
              <span className="mr-2">Math Task Complete! Moving to Stroop Task</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </TaskCard>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Take your time and focus on accuracy. Each correct answer moves you forward.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MathTask;