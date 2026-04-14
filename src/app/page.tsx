"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { BookOpen, Monitor, Camera, Calculator, Radio, Briefcase, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  const jurusans = [
    { name: 'TKJ', desc: 'Teknik Komputer dan Jaringan', icon: Monitor },
    { name: 'DKV', desc: 'Desain Komunikasi Visual', icon: Camera },
    { name: 'AK', desc: 'Akuntansi', icon: Calculator },
    { name: 'BC', desc: 'Broadcasting', icon: Radio },
    { name: 'MPLB', desc: 'Manajemen Perkantoran dan Layanan Bisnis', icon: Briefcase },
    { name: 'BD', desc: 'Bisnis Digital', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">SMK Prima Unggul</span>
          </div>
          <Link 
            href="/login" 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Masuk ke Aplikasi
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6"
            >
              Masa Depan <span className="text-red-600">Cemerlang</span> <br /> Dimulai di Sini
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              SMK Prima Unggul berkomitmen mencetak generasi unggul yang siap kerja, 
              cerdas, dan berkarakter di era digital.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-all hover:scale-105"
              >
                Mulai Ujian Sekarang <BookOpen className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Program Keahlian Kami</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jurusans.map((jurusan, index) => (
              <motion.div 
                key={jurusan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <jurusan.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{jurusan.name}</h3>
                <p className="text-gray-600">{jurusan.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-lg">SMK Prima Unggul</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Mencetak tenaga kerja profesional yang kompeten dan berdaya saing tinggi.
          </p>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SMK Prima Unggul. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
