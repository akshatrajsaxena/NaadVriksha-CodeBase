import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Award, BarChart3, Home, Download } from '../components/Icons';
import FeedbackForm from '../components/FeedbackForm';

const CompletionPage = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [taskResults, setTaskResults] = useState({
    math: [],
    stroop: [],
    captcha: []
  });

  useEffect(() => {
    // Load results from localStorage
    const mathResults = JSON.parse(localStorage.getItem('mathTaskResults') || '[]');
    const stroopResults = JSON.parse(localStorage.getItem('stroopTaskResults') || '[]');
    const captchaResults = JSON.parse(localStorage.getItem('captchaTaskResults') || '[]');
    
    setTaskResults({
      math: mathResults,
      stroop: stroopResults,
      captcha: captchaResults
    });
  }, []);

  const calculateStats = () => {
    const allResults = [...taskResults.math, ...taskResults.stroop, ...taskResults.captcha];
    
    if (allResults.length === 0) return null;

    const totalTime = allResults.reduce((sum, result) => sum + result.responseTime, 0);
    const averageTime = totalTime / allResults.length;
    
    return {
      totalQuestions: allResults.length,
      averageResponseTime: Math.round(averageTime / 1000 * 10) / 10, // Convert to seconds
      mathAccuracy: taskResults.math.length > 0 ? 100 : 0, // All correct since they had to be correct to proceed
      stroopAccuracy: taskResults.stroop.length > 0 ? 100 : 0,
      captchaAccuracy: taskResults.captcha.length > 0 ? 100 : 0
    };
  };

  const stats = calculateStats();

  const handleFeedbackSubmit = (feedbackData) => {
    // Store feedback data
    const completionData = {
      taskResults,
      feedback: feedbackData,
      completionTime: new Date().toISOString()
    };
    
    localStorage.setItem('naadVrikshaSession', JSON.stringify(completionData));
    console.log('Session completed:', completionData);
    
    setShowFeedback(false);
    // Could send to backend API here
  };

  const handleFeedbackSkip = () => {
    setShowFeedback(false);
  };

  const downloadResults = () => {
    const data = {
      sessionId: Date.now(),
      completionTime: new Date().toISOString(),
      taskResults,
      stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naadvriksha-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showFeedback) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <FeedbackForm 
            onSubmit={handleFeedbackSubmit}
            onSkip={handleFeedbackSkip}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You have successfully completed all three cognitive assessment tasks in the NaadVriksha system.
          </p>
        </div>

        {/* Results Summary */}
        {stats && (
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Performance Summary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.averageResponseTime}s
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600">Overall Accuracy</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  3/3
                </div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Task Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-blue-600">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Math Task</h3>
            <p className="text-gray-600 text-sm mb-3">
              {taskResults.math.length} problems solved
            </p>
            <div className="text-green-600 font-medium">Complete</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-purple-600">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stroop Task</h3>
            <p className="text-gray-600 text-sm mb-3">
              {taskResults.stroop.length} stimuli processed
            </p>
            <div className="text-green-600 font-medium">Complete</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-green-600">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CAPTCHA Task</h3>
            <p className="text-gray-600 text-sm mb-3">
              {taskResults.captcha.length} challenges solved
            </p>
            <div className="text-green-600 font-medium">Complete</div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="card text-center mb-8 bg-gradient-to-r from-primary-50 to-nature-50 border-primary-200">
          <Award className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            NaadVriksha Assessment Complete
          </h3>
          <p className="text-gray-600 mb-4">
            You have successfully demonstrated cognitive performance across multiple domains 
            while contributing valuable data to our Plant-Computer Interaction research.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-2" />
            Certified Participant
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowFeedback(true)}
            className="btn-primary text-lg px-8 py-3"
          >
            Provide Feedback
          </button>
          
          <button
            onClick={downloadResults}
            className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Results</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>

        {/* Next Steps */}
        <div className="card mt-8 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Your cognitive performance data contributes to our understanding of human-plant emotional interaction
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Environmental sensor data and music adaptation algorithms will be refined based on your responses
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Your feedback helps improve the NaadVriksha assessment experience for future participants
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;