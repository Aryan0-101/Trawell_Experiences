import { useState } from 'react';
import { UserDetails } from '../App';

interface UserDetailsFormProps {
  onSubmitted: (details: UserDetails) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const emailValid = /.+@.+\..+/.test(email);
  const canSubmit = !!name.trim() && emailValid;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    const details: UserDetails = {
      name: name.trim(),
      email: email.trim(),
      ...(phone.trim() && { phone: phone.trim() })
    };
    
    onSubmitted(details);
  };

  return (
    <div className="min-h-screen w-full flex items-start md:items-center justify-center bg-gradient-to-br from-[#faf3e7] to-[#f5e6d6] py-4 md:py-8 px-2">
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-xl md:shadow-2xl border border-[#f3e0c7] flex flex-col p-0 overflow-hidden backdrop-blur-sm">
        <form onSubmit={submit} className="w-full flex flex-col gap-6 px-5 sm:px-7 md:px-10 pt-6 pb-8 md:py-10">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <div className="flex items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#f3e0c7]/60 p-2 mb-3">
              <img
                src="/logo.png"
                alt="Trawell"
                className="h-14 w-auto sm:h-16 md:h-18 object-contain drop-shadow-sm"
              />
            </div>
            <p className="text-[0.65rem] sm:text-xs md:text-sm text-[#234857]/80 font-semibold uppercase tracking-wider">Personalized Travel Preferences</p>
          </div>
          <div className="text-center -mt-1 mb-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#b64805] tracking-tight mb-3">
              Let's Get Started
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Before we dive into understanding your travel preferences, we'd love to know a bit about you. This helps us personalize your experience and keep you updated on new features.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 tracking-wide" htmlFor="user-name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300/70 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 px-4 py-3 outline-none bg-[#f9f6f2] text-sm sm:text-base shadow-inner"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 tracking-wide" htmlFor="user-email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300/70 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 px-4 py-3 outline-none bg-[#f9f6f2] text-sm sm:text-base shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 tracking-wide" htmlFor="user-phone">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="user-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-300/70 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 px-4 py-3 outline-none bg-[#f9f6f2] text-sm sm:text-base shadow-inner"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full px-6 py-4 rounded-2xl font-semibold text-white bg-[#c55510] hover:bg-[#b84c08] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#c55510]/30"
            >
              Continue
            </button>
          </div>

          <p className="text-[0.65rem] sm:text-xs text-gray-500 mt-2 text-center leading-relaxed">
            We respect your privacy. Your information is only used to enhance your experience and will never be shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;