import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Layers,
  Rocket,
  FileText,
  Copy,
  Trash2,
  Edit,
  X,
  Check,
  Upload,
  Download,
  Tag,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  FileJson,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { Question, ExamCategory, Subject, Test } from '@/types';

export const QuestionsRepository: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Test[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAdd, setIsQuickAdd] = useState<{ type: 'category' | 'subject' | 'exam' | null, value: string, marks?: number, negativeMarks?: number }>({ type: null, value: '' });
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [categoryTimeLimit, setCategoryTimeLimit] = useState<number>(0);

  // Form State
  const [newQuestions, setNewQuestions] = useState<Partial<Question>[]>([{
    text: '',
    categoryId: '',
    subjectId: '',
    examId: '',
    type: 'MCQ',
    difficulty: 'Medium',
    status: 'Draft',
    options: [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
      { id: 'c', text: '' },
      { id: 'd', text: '' }
    ],
    correctAnswer: 'a',
    explanation: '',
    tags: []
  }]);
  const [globalShowExplanation, setGlobalShowExplanation] = useState(true);

  const [bulkJson, setBulkJson] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const [isExamEditModalOpen, setIsExamEditModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Test | null>(null);

  const liveExamCategoryId = categories.find(c => c.name === 'Live Exam')?.id || 'live-exams-cat';

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.name === 'Live Exam') return -1;
    if (b.name === 'Live Exam') return 1;
    return a.name.localeCompare(b.name);
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [qData, cData, sData, eData] = await Promise.all([
        apiService.getQuestions(),
        apiService.getCategories(),
        apiService.getSubjects(),
        apiService.getExams()
      ]);
      setQuestions(qData);
      setCategories(cData);
      setSubjects(sData);
      setExams(eData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setNewQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const addNextQuestion = (mode: 'same' | 'new-subject' | 'new-exam' = 'same') => {
    const lastQ = newQuestions[newQuestions.length - 1];
    setNewQuestions(prev => [...prev, {
      text: '',
      categoryId: lastQ.categoryId,
      subjectId: mode === 'new-subject' || mode === 'new-exam' ? '' : lastQ.subjectId,
      examId: mode === 'new-exam' ? '' : lastQ.examId,
      type: 'MCQ',
      difficulty: 'Medium',
      status: 'Published',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctAnswer: 'a',
      explanation: '',
      tags: []
    }]);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(index, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAdd = async (type: 'category' | 'subject' | 'exam', index: number) => {
    if (!isQuickAdd.value.trim()) return;
    try {
      let newId = '';
      const currentQ = newQuestions[index];
      if (type === 'category') {
        const res = await apiService.addCategory({ name: isQuickAdd.value, description: '' });
        newId = res.id;
        updateQuestion(index, { categoryId: newId, subjectId: '', examId: '' });
      } else if (type === 'subject' && currentQ.categoryId) {
        const res = await apiService.addSubject({ name: isQuickAdd.value, categoryId: currentQ.categoryId });
        newId = res.id;
        updateQuestion(index, { subjectId: newId });
      } else if (type === 'exam' && currentQ.categoryId) {
        const res = await apiService.addExam({ 
          title: isQuickAdd.value, 
          categoryId: currentQ.categoryId,
          subjectId: currentQ.subjectId || '',
          duration: 3600, // Default 1 hour
          status: 'Draft',
          questions: [],
          shuffleQuestions: true,
          shuffleOptions: true,
          showExplanation: true,
          marksPerQuestion: isQuickAdd.marks || 4,
          negativeMarksPerQuestion: isQuickAdd.negativeMarks || 1
        });
        newId = res.id;
        updateQuestion(index, { examId: newId });
      }
      await fetchData();
      setIsQuickAdd({ type: null, value: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    try {
      await apiService.updateExam(editingExam.id, editingExam);
      setIsExamEditModalOpen(false);
      setEditingExam(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExamExplanation = async (exam: Test) => {
    try {
      await apiService.updateExam(exam.id, { ...exam, showExplanation: !exam.showExplanation });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await apiService.updateQuestion(editingQuestion.id, newQuestions[0]);
      } else {
        for (const q of newQuestions) {
          await apiService.addQuestion(q);
        }
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
      fetchData();
      // Reset form
      setNewQuestions([{
        text: '',
        categoryId: selectedCategoryId || '',
        subjectId: '',
        examId: selectedExamId && selectedExamId !== 'unassigned' ? selectedExamId : '',
        type: 'MCQ',
        difficulty: 'Medium',
        status: 'Draft',
        options: [
          { id: 'a', text: '' },
          { id: 'b', text: '' },
          { id: 'c', text: '' },
          { id: 'd', text: '' }
        ],
        correctAnswer: 'a',
        explanation: '',
        tags: []
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await apiService.deleteQuestion(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam and all its questions?')) {
      try {
        // First delete all questions associated with this exam
        const examQuestions = questions.filter(q => q.examId === id);
        for (const q of examQuestions) {
          await apiService.deleteQuestion(q.id);
        }
        // Then delete the exam (assuming apiService has deleteExam, if not I'll add it)
        await apiService.deleteExam(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditQuestion = async (q: Question) => {
    setEditingQuestion(q);
    await fetchData(); // Ensure latest categories/subjects/topics are available
    setNewQuestions([q]);
    setIsModalOpen(true);
  };

  const handleSaveTimeLimit = async () => {
    if (!selectedCategoryId) return;
    try {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        await apiService.updateCategory(selectedCategoryId, { ...cat, timeLimit: categoryTimeLimit });
        fetchData();
        alert('Time limit updated successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validation: Ensure each item has required fields
      const isValid = items.every(item => item.text && item.categoryId && item.options && item.correctAnswer);
      if (!isValid) {
        alert('Some questions are missing required fields (text, categoryId, options, correctAnswer)');
        return;
      }

      setIsLoading(true);
      for (const item of items) {
        await apiService.addQuestion(item);
      }
      setIsBulkModalOpen(false);
      setBulkJson('');
      fetchData();
      alert(`Successfully uploaded ${items.length} questions`);
    } catch (err) {
      alert('Invalid JSON format. Please check your file content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert('Please upload a valid JSON file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setBulkJson(content);
      };
      reader.readAsText(file);
    }
  };

  const handleOptionChange = (qIndex: number, optId: string, text: string) => {
    setNewQuestions(prev => prev.map((q, i) => i === qIndex ? {
      ...q,
      options: q.options?.map(opt => opt.id === optId ? { ...opt, text } : opt)
    } : q));
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredQuestions = selectedCategoryId 
    ? questions.filter(q => {
        const matchCategory = q.categoryId === selectedCategoryId;
        const matchExam = selectedExamId 
          ? (selectedExamId === 'unassigned' ? !q.examId : q.examId === selectedExamId)
          : true;
        const matchSubject = selectedSubjectId ? q.subjectId === selectedSubjectId : true;
        const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchExam && matchSubject && matchSearch;
      })
    : [];

  const categoryExams = selectedCategoryId 
    ? exams.filter(e => e.categoryId === selectedCategoryId)
    : [];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight text-on-surface mb-2">
            {selectedCategoryId ? (
              <div className="flex items-center gap-2">
                <span className="opacity-50">Category:</span>
                <span>{selectedCategory?.name}</span>
                {selectedExamId && (
                  <>
                    <span className="opacity-30 mx-2">/</span>
                    <span className="opacity-50 text-xl">Exam:</span>
                    <span className="text-xl">{selectedExamId === 'unassigned' ? 'General Bank' : exams.find(e => e.id === selectedExamId)?.title}</span>
                  </>
                )}
                {selectedSubjectId && (
                  <>
                    <span className="opacity-30 mx-2">/</span>
                    <span className="opacity-50 text-lg">Subject:</span>
                    <span className="text-lg">{subjects.find(s => s.id === selectedSubjectId)?.name}</span>
                  </>
                )}
              </div>
            ) : 'Questions Repository'}
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base max-w-md">
            {selectedCategoryId 
              ? `Managing ${filteredQuestions.length} questions in this ${selectedExamId ? 'exam' : 'category'}.`
              : 'Centralized bank of validated assessment items with version control and difficulty mapping.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedCategoryId && (
            <button 
              onClick={() => {
                if (selectedExamId) {
                  setSelectedExamId(null);
                } else {
                  setSelectedCategoryId(null);
                  setCategoryTimeLimit(0);
                }
              }}
              className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-headline font-bold hover:bg-surface-container-highest transition-all"
            >
              <X className="h-5 w-5" />
              {selectedExamId ? 'Back to Exams' : 'Back to Categories'}
            </button>
          )}
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-headline font-bold hover:bg-surface-container-highest transition-all"
          >
            <Upload className="h-5 w-5" />
            Bulk Upload
          </button>
          <button 
            onClick={async () => {
              setEditingQuestion(null);
              await fetchData(); // Ensure categories are fresh
              setNewQuestions([{
                text: '',
                categoryId: selectedCategoryId || '',
                subjectId: selectedSubjectId || '',
                examId: selectedExamId === 'unassigned' ? '' : (selectedExamId || ''),
                type: 'MCQ',
                difficulty: 'Medium',
                status: 'Draft',
                options: [
                  { id: 'a', text: '' },
                  { id: 'b', text: '' },
                  { id: 'c', text: '' },
                  { id: 'd', text: '' }
                ],
                correctAnswer: 'a',
                explanation: '',
                tags: []
              }]);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        </div>
      </div>

      {!selectedCategoryId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((cat) => {
            const count = questions.filter(q => q.categoryId === cat.id).length;
            const examCount = exams.filter(e => e.categoryId === cat.id).length;
            const isLiveExamCat = cat.name === 'Live Exam';
            return (
              <motion.div 
                key={cat.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "p-6 rounded-2xl shadow-sm border flex flex-col gap-4 group cursor-pointer",
                  isLiveExamCat 
                    ? "bg-tertiary-fixed border-tertiary/20" 
                    : "bg-surface-container-lowest border-surface-container"
                )}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setCategoryTimeLimit(cat.timeLimit || 0);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "p-3 rounded-xl transition-all",
                    isLiveExamCat 
                      ? "bg-white/50 text-tertiary" 
                      : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary"
                  )}>
                    {isLiveExamCat ? <Rocket className="h-6 w-6" /> : <Layers className="h-6 w-6" />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isLiveExamCat ? "text-tertiary-on-fixed-variant bg-white/30" : "text-on-surface-variant bg-surface-container"
                    )}>
                      {count} Questions
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isLiveExamCat ? "text-tertiary bg-white" : "text-primary bg-primary/10"
                    )}>
                      {examCount} Exams/Mocks
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className={cn(
                    "text-xl font-bold font-headline mb-1",
                    isLiveExamCat ? "text-tertiary-on-fixed" : "text-on-surface"
                  )}>{cat.name}</h3>
                  <p className={cn(
                    "text-sm line-clamp-2",
                    isLiveExamCat ? "text-tertiary-on-fixed-variant" : "text-on-surface-variant"
                  )}>{cat.description}</p>
                </div>
                <div className={cn(
                  "mt-2 flex items-center gap-2 text-xs font-bold",
                  isLiveExamCat ? "text-tertiary" : "text-primary"
                )}>
                  <span>View Mocks & Questions</span>
                  <MoreVertical className="h-4 w-4 rotate-90" />
                </div>
              </motion.div>
            );
          })}
          {categories.length === 0 && (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              No categories found. Please create categories first.
            </div>
          )}
        </div>
      ) : !selectedExamId ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* General Question Bank Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-2 border-dashed border-surface-container flex flex-col gap-4 group cursor-pointer"
              onClick={() => setSelectedExamId('unassigned')}
            >
              <div className="p-3 w-fit rounded-xl bg-surface-container text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline text-on-surface mb-1">General Bank</h3>
                <p className="text-sm text-on-surface-variant">Questions not assigned to any specific mock exam.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant">
                  {questions.filter(q => q.categoryId === selectedCategoryId && !q.examId).length} Questions
                </span>
                <span className="text-xs font-bold text-primary">Open Bank</span>
              </div>
            </motion.div>

            {/* Exam Cards */}
            {categoryExams.map((exam) => {
              const examQuestions = questions.filter(q => q.examId === exam.id);
              const createdAt = exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : 'N/A';
              return (
                <motion.div 
                  key={exam.id}
                  whileHover={{ y: -5 }}
                  className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-4 group relative"
                >
                  <div className="flex items-start justify-between" onClick={() => setSelectedExamId(exam.id)}>
                    <div className="p-3 rounded-xl bg-tertiary/5 text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-all">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {examQuestions.length} Questions
                      </span>
                      <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(exam.duration / 3600)}h {Math.floor((exam.duration % 3600) / 60)}m
                      </span>
                    </div>
                  </div>
                  <div className="cursor-pointer" onClick={() => setSelectedExamId(exam.id)}>
                    <h3 className="text-xl font-bold font-headline text-on-surface mb-1">{exam.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-2">Created: {createdAt}</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{exam.description || 'Mock Exam Section'}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
                        <span className="text-[10px] font-bold text-emerald-600">+{exam.marksPerQuestion} / -{exam.negativeMarksPerQuestion}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl">
                          <span className="text-[10px] font-bold text-on-surface-variant">Show Answers</span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExamExplanation(exam);
                            }}
                            className={cn(
                              "w-8 h-4 rounded-full relative transition-all",
                              exam.showExplanation ? "bg-primary" : "bg-surface-container-highest"
                            )}
                          >
                            <motion.div 
                              animate={{ x: exam.showExplanation ? 18 : 2 }}
                              className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingExam(exam);
                            setIsExamEditModalOpen(true);
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            handleDeleteExam(exam.id);
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    <span className="text-xs font-bold text-primary cursor-pointer" onClick={() => setSelectedExamId(exam.id)}>View Questions</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Category/Exam Settings */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-tertiary/10 text-tertiary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">
                  {selectedExamId === 'unassigned' ? 'Category Time Limit' : 'Exam Duration'}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {selectedExamId === 'unassigned' 
                    ? 'Set a default timer for questions in this category (minutes).'
                    : 'Total time allowed for this mock exam (minutes).'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {selectedExamId === 'unassigned' ? (
                <>
                  <input 
                    type="number" 
                    value={categoryTimeLimit}
                    onChange={e => setCategoryTimeLimit(parseInt(e.target.value) || 0)}
                    className="w-24 bg-surface-container-lowest border-none rounded-lg py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    placeholder="Min"
                  />
                  <button 
                    onClick={handleSaveTimeLimit}
                    className="bg-tertiary text-on-tertiary px-6 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                  >
                    Save Time
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-surface-container">
                    <span className="text-lg font-bold text-primary">
                      {Math.floor((exams.find(e => e.id === selectedExamId)?.duration || 0) / 60)}
                    </span>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Minutes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <span className="text-sm font-bold text-emerald-600">
                      +{exams.find(e => e.id === selectedExamId)?.marksPerQuestion || 4} / -{exams.find(e => e.id === selectedExamId)?.negativeMarksPerQuestion || 1}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Marking</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-surface-container-low p-3 md:p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search questions in this category..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-lg pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-surface-container">
                <Filter className="h-4 w-4 text-on-surface-variant" />
                <select 
                  value={selectedSubjectId || ''}
                  onChange={e => {
                    setSelectedSubjectId(e.target.value || null);
                  }}
                  className="bg-transparent border-none text-xs font-bold focus:ring-0"
                >
                  <option value="">All Subjects</option>
                  {subjects.filter(s => s.categoryId === selectedCategoryId).map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {(selectedSubjectId || searchQuery) && (
                <button 
                  onClick={() => {
                    setSelectedSubjectId(null);
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container">
                No questions found in this category. Click "Add Question" to get started.
              </div>
            ) : filteredQuestions.map((q, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={q.id} 
                className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm border border-surface-container hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                        {subjects.find(s => s.id === q.subjectId)?.name || 'General'}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider",
                        q.difficulty === 'Hard' ? "bg-tertiary-fixed text-tertiary" : 
                        q.difficulty === 'Medium' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {q.difficulty}
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {q.type}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider",
                        q.status === 'Published' ? "bg-emerald-50 text-emerald-600" : "bg-surface-container text-on-surface-variant"
                      )}>
                        {q.status}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold font-headline text-on-surface mb-3 md:mb-4 leading-snug line-clamp-2 md:line-clamp-none">
                      {q.text}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button 
                      onClick={() => handleEditQuestion(q)}
                      className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                    <button className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                      <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 md:p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
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
              className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {editingQuestion ? 'Modify existing assessment item.' : 'Create a new assessment item for the repository.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-surface-container rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddQuestion} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar">
                {newQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container space-y-6 relative group">
                    {newQuestions.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => setNewQuestions(prev => prev.filter((_, i) => i !== qIndex))}
                        className="absolute -top-3 -right-3 p-2 bg-error text-on-error rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Question #{qIndex + 1}</span>
                      <div className="flex items-center gap-4">
                        <select 
                          value={q.difficulty}
                          onChange={e => updateQuestion(qIndex, { difficulty: e.target.value as any })}
                          className="bg-surface-container border-none rounded-lg py-1 px-3 text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <select 
                          value={q.status}
                          onChange={e => updateQuestion(qIndex, { status: e.target.value as any })}
                          className="bg-surface-container border-none rounded-lg py-1 px-3 text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                        <div className="flex gap-2">
                          <select 
                            required
                            value={q.categoryId}
                            onChange={e => updateQuestion(qIndex, { categoryId: e.target.value, subjectId: '', examId: '' })}
                            disabled={selectedCategoryId === liveExamCategoryId}
                            className="flex-1 bg-surface-container border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                          </select>
                          {selectedCategoryId !== liveExamCategoryId && (
                            <button 
                              type="button"
                              onClick={() => setIsQuickAdd({ type: 'category', value: '' })}
                              className="p-2 bg-surface-container text-on-surface-variant rounded-xl hover:text-primary transition-colors disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
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
                              className="flex-1 bg-surface border border-surface-container rounded-lg px-2 py-1 text-[10px]"
                            />
                            <button 
                              type="button"
                              onClick={() => handleQuickAdd('category', qIndex)}
                              className="px-2 py-1 bg-primary text-on-primary rounded-lg text-[10px] font-bold"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Exam / Mock</label>
                        <div className="flex gap-2">
                          <select 
                            value={q.examId}
                            onChange={e => {
                              const selectedExam = exams.find(ex => ex.id === e.target.value);
                              updateQuestion(qIndex, { 
                                examId: e.target.value,
                                subjectId: selectedExam?.subjectId || q.subjectId
                              });
                            }}
                            disabled={!q.categoryId}
                            className="flex-1 bg-surface-container border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                          >
                            <option value="">Select Exam</option>
                            {exams.filter(e => 
                              e.categoryId === q.categoryId && 
                              (!q.subjectId || e.subjectId === q.subjectId)
                            ).map(exam => (
                              <option key={exam.id} value={exam.id}>{exam.title}</option>
                            ))}
                          </select>
                          <button 
                            type="button"
                            disabled={!q.categoryId}
                            onClick={() => setIsQuickAdd({ type: 'exam', value: '', marks: 4, negativeMarks: 1 })}
                            className="p-2 bg-surface-container text-on-surface-variant rounded-xl hover:text-primary transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {isQuickAdd.type === 'exam' && (
                          <div className="mt-2 space-y-2 bg-surface p-3 rounded-xl border border-surface-container">
                            <input 
                              type="text" 
                              placeholder="New Exam Name"
                              value={isQuickAdd.value}
                              onChange={e => setIsQuickAdd(prev => ({ ...prev, value: e.target.value }))}
                              className="w-full bg-surface border border-surface-container rounded-lg px-2 py-1 text-[10px]"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] font-bold uppercase text-on-surface-variant">Marks</label>
                                <input 
                                  type="number" 
                                  value={isQuickAdd.marks || 0}
                                  onChange={e => setIsQuickAdd(prev => ({ ...prev, marks: parseInt(e.target.value) || 0 }))}
                                  className="w-full bg-surface border border-surface-container rounded-lg px-2 py-1 text-[10px]"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-bold uppercase text-on-surface-variant">Neg. Marks</label>
                                <input 
                                  type="number" 
                                  value={isQuickAdd.negativeMarks || 0}
                                  onChange={e => setIsQuickAdd(prev => ({ ...prev, negativeMarks: parseInt(e.target.value) || 0 }))}
                                  className="w-full bg-surface border border-surface-container rounded-lg px-2 py-1 text-[10px]"
                                />
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleQuickAdd('exam', qIndex)}
                              className="w-full py-1 bg-primary text-on-primary rounded-lg text-[10px] font-bold"
                            >
                              Add Exam
                            </button>
                          </div>
                        )}
                        {q.examId && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between bg-surface p-2 rounded-lg border border-surface-container">
                              <div className="flex flex-col">
                                <label className="text-[8px] font-bold uppercase text-on-surface-variant">Marking System</label>
                                <span className="text-[10px] font-bold text-emerald-600">
                                  +{exams.find(e => e.id === q.examId)?.marksPerQuestion || 4} / -{exams.find(e => e.id === q.examId)?.negativeMarksPerQuestion || 1}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <label className="text-[8px] font-bold uppercase text-on-surface-variant">Timer</label>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="number" 
                                    value={Math.floor((exams.find(e => e.id === q.examId)?.duration || 0) / 60)}
                                    onChange={async (e) => {
                                      const newDuration = (parseInt(e.target.value) || 0) * 60;
                                      const exam = exams.find(ex => ex.id === q.examId);
                                      if (exam) {
                                        await apiService.updateExam(exam.id, { ...exam, duration: newDuration });
                                        fetchData();
                                      }
                                    }}
                                    className="w-12 bg-transparent border-none p-0 text-[10px] font-bold text-right focus:ring-0"
                                  />
                                  <span className="text-[8px] text-on-surface-variant">min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Subject</label>
                        <div className="flex gap-2">
                          <select 
                            required
                            value={q.subjectId}
                            onChange={e => updateQuestion(qIndex, { subjectId: e.target.value })}
                            disabled={!q.categoryId}
                            className="flex-1 bg-surface-container border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                          >
                            <option value="">Select Subject</option>
                            {subjects.filter(s => 
                              s.categoryId === q.categoryId && 
                              (!q.examId || exams.find(e => e.id === q.examId)?.subjectId === s.id)
                            ).map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                          </select>
                          <button 
                            type="button"
                            disabled={!q.categoryId}
                            onClick={() => setIsQuickAdd({ type: 'subject', value: '' })}
                            className="p-2 bg-surface-container text-on-surface-variant rounded-xl hover:text-primary transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {isQuickAdd.type === 'subject' && (
                          <div className="mt-2 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="New Subject Name"
                              value={isQuickAdd.value}
                              onChange={e => setIsQuickAdd(prev => ({ ...prev, value: e.target.value }))}
                              className="flex-1 bg-surface border border-surface-container rounded-lg px-2 py-1 text-[10px]"
                            />
                            <button 
                              type="button"
                              onClick={() => handleQuickAdd('subject', qIndex)}
                              className="px-2 py-1 bg-primary text-on-primary rounded-lg text-[10px] font-bold"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Question Text (Rich Text Area)</label>
                        <div className="relative">
                          <textarea 
                            required
                            value={q.text}
                            onChange={e => updateQuestion(qIndex, { text: e.target.value })}
                            placeholder="Enter the question text here..."
                            rows={4}
                            className="w-full bg-surface-container border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                          />
                          <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <input 
                              type="file" 
                              id={`image-upload-${qIndex}`}
                              className="hidden" 
                              accept="image/*"
                              onChange={e => handleImageUpload(qIndex, e)}
                            />
                            <label 
                              htmlFor={`image-upload-${qIndex}`}
                              className="flex items-center gap-2 bg-surface text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold border border-surface-container hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              Upload Image
                            </label>
                          </div>
                        </div>
                        {q.imageUrl && (
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-surface-container">
                            <img src={q.imageUrl} alt="Question" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => updateQuestion(qIndex, { imageUrl: undefined })}
                              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Options Section</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options?.map((opt) => (
                            <div key={opt.id} className="flex items-center gap-3 bg-surface-container p-3 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
                              <button 
                                type="button"
                                onClick={() => updateQuestion(qIndex, { correctAnswer: opt.id })}
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0",
                                  q.correctAnswer === opt.id 
                                    ? "bg-primary text-on-primary shadow-md" 
                                    : "bg-surface text-on-surface-variant border border-surface-container"
                                )}
                              >
                                {q.correctAnswer === opt.id && <Check className="h-3.5 w-3.5" />}
                              </button>
                              <input 
                                type="text" 
                                required
                                value={opt.text}
                                onChange={e => handleOptionChange(qIndex, opt.id, e.target.value)}
                                placeholder={`Option ${opt.id.toUpperCase()}`}
                                className="flex-1 bg-transparent border-none p-0 text-sm focus:ring-0 font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Explanation Box</label>
                          <textarea 
                            value={q.explanation}
                            onChange={e => updateQuestion(qIndex, { explanation: e.target.value })}
                            placeholder="Provide a detailed explanation for the correct answer..."
                            rows={3}
                            className="w-full bg-surface-container border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => addNextQuestion('same')}
                    className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface rounded-2xl font-bold hover:bg-primary hover:text-on-primary transition-all shadow-lg shadow-black/5 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Same Subject
                  </button>
                  <button 
                    type="button"
                    onClick={() => addNextQuestion('new-subject')}
                    className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface rounded-2xl font-bold hover:bg-secondary hover:text-on-secondary transition-all shadow-lg shadow-black/5 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Subject
                  </button>
                  <button 
                    type="button"
                    onClick={() => addNextQuestion('new-exam')}
                    className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface rounded-2xl font-bold hover:bg-tertiary hover:text-on-tertiary transition-all shadow-lg shadow-black/5 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Exam
                  </button>
                </div>
              </form>

              <div className="p-6 md:p-8 border-t border-surface-container bg-surface-container-low flex items-center justify-between gap-4">
                <div className="text-xs font-bold text-on-surface-variant">
                  {newQuestions.length} Question{newQuestions.length > 1 ? 's' : ''} in batch
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddQuestion}
                    className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                  >
                    Save All Questions
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isExamEditModalOpen && editingExam && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-high w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                <h3 className="text-xl font-bold font-headline">Edit Mock Details</h3>
                <button onClick={() => setIsExamEditModalOpen(false)} className="p-2 hover:bg-surface-container-highest rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateExam} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mock Title</label>
                  <input 
                    type="text"
                    required
                    value={editingExam.title}
                    onChange={e => setEditingExam({ ...editingExam, title: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2 px-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                  <textarea 
                    value={editingExam.description}
                    onChange={e => setEditingExam({ ...editingExam, description: e.target.value })}
                    rows={3}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2 px-3 text-sm resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Duration (Mins)</label>
                  <input 
                    type="number"
                    required
                    value={Math.floor((editingExam.duration || 0) / 60)}
                    onChange={e => setEditingExam({ ...editingExam, duration: (parseInt(e.target.value) || 0) * 60 })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2 px-3 text-sm"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsExamEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isBulkModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface flex items-center gap-3">
                    <FileJson className="h-7 w-7 text-primary" />
                    Bulk Upload Questions
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Upload a JSON file containing an array of questions.
                  </p>
                </div>
                <button 
                  onClick={() => setIsBulkModalOpen(false)}
                  className="p-2 hover:bg-surface-container rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                {/* File Upload Area */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Select JSON File</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={cn(
                      "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all",
                      bulkJson ? "border-primary bg-primary/5" : "border-surface-container-highest bg-surface-container-lowest group-hover:border-primary/50 group-hover:bg-primary/5"
                    )}>
                      <div className={cn(
                        "p-4 rounded-2xl transition-all",
                        bulkJson ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant group-hover:scale-110"
                      )}>
                        <Upload className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-on-surface">
                          {bulkJson ? "File Ready for Upload" : "Click or Drag & Drop JSON File"}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Only .json files are supported
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JSON Preview/Edit Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">JSON Content Preview</label>
                    {bulkJson && (
                      <button 
                        onClick={() => setBulkJson('')}
                        className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline"
                      >
                        Clear Content
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <textarea 
                      value={bulkJson}
                      onChange={e => setBulkJson(e.target.value)}
                      placeholder="JSON content will appear here after file selection, or you can paste it directly..."
                      className="w-full h-64 bg-surface-container-low border-none rounded-2xl py-4 px-5 text-sm font-mono focus:ring-2 focus:ring-primary/20 transition-all resize-none custom-scrollbar"
                    />
                    {!bulkJson && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <FileJson className="h-24 w-24" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Example Format */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Required JSON Format</span>
                  </div>
                  <pre className="text-[10px] font-mono text-on-surface-variant bg-surface-container-lowest p-4 rounded-xl overflow-x-auto border border-surface-container">
{`[
  {
    "text": "What is the capital of France?",
    "categoryId": "cat-123",
    "subjectId": "sub-456",
    "examId": "exam-789", // Optional
    "type": "MCQ",
    "difficulty": "Easy",
    "options": [
      {"id": "a", "text": "London"},
      {"id": "b", "text": "Paris"},
      {"id": "c", "text": "Berlin"},
      {"id": "d", "text": "Madrid"}
    ],
    "correctAnswer": "b",
    "explanation": "Paris is the capital and most populous city of France."
  }
]`}
                  </pre>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-surface-container bg-surface-container-low flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkUpload}
                  disabled={!bulkJson.trim() || isLoading}
                  className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Uploading...
                    </div>
                  ) : 'Process & Upload'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
