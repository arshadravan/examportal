import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronRight, 
  Layers, 
  Book, 
  Tag, 
  Trash2, 
  Edit2,
  Loader2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { ExamCategory, Subject } from '@/types';

export const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState<'category' | 'subject' | null>(null);
  const [newName, setNewName] = useState('');

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

  const handleAdd = async () => {
    if (!newName.trim()) return;

    try {
      if (showAddModal === 'category') {
        await apiService.addCategory({ name: newName, description: '' });
      } else if (showAddModal === 'subject' && selectedCategory) {
        await apiService.addSubject({ name: newName, categoryId: selectedCategory });
      }
      setNewName('');
      setShowAddModal(null);
      fetchData();
    } catch (error) {
      console.error('Failed to add:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-on-surface">Category Hierarchy</h2>
          <p className="text-on-surface-variant">Manage exam categories, subjects, and topics for your tests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Column */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container overflow-hidden shadow-sm">
          <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface-bright">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-bold font-headline">Exam Categories</h3>
            </div>
            <button 
              onClick={() => setShowAddModal('category')}
              className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubject(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                  selectedCategory === cat.id 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "hover:bg-surface-container"
                )}
              >
                <span className="font-bold">{cat.name}</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", selectedCategory === cat.id && "rotate-90")} />
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Column */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container overflow-hidden shadow-sm">
          <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface-bright">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-tertiary" />
              <h3 className="font-bold font-headline">Subjects</h3>
            </div>
            {selectedCategory && (
              <button 
                onClick={() => setShowAddModal('subject')}
                className="p-2 hover:bg-tertiary/10 text-tertiary rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {!selectedCategory ? (
              <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant opacity-50">
                <Layers className="h-8 w-8 mb-2" />
                <p className="text-sm font-bold">Select a category first</p>
              </div>
            ) : (
              subjects.filter(s => s.categoryId === selectedCategory).map((sub) => (
                <div
                  key={sub.id}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group border border-transparent hover:border-surface-container-high",
                    selectedSubject === sub.id ? "bg-tertiary/10 border-tertiary/20" : "hover:bg-surface-container"
                  )}
                >
                  <span className="font-bold">{sub.name}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-surface-container-highest rounded-lg text-on-surface-variant">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 hover:bg-error/10 rounded-lg text-error">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md shadow-2xl border border-surface-container"
            >
              <h3 className="text-2xl font-bold font-headline mb-6">
                Add New {showAddModal.charAt(0).toUpperCase() + showAddModal.slice(1)}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={`Enter ${showAddModal} name...`}
                    className="w-full px-4 py-3 bg-surface-container rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAddModal(null)}
                    className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="flex-1 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    Add Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
