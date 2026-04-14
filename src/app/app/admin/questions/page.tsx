"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  Check,
  BookOpen
} from 'lucide-react';

interface Question {
  id: number;
  soal: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
  jawaban_benar: string;
}

export default function QuestionManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    soal: '',
    pilihan_a: '',
    pilihan_b: '',
    pilihan_c: '',
    pilihan_d: '',
    jawaban_benar: 'A'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setQuestions(data || []);
    setLoading(false);
  };

  const handleOpenModal = (q: Question | null = null) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({
        soal: q.soal,
        pilihan_a: q.pilihan_a,
        pilihan_b: q.pilihan_b,
        pilihan_c: q.pilihan_c,
        pilihan_d: q.pilihan_d,
        jawaban_benar: q.jawaban_benar
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        soal: '',
        pilihan_a: '',
        pilihan_b: '',
        pilihan_c: '',
        pilihan_d: '',
        jawaban_benar: 'A'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from('questions')
          .update(formData)
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('questions')
          .insert(formData);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan soal.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;
    
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Gagal menghapus soal.');
    } else {
      fetchQuestions();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Soal</h1>
          <p className="text-gray-500 mt-1">Kelola bank soal untuk ujian kompetensi TKJ.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tambah Soal Baru
        </button>
      </header>

      {/* Questions List */}
      <div className="space-y-4">
        {loading && questions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Memuat soal...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Soal</h3>
            <p className="text-gray-500">Klik tombol "Tambah Soal Baru" untuk memulai.</p>
          </div>
        ) : (
          questions.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-red-100 transition-colors group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">TKJ</span>
                  <span className="text-xs font-bold text-gray-400">ID: #{q.id}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-relaxed">{q.soal}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className={`text-sm flex items-center gap-2 ${q.jawaban_benar === opt ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${q.jawaban_benar === opt ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                        {opt}
                      </div>
                      <span className="truncate">{(q as any)[`pilihan_${opt.toLowerCase()}`]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleOpenModal(q)}
                  className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Pertanyaan</label>
                  <textarea 
                    required
                    value={formData.soal}
                    onChange={(e) => setFormData({...formData, soal: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none min-h-[120px]"
                    placeholder="Tuliskan pertanyaan di sini..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Pilihan {opt}</label>
                      <input 
                        type="text"
                        required
                        value={(formData as any)[`pilihan_${opt.toLowerCase()}`]}
                        onChange={(e) => setFormData({...formData, [`pilihan_${opt.toLowerCase()}`]: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder={`Jawaban ${opt}...`}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Jawaban Benar</label>
                  <div className="flex gap-4">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({...formData, jawaban_benar: opt})}
                        className={`
                          flex-1 py-4 rounded-2xl font-bold border-2 transition-all
                          ${formData.jawaban_benar === opt 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" /> {loading ? 'Menyimpan...' : 'Simpan Soal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
