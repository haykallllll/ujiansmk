"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  AlertCircle,
  CheckCircle2
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

export default function ExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 menit
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const fetchQuestions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Proteksi: Cek apakah sudah pernah ujian hari ini (opsional)
    // Untuk demo ini kita biarkan saja, tapi di real app bisa dicek di tabel results

    const { data, error } = await supabase
      .from('questions')
      .select('*');

    if (error) {
      console.error(error);
    } else if (data) {
      // Acak soal
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Hitung nilai
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.jawaban_benar) {
          correctCount++;
        }
      });

      const score = (correctCount / questions.length) * 100;

      // Simpan jawaban detail
      const answerData = questions.map((q) => ({
        user_id: user.id,
        question_id: q.id,
        jawaban: answers[q.id] || ''
      }));

      await supabase.from('answers').insert(answerData);

      // Simpan hasil akhir
      await supabase.from('results').insert({
        user_id: user.id,
        nilai: score
      });

      setIsFinished(true);
      setTimeout(() => {
        router.push('/app/result');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim jawaban. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Menyiapkan soal...</div>;
  if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center">Belum ada soal tersedia.</div>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Ujian */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
            {currentIndex + 1}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Soal ke</p>
            <p className="font-bold text-gray-900">{currentIndex + 1} dari {questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} />
          <span className={`font-mono font-bold text-xl ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-red-600 rounded-full"
        ></motion.div>
      </div>

      {/* Soal */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-10 leading-relaxed">
            {currentQuestion.soal}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const key = `pilihan_${opt.toLowerCase()}` as keyof Question;
              const isSelected = answers[currentQuestion.id] === opt;
              
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(currentQuestion.id, opt)}
                  className={`
                    flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all
                    ${isSelected 
                      ? 'border-red-600 bg-red-50 text-red-700' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0
                    ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}
                  `}>
                    {opt}
                  </div>
                  <span className="font-medium">{currentQuestion[key]}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigasi */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Sebelumnya
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70"
          >
            {submitting ? 'Mengirim...' : (
              <>
                Selesai Ujian <Send className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            Selanjutnya <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Overlay Selesai */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ujian Selesai!</h2>
              <p className="text-gray-500">Jawaban Anda telah berhasil disimpan. Mengalihkan ke halaman hasil...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
