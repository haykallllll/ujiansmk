"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Award, Calendar, ArrowLeft, RotateCcw } from 'lucide-react';

interface Result {
  id: number;
  nilai: number;
  created_at: string;
}

export default function ResultPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setResults(data || []);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat hasil...</div>;

  const latestResult = results[0];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hasil Ujian</h1>
          <p className="text-gray-500 mt-1">Lihat pencapaian Anda di sini.</p>
        </div>
        <Link 
          href="/app"
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Dashboard
        </Link>
      </header>

      {latestResult ? (
        <div className="space-y-10">
          {/* Latest Result Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 md:p-16 text-center border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Award className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-medium uppercase tracking-widest text-sm mb-2">Nilai Ujian Terakhir</p>
              <h2 className="text-8xl font-black text-gray-900 mb-6">{Math.round(latestResult.nilai)}</h2>
              
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-10">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{new Date(latestResult.created_at).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/app/exam"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-200"
                >
                  <RotateCcw className="w-5 h-5" /> Ulangi Ujian
                </Link>
              </div>
            </div>

            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          </motion.div>

          {/* History Table */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Riwayat Ujian</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 font-bold border-b">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4 text-right">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(res.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(res.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                          ${res.nilai >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                        `}>
                          {Math.round(res.nilai)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Hasil</h3>
          <p className="text-gray-500 mb-8">Anda belum pernah mengikuti ujian. Mulai sekarang untuk melihat hasil Anda.</p>
          <Link 
            href="/app/exam"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
          >
            Mulai Ujian Pertama
          </Link>
        </div>
      )}
    </div>
  );
}
