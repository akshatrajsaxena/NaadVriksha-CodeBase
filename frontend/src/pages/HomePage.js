import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Brain, Music, Zap, Users, BarChart3, Headphones, TreePine } from '../components/Icons';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TreePine className="w-8 h-8 text-nature-600" />,
      title: "Plant-Computer Interaction",
      description: "Revolutionary PCI technology connecting plants with environmental sensors to understand emotional responses."
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
      title: "Real-time Feedback",
      description: "Adaptive feedback loops using facial recognition and speech-based NLP emotion models."
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
              Understanding Human Emotions Through Plant-Computer Interaction
            </p>
            <p className="text-lg text-white/80 mb-12 max-w-4xl mx-auto">
              A revolutionary cognitive assessment platform that explores the intricate relationship between 
              human emotions, environmental factors, and plant responses through advanced sensor technology 
              and adaptive music generation.
            </p>
            <button
              onClick={() => navigate('/math-task')}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How NaadVriksha Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative system combines cutting-edge technology with nature's wisdom to create 
              a comprehensive emotional and cognitive assessment experience.
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
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Overview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cognitive Assessment Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete three scientifically-designed tasks that measure different aspects of 
              cognitive performance while our system monitors your emotional responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Math Task</h3>
              <p className="text-gray-600 mb-6">
                Solve 20 sequential math problems designed to assess numerical processing 
                and working memory under cognitive load.
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
                Identify font colors while ignoring word meanings to measure selective 
                attention and cognitive flexibility.
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
                Solve visual perception challenges that test attention to detail 
                and pattern recognition abilities.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                Visual Processing & Attention
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/math-task')}
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
            <h2 className="text-4xl font-bold mb-6">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              Our system integrates environmental sensors (humidity, light, moisture), 
              facial recognition technology, speech-based NLP emotion models, and 
              adaptive MIDI music generation to create a comprehensive assessment 
              of human-plant emotional interaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;