"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion } from 'motion/react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    totalExams: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Total Students
      const { count: studentCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'siswa');

      // Total Questions
      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Total Exams & Avg Score
      const { data: results } = await supabase
        .from('results')
        .select('nilai');

      if (results) {
        const total = results.length;
        const avg = total > 0 ? results.reduce((acc, curr) => acc + Number(curr.nilai), 0) / total : 0;
        setStats({
          totalStudents: studentCount || 0,
          totalQuestions: questionCount || 0,
          totalExams: total,
          averageScore: Math.round(avg)
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Siswa', value: stats.totalStudents, icon: Users, color: 'blue' },
    { name: 'Total Soal', value: stats.totalQuestions, icon: BookOpen, color: 'purple' },
    { name: 'Ujian Selesai', value: stats.totalExams, icon: Award, color: 'green' },
    { name: 'Rata-rata Nilai', value: stats.averageScore, icon: TrendingUp, color: 'red' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Pantau aktivitas ujian dan performa siswa.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => (
          <motion.div 
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 
              ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
              ${card.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
              ${card.color === 'green' ? 'bg-green-50 text-green-600' : ''}
              ${card.color === 'red' ? 'bg-red-50 text-red-600' : ''}
            `}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.name}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h3>
          <div className="grid grid-cols-1 gap-4">
            <a href="/app/admin/questions" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold">Kelola Bank Soal</span>
              </div>
              <TrendingUp className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="/app/admin/results" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-bold">Lihat Hasil Siswa</span>
              </div>
              <TrendingUp className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gray-900 p-8 rounded-[2rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Tips Admin</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-red-600 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white font-bold">1</div>
                Gunakan menu Manajemen Soal untuk menambah, mengedit, atau menghapus soal ujian.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-red-600 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white font-bold">2</div>
                Hasil ujian siswa dapat dipantau secara real-time di menu Hasil Ujian.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-red-600 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white font-bold">3</div>
                Pastikan kunci jawaban sudah benar sebelum mempublikasikan soal baru.
              </li>
            </ul>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
