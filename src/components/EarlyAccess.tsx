import React from 'react';
import { UserDetails } from '../App';

interface EarlyAccessProps {
  onSubmitted: () => void;
  onCancel: () => void;
  userDetails: UserDetails | null;
}

const EarlyAccess: React.FC<EarlyAccessProps> = ({ onSubmitted, onCancel, userDetails }) => {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitted();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white/55 backdrop-blur-sm border-b border-white/20 -mb-6 md:-mb-8 relative z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 md:py-4 flex items-center">
          <img
            src="/logo.png"
            alt="Trawell"
            className="h-32 sm:h-36 md:h-40 lg:h-44 w-auto object-contain -mb-5 md:-mb-6 drop-shadow-md"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">Get Early Access</h1>
          <p className="text-gray-600 mb-6">
            Great news! We already have your details from when you started. 
            Click below to join our early access list and be the first to know about new features.
          </p>

          {userDetails && (
            <div className="bg-gradient-to-r from-[#013a4e]/5 to-[#c45510]/5 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Your Details:</h3>
              <div className="space-y-1 text-gray-600">
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                {userDetails.phone && <p><strong>Phone:</strong> {userDetails.phone}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={submit}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#013a4e] to-[#c45510] hover:from-[#013a4e]/90 hover:to-[#c45510]/90"
            >
              Join Early Access List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarlyAccess;
