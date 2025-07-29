import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Brain, Music, Zap, Users, BarChart3, Headphones, TreePine } from './Icons';

const HomePage = () => {
  const navigate = useNavigate();

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
      title: "Coginitive Assessment",
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
            <button
              onClick={handleStartAssessment}
              className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Begin Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NaadVriksha's Assessment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invite you to participate in this coginitive assessment(~10-15) mins. Your responses will also help us gain valuable insights into the nature related experiences across different lifestyles.
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
              onClick={handleStartAssessment}
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