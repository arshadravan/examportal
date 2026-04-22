import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckSquare,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const results = [
  { id: '1', name: 'Eleanor Markram', initial: 'EM', exam: 'Advanced Theory Final', subject: 'Philology', score: '94/100', time: '38m 12s', color: 'bg-indigo-200 text-indigo-700' },
  { id: '2', name: 'Julian Sterling', initial: 'JS', exam: 'Quantum Computing 101', subject: 'CompSci', score: '88/100', time: '54m 05s', color: 'bg-primary-fixed text-on-primary-fixed' },
  { id: '3', name: 'Aditi Williams', initial: 'AW', exam: 'Advanced Theory Final', subject: 'Philology', score: '58/100', time: '41m 22s', color: 'bg-tertiary-fixed text-on-tertiary-fixed', fail: true },
  { id: '4', name: 'Ben Henderson', initial: 'BH', exam: 'Intro to Logic', subject: 'Mathematics', score: '82/100', time: '29m 44s', color: 'bg-slate-200 text-slate-700' },
  { id: '5', name: 'Chloe Liao', initial: 'CL', exam: 'Quantum Computing 101', subject: 'CompSci', score: '91/100', time: '58m 10s', color: 'bg-indigo-200 text-indigo-700' },
];

export const ResultsAnalytics: React.FC = () => {
  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-[1400px] mx-auto">
      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Average Score', value: '78.4', sub: '/100', trend: '+2.4% vs last mo', icon: TrendingUp },
          { label: 'Pass Rate %', value: '92.1%', trend: '892 Students', icon: ShieldCheck },
          { label: 'Time Taken', value: '42', sub: 'min', trend: 'Avg. Session', icon: Clock },
          { label: 'Exams Completed', value: '1,248', trend: 'This Week', icon: CheckSquare },
        ].map((metric, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={metric.label} 
            className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm hover:translate-y-[-2px] transition-all"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg text-primary">
                <metric.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                {metric.trend}
              </span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-on-surface-variant font-headline mb-0.5 md:mb-1 uppercase tracking-wider">
              {metric.label}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-headline text-on-surface">
              {metric.value}
              {metric.sub && <span className="text-sm md:text-base lg:text-lg text-on-surface-variant font-medium ml-0.5">{metric.sub}</span>}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Filters */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 w-full max-w-4xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Exam Name</label>
            <select className="bg-surface-container-high border-none rounded-lg text-xs md:text-sm py-2 md:py-2.5 focus:ring-2 focus:ring-primary/20 transition-all">
              <option>All Exams</option>
              <option>Advanced Theory Final</option>
              <option>Introduction to Logic</option>
              <option>Quantum Computing 101</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Subject Area</label>
            <select className="bg-surface-container-high border-none rounded-lg text-xs md:text-sm py-2 md:py-2.5 focus:ring-2 focus:ring-primary/20 transition-all">
              <option>All Subjects</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Philosophy</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2 md:col-span-1">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Date Range</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Select dates" 
                className="w-full bg-surface-container-high border-none rounded-lg text-xs md:text-sm py-2 md:py-2.5 pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-on-surface-variant" />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button className="w-full sm:flex-1 lg:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-all shadow-sm">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button className="w-full sm:flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/10">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-headline font-bold text-lg md:text-xl text-on-surface">Detailed Results</h2>
          <div className="flex items-center gap-2 text-[10px] md:text-sm text-on-surface-variant">
            <Info className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Showing 1-10 of 1,248 entries
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Student Name</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Exam Taken</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Subject</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Score</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">Time Taken</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {results.map((row) => (
                <tr key={row.id} className="hover:bg-surface-bright transition-colors">
                  <td className="px-4 md:px-8 py-4 md:py-5">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={cn("w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0", row.color)}>
                        {row.initial}
                      </div>
                      <span className="font-semibold text-sm md:text-base text-on-surface truncate max-w-[120px] md:max-w-none">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-4 md:py-5 text-xs md:text-sm text-on-surface-variant font-medium truncate max-w-[150px] md:max-w-none">{row.exam}</td>
                  <td className="px-4 md:px-8 py-4 md:py-5">
                    <span className="px-2 py-0.5 md:py-1 rounded bg-primary/5 text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                      {row.subject}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-4 md:py-5">
                    <span className={cn("font-headline font-bold text-sm md:text-base", row.fail ? "text-error" : "text-primary")}>
                      {row.score}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-4 md:py-5 text-xs md:text-sm text-on-surface-variant">{row.time}</td>
                  <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                    <button className="text-primary font-bold text-xs md:text-sm hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 md:px-8 py-4 md:py-6 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs md:text-sm text-on-surface-variant font-medium text-center sm:text-left">
            Showing 1 to 5 of 1,248 results
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all">
              <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-primary text-white text-xs md:text-sm font-bold shadow-lg shadow-primary/20">1</button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all text-xs md:text-sm font-bold">2</button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all text-xs md:text-sm font-bold">3</button>
            <span className="px-1 md:px-2 text-on-surface-variant text-xs">...</span>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all text-xs md:text-sm font-bold">125</button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all">
              <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h3 className="font-headline font-bold text-base md:text-lg text-on-surface">Score Distribution</h3>
              <p className="text-xs md:text-sm text-on-surface-variant">Performance spread across all participants</p>
            </div>
            <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 w-fit">
              View Graph <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-end gap-1.5 md:gap-2 h-40 md:h-48">
            {[10, 25, 45, 95, 65, 35, 15].map((h, i) => (
              <div 
                key={i}
                className={cn(
                  "w-full rounded-t-lg transition-all cursor-pointer",
                  i === 3 ? "bg-primary" : "bg-surface-container-high hover:bg-primary-fixed-dim"
                )}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[8px] md:text-[10px] uppercase font-bold text-on-surface-variant font-headline tracking-widest">
            <span>0-30</span>
            <span>31-50</span>
            <span>51-70</span>
            <span>71-85</span>
            <span>86-95</span>
            <span>96-100</span>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-lg md:text-xl mb-2">Automated Insight</h3>
            <p className="text-indigo-200 text-xs md:text-sm leading-relaxed mb-6">
              Results are up <span className="text-white font-bold">12%</span> in Mathematics this semester. Consider increasing the difficulty of the Advanced Algebra exam for the next cycle.
            </p>
          </div>
          <button className="relative z-10 bg-white/10 hover:bg-white/20 transition-all border border-white/20 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold font-headline flex items-center justify-center gap-2">
            Generate Full Report
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
