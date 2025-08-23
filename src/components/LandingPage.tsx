import React from 'react';
import { Compass, Users, Star } from 'lucide-react';
import { UserDetails } from '../App';

interface LandingPageProps {
  onStartQuiz: () => void;
  onOpenFeedback?: () => void;
  userDetails: UserDetails | null;
  hasTakenQuiz?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz, onOpenFeedback, userDetails, hasTakenQuiz }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
  <header className="px-6 py-1.5 md:py-2 bg-[#f5eede] border-b border-[#f5eede] -mb-4 md:-mb-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 min-h-0">
          <div className="flex items-center min-w-0 max-w-xs flex-shrink-0">
            <img
              src="/logo.png"
              alt="Trawell"
              className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto object-contain rounded-xl transition-transform duration-300 -mb-3 md:-mb-4"
            />
          </div>
          <div className="flex-1 flex items-center justify-end gap-6 min-w-0">
            {userDetails && (
              <div className="hidden md:flex items-center space-x-2 text-gray-600 whitespace-nowrap">
                <span>{hasTakenQuiz ? 'Welcome back,' : 'Welcome,'} {userDetails.name}!</span>
              </div>
            )}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
  <main className="flex-1 flex items-center justify-center px-6 pt-4 pb-6 md:pt-8 md:pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left column: heading + CTA buttons */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
          
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight tracking-tight">
                Help Us Understand
                <span className="bg-gradient-to-r from-[#16434b] to-[#c55510] bg-clip-text text-transparent block">
                  Your Travel Needs
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Share your travel preferences with us through our quick quiz. Your insights 
                help us build better travel experiences and create services that truly match 
                what travelers like you are looking for.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartQuiz}
                className="group bg-gradient-to-r from-[#73947C] to-[#16434B] hover:from-[#16434B]/90 hover:to-[#427556]/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                {hasTakenQuiz ? 'Retake Quiz' : 'Take a Quick Quiz'}
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
              </button>
              <button
                onClick={onOpenFeedback}
                className="border-2 border-[#013a4e]/30 hover:border-[#013a4e]/50 text-[#013a4e] px-6 py-4 rounded-2xl font-medium text-base transition-all duration-300 hover:shadow-lg hover:bg-[#013a4e]/5"
              >
                Feeling more generous? Help us even more by sharing your detailed travel experiences and stories
              </button>
            </div> 
          </div>

          {/* Right column: feature card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-6">
                <div className="bg-[#73947C] rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Understanding Travelers</h3>
                      <p className="text-white/80 text-sm">Building better experiences together</p>
                    </div>
                  </div>
                  <p className="text-white/90">Your voice matters.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <Users className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-medium text-gray-800">Family Travel</h4>
                    <p className="text-sm text-gray-600">Fun for everyone</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <Compass className="w-8 h-8 text-orange-500 mb-2" />
                    <h4 className="font-medium text-gray-800">Adventure Tours</h4>
                    <p className="text-sm text-gray-600">Thrill seekers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section className="px-6 py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How Your Input Helps Us</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Your responses help us understand what travelers really want, so we can build better services and experiences for everyone
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#013a4e] to-[#013a4e]/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Better Understanding</h3>
              <p className="text-gray-600">Your preferences help us understand what different types of travelers are looking for</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#c45510] to-[#c45510]/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Improved Services</h3>
              <p className="text-gray-600">We use your insights to develop features and services that truly meet traveler needs</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#013a4e] to-[#c45510] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Impact</h3>
              <p className="text-gray-600">Your feedback helps us create solutions that benefit the entire travel community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;