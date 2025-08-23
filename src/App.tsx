import { useState, useEffect } from 'react';
import { upsertUser, saveQuiz, saveStory, hasStory, hasEarlyAccess, userSummary, joinEarlyAccess } from './lib/api';
import UserDetailsForm from './components/UserDetailsForm.tsx';
import LandingPage from './components/LandingPage.tsx';
import Quiz from './components/Quiz.tsx';
import Results from './components/Results.tsx';
import Feedback from './components/Feedback.tsx';
import EarlyAccess from './components/EarlyAccess.tsx';
import { supabaseReady } from './lib/supabase';

export interface QuizAnswer {
  questionId: number;
  selectedOptions: string[];
}

export interface UserDetails {
  name: string;
  email: string;
  phone?: string;
}
function App() {
  const [currentPage, setCurrentPage] = useState<'userDetails' | 'landing' | 'quiz' | 'results' | 'feedback' | 'earlyAccess'>('userDetails');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showEarlySupporterToast, setShowEarlySupporterToast] = useState(false);
  // Local flags to enforce duplicate submission prompts even if network check fails
  // Quiz taken flag (server + local)
  const [quizTaken, setQuizTaken] = useState(false);
  const [hasSubmittedStory, setHasSubmittedStory] = useState(false);
  const [hasJoinedEarlyAccess, setHasJoinedEarlyAccess] = useState(false);

  const handleUserDetailsSubmitted = async (details: UserDetails) => {
    const normalized = { ...details, email: details.email.toLowerCase() };
    setUserDetails(normalized);
    try {
      await upsertUser(normalized);
      // Prefetch summary for quiz status & early access status
      const [summary, early] = await Promise.all([
        userSummary(normalized.email),
        hasEarlyAccess(normalized.email).catch(() => false)
      ]);
      setQuizTaken(summary.quizCount > 0);
      setHasJoinedEarlyAccess(early);
    } catch (e) {
      console.warn('Failed to sync user to server', e);
    }
    setCurrentPage('landing');
  };

  const handleStartQuiz = async () => {
    // Simply navigate; duplicate awareness handled by LandingPage display
    setCurrentPage('quiz');
    setQuizAnswers([]);
  };

  const handleQuizComplete = async (answers: QuizAnswer[]) => {
    setQuizAnswers(answers);
    setQuizTaken(true);
  if (userDetails?.email) {
      try {
    await saveQuiz(userDetails.email.toLowerCase(), answers);
      } catch (e) {
        console.warn('Failed to save quiz to server', e);
      }
    }
    setCurrentPage('results');
  };

  const handleRestartQuiz = () => {
    setCurrentPage('landing');
    setQuizAnswers([]);
  };

  const handleOpenFeedback = async () => {
    let serverExists = false;
  if (userDetails?.email) {
      try { serverExists = await hasStory(userDetails.email); } catch (e) { console.warn('Story existence check failed', e); }
    }
  if (hasSubmittedStory || serverExists) {
      const proceed = window.confirm('You already submitted a story. Overwrite it?');
      if (!proceed) return;
    }
    setCurrentPage('feedback');
  };

  const handleFeedbackSubmitted = async (text: string) => {
    try {
      const key = 'trawell_feedback';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ text, userDetails, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setHasSubmittedStory(true);
  if (userDetails?.email) {
      try {
    await saveStory(userDetails.email.toLowerCase(), text);
      } catch (e) {
        console.warn('Failed to save story to server', e);
      }
    }
    // stay on feedback page; the component will show a thank-you state
  };

  const handleFeedbackCancel = () => {
    setCurrentPage(quizAnswers.length ? 'results' : 'landing');
  };

  const handleOpenEarlyAccess = async () => {
    let serverExists = false;
  if (userDetails?.email) {
      try { serverExists = await hasEarlyAccess(userDetails.email); } catch (e) { console.warn('Early access existence check failed', e); }
    }
    if (hasJoinedEarlyAccess || serverExists) {
      const proceed = window.confirm('You are already on the early access list. Open it again?');
      if (!proceed) return;
    }
    setCurrentPage('earlyAccess');
  };

  const handleEarlyAccessSubmitted = async () => {
    try {
      const key = 'trawell_early_access';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...userDetails, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    if (userDetails?.email) {
      try { await joinEarlyAccess(userDetails.email.toLowerCase()); } catch (e) { console.warn('Failed to mark early access', e); }
    }
    setHasJoinedEarlyAccess(true);
    setCurrentPage('landing');
    setShowEarlySupporterToast(true);
  };

  // Fetch summary whenever landing is shown (in case of page reload state loss, future enhancement could persist userDetails externally)
  useEffect(() => {
    (async () => {
      if (currentPage === 'landing' && userDetails?.email) {
        try {
          const summary = await userSummary(userDetails.email.toLowerCase());
          setQuizTaken(summary.quizCount > 0);
        } catch (e) {
          console.warn('Failed to refresh summary', e);
        }
      }
    })();
  }, [currentPage, userDetails?.email]);

  const handleEarlyAccessCancel = () => {
    setCurrentPage(quizAnswers.length ? 'results' : 'landing');
  };

  if (!supabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#f9f0df] via-[#f9f0df] to-[#f5ead6]">
        <div className="max-w-md w-full bg-white/90 rounded-2xl shadow-xl p-6 text-center space-y-4">
          <h1 className="text-xl font-bold">Configuration Missing</h1>
          <p className="text-gray-700 text-sm">Environment variables <code>VITE_SUPABASE_URL</code> and/or <code>VITE_SUPABASE_ANON_KEY</code> are not set at build time.</p>
          <ol className="text-left text-xs list-decimal list-inside space-y-1 text-gray-600">
            <li>Add them in a root <code>.env</code> file locally (not inside <code>src/</code>).</li>
            <li>On Netlify: Site Settings → Environment Variables → add both (names must start with VITE_).</li>
            <li>Redeploy the site.</li>
          </ol>
          <p className="text-xs text-gray-500">This message only appears when variables are missing.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f9f0df] via-[#f9f0df] to-[#f5ead6]">
      {currentPage === 'userDetails' && (
        <UserDetailsForm onSubmitted={handleUserDetailsSubmitted} />
      )}
      {currentPage === 'landing' && (
  <LandingPage onStartQuiz={handleStartQuiz} onOpenFeedback={handleOpenFeedback} userDetails={userDetails} hasTakenQuiz={quizTaken} />
      )}
  {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} onExit={() => setCurrentPage('landing')} />}
      {currentPage === 'results' && (
        <Results
          answers={quizAnswers}
          onRestart={handleRestartQuiz}
          onShareStory={handleOpenFeedback}
          onEarlyAccess={handleOpenEarlyAccess}
          userDetails={userDetails}
        />
      )}
      {currentPage === 'feedback' && (
        <Feedback onCancel={handleFeedbackCancel} onSubmitted={handleFeedbackSubmitted} onEarlyAccess={handleOpenEarlyAccess} userDetails={userDetails} />
      )}
      {currentPage === 'earlyAccess' && (
        <EarlyAccess onCancel={handleEarlyAccessCancel} onSubmitted={handleEarlyAccessSubmitted} userDetails={userDetails} />
      )}
      {/* Early Supporter Toast */}
      {showEarlySupporterToast && currentPage === 'landing' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEarlySupporterToast(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Thank you for being an early supporter!</h3>
            <p className="text-gray-700 mb-4">We appreciate it.</p>
            <button className="px-6 py-2 rounded-xl bg-[#013a4e] text-white" onClick={() => setShowEarlySupporterToast(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;