import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data for testing
  let categories = [
    { id: 'cat1', name: 'SSC', description: 'Staff Selection Commission Exams' },
    { id: 'cat2', name: 'Banking', description: 'IBPS, SBI, and other banking exams' },
    { id: 'live-exams-cat', name: 'Live Exam', description: 'Mass-level live assessments' },
  ];

  let subjects = [
    { id: 'sub1', categoryId: 'cat1', name: 'Mathematics' },
    { id: 'sub2', categoryId: 'cat1', name: 'English' },
    { id: 'sub3', categoryId: 'cat2', name: 'Reasoning' },
  ];

  let questions = [
    { 
      id: 'q1', 
      categoryId: 'cat1', 
      subjectId: 'sub1', 
      examId: 'ex1',
      text: 'What is the value of x if 2x + 5 = 15?', 
      type: 'MCQ', 
      difficulty: 'Easy', 
      options: [{id: 'a', text: '5'}, {id: 'b', text: '10'}, {id: 'c', text: '15'}, {id: 'd', text: '20'}], 
      correctAnswer: 'a', 
      explanation: '2x = 15 - 5 => 2x = 10 => x = 5',
      tags: ['Algebra', 'Basic Math'],
      status: 'Published'
    },
    { 
      id: 'q2', 
      categoryId: 'cat1', 
      subjectId: 'sub1', 
      examId: 'ex1',
      text: 'The sum of angles in a triangle is 180 degrees.', 
      type: 'True-False', 
      difficulty: 'Easy', 
      options: [{id: 'true', text: 'True'}, {id: 'false', text: 'False'}], 
      correctAnswer: 'true', 
      explanation: 'Basic property of Euclidean geometry.',
      tags: ['Geometry'],
      status: 'Published'
    },
    { 
      id: 'q-live-1', 
      categoryId: 'live-exams-cat', 
      subjectId: 'sub1', 
      examId: 'ex-live-1',
      text: 'Which article of the Indian Constitution deals with the Right to Equality?', 
      type: 'MCQ', 
      difficulty: 'Medium', 
      options: [{id: 'a', text: 'Article 14'}, {id: 'b', text: 'Article 19'}, {id: 'c', text: 'Article 21'}, {id: 'd', text: 'Article 32'}], 
      correctAnswer: 'a', 
      explanation: 'Article 14 of the Indian Constitution provides for equality before the law.',
      tags: ['Polity', 'Constitution'],
      status: 'Published'
    },
    { 
      id: 'q-live-2', 
      categoryId: 'live-exams-cat', 
      subjectId: 'sub1', 
      examId: 'ex-live-1',
      text: 'The concept of "Satyagraha" was introduced by Mahatma Gandhi.', 
      type: 'True-False', 
      difficulty: 'Easy', 
      options: [{id: 'true', text: 'True'}, {id: 'false', text: 'False'}], 
      correctAnswer: 'true', 
      explanation: 'Satyagraha is a particular form of nonviolent resistance or civil resistance.',
      tags: ['History', 'Freedom Struggle'],
      status: 'Published'
    },
  ];

  let exams = [
    { 
      id: 'ex1', 
      categoryId: 'cat1', 
      subjectId: 'sub1', 
      title: 'Algebra Foundation Test', 
      duration: 1800, 
      questionTimer: 60,
      status: 'Live',
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanation: true,
      marksPerQuestion: 4,
      negativeMarksPerQuestion: 1,
      createdAt: new Date().toISOString(),
      questions: []
    },
    { 
      id: 'ex-live-1', 
      categoryId: 'live-exams-cat', 
      subjectId: 'sub1', 
      title: 'UPSC Live Assessment 2026', 
      duration: 3600, 
      questionTimer: 0,
      status: 'Live',
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanation: true,
      marksPerQuestion: 2,
      negativeMarksPerQuestion: 0.66,
      createdAt: new Date().toISOString(),
      startTime: new Date().toISOString(),
      questions: []
    },
  ];

  let students = [
    { id: '1', name: 'Alexander Thorne', major: 'Applied Mathematics', email: 'a.thorne@academic.edu', examId: 'ex1', status: 'Active', avatar: 'https://picsum.photos/seed/alex/100/100' },
  ];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running locally!" });
  });

  // Categories
  app.get("/api/categories", (req, res) => res.json(categories));
  app.post("/api/categories/add", (req, res) => {
    const newCat = { ...req.body, id: `cat${categories.length + 1}` };
    categories.push(newCat);
    res.status(201).json(newCat);
  });
  app.put("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...req.body };
      res.json(categories[index]);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  });

  // Subjects
  app.get("/api/subjects", (req, res) => res.json(subjects));
  app.post("/api/subjects/add", (req, res) => {
    const newSub = { ...req.body, id: `sub${subjects.length + 1}` };
    subjects.push(newSub);
    res.status(201).json(newSub);
  });

  // Questions
  app.get("/api/questions", (req, res) => res.json(questions));
  app.post("/api/questions/add", (req, res) => {
    const newQ = { ...req.body, id: `q${questions.length + 1}` };
    questions.push(newQ);
    res.status(201).json(newQ);
  });
  app.put("/api/questions/:id", (req, res) => {
    const { id } = req.params;
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...req.body };
      res.json(questions[index]);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  });
  app.delete("/api/questions/:id", (req, res) => {
    const { id } = req.params;
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions.splice(index, 1);
      res.json({ message: "Question deleted" });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  });

  app.get("/api/questions/test", (req, res) => {
    const { exam, subject } = req.query;
    let filtered = questions;
    if (exam) filtered = filtered.filter(q => q.categoryId === exam);
    if (subject) filtered = filtered.filter(q => q.subjectId === subject);
    res.json(filtered);
  });

  // Exams
  app.get("/api/exams", (req, res) => {
    const populatedExams = exams.map(exam => {
      // If questions are already on the exam object (e.g. newly created), use them.
      // Otherwise, filter from the global questions list.
      const examQuestions = (exam.questions && exam.questions.length > 0) 
        ? exam.questions 
        : questions.filter(q => q.examId === exam.id);
      
      return {
        ...exam,
        questions: examQuestions
      };
    });
    res.json(populatedExams);
  });
  app.post("/api/exams/add", (req, res) => {
    const newExam = { 
      ...req.body, 
      id: `ex${exams.length + 1}`,
      createdAt: new Date().toISOString(),
      showExplanation: req.body.showExplanation ?? true,
      marksPerQuestion: req.body.marksPerQuestion ?? 4,
      negativeMarksPerQuestion: req.body.negativeMarksPerQuestion ?? 1
    };
    exams.push(newExam);
    res.status(201).json(newExam);
  });

  app.put("/api/exams/:id", (req, res) => {
    const { id } = req.params;
    const index = exams.findIndex(e => e.id === id);
    if (index !== -1) {
      exams[index] = { ...exams[index], ...req.body };
      res.json(exams[index]);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  });

  app.delete("/api/exams/:id", (req, res) => {
    const { id } = req.params;
    const index = exams.findIndex(e => e.id === id);
    if (index !== -1) {
      exams.splice(index, 1);
      res.json({ message: "Exam deleted" });
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  });

  app.get("/api/students", (req, res) => res.json(students));

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Simple mock login
    if (email.includes("admin")) {
      res.json({ role: "admin", token: "mock-admin-token" });
    } else {
      res.json({ role: "student", token: "mock-student-token" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
