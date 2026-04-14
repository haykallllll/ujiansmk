"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { motion } from 'motion/react';
import { BookOpen, Award, Clock, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    lastScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: results } = await supabase
        .from('results')
        .select('nilai')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (results && results.length > 0) {
        const total = results.length;
        const avg = results.reduce((acc, curr) => acc + Number(curr.nilai), 0) / total;
        setStats({
          totalExams: total,
          averageScore: Math.round(avg),
          lastScore: Number(results[0].nilai)
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Siswa</h1>
        <p className="text-gray-500 mt-1">Selamat datang kembali! Siap untuk ujian hari ini?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-500">Total Ujian</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalExams}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-500">Rata-rata Nilai</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.averageScore}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-500">Nilai Terakhir</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.lastScore}</h3>
        </motion.div>
      </div>

      {/* Action Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-red-600 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-red-200"
      >
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ujian Kompetensi TKJ</h2>
          <p className="text-red-100 text-lg mb-8">
            Uji kemampuan Anda dalam Teknik Komputer dan Jaringan. 
            Pastikan koneksi internet stabil sebelum memulai.
          </p>
          <Link 
            href="/app/exam"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all active:scale-95"
          >
            Mulai Ujian Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 w-96 h-96 bg-red-400/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}
