/**
 * API Service for local testing and production
 */

//const AUTH_API_URL = 'http://localhost:8080/api/auth';
const AUTH_API_URL = 'http://15.206.168.236:8081/api/auth';
const API_BASE_URL = '/api';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── API SERVICE ─────────────────────────────────────────────────────────────

export const apiService = {

  // ── AUTH ──────────────────────────────────────────────────────────────────

  async register(userData: {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
  }) {
    const res = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `Request failed: ${res.status}`);
    }

    return res.text();
  },

  async login(credentials: { identifier: string; password: string }) {
    const data: any = await request(`${AUTH_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.identifier,
        password: credentials.password,
      }),
    });

    if (data.token) localStorage.setItem('authToken', data.token);

    return {
      role: (data.role?.toLowerCase() ?? 'student') as 'admin' | 'student',
      name: data.username ?? data.name ?? data.email ?? 'User',
      token: data.token,
    };
  },

  async verifyOtp(email: string, otp: string) {
    const res = await fetch(`${AUTH_API_URL}/verify-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `Request failed: ${res.status}`);
    }

    return res.text();
  },

  // ✅ Forgot Password — Step 1
  async forgotPassword(email: string) {
    const res = await fetch(`${AUTH_API_URL}/forgot-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `Request failed: ${res.status}`);
    }
    return res.text();
  },

  // ✅ Forgot Password — Step 2
  async verifyForgotOtp(email: string, otp: string) {
    const res = await fetch(`${AUTH_API_URL}/verify-forgot-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `Request failed: ${res.status}`);
    }
    return res.text();
  },

  // ✅ Forgot Password — Step 3
  async resetPassword(email: string, otp: string, newPassword: string) {
    const res = await fetch(`${AUTH_API_URL}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, otp, newPassword }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `Request failed: ${res.status}`);
    }
    return res.text();
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  // ── HEALTH ────────────────────────────────────────────────────────────────

  async getHealth() {
    return request(`${API_BASE_URL}/health`);
  },

  // ── CATEGORIES ───────────────────────────────────────────────────────────

  async getCategories() {
    return request(`${API_BASE_URL}/categories`);
  },

  async addCategory(category: any) {
    return request(`${API_BASE_URL}/categories/add`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateCategory(id: string, category: any) {
    return request(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  // ── SUBJECTS ─────────────────────────────────────────────────────────────

  async getSubjects() {
    return request(`${API_BASE_URL}/subjects`);
  },

  async addSubject(subject: any) {
    return request(`${API_BASE_URL}/subjects/add`, {
      method: 'POST',
      body: JSON.stringify(subject),
    });
  },

  // ── QUESTIONS ────────────────────────────────────────────────────────────

  async getQuestions() {
    return request(`${API_BASE_URL}/questions`);
  },

  async addQuestion(question: any) {
    return request(`${API_BASE_URL}/questions/add`, {
      method: 'POST',
      body: JSON.stringify(question),
    });
  },

  async updateQuestion(id: string, question: any) {
    return request(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
  },

  async deleteQuestion(id: string) {
    return request(`${API_BASE_URL}/questions/${id}`, { method: 'DELETE' });
  },

  async getTestQuestions(exam?: string, subject?: string) {
    const params = new URLSearchParams();
    if (exam) params.append('exam', exam);
    if (subject) params.append('subject', subject);
    return request(`${API_BASE_URL}/questions/test?${params}`);
  },

  // ── EXAMS ────────────────────────────────────────────────────────────────

  async getExams() {
    return request(`${API_BASE_URL}/exams`);
  },

  async addExam(exam: any) {
    return request(`${API_BASE_URL}/exams/add`, {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  },

  async updateExam(id: string, exam: any) {
    return request(`${API_BASE_URL}/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exam),
    });
  },

  async deleteExam(id: string) {
    return request(`${API_BASE_URL}/exams/${id}`, { method: 'DELETE' });
  },

  // ── STUDENTS ─────────────────────────────────────────────────────────────

  async getStudents() {
    return request(`${API_BASE_URL}/students`);
  },
};