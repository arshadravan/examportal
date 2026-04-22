import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  AlertCircle,
  CheckCircle2,
  Shield,
  Maximize2,
  Menu,
  X,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';

import { ScoreBoard } from './ScoreBoard';

interface ExamInterfaceProps {
  exam: {
    id: string;
    title: string;
    subject: string;
    categoryName?: string;
    duration: number; // in seconds
    questions: Question[];
    questionTimer?: number; // optional per-question timer in seconds
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
  };
  userName?: string;
  rollNumber?: string;
  onComplete: (results: any) => void;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ 
  exam, 
  onComplete,
  userName = "Arsh Hassan",
  rollNumber = "20260328"
}) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(exam.duration);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(exam.questionTimer || 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    // Anti-cheat measures: Disable right-click, copy, paste, and common developer shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+V
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'v'))
      ) {
        e.preventDefault();
      }
    };
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
    let qs = [...(exam.questions || [])];
    if (exam.shuffleQuestions) {
      qs = qs.sort(() => Math.random() - 0.5);
    }
    if (exam.shuffleOptions) {
      qs = qs.map(q => ({
        ...q,
        options: [...(q.options || [])].sort(() => Math.random() - 0.5)
      }));
    }
    setShuffledQuestions(qs);
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      if (exam.questionTimer) {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto-advance to next question if time runs out
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
              setCurrentQuestionIndex(prevIdx => prevIdx + 1);
              return exam.questionTimer || 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, currentQuestionIndex, shuffledQuestions.length]);

  useEffect(() => {
    if (exam.questionTimer) {
      setQuestionTimeLeft(exam.questionTimer);
    }
  }, [currentQuestionIndex, exam.questionTimer]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    setVisitedQuestions(prev => new Set(prev).add(currentQuestionIndex));
  }, [currentQuestionIndex]);

  const getQuestionStatus = (idx: number) => {
    const isAnswered = !!answers[shuffledQuestions[idx]?.id];
    const isFlagged = flaggedQuestions.has(idx);
    const isVisited = visitedQuestions.has(idx);

    if (isFlagged) return 'flagged';
    if (isAnswered) return 'answered';
    if (isVisited) return 'unanswered';
    return 'not-visited';
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId
    });
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex);
    } else {
      newFlagged.add(currentQuestionIndex);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);
  };

  const clearResponse = () => {
    if (isSubmitted) return;
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
  };

  const markForReviewAndNext = () => {
    if (isSubmitted) return;
    const newFlagged = new Set(flaggedQuestions);
    newFlagged.add(currentQuestionIndex);
    setFlaggedQuestions(newFlagged);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const saveAndNext = () => {
    if (isSubmitted) return;
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!shuffledQuestions.length) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center space-y-6">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant opacity-30">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-headline text-on-surface">No Questions Found</h2>
          <p className="text-on-surface-variant max-w-md">This mock exam doesn't have any questions assigned to it yet. Please contact the administrator.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    const totalQuestions = shuffledQuestions.length;
    const attempted = Object.keys(answers).length;
    const unattempted = totalQuestions - attempted;
    const correct = shuffledQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    const incorrect = attempted - correct;
    const score = (correct * 4) - (incorrect * 1);
    const maxScore = totalQuestions * 4;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    
    // Mock data for rank and percentile (as seen in screenshot)
    const rank = 16817; 
    const totalStudents = 32596;
    const percentile = 48.42;

    const isLiveExam = exam.categoryName?.includes('Live Exam');

    return (
      <ScoreBoard 
        examTitle={exam.title}
        userName={userName}
        totalQuestions={totalQuestions}
        correct={correct}
        incorrect={incorrect}
        unattempted={unattempted}
        score={score}
        maxScore={maxScore}
        accuracy={accuracy}
        percentile={percentile}
        rank={rank}
        totalStudents={totalStudents}
        questions={shuffledQuestions}
        answers={answers}
        hideLeaderboard={isLiveExam}
        hideSolutions={isLiveExam}
        onReattempt={() => {
          setAnswers({});
          setFlaggedQuestions(new Set());
          setTimeLeft(exam.duration);
          setCurrentQuestionIndex(0);
          setIsSubmitted(false);
        }}
        onBackToDashboard={() => onComplete({
          examId: exam.id,
          name: exam.title,
          category: exam.categoryName || 'General',
          subject: exam.subject,
          questions: shuffledQuestions,
          answers,
          score,
          maxScore,
          correct,
          incorrect,
          unattempted,
          accuracy,
          percentile,
          rank,
          totalStudents
        })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#E0E0E0] flex flex-col h-screen overflow-hidden font-sans relative">
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Submit Exam?</h3>
                <p className="text-gray-500 text-sm">
                  You have attempted <span className="font-bold text-gray-900">{Object.keys(answers).length}</span> out of <span className="font-bold text-gray-900">{shuffledQuestions.length}</span> questions. Are you sure you want to end the exam?
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Yes, Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Top Header - Teal */}
      <header className="bg-[#008080] text-white px-4 py-2 flex items-center justify-between shrink-0 shadow-md z-50">
        <h1 className="text-lg font-bold truncate pr-4">{exam.title}</h1>
        <div className="flex flex-col items-end text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">Time Left :-</span>
            <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
          </div>
          <span className="font-bold mt-0.5">{userName}</span>
        </div>
      </header>

      {/* Sub-header: Subject Tabs */}
      <div className="bg-[#008080]/10 border-b border-gray-300 px-4 py-1 flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
        <button className="bg-[#008080] text-white px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 rounded-t-md">
          {exam.subject}
          <Info className="h-3 w-3" />
        </button>
        {/* Placeholder for other subjects if any */}
        <button className="bg-orange-400 text-white px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 rounded-t-md opacity-80">
          CHEMISTRY
          <Info className="h-3 w-3" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="bg-gray-200 border-b border-gray-300 px-4 py-1.5 flex items-center gap-2 shrink-0">
        <button className="bg-red-600 text-white px-4 py-1 text-[10px] font-bold uppercase rounded">SECTION A</button>
        <button className="bg-white text-gray-700 border border-gray-300 px-4 py-1 text-[10px] font-bold uppercase rounded">SECTION B</button>
      </div>

      {/* Question Info Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-1.5 flex flex-wrap items-center gap-4 shrink-0 text-[11px] font-bold text-gray-600">
        <div className="flex items-center gap-1 border border-gray-300 px-2 py-0.5 rounded bg-white">
          <span>Qus. No</span>
          <span className="text-red-600">{currentQuestionIndex + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center">+</button>
          <button className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center">-</button>
        </div>
        <div className="flex items-center gap-1">
          <span>Qus. Type :</span>
          <span className="text-black">MCQ Single</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Marks :</span>
          <span className="text-black">4</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Neg Marks :</span>
          <span className="text-black">1</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Question Navigator - Mobile: Top (Sticky) */}
        <div className="md:hidden w-full bg-gray-100 border-b border-gray-300 p-2 overflow-x-auto shrink-0 sticky top-0 z-40 shadow-sm no-scrollbar">
          <div className="flex gap-1.5">
            {shuffledQuestions.map((_, idx) => {
              const status = getQuestionStatus(idx);
              const isCurrent = currentQuestionIndex === idx;
              const isAnswered = !!answers[shuffledQuestions[idx]?.id];
              const isFlagged = flaggedQuestions.has(idx);
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={cn(
                    "h-8 w-8 shrink-0 rounded-t-lg rounded-b-sm flex items-center justify-center text-[10px] font-bold transition-all",
                    isCurrent ? "ring-2 ring-blue-500 z-10" : "",
                    isFlagged && isAnswered ? "bg-purple-600 text-white" :
                    isFlagged ? "bg-purple-600 text-white" :
                    status === 'answered' ? "bg-green-600 text-white" :
                    status === 'unanswered' ? "bg-red-600 text-white" :
                    "bg-white text-gray-500 border border-gray-300"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Question Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col custom-scrollbar bg-gray-200 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none overflow-hidden">
            <span className="text-9xl font-black rotate-[-35deg] whitespace-nowrap">SCORE EXAM</span>
          </div>

          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-6 relative z-10"
          >
            <div className="space-y-4">
              <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                {currentQuestion.text}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      "group relative p-3 md:p-4 border border-gray-300 text-left transition-all flex items-center gap-3 bg-gray-100/50 hover:bg-white",
                      answers[currentQuestion.id] === option.id && "bg-white ring-1 ring-blue-400"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 border border-gray-400 flex items-center justify-center shrink-0",
                      answers[currentQuestion.id] === option.id ? "bg-blue-600 border-blue-600" : "bg-white"
                    )}>
                      {answers[currentQuestion.id] === option.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      {option.id.toUpperCase()} - {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </main>

        {/* Sidebar / Question Navigator - Desktop/Tablet */}
        <aside className={cn(
          "hidden md:flex bg-gray-200 border-l border-gray-300 flex-col overflow-hidden shrink-0 transition-all duration-300 relative",
          isSidebarOpen ? "w-[280px] lg:w-[320px]" : "w-0 border-l-0"
        )}>
          {/* Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-[#008080] text-white p-1 rounded-l-md shadow-md z-50 hover:bg-[#006666] transition-colors"
          >
            {isSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className={cn("flex flex-col h-full", !isSidebarOpen && "invisible")}>
            {/* Legend */}
            <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-bold text-gray-600 border-b border-gray-300 bg-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-600" />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400" />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
                <span>Answered & Marked for Review</span>
              </div>
            </div>

            {/* Subject Label in Sidebar */}
            <div className="bg-orange-300 py-1 px-4 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
              {exam.subject}
            </div>

            {/* Grid */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-300/50">
              <div className="grid grid-cols-5 gap-2">
                {shuffledQuestions.map((_, idx) => {
                  const status = getQuestionStatus(idx);
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = !!answers[shuffledQuestions[idx]?.id];
                  const isFlagged = flaggedQuestions.has(idx);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={cn(
                        "h-8 w-8 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-bold transition-all relative",
                        isCurrent ? "ring-2 ring-blue-500 ring-offset-1 z-10" : "",
                        isFlagged && isAnswered ? "bg-purple-600 text-white" :
                        isFlagged ? "bg-purple-600 text-white" :
                        status === 'answered' ? "bg-green-600 text-white" :
                        status === 'unanswered' ? "bg-red-600 text-white" :
                        "bg-white text-gray-500 border border-gray-300"
                      )}
                    >
                      {idx + 1}
                      {isFlagged && isAnswered && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                          <Check className="h-2 w-2 text-purple-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle for when it's closed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-[#008080] text-white p-1 rounded-l-md shadow-md z-50 hover:bg-[#006666] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Footer: Action Buttons */}
      <footer className="bg-gray-100 border-t border-gray-300 p-2 flex flex-wrap items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={markForReviewAndNext}
            className="bg-orange-400 text-white px-4 py-1.5 rounded text-[11px] font-bold shadow-sm hover:bg-orange-500 transition-colors"
          >
            Mark for Review & Next
          </button>
          <button 
            onClick={clearResponse}
            className="bg-gray-200 text-gray-700 border border-gray-300 px-4 py-1.5 rounded text-[11px] font-bold hover:bg-gray-300 transition-colors"
          >
            Clear Response
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={saveAndNext}
            className="bg-green-600 text-white px-8 py-1.5 rounded text-[11px] font-bold shadow-sm hover:bg-green-700 transition-colors"
          >
            SAVE & NEXT
          </button>
        </div>

        {/* Isolated Submit Button at the very bottom right */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase mb-0.5">
              <span>INSTRUCTIONS</span>
            </div>
            <button 
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-green-700 text-white px-10 py-1.5 rounded text-[11px] font-bold hover:bg-green-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
