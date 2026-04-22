import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  MoreVertical, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Check,
  ChevronRight,
  Rocket,
  Layers,
  Settings,
  Timer,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { Test, Question, ExamCategory, Subject } from '@/types';

export const ExamsManagement: React.FC = () => {
  const [exams, setExams] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuickAdd, setIsQuickAdd] = useState<{ type: 'category' | 'subject' | null, value: string }>({ type: null, value: '' });

  // Form State
  const [newExam, setNewExam] = useState<Partial<Test>>({
    title: '',
    categoryId: '',
    subjectId: '',
    status: 'Live',
    duration: 60, // minutes
    startTime: new Date().toISOString().slice(0, 16),
    questionTimer: 0,
    shuffleQuestions: true,
    shuffleOptions: true
  });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const liveExamCategoryId = categories.find(c => c.name === 'Live Exam')?.id || 'live-exams-cat';

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.name === 'Live Exam') return -1;
    if (b.name === 'Live Exam') return 1;
    return a.name.localeCompare(b.name);
  });

  const fetchData = async () => {
    try {
      const [examsData, questionsData, cats, subs] = await Promise.all([
        apiService.getExams(),
        apiService.getQuestions(),
        apiService.getCategories(),
        apiService.getSubjects()
      ]);
      setExams(examsData);
      setQuestions(questionsData);
      setCategories(cats);
      setSubjects(subs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectWiseCounts = (examQuestions: Question[]) => {
    const counts: Record<string, number> = {};
    examQuestions.forEach(q => {
      const subject = subjects.find(s => s.id === q.subjectId)?.name || 'General';
      counts[subject] = (counts[subject] || 0) + 1;
    });
    return counts;
  };

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = !newExam.categoryId || q.categoryId === newExam.categoryId;
    const matchesSubject = !newExam.subjectId || q.subjectId === newExam.subjectId;
    return matchesCategory && matchesSubject;
  });

  const handleQuickAdd = async (type: 'category' | 'subject') => {
    if (!isQuickAdd.value.trim()) return;
    try {
      if (type === 'category') {
        const res = await apiService.addCategory({ name: isQuickAdd.value, description: '' });
        setNewExam(prev => ({ ...prev, categoryId: res.id, subjectId: '' }));
      } else if (type === 'subject' && newExam.categoryId) {
        const res = await apiService.addSubject({ name: isQuickAdd.value, categoryId: newExam.categoryId });
        setNewExam(prev => ({ ...prev, subjectId: res.id }));
      }
      await fetchData();
      setIsQuickAdd({ type: null, value: '' });
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const examToCreate = {
        ...newExam,
        questions: questions.filter(q => selectedQuestionIds.includes(q.id)),
        duration: (newExam.duration || 60) * 60 // convert to seconds for server
      };
      await apiService.addExam(examToCreate as Test);
      setIsModalOpen(false);
      fetchData();
      // Reset
      setNewExam({
        title: '',
        categoryId: '',
        subjectId: '',
        status: 'Live',
        duration: 60,
        startTime: new Date().toISOString().slice(0, 16),
        questionTimer: 0,
        shuffleQuestions: true,
        shuffleOptions: true
      });
      setSelectedQuestionIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 lg:space-y-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline tracking-tight text-on-surface">Exams Management</h2>
          <p className="text-on-surface-variant text-sm md:text-base max-w-md leading-relaxed">Schedule, monitor, and configure academic assessments with advanced proctoring controls.</p>
        </div>
        <button 
          onClick={() => {
            setNewExam(prev => ({
              ...prev,
              categoryId: selectedCategoryId || '',
              duration: selectedCategoryId ? (categories.find(c => c.id === selectedCategoryId)?.timeLimit || 60) : 60
            }));
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary text-on-primary px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-headline font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
          Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {[
          { label: 'Live Now', count: exams.filter(e => e.status === 'Live').length.toString(), color: 'bg-tertiary-fixed text-tertiary shadow-tertiary/5' },
          { label: 'Scheduled', count: exams.filter(e => e.status === 'Scheduled').length.toString(), color: 'bg-primary/5 text-primary shadow-primary/5' },
          { label: 'Completed', count: exams.filter(e => e.status === 'Completed').length.toString(), color: 'bg-emerald-50 text-emerald-700 shadow-emerald-500/5' },
          { label: 'Total Questions', count: exams.reduce((acc, e) => acc + (e.questions?.length || 0), 0).toString(), color: 'bg-surface-container text-on-surface-variant shadow-sm' },
        ].map((tab) => (
          <div key={tab.label} className={cn("p-4 md:p-6 lg:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between transition-all border border-transparent", tab.color)}>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-0">{tab.label}</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black font-headline">{tab.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-low p-3 md:p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 md:gap-6">
        <div className="relative flex-1 sm:max-w-md lg:max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search exams by name, subject or ID..." 
            className="w-full bg-surface-container-lowest border-none rounded-xl pl-12 pr-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-container-lowest text-on-surface rounded-xl hover:bg-white transition-all shadow-sm border border-surface-container">
            <Filter className="h-5 w-5" />
            <span className="text-sm font-bold sm:hidden lg:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-on-surface-variant">Loading assessments...</div>
        ) : !selectedCategoryId ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.map(category => {
                const categoryExams = exams.filter(e => e.categoryId === category.id);
                return (
                  <motion.div 
                    key={category.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="bg-surface-container-low p-8 md:p-10 rounded-[2.5rem] border border-surface-container hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                    
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-lg shadow-primary/5">
                      <Layers className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface mb-3 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-on-surface-variant text-sm md:text-base line-clamp-2 mb-8 leading-relaxed">{category.description || 'Manage specialized mock tests and practice assessments for this category.'}</p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-surface-container/50">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black font-headline text-on-surface">{categoryExams.length}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mock Tests</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                        <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {categories.length === 0 && (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-surface-container">
                <AlertCircle className="h-12 w-12 text-on-surface-variant mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-on-surface mb-2">No Categories Found</h3>
                <p className="text-on-surface-variant">Create categories first to organize your mock tests.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategoryId(null)}
                  className="flex items-center gap-2 text-primary font-bold hover:underline mb-4 group"
                >
                  <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </button>
                <h3 className="text-3xl md:text-4xl font-bold font-headline text-on-surface">
                  {categories.find(c => c.id === selectedCategoryId)?.name} <span className="text-primary">Mocks</span>
                </h3>
                <p className="text-on-surface-variant max-w-xl">Explore and manage specific mock tests within this category. Each test is designed with subject-wise question distribution.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-surface-container-low px-6 py-4 rounded-2xl border border-surface-container">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Tests</span>
                  <span className="text-2xl font-black font-headline text-on-surface">{exams.filter(e => e.categoryId === selectedCategoryId).length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exams.filter(e => e.categoryId === selectedCategoryId).map((exam, i) => {
                const subjectCounts = getSubjectWiseCounts(exam.questions || []);
                return (
                  <motion.div 
                    key={exam.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] border border-surface-container hover:shadow-2xl hover:shadow-black/5 transition-all group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-bold font-headline text-on-surface group-hover:text-primary transition-colors leading-tight">{exam.title}</h4>
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Created: {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
                        exam.status === 'Live' ? "bg-tertiary-fixed text-tertiary" : "bg-surface-container text-on-surface-variant"
                      )}>
                        {exam.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-surface-container p-5 rounded-3xl border border-transparent group-hover:border-primary/10 transition-all">
                        <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                          <FileText className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Questions</span>
                        </div>
                        <p className="text-2xl font-black font-headline text-on-surface">{exam.questions?.length || 0}</p>
                      </div>
                      <div className="bg-surface-container p-5 rounded-3xl border border-transparent group-hover:border-primary/10 transition-all">
                        <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                          <Timer className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                        </div>
                        <p className="text-2xl font-black font-headline text-on-surface">{Math.round(exam.duration / 60)}m</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                        <Layers className="h-3 w-3" />
                        Subject-wise Division
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(subjectCounts).map(([subject, count]) => (
                          <div key={subject} className="flex items-center gap-2 px-3 py-2 bg-surface-container-high text-on-surface text-[11px] font-bold rounded-xl border border-surface-container group-hover:bg-white transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {subject}: <span className="text-primary">{count}</span>
                          </div>
                        ))}
                        {Object.keys(subjectCounts).length === 0 && (
                          <p className="text-[10px] text-on-surface-variant italic">No questions assigned yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-8 border-t border-surface-container/50">
                      <button className="flex-1 py-4 bg-surface-container text-on-surface text-sm font-bold rounded-2xl hover:bg-surface-container-highest transition-all active:scale-95">
                        View Details
                      </button>
                      <button className="flex-1 py-4 bg-primary text-on-primary text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
                        Edit Exam
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              {exams.filter(e => e.categoryId === selectedCategoryId).length === 0 && (
                <div className="col-span-full text-center py-20 bg-surface-container-low rounded-[2.5rem] border-2 border-dashed border-surface-container">
                  <AlertCircle className="h-12 w-12 text-on-surface-variant mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-on-surface mb-2">No Mock Tests Found</h3>
                  <p className="text-on-surface-variant">There are no mock tests created for this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface">Create New Exam</h3>
                  <p className="text-sm text-on-surface-variant">Configure a new assessment session and select questions.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-surface-container rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                {/* Basic Info */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Exam Name</label>
                  <input 
                    type="text" 
                    required
                    value={newExam.title}
                    onChange={e => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Mid-Term Assessment"
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Category</label>
                    <div className="flex gap-2">
                      <select 
                        required
                        value={newExam.categoryId}
                        onChange={e => {
                          const catId = e.target.value;
                          const category = categories.find(c => c.id === catId);
                          setNewExam(prev => ({ 
                            ...prev, 
                            categoryId: catId, 
                            subjectId: '', 
                            duration: category?.timeLimit || 60
                          }));
                        }}
                        disabled={newExam.categoryId === liveExamCategoryId}
                        className="flex-1 bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                      >
                        <option value="">Select Category</option>
                        {sortedCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      {newExam.categoryId !== liveExamCategoryId && (
                        <button 
                          type="button"
                          onClick={() => setIsQuickAdd({ type: 'category', value: '' })}
                          className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:text-primary transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {isQuickAdd.type === 'category' && (
                      <div className="mt-2 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="New Category Name"
                          value={isQuickAdd.value}
                          onChange={e => setIsQuickAdd(prev => ({ ...prev, value: e.target.value }))}
                          className="flex-1 bg-surface border border-surface-container rounded-lg px-3 py-2 text-xs"
                        />
                        <button 
                          type="button"
                          onClick={() => handleQuickAdd('category')}
                          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Subject</label>
                    <div className="flex gap-2">
                      <select 
                        required
                        value={newExam.subjectId}
                        onChange={e => setNewExam(prev => ({ ...prev, subjectId: e.target.value }))}
                        disabled={!newExam.categoryId}
                        className="flex-1 bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                      >
                        <option value="">Select Subject</option>
                        {subjects.filter(s => s.categoryId === newExam.categoryId).map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        disabled={!newExam.categoryId}
                        onClick={() => setIsQuickAdd({ type: 'subject', value: '' })}
                        className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {isQuickAdd.type === 'subject' && (
                      <div className="mt-2 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="New Subject Name"
                          value={isQuickAdd.value}
                          onChange={e => setIsQuickAdd(prev => ({ ...prev, value: e.target.value }))}
                          className="flex-1 bg-surface border border-surface-container rounded-lg px-3 py-2 text-xs"
                        />
                        <button 
                          type="button"
                          onClick={() => handleQuickAdd('subject')}
                          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={newExam.startTime}
                      onChange={e => setNewExam(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Status</label>
                    <select 
                      required
                      value={newExam.status}
                      onChange={e => setNewExam(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Live">Live</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Duration (Mins)</label>
                    <input 
                      type="number" 
                      required
                      value={newExam.duration || 0}
                      onChange={e => setNewExam(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-surface-container-low p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-bold font-headline text-on-surface">Advanced Configuration</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline flex items-center gap-1.5">
                        <Timer className="h-3 w-3" />
                        Per-Question Timer (Secs)
                      </label>
                      <input 
                        type="number" 
                        value={newExam.questionTimer || 0}
                        onChange={e => setNewExam(prev => ({ ...prev, questionTimer: parseInt(e.target.value) || 0 }))}
                        placeholder="0 for none"
                        className="w-full bg-surface border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-6 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          newExam.shuffleQuestions ? "bg-primary border-primary" : "border-outline group-hover:border-primary"
                        )} onClick={() => setNewExam(prev => ({ ...prev, shuffleQuestions: !prev.shuffleQuestions }))}>
                          {newExam.shuffleQuestions && <Check className="h-3.5 w-3.5 text-on-primary" />}
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant">Shuffle Questions</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          newExam.shuffleOptions ? "bg-primary border-primary" : "border-outline group-hover:border-primary"
                        )} onClick={() => setNewExam(prev => ({ ...prev, shuffleOptions: !prev.shuffleOptions }))}>
                          {newExam.shuffleOptions && <Check className="h-3.5 w-3.5 text-on-primary" />}
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant">Shuffle Options</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Question Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Select Questions ({selectedQuestionIds.length})</label>
                    <span className="text-xs font-bold text-primary">{filteredQuestions.length} available</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredQuestions.map(q => (
                      <div 
                        key={q.id}
                        onClick={() => toggleQuestion(q.id)}
                        className={cn(
                          "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4",
                          selectedQuestionIds.includes(q.id) 
                            ? "bg-primary/5 border-primary shadow-sm" 
                            : "bg-surface-container-low border-surface-container hover:border-primary/20"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                              {subjects.find(s => s.id === q.subjectId)?.name || 'General'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">•</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{q.difficulty}</span>
                          </div>
                          <p className="text-sm font-bold text-on-surface line-clamp-1">{q.text}</p>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                          selectedQuestionIds.includes(q.id) ? "bg-primary text-on-primary" : "bg-surface-container"
                        )}>
                          {selectedQuestionIds.includes(q.id) && <Check className="h-4 w-4" />}
                        </div>
                      </div>
                    ))}
                    {filteredQuestions.length === 0 && (
                      <div className="p-8 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                        <AlertCircle className="h-8 w-8 text-on-surface-variant mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-on-surface-variant font-medium">No published questions found for this selection.</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="p-6 md:p-8 border-t border-surface-container bg-surface-container-low flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateExam}
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  Publish Exam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
