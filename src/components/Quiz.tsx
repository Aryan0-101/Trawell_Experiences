import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { QuizAnswer } from '../App';
import { questions } from '../data/questions';

interface QuizProps {
  onComplete: (answers: QuizAnswer[]) => void;
  onExit?: () => void; // navigate back to landing
}

const Quiz: React.FC<QuizProps> = ({ onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    const question = questions[currentQuestion];
    
    if (question.multipleSelection) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const saveAnswer = () => {
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion,
      selectedOptions: selectedOptions
    };
    
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      saveAnswer();
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        
        // Load existing answer if any
        const existingAnswer = answers.find(a => a.questionId === currentQuestion + 1);
        setSelectedOptions(existingAnswer ? existingAnswer.selectedOptions : []);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      saveAnswer();
      setCurrentQuestion(currentQuestion - 1);
      
      // Load existing answer
      const existingAnswer = answers.find(a => a.questionId === currentQuestion - 1);
      setSelectedOptions(existingAnswer ? existingAnswer.selectedOptions : []);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      saveAnswer();
      const finalAnswers = [...answers.filter(a => a.questionId !== currentQuestion), {
        questionId: currentQuestion,
        selectedOptions: selectedOptions
      }];
      onComplete(finalAnswers);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Progress & Exit */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Trawell" className="h-24 w-48 max-w-full max-h-32 rounded-lg object-contain" />
              <span className="text-xl font-semibold text-gray-800">Trawell Quiz</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} of {questions.length}
              </span>
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#013a4e] to-[#c45510] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {question.text}
            </h2>
            {question.subtitle && (
              <p className="text-lg text-gray-600">{question.subtitle}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left ${
                  selectedOptions.includes(option.id) 
                    ? 'ring-2 ring-[#013a4e] bg-[#013a4e]/5' 
                    : 'hover:shadow-2xl'
                }`}
              >
                {selectedOptions.includes(option.id) && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#013a4e]" />
                  </div>
                )}
                
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    selectedOptions.includes(option.id) 
                      ? 'bg-gradient-to-r from-[#013a4e] to-[#c45510]' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <span className={selectedOptions.includes(option.id) ? 'grayscale-0' : 'grayscale'}>
                      {option.emoji}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                  {option.label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {option.description}
                </p>
                
                <div className={`mt-4 h-1 w-full bg-gradient-to-r from-[#013a4e] to-[#c45510] rounded-full transition-all duration-300 ${
                  selectedOptions.includes(option.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                }`}></div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedOptions.length === 0}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#013a4e] to-[#c45510] hover:from-[#013a4e]/90 hover:to-[#c45510]/90 disabled:from-gray-300 disabled:to-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#013a4e] to-[#c45510] hover:from-[#013a4e]/90 hover:to-[#c45510]/90 disabled:from-gray-300 disabled:to-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                <span>Submit Quiz</span>
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;