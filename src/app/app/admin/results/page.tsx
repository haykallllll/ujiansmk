"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { motion } from 'motion/react';
import { 
  Search, 
  Download, 
  Filter, 
  User, 
  Calendar, 
  Award,
  ChevronRight
} from 'lucide-react';

interface ResultWithUser {
  id: number;
  nilai: number;
  created_at: string;
  user_id: string;
  users: {
    email: string;
  };
}

export default function AdminResults() {
  const [results, setResults] = useState<ResultWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('results')
      .select(`
        id,
        nilai,
        created_at,
        user_id,
        users (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setResults(data as any || []);
    }
    setLoading(false);
  };

  const filteredResults = results.filter(res => 
    res.users?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hasil Ujian Siswa</h1>
          <p className="text-gray-500 mt-1">Daftar lengkap nilai ujian semua siswa.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          <Download className="w-5 h-5" /> Cetak Laporan
        </button>
      </header>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan email siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-400 font-bold border-b bg-gray-50/50">
                <th className="px-8 py-5">Siswa</th>
                <th className="px-8 py-5">Tanggal & Waktu</th>
                <th className="px-8 py-5 text-center">Nilai</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-500">Tidak ada hasil ditemukan.</td>
                </tr>
              ) : (
                filteredResults.map((res, index) => (
                  <motion.tr 
                    key={res.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{res.users?.email}</p>
                          <p className="text-xs text-gray-400">ID: {res.user_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(res.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-400 ml-5">
                          {new Date(res.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`text-xl font-black ${res.nilai >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.round(res.nilai)}
                        </span>
                        <div className="w-8 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${res.nilai >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${res.nilai}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                        ${res.nilai >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                      `}>
                        {res.nilai >= 75 ? <Award className="w-3.5 h-3.5" /> : null}
                        {res.nilai >= 75 ? 'LULUS' : 'TIDAK LULUS'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
