import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Layers, 
  Book, 
  Tag, 
  ExternalLink,
  Loader2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { ExamCategory, Subject } from '@/types';

export const EmbedGenerator: React.FC = () => {
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        apiService.getCategories(),
        apiService.getSubjects()
      ]);
      setCategories(cats);
      setSubjects(subs);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    const id = `exam-intel-${selectedCategory || 'all'}-${selectedSubject || 'all'}`;
    const scriptUrl = `${baseUrl}/embed-test.js?exam=${selectedCategory}&subject=${selectedSubject}`;
    
    return `<!-- ExamIntel Test Embed -->
<div id="${id}"></div>
<script src="${scriptUrl}"></script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-primary/10 rounded-3xl text-primary mb-2">
          <Code className="h-8 w-8" />
        </div>
        <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Embed Code Generator</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg leading-relaxed">
          Generate a professional, competition-style test widget to embed on any website or LMS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant px-2">
            <Layers className="h-4 w-4" /> Exam Category
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubject('');
            }}
            className="w-full px-5 py-4 bg-surface-container-lowest border border-surface-container rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold shadow-sm appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant px-2">
            <Book className="h-4 w-4" /> Subject
          </label>
          <select 
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
            }}
            disabled={!selectedCategory}
            className="w-full px-5 py-4 bg-surface-container-lowest border border-surface-container rounded-2xl focus:outline-none focus:ring-2 focus:ring-tertiary/50 font-bold shadow-sm appearance-none disabled:opacity-50"
          >
            <option value="">All Subjects</option>
            {subjects.filter(s => s.categoryId === selectedCategory).map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-fixed" />
              </div>
              <h3 className="text-xl font-bold font-headline text-white tracking-tight">Generated Snippet</h3>
            </div>
            <button 
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95",
                copied 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-slate-900 hover:bg-indigo-50 shadow-lg"
              )}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? 'Copied!' : 'Copy Snippet'}
            </button>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 font-mono text-sm md:text-base text-indigo-100 overflow-x-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap break-all leading-relaxed">
              {generateEmbedCode()}
            </pre>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
            <Info className="h-6 w-6 text-primary-fixed shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-white font-bold">How to use this code?</p>
              <p className="text-indigo-200/70 text-sm leading-relaxed">
                Paste the <code className="text-primary-fixed">div</code> where you want the test to appear, and include the <code className="text-primary-fixed">script</code> tag at the end of your body. The test will automatically load with a timer and professional UI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center gap-2 px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all shadow-sm">
          <ExternalLink className="h-5 w-5" /> Preview Widget
        </button>
        <button className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
          Documentation
        </button>
      </div>
    </div>
  );
};
