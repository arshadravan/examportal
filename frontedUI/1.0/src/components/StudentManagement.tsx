import React from 'react';
import { 
  UserPlus, 
  TrendingUp, 
  Timer, 
  CheckCircle2,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const students = [
  { id: '1', name: 'Alexander Thorne', major: 'Applied Mathematics', email: 'a.thorne@academic.edu', examId: 'EX-4829-TH', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-LAW-AYccObpIqVZVoamgxc7cAAE3j3lpX18mwg7XEOhLYqQJbHyIidUsBM8TuJB-ubZD-b54AlYsKJNs2K5SaK5B50Ae7Ekhpq5nMAw0vajA3vN8hMMgedQ8Vc_UdmNb2pRvRgQFUTtGh2NzoHN3oXn9rC0yM0N8yUhJZ6SxLhShfYqCAF_aWgjLBW1Yy6_FI8eWvMmuG3WT1eIUw9Z8lQNUuVBtordxlVWeZg2Fpe1KpZFQspc47joc2F_sFr2gKPQDAuGvEGgV' },
  { id: '2', name: 'Elena Rodriguez', major: 'Quantum Physics', email: 'elena.rod@phys.inst.org', examId: 'EX-9912-RD', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNAJZeq5q8ri_CLg1oplxTCB8w7l4mCrXF0rgASP1kzp9G2l-ANiwkD_I2-YlX4O46UApZpRabojHh4TrUfKhDwtzQKqOuDaw7nO0F0ROuS17nC9lmJ07z0mDpxHJ9-W9QUE-pLmnqeJdyk5T3ETLgqJwO4TDSPX8sFaBiAmdYbl_jwU86nL-72GWuRr2ermTDwDfjdN3qq194wfbSvlSvfccFn42F6HXvO880_PHk2t889dXmTpS9FgY0KZ9peukXJTQudeHFOomA' },
  { id: '3', name: 'Marcus Vane', major: 'Cognitive Science', email: 'mvane.cog@uni.ac', examId: 'EX-1053-VN', status: 'Inactive', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9BvVQpbNbc8L6UwR7PPTnW0prBlnGUQn8_XRDXqPbFUS-b8QI4se-H9e9kRvzCR_qUSAQZllSusW36DcurXZxgsDngDgkvooHGceyTANe5uAbvLkAE8doKGmKWl6QNJh0CKspWQv6JBO1kWz2BkPjvHKdsEDXcdOiQf_6TspZp57ifmEQhHq93qCPqKI2NH53yYMMpDpXfePY62CBFMCE6Y3DbzzAa-qxSIcpHyiMeSr9_jzldOvhpt2H-fxhcEUUN0FkDRAH6yWK' },
  { id: '4', name: 'Sarah Jenkins', major: 'Economics', email: 's.jenkins@ec.college.io', examId: 'EX-7721-JK', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPY2IFR649U8KtuRNnmMKN2S95SwLWRc5-UliQN6N78fq0rL8ha-Dn8dVfPRUr-nmj23S1OWOG9q7FAKDHrOUepztX71W3VNg3sREtm1imbYkx5AnD5Ky9IPcCNRa736aEwfbGfodelkOcAb39Npl97kCVNw-gYnrc-EaVwHn-k4ME-7t63LdzCKLvPGKVjOfE6qiJWjv5DzVxOiuw71cI2cC45-yuXiulB-gqxxk-xljofWFEw8SuAlu4b6hyLI0a5a7aJGoCChQ' },
];

export const StudentManagement: React.FC = () => {
  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight text-on-surface mb-2">Student Registry</h2>
          <p className="text-on-surface-variant text-sm md:text-base max-w-md">Manage academic credentials, exam access, and participation status for all active candidates.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
          <UserPlus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Total Students', value: '1,284', trend: '+12% this month', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Active Exams', value: '42', trend: '5 ending today', icon: Timer, color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
          { label: 'System Health', value: '99.9%', trend: 'All systems operational', icon: CheckCircle2, color: 'text-indigo-900', bg: 'bg-surface-container' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label} 
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-1"
          >
            <span className="text-on-surface-variant text-sm font-medium">{stat.label}</span>
            <span className={cn("text-4xl font-extrabold font-headline tracking-tight", stat.color)}>{stat.value}</span>
            <div className={cn("mt-4 flex items-center gap-2 text-xs font-semibold w-fit px-2 py-1 rounded-full", stat.bg, stat.color)}>
              <stat.icon className="h-3 w-3" /> {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface-container-low p-3 md:p-4 rounded-xl flex flex-col items-stretch justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            className="w-full bg-surface-container-lowest border-none rounded-lg pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/40"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-surface-container-lowest text-on-surface text-xs md:text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-surface-container-lowest text-on-surface text-xs md:text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Student Details</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Email Address</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Exam ID</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Status</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden shrink-0">
                        <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm md:text-base text-on-surface font-headline truncate">{student.name}</p>
                        <p className="text-[10px] md:text-xs text-on-surface-variant truncate">{student.major}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <span className="text-xs md:text-sm font-medium text-on-surface truncate block max-w-[150px] md:max-w-none">{student.email}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5 font-headline">
                    <span className="bg-surface-container px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold text-on-surface">{student.examId}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold",
                      student.status === 'Active' ? "bg-primary/5 text-primary" : "bg-surface-container-high text-on-surface-variant"
                    )}>
                      <span className={cn("w-1 md:w-1.5 h-1 md:h-1.5 rounded-full", student.status === 'Active' ? "bg-primary" : "bg-outline")} />
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                      <button className="p-1.5 md:p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-all">
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-low px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs md:text-sm text-on-surface-variant font-medium text-center sm:text-left">Showing 1 to 10 of 1,284 results</span>
          <div className="flex gap-1.5 md:gap-2">
            <button className="p-1.5 md:p-2 text-on-surface hover:bg-white rounded-lg transition-colors">
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <div className="flex items-center px-3 md:px-4 font-bold text-xs md:text-sm text-primary bg-white rounded-lg shadow-sm">1</div>
            <button className="p-1.5 md:p-2 text-xs md:text-sm text-on-surface hover:bg-white rounded-lg transition-colors">2</button>
            <button className="p-1.5 md:p-2 text-xs md:text-sm text-on-surface hover:bg-white rounded-lg transition-colors">3</button>
            <button className="p-1.5 md:p-2 text-on-surface hover:bg-white rounded-lg transition-colors">
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
