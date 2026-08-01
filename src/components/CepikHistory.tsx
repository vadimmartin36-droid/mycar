import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  UserCheck, 
  Building, 
  MapPin, 
  FileCheck2, 
  TrendingUp, 
  Wrench, 
  CheckCircle2, 
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CAR_CONFIG } from '../carData';

interface CepikHistoryProps {
  onOpenTestDrive?: () => void;
}

export const CepikHistory: React.FC<CepikHistoryProps> = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'chart'>('timeline');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'inspection' | 'owner' | 'registration'>('all');

  const cepikRecords = CAR_CONFIG.cepikHistory || [];
  const mileageData = CAR_CONFIG.mileageHistory || [];

  // Filter cepik records
  const filteredRecords = cepikRecords.filter(item => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'inspection') return item.category === 'inspection';
    if (categoryFilter === 'owner') return item.category === 'owner';
    if (categoryFilter === 'registration') return item.category === 'registration' || item.category === 'production';
    return true;
  });

  // Count stats
  const totalInspections = cepikRecords.filter(r => r.category === 'inspection').length;
  const positiveInspections = cepikRecords.filter(r => r.badgeType === 'success').length;
  const lastInspection = cepikRecords.slice().reverse().find(r => r.category === 'inspection');

  return (
    <div className="space-y-10">
      
      {/* =========================================================================
          1. CEPiK VERIFIED BANNER & SUMMARY CARDS
         ========================================================================= */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-br from-[#0e0e18] via-[#090910] to-[#121120] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#229ED9]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f6e05e]/20 via-[#d4af37]/30 to-[#8a6715]/40 border border-[#d4af37]/60 flex items-center justify-center text-[#f6e05e] shrink-0 shadow-lg shadow-[#d4af37]/20">
              <ShieldCheck className="w-8 h-8 text-[#f6e05e]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/40">
                  Polska Baza CEPiK
                </span>
                <span className="text-xs text-gray-400 font-mono">100% Weryfikacja</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                Oficjalna Historia Pojazdu z CEPIK
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Badanie ważne do 22.12.2026 r.</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#f6e05e] text-xs font-semibold mb-1">
              <FileCheck2 className="w-4 h-4" />
              <span>Wyniki badań</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {positiveInspections} / {totalInspections} <span className="text-xs font-bold text-emerald-400">100% Pozytywne</span>
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Brak jakichkolwiek usterek</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#f6e05e] text-xs font-semibold mb-1">
              <Gauge className="w-4 h-4" />
              <span>Stan Licznika CEPiK</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              271 594 <span className="text-xs font-semibold text-gray-400">km</span>
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Odczyt z 22.12.2025 (EL/115/P)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#f6e05e] text-xs font-semibold mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Prywatny Właściciel</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              9 lat <span className="text-xs font-semibold text-gray-400">w jednych rękach</span>
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">2016 – 2025 (woj. Łódzkie)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#f6e05e] text-xs font-semibold mb-1">
              <Award className="w-4 h-4" />
              <span>Rok & Rejestracja</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              2007 r. <span className="text-xs font-semibold text-gray-400">/ PL 2010</span>
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Pełna dokumentacja i karta</span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. NAVIGATION TABS (Timeline / Mileage Chart / Service History)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Main View Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b] text-black shadow-lg shadow-[#d4af37]/20 font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Pełna Oś Czasu CEPiK ({cepikRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b] text-black shadow-lg shadow-[#d4af37]/20 font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Wykres Przebiegu (2014–2025)</span>
          </button>
        </div>

        {/* Filters if timeline active */}
        {activeTab === 'timeline' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-[11px] text-gray-400 font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#d4af37]" /> Filtr:
            </span>
            {[
              { id: 'all', label: 'Wszystkie' },
              { id: 'inspection', label: 'Badania Techniczne' },
              { id: 'owner', label: 'Właściciele' },
              { id: 'registration', label: 'Rejestracja' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === f.id
                    ? 'bg-[#d4af37]/25 text-[#f6e05e] border border-[#d4af37]/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* =========================================================================
          3. TAB CONTENT
         ========================================================================= */}

      {/* --- TAB 1: PEŁNA OŚ CZASU (TIMELINE) --- */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="relative pl-6 sm:pl-10 border-l-2 border-[#d4af37]/30 space-y-8 max-w-5xl mx-auto">
            
            {filteredRecords.map((item, idx) => {
              const isInspection = item.category === 'inspection';
              const isOwner = item.category === 'owner';
              const isReg = item.category === 'registration' || item.category === 'production';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                  className="relative group"
                >
                  {/* Timeline dot */}
                  <div 
                    className={`absolute -left-[31px] sm:-left-[47px] top-3.5 w-6 h-6 rounded-full border-4 border-[#0a0a12] flex items-center justify-center transition-transform group-hover:scale-125 z-10 ${
                      item.badgeType === 'success'
                        ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : item.badgeType === 'gold'
                        ? 'bg-[#f6e05e] shadow-[0_0_12px_rgba(246,224,94,0.5)]'
                        : 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                    }`}
                  >
                    {isInspection && <CheckCircle2 className="w-3 h-3 text-black font-extrabold" />}
                    {isOwner && <UserCheck className="w-3 h-3 text-black font-extrabold" />}
                    {isReg && <FileCheck2 className="w-3 h-3 text-black font-extrabold" />}
                  </div>

                  {/* Card Container */}
                  <div className={`p-5 sm:p-6 rounded-2xl glass-card border transition-all duration-300 ${
                    item.id === 'cepik-23'
                      ? 'border-[#d4af37] bg-[#121122]/95 shadow-[0_10px_30px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/40'
                      : 'border-white/10 hover:border-[#d4af37]/50 hover:bg-white/[0.03]'
                  }`}>

                    {/* Top Row: Date, Badge, SKP/Mileage */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-black/60 text-white font-mono border border-white/10 shadow-inner">
                          {item.date}
                        </span>
                        
                        {item.badge && (
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            item.badgeType === 'success'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                              : item.badgeType === 'gold'
                              ? 'bg-[#d4af37]/20 text-[#f6e05e] border-[#d4af37]/50'
                              : 'bg-sky-500/15 text-sky-300 border-sky-500/40'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Mileage / SKP Header indicator */}
                      {item.mileageFormatted && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f6e05e] font-extrabold text-xs">
                          <Gauge className="w-3.5 h-3.5 text-[#f6e05e]" />
                          <span>{item.mileageFormatted}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <h4 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                      {item.title}
                      {item.skpCode && (
                        <span className="text-xs font-mono font-medium text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          SKP: {item.skpCode}
                        </span>
                      )}
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs text-gray-400 mt-0.5 mb-3 font-light">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Note if any */}
                    {item.note && (
                      <p className="text-xs text-[#f6e05e] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1.5 rounded-lg mb-3 italic">
                        💡 {item.note}
                      </p>
                    )}

                    {/* Detailed Key-Value Grid */}
                    {item.details && item.details.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-white/5">
                        {item.details.map((det, i) => (
                          <div key={i} className="text-xs bg-black/30 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                              {det.label}
                            </span>
                            <span className="text-xs font-semibold text-gray-200 mt-0.5">
                              {det.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>
      )}

      {/* --- TAB 2: WYKRES PRZEBIEGU (RECHARTS CHART) --- */}
      {activeTab === 'chart' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#f6e05e]" />
              <h4 className="text-base sm:text-lg font-bold font-display text-white">
                Historia Odczytów Licznika (CEPiK)
              </h4>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f6e05e] text-xs font-semibold">
              ✓ 100% Brak cofania licznika
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-[220px] sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mileageData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mileageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f6e05e" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af" 
                  tickLine={false}
                  axisLine={{ stroke: '#ffffff20' }}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <YAxis 
                  domain={[170000, 280000]}
                  stroke="#9ca3af" 
                  tickLine={false}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="px-3 py-2 rounded-xl bg-[#0c0c16]/95 border border-[#d4af37]/60 shadow-xl text-xs space-y-0.5 backdrop-blur-md">
                          <p className="font-bold text-white font-mono">{data.date}</p>
                          <p className="text-[#f6e05e] font-black text-sm">
                            {data.label}
                          </p>
                          <p className="text-gray-400 text-[11px]">SKP: {data.skp}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mileage" 
                  stroke="#f6e05e" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#mileageGradient)" 
                  activeDot={{ r: 6, fill: '#f6e05e', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key milestone summary pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-medium">Pierwszy wpis (2014)</span>
              <span className="text-xs sm:text-sm font-bold text-white">183 119 km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-medium">Po 5 latach (2019)</span>
              <span className="text-xs sm:text-sm font-bold text-white">242 542 km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-medium">Po 10 latach (2024)</span>
              <span className="text-xs sm:text-sm font-bold text-white">267 221 km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-center">
              <span className="text-[10px] text-[#f6e05e] block uppercase font-bold">Ostatni odczyt (2025)</span>
              <span className="text-xs sm:text-sm font-black text-[#f6e05e]">271 594 km</span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
