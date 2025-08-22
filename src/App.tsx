import { useState } from 'react';
import { upsertUser, saveQuiz, saveStory, hasQuiz } from './lib/api';
import UserDetailsForm from './components/UserDetailsForm.tsx';
import LandingPage from './components/LandingPage.tsx';
import Quiz from './components/Quiz.tsx';
import Results from './components/Results.tsx';
import Feedback from './components/Feedback.tsx';
import EarlyAccess from './components/EarlyAccess.tsx';

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

  const handleUserDetailsSubmitted = async (details: UserDetails) => {
    setUserDetails(details);
    try {
      await upsertUser(details);
    } catch (e) {
      console.warn('Failed to sync user to server', e);
    }
    setCurrentPage('landing');
  };

  const handleStartQuiz = async () => {
    // Check if already submitted and confirm re-take
    if (userDetails?.email) {
      try {
        const exists = await hasQuiz(userDetails.email);
        if (exists) {
          const confirmResubmit = window.confirm('You have already submitted the quiz. Do you want to retake and resubmit?');
          if (!confirmResubmit) return;
        }
      } catch (e) {
        // Non-blocking if check fails
        console.warn('Quiz existence check failed', e);
      }
    }
    setCurrentPage('quiz');
    setQuizAnswers([]);
  };

  const handleQuizComplete = async (answers: QuizAnswer[]) => {
    setQuizAnswers(answers);
    if (userDetails?.email) {
      try {
        await saveQuiz(userDetails.email, answers);
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

  const handleOpenFeedback = () => {
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
    if (userDetails?.email) {
      try {
        await saveStory(userDetails.email, text);
      } catch (e) {
        console.warn('Failed to save story to server', e);
      }
    }
    // stay on feedback page; the component will show a thank-you state
  };

  const handleFeedbackCancel = () => {
    setCurrentPage(quizAnswers.length ? 'results' : 'landing');
  };

  const handleOpenEarlyAccess = () => {
    setCurrentPage('earlyAccess');
  };

  const handleEarlyAccessSubmitted = () => {
    try {
      const key = 'trawell_early_access';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...userDetails, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
  setCurrentPage('landing');
  setShowEarlySupporterToast(true);
  };

  const handleEarlyAccessCancel = () => {
    setCurrentPage(quizAnswers.length ? 'results' : 'landing');
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f9f0df] via-[#f9f0df] to-[#f5ead6]">
      {currentPage === 'userDetails' && (
        <UserDetailsForm onSubmitted={handleUserDetailsSubmitted} />
      )}
      {currentPage === 'landing' && (
    <LandingPage onStartQuiz={handleStartQuiz} onOpenFeedback={handleOpenFeedback} userDetails={userDetails} />
      )}
      {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
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