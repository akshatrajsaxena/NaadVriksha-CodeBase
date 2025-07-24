import React, { useState } from 'react';
import { Star, MessageCircle } from './Icons';

const FeedbackForm = ({ onSubmit, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [emotionalState, setEmotionalState] = useState('');

  const emotions = [
    { value: 'calm', label: 'Calm', color: 'bg-blue-100 text-blue-800' },
    { value: 'focused', label: 'Focused', color: 'bg-green-100 text-green-800' },
    { value: 'stressed', label: 'Stressed', color: 'bg-red-100 text-red-800' },
    { value: 'excited', label: 'Excited', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'tired', label: 'Tired', color: 'bg-gray-100 text-gray-800' },
    { value: 'confident', label: 'Confident', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      rating,
      feedback,
      emotionalState,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="card max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          How was your experience?
        </h3>
        <p className="text-gray-600">
          Your feedback helps us improve the NaadVriksha assessment experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Experience Rating
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Emotional State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How did you feel during the tasks?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                type="button"
                onClick={() => setEmotionalState(emotion.value)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  emotionalState === emotion.value
                    ? emotion.color + ' ring-2 ring-offset-2 ring-primary-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {emotion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Share any thoughts about the tasks, interface, or overall experience..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={rating === 0}
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 btn-secondary"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;