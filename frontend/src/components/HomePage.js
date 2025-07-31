import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Brain, Music, Zap, Users, BarChart3, Headphones, TreePine, AlertTriangle, Clock, Target, Eye } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartAssessment = () => {
    navigate('/math');
  };

  const features = [
    {
      icon: <TreePine className="w-8 h-8 text-nature-600" />,
      title: "Plant-Computer Interaction",
      description: "Revolutionary PCI technology connecting plants with environmental sensors to mark the reading for prediction."
    },
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: "Cognitive Assessment",
      description: "Multi-modal cognitive tasks measuring attention, processing speed, and executive function."
    },
    {
      icon: <Music className="w-8 h-8 text-purple-600" />,
      title: "Adaptive Music Generation",
      description: "MIDI-based emotional music model that responds to real-time weather and sensor data."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Cognitive Assessment",
      description: "An assessment designed to capture your ability to respond accurately under time constraints and cognitive pressure."
    },
    {
      icon: <Users className="w-8 h-8 text-pink-600" />,
      title: "Human-Plant Interaction",
      description: "Explore the fascinating connection between human emotions and plant responses."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      title: "Multi-modal Data Collection",
      description: "Comprehensive data gathering from environmental sensors, biometrics, and cognitive performance."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-nature-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Leaf className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              NaadVriksha
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting people to nature through mindful experiences that restore awareness, and appreciation for the natural world.
            </p>
            <p className="text-lg text-white/80 mb-12 max-w-4xl mx-auto">
              NaadVriksha is a unique project that explores the seamless interaction between plants, technology, and humans to support mental well being.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowInstructions(true)}
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mr-4"
              >
                Read Instructions
              </button>
              <button
                onClick={handleStartAssessment}
                className="bg-nature-500 text-white hover:bg-nature-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Assessment Instructions</h2>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Technical Requirements */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Important Technical Requirements</h3>
                    <ul className="text-red-700 space-y-2">
                      <li>• <strong>Do NOT refresh the page</strong> during the assessment - this will reset your progress</li>
                      <li>• <strong>Use full-screen mode</strong> by pressing <kbd className="bg-gray-200 px-2 py-1 rounded text-sm">F11</kbd> for optimal experience</li>
                      <li>• Ensure stable internet connection throughout the test</li>
                      <li>• Close other applications to minimize distractions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Task Instructions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Task Instructions & Scoring</h3>

                {/* Math Task */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Brain className="w-6 h-6 text-blue-600 mr-3" />
                    <h4 className="text-xl font-semibold text-blue-800">1. Math Task (20 Questions)</h4>
                  </div>
                  <div className="text-blue-700 space-y-2">
                    <p><strong>Task:</strong> Solve each Math question as quickly and accurately as you can.</p>
                    <p><strong>Time Limit:</strong> 60 seconds per question</p>
                    <div className="bg-blue-100 p-3 rounded mt-2">
                      <p className="font-semibold text-blue-800">Time & Penalty System:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• <span className="text-green-600 font-semibold">Correct on First Attempt:</span> No time penalty; next question starts with full 60 seconds.</li>
                        <li>• <span className="text-red-600 font-semibold">Incorrect Answer:</span> 10 seconds will be deducted from the next question’s timer.</li>
                        <li>• <span className="text-orange-600 font-semibold">Timeout (No Answer):</span> 10 seconds will be deducted from the next question’s timer.</li>
                        <li>• <span className="text-blue-600 font-semibold">Recovered Correct Answer:</span> If your first attempt for the current question correct and the current question had a time penalty from the previous one, the next question will have the full 60 seconds restored.</li>

                      </ul>
                    </div>
                  </div>
                </div>

                {/* Stroop Task */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Eye className="w-6 h-6 text-green-600 mr-3" />
                    <h4 className="text-xl font-semibold text-green-800">2. Stroop Task</h4>
                  </div>
                  <div className="text-green-700 space-y-2">
                    <p><strong>Task:</strong> Focus on the <u>font color</u> of each word, and ignore the word’s meaning.</p>
                    <p><strong>Example:</strong> If the word <span className="font-semibold text-red-600">"BLUE"</span> is written in <span className="font-semibold text-red-600">red</span>, your answer should be <strong>"Red"</strong>.</p>
                    <p><strong>Time Limit:</strong> 15 seconds per question</p>
                    <div className="bg-green-100 p-3 rounded mt-2">
                      <p className="font-semibold text-green-800">Scoring System:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• <span className="text-green-600 font-semibold">Correct on First Attempt:</span> No time penalty; next question starts with full 15 seconds.</li>
                        <li>• <span className="text-red-600 font-semibold">Incorrect Answer:</span> 5 seconds will be deducted from the next question’s timer.</li>
                        <li>• <span className="text-orange-600 font-semibold">Timeout (No Answer):</span> 5 seconds will be deducted from the next question’s timer.</li>
                        <li>• <span className="text-blue-600 font-semibold">Recovered Correct Answer:</span> If your first attempt for the current question correct and the current question had a time penalty from the previous one, the next question will have the full 15 seconds restored.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CAPTCHA Task */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Target className="w-6 h-6 text-purple-600 mr-3" />
                    <h4 className="text-xl font-semibold text-purple-800">3. CAPTCHA Task</h4>
                  </div>
                  <div className="text-purple-700 space-y-2">
                    <p><strong>Task:</strong> Identify and type the characters or numbers displayed in distorted CAPTCHA images as quickly and accurately as possible.</p>
                    <p><strong>Time Limit:</strong> 60 seconds per CAPTCHA</p>
                    <div className="bg-purple-100 p-3 rounded mt-2">
                      <p className="font-semibold text-purple-800">Time & Penalty System:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• <span className="text-green-600 font-semibold">Correct on First Attempt:</span> No time penalty; next CAPTCHA starts with full 60 seconds.</li>
                        <li>• <span className="text-red-600 font-semibold">Incorrect Answer:</span> 10 seconds will be deducted from the next CAPTCHA’s timer.</li>
                        <li>• <span className="text-orange-600 font-semibold">Timeout (No Answer):</span> 10 seconds will be deducted from the next CAPTCHA’s timer.</li>
                        <li>• <span className="text-purple-600 font-semibold">Recovered Correct Answer:</span> If your first attempt for the current CAPTCHA is correct and the current CAPTCHA was penalized due to the previous one, the next CAPTCHA will have the full 60 seconds restored.</li>
                      </ul>
                    </div>
                  </div>
                </div>


                {/* General Guidelines */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">General Guidelines</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Work as quickly and accurately as possible</li>
                    <li>• Each task builds cognitive pressure - this is intentional</li>
                    <li>• Don't panic. Enough time has been provided for each question</li>
                    <li>• Your responses help us understand cognitive performance patterns</li>
                  </ul>
                </div>

                {/* Duration Info */}
                <div className="flex items-center justify-center bg-yellow-50 rounded-lg p-4">
                  <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                  <span className="text-yellow-800 font-semibold">
                    Total Estimated Duration: 10-15 minutes
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setShowInstructions(false);
                    handleStartAssessment();
                  }}
                  className="bg-primary-600 text-white hover:bg-primary-700 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  I Understand - Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NaadVriksha's Assessment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invite you to participate in this cognitive assessment (~10-15 mins). Your responses will also help us gain valuable insights into the nature related experiences across different lifestyles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Overview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cognitive Assessment Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete three scientifically-designed tasks that measure different aspects of cognitive performance while our system monitors your emotional responses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Math Task</h3>
              <p className="text-gray-600 mb-6">
                Solve 20 sequential math problems designed to assess numerical processing and working memory under cognitive load.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Brain className="w-4 h-4 mr-2" />
                Working Memory & Processing Speed
              </div>
            </div>

            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Stroop Task</h3>
              <p className="text-gray-600 mb-6">
                Identify font colors while ignoring word meanings to measure selective attention and cognitive flexibility.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Zap className="w-4 h-4 mr-2" />
                Attention & Cognitive Control
              </div>
            </div>

            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">CAPTCHA Task</h3>
              <p className="text-gray-600 mb-6">
                Solve visual perception challenges that test attention to detail and pattern recognition abilities.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                Visual Processing & Attention
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setShowInstructions(true)}
              className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-nature-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <Headphones className="w-16 h-16 mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl font-bold mb-6">Researchers from Persisst Lab, IIITD</h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              This study has been approved by the Institutional Review Board (IRB), IIIT-Delhi.
              For any questions about your rights as a research participant or objections to the study,
              you may contact: IRB Chairperson, Indraprastha Institute of Information Technology Delhi.
              Email: <a href="mailto:IRB@iiitd.ac.in" className="text-white underline">IRB@iiitd.ac.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
