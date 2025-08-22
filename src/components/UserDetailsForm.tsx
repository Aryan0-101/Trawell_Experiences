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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#faf3e7] to-[#f5e6d6] py-8 px-2">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl border border-[#f3e0c7] flex flex-col items-center p-0 md:p-0">
        {/* Header Card */}
        <div className="w-full flex flex-col items-center justify-center bg-[#fff8ef] rounded-t-3xl border-b border-[#f3e0c7] py-4 px-4">
          <img src="/logo.png" alt="Trawell" className="h-35 w-auto max-w-[150px] mb-1 object-contain drop-shadow-md" />
          <span className="text-2xl font-bold text-[#003249] tracking-tight mt-0">Welcome to Trawell Experience</span>
        </div>
        {/* Form Card */}
        <form onSubmit={submit} className="w-full flex flex-col gap-6 px-6 md:px-10 py-10">
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d2d2d] mb-2">Let's Get Started!</h1>
            <p className="text-gray-600 text-base md:text-lg">
              Before we dive into understanding your travel preferences, we'd love to know a bit about you. 
              This helps us personalize your experience and keep you updated on new features.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user-name">
                Name <span className="text-red-500">*</span>
              </label>
              <input 
                id="user-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 p-3 outline-none bg-[#f9f6f2]" 
                placeholder="Your full name" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user-email">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                id="user-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 p-3 outline-none bg-[#f9f6f2]" 
                placeholder="you@example.com" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user-phone">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <input 
                id="user-phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-300 focus:border-[#013a4e] focus:ring-2 focus:ring-[#013a4e]/20 p-3 outline-none bg-[#f9f6f2]" 
                placeholder="Your phone number" 
              />
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="submit" 
              disabled={!canSubmit}
              className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#c55510] to-[#c55510] hover:from-[#c25f23]/90 hover:to-[#c25f23]/90 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md"
            >
              Continue to Trawell Experience
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            We respect your privacy. Your information is only used to enhance your experience and will never be shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;