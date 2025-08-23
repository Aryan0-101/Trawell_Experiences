import React from 'react';
import { Star, MapPin, Users, Home as HomeIcon } from 'lucide-react';
import { QuizAnswer, UserDetails } from '../App';

interface ResultsProps {
  answers: QuizAnswer[];
  onRestart: () => void;
  onShareStory?: () => void;
  onEarlyAccess?: () => void;
  userDetails: UserDetails | null;
}

const Results: React.FC<ResultsProps> = ({ answers, onRestart, onShareStory, onEarlyAccess, userDetails }) => {
  // Simple analysis based on answers
  const analyzeResults = () => {
    // This is a simplified analysis - in real app, you'd have more sophisticated logic
    const planningTypes = answers[0]?.selectedOptions || [];
  // reserved for future use: const hasBookedPackages = answers[2]?.selectedOptions.includes('e') || false;
    
    let travelStyle = 'Explorer';
    let description = 'You love to discover new places with a perfect balance of planning and spontaneity.';
    let recommendations = [
      'Personalized itinerary packages',
      'Mix of planned activities and free time',
      'Local experiences and hidden gems'
    ];

    if (planningTypes.includes('d')) {
      travelStyle = 'Research Enthusiast';
      description = 'You\'re thorough in your planning and love to dive deep into destinations before visiting.';
      recommendations = [
        'Detailed destination guides',
        'Cultural and historical tours',
        'Photography-focused experiences'
      ];
    } else if (planningTypes.includes('e')) {
      travelStyle = 'Spontaneous Adventurer';
      description = 'You embrace the unknown and find joy in unexpected discoveries during your travels.';
      recommendations = [
        'Flexible itineraries',
        'Adventure and outdoor activities',
        'Last-minute deal packages'
      ];
    } else if (planningTypes.includes('b')) {
      travelStyle = 'Comfort Seeker';
      description = 'You prefer hassle-free travel with trusted professionals handling the details.';
      recommendations = [
        'Full-service travel packages',
        'Luxury accommodations',
        'Private tours and transfers'
      ];
    }

    return { travelStyle, description, recommendations };
  };

  analyzeResults();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Trawell" className="h-24 w-48 max-w-full max-h-32 rounded-lg object-contain" />
            <span className="text-xl font-semibold text-gray-800">
              Thank You{userDetails ? `, ${userDetails.name}` : ''} for Your Input!
            </span>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto w-full">
          {/* Main Result Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-orange-400/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-teal-500/20 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#013a4e] to-[#c45510] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Star className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Thank you for helping us understand 
                <span className="bg-gradient-to-r from-[#013a4e] to-[#c45510] bg-clip-text text-transparent block">
                  travelers like you better!
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your responses help us build travel services that truly match what people are looking for. 
                We'll use these insights to create better experiences for the travel community.
              </p>

              <div className="bg-gradient-to-r from-[#013a4e]/5 to-[#c45510]/5 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Based on your responses, we learned:</h3>
                <div className="space-y-3">
                  {[
                    "Your planning preferences and style",
                    "Common challenges you face while traveling", 
                    "What matters most to you in travel experiences"
                  ].map((insight, index) => (
                    <div key={index} className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#013a4e] to-[#c45510] rounded-full"></div>
                      <span className="text-gray-700">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#013a4e] to-[#013a4e]/80 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Early Bird Advantage</h3>
              <p className="text-gray-600 mb-4">
                Be the first to know when we launch new features and get special perks.
              </p>
              <button onClick={onEarlyAccess} className="w-full bg-gradient-to-r from-[#013a4e] to-[#013a4e]/80 hover:from-[#013a4e]/90 hover:to-[#013a4e]/70 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                Get Early Access
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#c45510] to-[#c45510]/80 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Share More Feedback</h3>
              <p className="text-gray-600 mb-4">
                Help us even more by sharing detailed stories about your travel experiences.
              </p>
              <button onClick={onShareStory} className="w-full bg-gradient-to-r from-[#c45510] to-[#c45510]/80 hover:from-[#c45510]/90 hover:to-[#c45510]/70 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                Share Your Story
              </button>
            </div>
          </div>

      {/* Home Navigation */}
          <div className="text-center">
            <button
              onClick={onRestart}
              className="flex items-center space-x-2 mx-auto text-gray-600 hover:text-gray-800 transition-colors"
            >
        <HomeIcon className="w-5 h-5" />
        <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;