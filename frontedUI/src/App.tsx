import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AdminDashboard } from './components/AdminDashboard';
import { ResultsAnalytics } from './components/ResultsAnalytics';
import { StudentManagement } from './components/StudentManagement';
import { ExamsManagement } from './components/ExamsManagement';
import { QuestionsRepository } from './components/QuestionsRepository';
import { CategoriesManagement } from './components/CategoriesManagement';
import { EmbedGenerator } from './components/EmbedGenerator';
import { Login } from './components/Login';
import { StudentDashboard } from './components/StudentDashboard';
import { ExamInterface } from './components/ExamInterface';
import { View, Test } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<'admin' | 'student'>('admin');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Test | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [lastExamResult, setLastExamResult] = useState<any | null>(null);

  const handleLogin = (role: 'admin' | 'student', name?: string) => {
    setUserRole(role);
    if (name) {
      setUserName(name);
      localStorage.setItem('userName', name);
    }
    localStorage.setItem('userRole', role);
    setCurrentView(role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleStartExam = (exam: Test, categoryName: string) => {
    setSelectedExam(exam);
    setSelectedCategoryName(categoryName);
    setLastExamResult(null);
    setCurrentView('exam-interface');
  };

  const handleExamComplete = (result: any) => {
    setLastExamResult(result);
    setCurrentView('student-dashboard');
  };

  const renderView = () => {
    // Frontend Route Protection: Ensure students cannot access admin views
    const adminViews: View[] = ['admin-dashboard', 'results', 'students', 'exams', 'questions', 'categories', 'embed-generator'];
    if (userRole === 'student' && adminViews.includes(currentView)) {
      return (
        <StudentDashboard 
          userName={userName}
          onStartExam={handleStartExam} 
          initialResult={lastExamResult}
          onClearResult={() => setLastExamResult(null)}
        />
      );
    }

    switch (currentView) {
      case 'admin-dashboard':
        return <AdminDashboard userName={userName} />;
      case 'results':
        return <ResultsAnalytics />;
      case 'students':
        return <StudentManagement />;
      case 'exams':
        return <ExamsManagement />;
      case 'questions':
        return <QuestionsRepository />;
      case 'categories':
        return <CategoriesManagement />;
      case 'embed-generator':
        return <EmbedGenerator />;
      case 'student-dashboard':
        return (
          <StudentDashboard 
            userName={userName}
            onStartExam={handleStartExam} 
            initialResult={lastExamResult}
            onClearResult={() => setLastExamResult(null)}
          />
        );
      case 'exam-interface':
        if (!selectedExam) return <StudentDashboard onStartExam={handleStartExam} />;
        return (
          <ExamInterface 
            exam={{ ...selectedExam, categoryName: selectedCategoryName }} 
            onComplete={handleExamComplete} 
          />
        );
      default:
        return <AdminDashboard />;
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === 'exam-interface' && selectedExam) {
    return (
      <ExamInterface 
        exam={{ ...selectedExam, categoryName: selectedCategoryName }} 
        onComplete={handleExamComplete} 
      />
    );
  }

  const getTitle = () => {
    switch (currentView) {
      case 'admin-dashboard': return 'Admin Intelligence Dashboard';
      case 'results': return 'Performance Analytics & Results';
      case 'students': return 'Student Registry Management';
      case 'exams': return 'Examination Control Center';
      case 'questions': return 'Validated Question Repository';
      case 'student-dashboard': return 'Student Academic Portal';
      default: return 'ExamIntel';
    }
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-x-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        role={userRole} 
        userName={userName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "lg:ml-64 w-full"
      )}>
        <TopBar 
          title={getTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
