import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Rocket, 
  CheckCircle2, 
  MoreHorizontal,
  PlusCircle,
  FileBarChart,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  History,
  Edit3,
  UserPlus,
  HelpCircle,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';

const participationData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 95 },
  { name: 'Thu', value: 55 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 30 },
  { name: 'Sun', value: 20 },
];

const activeExams = [
  { name: 'Advanced Theory: Final Exam', time: 'Started 15 mins ago', participants: 142 },
  { name: 'Data Structures & Algo', time: 'Started 45 mins ago', participants: 89 },
  { name: 'Introduction to UX Design', time: 'Started 2 hours ago', participants: 256 },
];

const activities = [
  { id: '1', type: 'registration', title: 'New student registration', desc: 'Marcus Chen joined Computer Science 101', time: '2 mins ago', icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  { id: '2', type: 'submission', title: 'Exam submitted', desc: 'Sarah Miller completed "Economic Policy"', time: '14 mins ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: '3', type: 'alert', title: 'Proctor Alert', desc: 'Tab switching detected for ID #8841', time: '28 mins ago', icon: AlertTriangle, color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
  { id: '4', type: 'update', title: 'Exam Updated', desc: 'Prof. Aris edited "Microbiology Quiz 4"', time: '1 hour ago', icon: Edit3, color: 'text-primary', bg: 'bg-primary/10' },
  { id: '5', type: 'backup', title: 'System Backup', desc: 'Daily cloud restoration point created', time: '3 hours ago', icon: History, color: 'text-secondary', bg: 'bg-surface-container' },
];

export const AdminDashboard: React.FC<{ userName?: string }> = ({ userName }) => {
  const [stats, setStats] = useState({
    students: '...',
    exams: '...',
    active: '...',
    questions: '...',
    categories: '...',
    subjects: '...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, exams, questions, categories, subjects] = await Promise.all([
          apiService.getStudents(),
          apiService.getExams(),
          apiService.getQuestions(),
          apiService.getCategories(),
          apiService.getSubjects()
        ]);
        setStats({
          students: students.length.toString(),
          exams: exams.length.toString(),
          active: exams.filter((e: any) => e.status === 'live').length.toString(),
          questions: questions.length.toString(),
          categories: categories.length.toString(),
          subjects: subjects.length.toString()
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.students, trend: '+12% vs last month', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Questions', value: stats.questions, trend: 'Bank Size', icon: HelpCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Exams', value: stats.active, trend: 'Live Now', icon: Rocket, color: 'text-tertiary', bg: 'bg-tertiary-fixed', live: true },
    { label: 'Categories', value: stats.categories, trend: 'Exam Groups', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-surface-container-lowest p-5 md:p-6 lg:p-8 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all group border border-surface-container/50"
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className={cn("p-2.5 md:p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                {stat.live && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-tertiary animate-pulse" />}
                <span className={cn("text-[9px] md:text-[10px] font-bold uppercase tracking-widest", stat.color)}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-on-surface-variant text-xs md:text-sm font-medium tracking-wide uppercase">{stat.label}</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline tracking-tight text-on-surface">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        {/* Main Chart & Table */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <section className="bg-surface-container-lowest p-5 md:p-8 lg:p-10 rounded-2xl border border-surface-container/50 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-10">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface tracking-tight">Participation Trends</h3>
                <p className="text-on-surface-variant text-sm md:text-base mt-1">Student activity over the last 7 days</p>
              </div>
              <div className="flex bg-surface-container p-1 rounded-full w-fit">
                <button className="px-5 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs font-bold rounded-full text-on-surface-variant hover:text-on-surface transition-colors">7D</button>
                <button className="px-5 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs font-bold bg-primary text-on-primary rounded-full shadow-md">30D</button>
              </div>
            </div>
            
            <div className="h-64 md:h-80 lg:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#464555' }}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f2f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#3525cd' : '#e6e8ea'} className="hover:fill-primary-container transition-colors cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-surface-container-lowest overflow-hidden rounded-2xl border border-surface-container/50 shadow-sm">
            <div className="px-6 md:px-8 lg:px-10 py-5 md:py-6 lg:py-8 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface tracking-tight">Currently Active</h3>
              <button className="text-xs md:text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-surface-container-low text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <tr>
                    <th className="px-6 md:px-8 lg:px-10 py-5">Exam Name</th>
                    <th className="px-6 md:px-8 lg:px-10 py-5">Status</th>
                    <th className="px-6 md:px-8 lg:px-10 py-5 text-right">Participants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {activeExams.map((exam) => (
                    <tr key={exam.name} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="px-6 md:px-8 lg:px-10 py-5 md:py-6">
                        <p className="font-bold text-sm md:text-base lg:text-lg text-on-surface group-hover:text-primary transition-colors">{exam.name}</p>
                        <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">{exam.time}</p>
                      </td>
                      <td className="px-6 md:px-8 lg:px-10 py-5 md:py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-tertiary-fixed text-tertiary text-[10px] md:text-xs font-bold rounded-full">
                          <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-tertiary animate-pulse" />
                          LIVE
                        </span>
                      </td>
                      <td className="px-6 md:px-8 lg:px-10 py-5 md:py-6 text-right font-headline font-bold text-base md:text-lg lg:text-xl text-on-surface">{exam.participants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Activity Feed */}
        <section className="bg-surface-container-lowest p-6 md:p-8 lg:p-10 rounded-2xl border border-surface-container/50 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-bold font-headline text-on-surface tracking-tight">Recent Activity</h3>
            <button className="p-2 hover:bg-surface-container rounded-full transition-all text-on-surface-variant">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-8 md:space-y-10 relative flex-1">
            <div className="absolute left-4 md:left-5 top-2 bottom-2 w-0.5 bg-surface-container" />
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-12 md:pl-14">
                <div className={cn("absolute left-0 top-1 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center z-10 shadow-sm", activity.bg, activity.color)}>
                  <activity.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm md:text-base font-bold text-on-surface leading-tight">{activity.title}</p>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{activity.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-outline uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 md:mt-12 py-4 border-2 border-surface-container rounded-xl text-sm md:text-base font-bold text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all shadow-sm">
            View All Activity
          </button>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-primary p-6 md:p-8 lg:p-10 rounded-2xl flex items-center justify-between text-on-primary group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          <div className="space-y-2">
            <h4 className="text-lg md:text-xl font-bold font-headline">Create New Exam</h4>
            <p className="text-on-primary/70 text-xs md:text-sm">Launch a new session instantly</p>
          </div>
          <PlusCircle className="h-10 w-10 md:h-12 md:w-12 opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-slate-900 p-6 md:p-8 lg:p-10 rounded-2xl flex items-center justify-between text-white group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/20">
          <div className="space-y-2">
            <h4 className="text-lg md:text-xl font-bold font-headline">Generate Reports</h4>
            <p className="text-slate-400 text-xs md:text-sm">Analytics for current semester</p>
          </div>
          <FileBarChart className="h-10 w-10 md:h-12 md:w-12 opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-indigo-100 p-6 md:p-8 lg:p-10 rounded-2xl flex items-center justify-between text-indigo-900 group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all sm:col-span-2 lg:col-span-1 shadow-lg shadow-indigo-100/20">
          <div className="space-y-2">
            <h4 className="text-lg md:text-xl font-bold font-headline">Bulk Import Students</h4>
            <p className="text-indigo-600 text-xs md:text-sm">CSV or Excel compatible</p>
          </div>
          <UploadCloud className="h-10 w-10 md:h-12 md:w-12 opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
      </section>
    </div>
  );
};
