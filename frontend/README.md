# NaadVriksha - Cognitive Assessment Web Application

A comprehensive React-based web application for cognitive assessment through Plant-Computer Interaction (PCI) research.

## Overview

NaadVriksha is an innovative cognitive assessment platform that explores the relationship between human emotions, environmental factors, and plant responses. The application consists of three sequential cognitive tasks designed to measure different aspects of cognitive performance while monitoring emotional responses.

## Features

### 🏠 Home Page
- Comprehensive project overview
- Detailed explanation of Plant-Computer Interaction technology
- Feature highlights including adaptive music generation and multi-modal data collection
- Engaging visual design with gradient backgrounds and animations

### 🧮 Math Task
- 20 sequential math problems (basic arithmetic)
- Progressive difficulty assessment
- Real-time validation (must be correct to proceed)
- Response time tracking
- Visual feedback and progress indicators

### 👁️ Stroop Task
- 20 color-word stimuli challenges
- Tests selective attention and cognitive flexibility
- Font color identification while ignoring word meaning
- Interactive color selection interface
- Cognitive load measurement

### 🛡️ CAPTCHA Task
- 5 Google reCAPTCHA challenges for enhanced security
- Real-time verification using Google's reCAPTCHA API
- Visual perception and human verification testing
- Attention to detail and bot detection assessment
- Automatic token verification with feedback

### 📊 Results & Completion
- Comprehensive performance summary
- Task-by-task breakdown
- Response time analytics
- Achievement certification
- Data export functionality
- Optional feedback collection

## Technology Stack

- **React 18.2.0** - Modern functional components with hooks
- **React Router DOM 6.28.0** - Seamless navigation between tasks
- **Tailwind CSS 3.4.0** - Responsive, utility-first styling
- **React Google reCAPTCHA** - Google reCAPTCHA integration for security
- **Custom Icons** - Lightweight SVG icon components
- **PostCSS & Autoprefixer** - CSS processing and compatibility

## Key Components

### Reusable Components
- `ProgressTracker` - Visual progress indication across tasks
- `TaskCard` - Consistent card layout for all tasks
- `FeedbackForm` - Comprehensive user feedback collection

### Pages
- `HomePage` - Landing page with project information
- `MathTask` - Mathematical problem solving interface
- `StroopTask` - Color-word interference testing
- `CaptchaTask` - Visual perception challenges
- `CompletionPage` - Results summary and feedback collection

## Design Features

### Visual Design
- Gradient backgrounds and smooth animations
- Responsive design for all screen sizes
- Consistent color scheme with nature-inspired palette
- Accessibility-compliant interface elements

### User Experience
- Sequential task flow with validation
- Real-time feedback and progress tracking
- Smooth transitions between sections
- Clear instructions and visual cues
- Error handling and retry mechanisms

### Data Collection
- Response time measurement for each question
- Accuracy tracking across all tasks
- User feedback and emotional state reporting
- Local storage for session persistence
- JSON export functionality

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── ProgressTracker.js
│   │   ├── TaskCard.js
│   │   └── FeedbackForm.js
│   ├── pages/            # Main application pages
│   │   ├── HomePage.js
│   │   ├── MathTask.js
│   │   ├── StroopTask.js
│   │   ├── CaptchaTask.js
│   │   └── CompletionPage.js
│   ├── App.js            # Main application component
│   ├── App.css           # Custom styles
│   ├── index.js          # Application entry point
│   └── index.css         # Tailwind CSS imports
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```

## Cognitive Assessment Flow

1. **Welcome & Information** - Users learn about the NaadVriksha project
2. **Math Task** - Sequential problem solving with accuracy requirements
3. **Stroop Task** - Color identification with cognitive interference
4. **CAPTCHA Task** - Visual perception and attention challenges
5. **Completion & Feedback** - Results summary and optional feedback

## Data Storage

- **Local Storage**: Session data, task results, and user progress
- **JSON Export**: Complete session data for research purposes
- **Response Tracking**: Detailed timing and accuracy metrics

## Future Integration Points

The application is designed for easy integration with:
- Backend APIs for data persistence
- Facial recognition emotion tracking
- Speech-based NLP emotion models
- Environmental sensor data
- MIDI-based music generation systems
- Real-time weather data integration

## Research Applications

This application supports research in:
- Human-Computer Interaction (HCI)
- Plant-Computer Interaction (PCI)
- Cognitive psychology and assessment
- Emotional response measurement
- Multi-modal data collection
- Adaptive system design

## Contributing

The codebase is modular and maintainable, designed for:
- Easy addition of new cognitive tasks
- Integration with backend services
- Customization of assessment parameters
- Extension of data collection capabilities

## License

This project is part of the NaadVriksha research initiative exploring human emotions through Plant-Computer Interaction.
