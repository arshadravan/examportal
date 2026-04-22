import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Percent, 
  FileText, 
  Flag, 
  RotateCcw, 
  Check, 
  X, 
  Circle,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  User,
  Sun,
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface ScoreBoardProps {
  examTitle: string;
  userName: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  maxScore: number;
  accuracy: number;
  percentile: number;
  rank: number;
  totalStudents: number;
  onReattempt: () => void;
  onBackToDashboard: () => void;
  questions?: Question[];
  answers?: Record<string, string>;
  hideLeaderboard?: boolean;
  hideSolutions?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  examTitle,
  userName,
  totalQuestions,
  correct,
  incorrect,
  unattempted,
  score,
  maxScore,
  accuracy,
  percentile,
  rank,
  totalStudents,
  onReattempt,
  onBackToDashboard,
  questions = [],
  answers = {},
  hideLeaderboard = false,
  hideSolutions = false
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'leaderboard' | 'solutions'>('analysis');
  const [currentSolutionIdx, setCurrentSolutionIdx] = useState(0);
  const [revealedOptions, setRevealedOptions] = useState<Record<string, Set<string>>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (questionId: string, optionId: string) => {
    setRevealedOptions(prev => {
      const currentSet = new Set(prev[questionId] || []);
      currentSet.add(optionId);
      return { ...prev, [questionId]: currentSet };
    });
  };

  useEffect(() => {
    if (activeTab === 'solutions' && scrollRef.current) {
      const activeButton = scrollRef.current.children[currentSolutionIdx] as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentSolutionIdx, activeTab]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans overflow-y-auto custom-scrollbar">
      {/* Top Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex items-center gap-8 shrink-0 sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('analysis')}
          className={cn(
            "py-4 text-sm font-bold transition-all border-b-2",
            activeTab === 'analysis' ? "text-black border-black" : "text-gray-400 border-transparent"
          )}
        >
          Analysis
        </button>
        {!hideLeaderboard && (
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={cn(
              "py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'leaderboard' ? "text-black border-black" : "text-gray-400 border-transparent"
            )}
          >
            Leaderboard
          </button>
        )}
        {!hideSolutions && (
          <button 
            onClick={() => setActiveTab('solutions')}
            className={cn(
              "py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'solutions' ? "text-black border-black" : "text-gray-400 border-transparent"
            )}
          >
            Solutions
          </button>
        )}
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-4">
        {activeTab === 'analysis' && (
          <>
            {/* Reattempt Banner */}
            <button 
              onClick={onReattempt}
              className="w-full bg-[#E8F0FE] p-4 rounded-3xl flex items-center justify-between group hover:bg-[#D2E3FC] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#1A73E8] font-bold text-sm">Reattempt Test</span>
                <div className="bg-[#1A73E8] rounded-full p-1">
                  <ChevronRight className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="opacity-20">
                <FileText className="h-10 w-10 text-[#1A73E8]" />
              </div>
            </button>

            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Summary</h2>
              <div className="flex items-center gap-2">
                <div className="bg-white border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                  General <ChevronRight className="h-2 w-2 rotate-90" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Cut-off: 71-74</span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-3">
              {/* Rank Card */}
              <div className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-2.5 rounded-xl">
                    <Flag className="h-5 w-5 text-red-400" />
                  </div>
                  <span className="font-bold text-gray-600">Rank</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-gray-800">{rank.toLocaleString()}</span>
                  <span className="text-sm font-bold text-gray-400">/{totalStudents.toLocaleString()}</span>
                </div>
              </div>

              {/* Score Card */}
              <div className="bg-white p-4 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 p-2.5 rounded-xl">
                      <Trophy className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="font-bold text-gray-600">Score</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-800">{score.toFixed(2)}</span>
                    <span className="text-sm font-bold text-gray-400">/{maxScore}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-50">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Average Score:</span>
                    <span className="text-[10px] font-bold text-gray-600 ml-1">47.3</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Best Score:</span>
                    <span className="text-[10px] font-bold text-gray-600 ml-1">98</span>
                  </div>
                </div>
              </div>

              {/* Percentile, Accuracy, Attempted Group */}
              <div className="bg-white p-4 rounded-3xl shadow-sm space-y-6">
                {/* Percentile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 p-2.5 rounded-xl">
                      <User className="h-5 w-5 text-purple-300" />
                    </div>
                    <span className="font-bold text-gray-600">Percentile</span>
                  </div>
                  <span className="text-lg font-black text-gray-800">{percentile.toFixed(2)} %</span>
                </div>

                {/* Accuracy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-2.5 rounded-xl">
                      <Sun className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="font-bold text-gray-600">Accuracy</span>
                  </div>
                  <span className="text-lg font-black text-gray-800">{accuracy.toFixed(2)} %</span>
                </div>

                {/* Qs. Attempted */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="font-bold text-gray-600">Qs. Attempted</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-800">{correct + incorrect}</span>
                    <span className="text-sm font-bold text-gray-400">/{totalQuestions}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Correct:</span>
                    <span className="text-xs font-black text-gray-800">{correct}</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center gap-2">
                  <div className="bg-red-100 p-1 rounded-full">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Incorrect:</span>
                    <span className="text-xs font-black text-gray-800">{incorrect}</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <Circle className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Unattempted:</span>
                    <span className="text-xs font-black text-gray-800">{unattempted}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 pb-8">
              <button 
                onClick={onBackToDashboard}
                className="w-full bg-black text-white py-4 rounded-3xl font-bold text-sm shadow-xl hover:bg-gray-800 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-500">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Leaderboard Coming Soon</h3>
            <p className="text-gray-500 text-sm">We're currently processing the final rankings for this mock exam. Check back in a few minutes!</p>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="space-y-6 flex flex-col h-full">
            {questions.length > 0 ? (
              <>
                {/* Sliding Question Navigator */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 sticky top-16 z-40">
                  <div 
                    ref={scrollRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1"
                  >
                    {questions.map((q, idx) => {
                      const userAnswer = answers[q.id];
                      const isCorrect = userAnswer === q.correctAnswer;
                      const isUnattempted = !userAnswer;
                      const isCurrent = currentSolutionIdx === idx;

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentSolutionIdx(idx)}
                          className={cn(
                            "min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all shrink-0",
                            isUnattempted ? "bg-gray-200 text-gray-500" :
                            isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white",
                            isCurrent && "ring-2 ring-black ring-offset-2 scale-110 shadow-lg"
                          )}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Content with Sliding Animation */}
                <div className="relative overflow-hidden min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSolutionIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6"
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-sm",
                            !answers[questions[currentSolutionIdx].id] ? "bg-gray-400" :
                            answers[questions[currentSolutionIdx].id] === questions[currentSolutionIdx].correctAnswer ? "bg-green-600" : "bg-red-600"
                          )}>
                            Question {currentSolutionIdx + 1}
                          </span>
                          {answers[questions[currentSolutionIdx].id] && (
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              answers[questions[currentSolutionIdx].id] === questions[currentSolutionIdx].correctAnswer
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            )}>
                              {answers[questions[currentSolutionIdx].id] === questions[currentSolutionIdx].correctAnswer ? 'Correct' : 'Incorrect'}
                            </span>
                          )}
                          {!answers[questions[currentSolutionIdx].id] && (
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              Unattempted
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-lg font-bold text-gray-800 leading-relaxed">
                        {questions[currentSolutionIdx].text}
                      </p>

                      {/* Interactive Options */}
                      <div className="space-y-3">
                        {questions[currentSolutionIdx].options.map((opt) => {
                          const questionId = questions[currentSolutionIdx].id;
                          const isRevealed = revealedOptions[questionId]?.has(opt.id);
                          const isCorrect = opt.id === questions[currentSolutionIdx].correctAnswer;
                          const isUserAnswer = opt.id === answers[questionId];
                          
                          // Show if it's the correct answer, OR if the user clicked it, OR if it was the user's original answer
                          const shouldShowStatus = isRevealed || isUserAnswer || isCorrect;

                          return (
                            <button 
                              key={opt.id}
                              onClick={() => handleOptionClick(questionId, opt.id)}
                              className={cn(
                                "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                                shouldShowStatus 
                                  ? isCorrect 
                                    ? "bg-green-50 border-green-200 text-green-800" 
                                    : isUserAnswer || isRevealed
                                      ? "bg-red-50 border-red-200 text-red-800"
                                      : "bg-gray-50 border-gray-100"
                                  : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <span className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm uppercase transition-all",
                                  shouldShowStatus
                                    ? isCorrect
                                      ? "bg-green-600 text-white"
                                      : isUserAnswer || isRevealed
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-200 text-gray-500"
                                    : "bg-white border border-gray-200 text-gray-400 group-hover:border-primary group-hover:text-primary"
                                )}>
                                  {opt.id}
                                </span>
                                <span className={cn(
                                  "font-medium",
                                  shouldShowStatus && isCorrect && "font-bold"
                                )}>
                                  {opt.text}
                                </span>
                              </div>
                              {shouldShowStatus && (
                                isCorrect 
                                  ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  : (isUserAnswer || isRevealed) && <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation at Bottom */}
                      {questions[currentSolutionIdx].explanation && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 pt-6 border-t border-gray-100 space-y-4"
                        >
                          <div className="flex items-center gap-2 text-primary">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Detailed Explanation</span>
                          </div>
                          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <BookOpen className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed relative z-10">
                              {questions[currentSolutionIdx].explanation}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between gap-4 pt-4">
                  <button
                    disabled={currentSolutionIdx === 0}
                    onClick={() => setCurrentSolutionIdx(prev => prev - 1)}
                    className="flex-1 bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    disabled={currentSolutionIdx === questions.length - 1}
                    onClick={() => setCurrentSolutionIdx(prev => prev + 1)}
                    className="flex-1 bg-black text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No Solutions Available</h3>
                <p className="text-gray-500 text-sm">Detailed solutions for this exam are not yet available.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
