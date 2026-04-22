export type View = 
  | 'admin-dashboard' 
  | 'results' 
  | 'students' 
  | 'exams' 
  | 'questions' 
  | 'login' 
  | 'student-dashboard' 
  | 'exam-interface'
  | 'categories'
  | 'embed-generator';

export interface ExamCategory {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
  timeLimit?: number; // default time limit in minutes for tests in this category
}

export interface Subject {
  id: string;
  categoryId: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  examId: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

export interface Activity {
  id: string;
  type: 'registration' | 'submission' | 'alert' | 'update' | 'backup';
  title: string;
  description: string;
  time: string;
  icon: string;
}

export interface Question {
  id: string;
  categoryId: string;
  subjectId: string;
  examId?: string; // Link to a specific mock/exam
  text: string;
  type: 'MCQ' | 'True-False' | 'Subjective';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string; // ID for MCQ, "True"/"False" for T/F, or text for Subjective
  explanation?: string;
  imageUrl?: string;
  tags: string[];
  status: 'Published' | 'Draft';
}

export interface Test {
  id: string;
  categoryId: string;
  subjectId: string;
  title: string;
  duration: number; // total duration in seconds
  questionTimer?: number; // optional per-question timer in seconds
  questions: Question[];
  status: 'Live' | 'Scheduled' | 'Completed' | 'Draft';
  startTime?: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanation: boolean;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  completedAt: string;
}
