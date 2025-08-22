import React, { useState } from 'react';
import { UserDetails } from '../App';

interface FeedbackProps {
  onSubmitted: (text: string) => void;
  onCancel: () => void;
  onEarlyAccess?: () => void;
  userDetails: UserDetails | null;
}

const Feedback: React.FC<FeedbackProps> = ({ onSubmitted, onCancel, onEarlyAccess, userDetails }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
  setSubmitting(true);
  // simulate async, but immediately call
  onSubmitted(text.trim());
  setSubmitted(true);
  setSubmitting(false);
  };

  const disabled = submitting || text.trim().length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center space-x-3">
          <img src="/logo.png" alt="Trawell" className="h-24 w-48 max-w-full max-h-32 rounded-lg object-contain" />
          <span className="text-xl font-semibold text-gray-800">
            Share Your Travel Story{userDetails ? `, ${userDetails.name}` : ''}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">We’d love to hear from you</h1>
            <p className="text-gray-600 mb-6">Share your detailed travel experiences, highlights, challenges, and tips.</p>

            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="story">Your story</label>
            <textarea
              id="story"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-gray-300 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 p-4 outline-none resize-vertical text-gray-800"
              placeholder="Tell us about your trip... the start, the end we'd love to know everything"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disabled}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#013a4e] to-[#c45510] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Story'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you for sharing! ✨</h2>
            <p className="text-gray-600 mb-6">Your story helps us build better travel experiences for everyone.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onEarlyAccess}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#013a4e] to-[#013a4e]/80 hover:from-[#013a4e]/90 hover:to-[#013a4e]/70"
              >
                Get Early Access
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
