import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  History,
  TrendingUp,
  Award,
  FileText,
  Loader2,
  Layers,
  ChevronLeft,
  X as CloseIcon,
  Rocket,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { Test, ExamCategory, Subject } from '@/types';
import { ScoreBoard } from './ScoreBoard';

export const StudentDashboard: React.FC<{ 
  userName?: string,
  onStartExam: (exam: Test, categoryName: string) => void,
  initialResult?: any,
  onClearResult?: () => void
}> = ({ userName, onStartExam, initialResult, onClearResult }) => {
  const [upcomingExams, setUpcomingExams] = useState<Test[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat?.name === 'Live Exam') return 'Live Exams';
    return cat?.name || 'General';
  };
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'General';

  useEffect(() => {
    if (initialResult) {
      // Use the detailed result passed from ExamInterface
      const transformedResult = {
        id: initialResult.examId,
        name: initialResult.name || 'Mock Test',
        category: initialResult.category || 'General',
        subject: initialResult.subject || 'General',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round(initialResult.score),
        maxScore: initialResult.maxScore || 100,
        correct: initialResult.correct,
        incorrect: initialResult.incorrect,
        unattempted: initialResult.unattempted,
        accuracy: Math.round(initialResult.accuracy),
        percentile: initialResult.percentile || 95.5,
        rank: initialResult.rank || 124,
        totalStudents: initialResult.totalStudents || 10000,
        status: 'Completed',
        questions: initialResult.questions,
        answers: initialResult.answers
      };
      setSelectedResult(transformedResult);
      if (onClearResult) onClearResult();
    }
  }, [initialResult]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exams, cats, subs] = await Promise.all([
          apiService.getExams(),
          apiService.getCategories(),
          apiService.getSubjects()
        ]);
        // Only show 'live', 'scheduled', or 'completed' exams to students. Drafts are hidden.
        const visibleExams = exams.filter(e => 
          ['live', 'scheduled', 'completed'].includes(e.status.toLowerCase())
        );
        setUpcomingExams(visibleExams);
        setCategories(cats);
        setSubjects(subs);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const liveExamCategory = categories.find(c => c.name === 'Live Exam');
  const liveExamCategoryId = liveExamCategory?.id || 'live-exams-cat';

  const parseExamTime = (startTime?: string) => {
    if (!startTime) return new Date();
    // If it's a time string like "10:00", combine with today's date
    if (startTime.includes(':') && !startTime.includes('-') && !startTime.includes('T')) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
    const date = new Date(startTime);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const categoryExams = upcomingExams.filter(e => {
    const matchCategory = e.categoryId === selectedCategoryId;
    const matchSubject = !selectedSubjectId || e.subjectId === selectedSubjectId;
    return matchCategory && matchSubject;
  });

  const categorySubjects = subjects.filter(s => s.categoryId === selectedCategoryId);

  const completedExams = [
    { 
      id: '3', 
      name: 'SSC CGL Tier 1 Mock', 
      category: 'SSC', 
      subject: 'General Awareness', 
      date: 'Mar 24', 
      score: 92, 
      maxScore: 100,
      correct: 23,
      incorrect: 2,
      unattempted: 0,
      accuracy: 92,
      percentile: 98.5,
      rank: 42,
      totalStudents: 12500,
      status: 'Passed',
      questions: [
        {
          id: 'q1',
          text: 'Which of the following is the capital of France?',
          options: [
            { id: 'a', text: 'London' },
            { id: 'b', text: 'Paris' },
            { id: 'c', text: 'Berlin' },
            { id: 'd', text: 'Madrid' }
          ],
          correctAnswer: 'b',
          explanation: 'Paris is the capital and most populous city of France.'
        },
        {
          id: 'q2',
          text: 'What is the largest planet in our solar system?',
          options: [
            { id: 'a', text: 'Earth' },
            { id: 'b', text: 'Mars' },
            { id: 'c', text: 'Jupiter' },
            { id: 'd', text: 'Saturn' }
          ],
          correctAnswer: 'c',
          explanation: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.'
        }
      ],
      answers: {
        'q1': 'b',
        'q2': 'a'
      }
    },
    { 
      id: '4', 
      name: 'IBPS PO Prelims Quiz', 
      category: 'Banking', 
      subject: 'Quantitative Aptitude', 
      date: 'Mar 20', 
      score: 88, 
      maxScore: 100,
      correct: 22,
      incorrect: 3,
      unattempted: 0,
      accuracy: 88,
      percentile: 96.2,
      rank: 156,
      totalStudents: 8400,
      status: 'Passed',
      questions: [
        {
          id: 'q3',
          text: 'What is 15% of 200?',
          options: [
            { id: 'a', text: '20' },
            { id: 'b', text: '30' },
            { id: 'c', text: '40' },
            { id: 'd', text: '50' }
          ],
          correctAnswer: 'b',
          explanation: '15% of 200 = (15/100) * 200 = 15 * 2 = 30.'
        }
      ],
      answers: {
        'q3': 'b'
      }
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (selectedResult) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
        <div className="sticky top-0 z-[110] bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 truncate pr-4">{selectedResult.name} - Results</h2>
          <button 
            onClick={() => setSelectedResult(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <ScoreBoard 
          examTitle={selectedResult.name}
          userName={userName || "Student"}
          totalQuestions={selectedResult.correct + selectedResult.incorrect + selectedResult.unattempted}
          correct={selectedResult.correct}
          incorrect={selectedResult.incorrect}
          unattempted={selectedResult.unattempted}
          score={selectedResult.score}
          maxScore={selectedResult.maxScore}
          accuracy={selectedResult.accuracy}
          percentile={selectedResult.percentile}
          rank={selectedResult.rank}
          totalStudents={selectedResult.totalStudents}
          questions={selectedResult.questions}
          answers={selectedResult.answers}
          onReattempt={() => {
            // Find the exam and start it
            const exam = upcomingExams.find(e => e.id === selectedResult.id) || upcomingExams[0];
            onStartExam(exam, selectedResult.category);
            setSelectedResult(null);
          }}
          onBackToDashboard={() => setSelectedResult(null)}
        />
      </div>
    );
  }

  const isLiveExam = selectedCategoryId === liveExamCategoryId;
  
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.name === 'Live Exam') return -1;
    if (b.name === 'Live Exam') return 1;
    return 0;
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 lg:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {selectedCategoryId && (
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="p-2 hover:bg-surface-container rounded-full transition-all text-on-surface-variant"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline tracking-tight text-on-surface">
              {selectedCategoryId ? getCategoryName(selectedCategoryId) : 'Explore Categories'}
            </h2>
          </div>
          <p className="text-on-surface-variant text-sm md:text-base max-w-md leading-relaxed">
            {selectedCategoryId 
              ? `Select a mock exam from ${getCategoryName(selectedCategoryId)} to begin your practice.`
              : 'Choose a category to view available mock exams and practice tests.'}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-2xl w-fit">
          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-xl shadow-sm flex items-center gap-2">
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-on-surface">System Ready</span>
          </div>
          <div className="px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {upcomingExams.length} Live Exams
            </span>
          </div>
        </div>
      </div>

      {!selectedCategoryId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedCategories.map((cat, i) => {
            const isLiveCat = cat.name === 'Live Exam';
            const count = upcomingExams.filter(e => e.categoryId === cat.id).length;
            
            if (isLiveCat) {
              const activeLiveCount = upcomingExams.filter(e => {
                if (e.categoryId !== cat.id) return false;
                const examTime = parseExamTime(e.startTime);
                const endTime = new Date(examTime.getTime() + (e.duration * 1000));
                const status = e.status.toLowerCase();
                return (status === 'live' || status === 'scheduled') && currentTime < endTime;
              }).length;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={cat.id}
                  whileHover={{ y: -5 }}
                  className="bg-tertiary-fixed p-6 md:p-8 rounded-3xl shadow-sm border border-tertiary/20 flex flex-col gap-6 group cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedSubjectId(null);
                  }}
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-tertiary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-tertiary/20 animate-pulse">
                      Live Now
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/50 text-tertiary w-fit">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-tertiary-on-fixed mb-2">Live Exams</h3>
                    <p className="text-tertiary-on-fixed-variant text-sm line-clamp-2 leading-relaxed">{cat.description || 'Join mass-level competitive assessments scheduled for specific time slots.'}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-tertiary/10">
                    <span className="text-xs font-bold text-tertiary-on-fixed-variant uppercase tracking-widest">
                      {activeLiveCount} Active
                    </span>
                    <div className="flex items-center gap-2 text-tertiary font-bold text-sm">
                      Join Now <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={cat.id}
                whileHover={{ y: -5 }}
                className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-6 group cursor-pointer relative overflow-hidden"
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSelectedSubjectId(null);
                }}
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20">
                    Free
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all w-fit">
                  <Layers className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-headline text-on-surface mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-container/50">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{count} Mock Exams</span>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    View Mocks <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Subject Filter Bar */}
          {categorySubjects.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 bg-surface-container-low p-2 rounded-2xl w-fit">
              <button
                onClick={() => setSelectedSubjectId(null)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  !selectedSubjectId 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-container"
                )}
              >
                All Subjects
              </button>
              {categorySubjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedSubjectId === sub.id 
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                      : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-surface-container">
            <div className="p-6 md:p-8 border-b border-surface-container flex items-center justify-between">
              <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight">
                {selectedSubjectId ? getSubjectName(selectedSubjectId) : 'All Mock Exams'}
              </h3>
              <button 
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedSubjectId(null);
                }}
                className="text-primary text-xs md:text-sm font-bold hover:underline"
              >
                Back to Categories
              </button>
            </div>
            <div className="divide-y divide-surface-container">
              {categoryExams.length > 0 ? (
                categoryExams.map((exam) => (
                  <div 
                    key={exam.id} 
                    onClick={() => {
                      const examTime = parseExamTime(exam.startTime);
                      const endTime = new Date(examTime.getTime() + (exam.duration * 1000));
                      const diff = examTime.getTime() - currentTime.getTime();
                      const isLive = exam.status === 'Live';
                      const isScheduled = exam.status === 'Scheduled';
                      const isJoinable = isLive || (isScheduled && diff < 300000);
                      const isEnded = currentTime >= endTime;

                      if (isLiveExam) {
                        if (!isEnded && isJoinable) {
                          onStartExam({ ...exam, subject: getSubjectName(exam.subjectId) }, 'Live Exam');
                        }
                      } else {
                        onStartExam({ ...exam, subject: getSubjectName(exam.subjectId) }, getCategoryName(exam.categoryId));
                      }
                    }}
                    className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-bright transition-colors group cursor-pointer"
                  >
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                            {getSubjectName(exam.subjectId)}
                          </span>
                          <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {Math.floor(exam.duration / 60)}m
                          </span>
                          <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {(exam.questions || []).length} Questions
                          </span>
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold font-headline text-on-surface group-hover:text-primary transition-colors leading-tight">
                          {exam.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-on-surface-variant font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {exam.startTime ? new Date(exam.startTime).toLocaleDateString() : '2026-03-27'}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {exam.startTime ? new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                        {isLiveExam ? (
                          (() => {
                            const examTime = parseExamTime(exam.startTime);
                            const endTime = new Date(examTime.getTime() + (exam.duration * 1000));
                            const diff = examTime.getTime() - currentTime.getTime();
                            
                            const isLive = exam.status === 'Live';
                            const isScheduled = exam.status === 'Scheduled';
                            
                            const isJoinable = isLive || (isScheduled && diff < 300000);
                            const isBefore = isScheduled && diff >= 300000;
                            const isEnded = currentTime >= endTime;
                            
                            if (isEnded) {
                              return (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartExam({ ...exam, subject: getSubjectName(exam.subjectId) }, 'Live Exam Mock');
                                  }}
                                  className="px-8 md:px-10 py-3 md:py-3.5 bg-surface-container-high text-on-surface font-bold rounded-xl text-xs md:text-sm hover:bg-surface-container-highest transition-all border border-surface-container flex items-center justify-center gap-2.5"
                                >
                                  Take Mock
                                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                                </button>
                              );
                            }

                            if (isBefore) {
                              return (
                                <div className="px-6 py-3 bg-surface-container text-on-surface-variant font-bold rounded-xl text-xs flex items-center gap-2">
                                  <Timer className="h-4 w-4" />
                                  Starts in {Math.floor(diff / 60000)}m
                                </div>
                              );
                            }
                            
                            return (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartExam({ ...exam, subject: getSubjectName(exam.subjectId) }, 'Live Exam');
                                }}
                                className="px-8 md:px-10 py-3 md:py-3.5 bg-tertiary text-white font-bold rounded-xl text-xs md:text-sm shadow-xl shadow-tertiary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2.5"
                              >
                                Login to Exam
                                <Rocket className="h-4 w-4 md:h-5 md:w-5" />
                              </button>
                            );
                          })()
                        ) : (
                          <>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="px-6 md:px-8 py-3 md:py-3.5 bg-surface-container-high text-on-surface font-bold rounded-xl text-xs md:text-sm hover:bg-surface-container-highest transition-all border border-surface-container"
                            >
                              Instructions
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartExam({ ...exam, subject: getSubjectName(exam.subjectId) }, getCategoryName(exam.categoryId));
                              }}
                              className="px-8 md:px-10 py-3 md:py-3.5 bg-primary text-on-primary font-bold rounded-xl text-xs md:text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2.5"
                            >
                              Start Mock
                              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-on-surface-variant opacity-30">
                    <FileText className="h-8 w-8" />
                  </div>
                  <p className="text-on-surface-variant font-medium">No mock exams found in this selection</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm border border-surface-container flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0">
              <BookOpen className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight">Preparation Resources</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">Access study materials, practice quizzes, and previous year papers to boost your performance.</p>
            </div>
            <button className="w-full md:w-auto px-8 py-3.5 border-2 border-surface-container rounded-xl text-sm font-bold text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all shadow-sm">
              Browse Library
            </button>
          </section>
        </div>

        <div className="space-y-8 md:space-y-12">
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-surface-container">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface tracking-tight">Recent Results</h3>
              <History className="h-5 w-5 text-on-surface-variant" />
            </div>
            <div className="space-y-8 md:space-y-10">
              {completedExams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => setSelectedResult(exam)}
                >
                  <div className="space-y-1.5">
                    <p className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{exam.subject}</p>
                    <h4 className="font-bold font-headline text-base md:text-lg text-on-surface group-hover:text-primary transition-colors leading-tight">{exam.name}</h4>
                    <p className="text-[10px] md:text-[11px] font-bold text-outline uppercase tracking-widest">{exam.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl md:text-2xl font-black font-headline text-primary">{exam.score}/{exam.maxScore}</p>
                    <span className="text-[10px] md:text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">{exam.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 md:mt-12 py-4 border-2 border-surface-container rounded-xl text-sm md:text-base font-bold text-on-surface-variant hover:bg-surface-container transition-all shadow-sm">
              View All Results
            </button>
          </section>

          <section className="bg-slate-900 rounded-3xl p-6 md:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="p-3 bg-white/10 rounded-xl w-fit mb-6 md:mb-8">
                <AlertCircle className="h-6 w-6 text-indigo-200" />
              </div>
              <h3 className="font-headline font-bold text-xl md:text-2xl mb-3 tracking-tight">Proctoring Notice</h3>
              <p className="text-indigo-200 text-sm md:text-base leading-relaxed mb-8 md:mb-10">
                All exams are monitored via AI-proctoring. Ensure your camera is functional and your environment is quiet before entering the exam room.
              </p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-xl text-sm md:text-base font-bold font-headline hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                Run System Check
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
