import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Key, 
  Lightbulb, 
  Radio, 
  Sparkles, 
  Check, 
  Play, 
  Square,
  ShieldAlert
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export function AudioDashboard() {
  const [isPlayingEngine, setIsPlayingEngine] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioSynth.isMuted);
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);

  const handleToggleMute = () => {
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioSynth.playClick();
    }
  };

  const handlePlayEngine = async () => {
    if (isPlayingEngine) return;
    setIsPlayingEngine(true);
    setActiveSoundName('Odpalanie silnika 1.6 HDi...');
    
    await audioSynth.playEngineStart();
    
    setIsPlayingEngine(false);
    setActiveSoundName(null);
  };

  const handlePlayHorn = () => {
    audioSynth.playHorn();
    setActiveSoundName('Klakson (Sygnał dźwiękowy)');
    setTimeout(() => setActiveSoundName(null), 1200);
  };

  const handlePlayLock = () => {
    audioSynth.playLockSound();
    setActiveSoundName('Centralny zamek (Kluczyk)');
    setTimeout(() => setActiveSoundName(null), 1200);
  };

  const handlePlaySwitch = () => {
    audioSynth.playSwitchSound();
    setActiveSoundName('Przełącznik świateł');
    setTimeout(() => setActiveSoundName(null), 1200);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-br from-[#0c0d16] via-[#080910] to-[#121122] relative overflow-hidden shadow-2xl">
      
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/40">
              Interaktywne Efekty Dźwiękowe
            </span>
            <span className="text-xs text-gray-400 font-num">Web Audio Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Strefa Dźwiękowa Citroëna
          </h3>
        </div>

        {/* Mute / Unmute Button */}
        <button
          onClick={handleToggleMute}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'
              : 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f6e05e] hover:bg-[#d4af37] hover:text-black shadow-lg shadow-[#d4af37]/20'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'Wyciszony' : 'Dźwięk Aktywny'}</span>
        </button>
      </div>

      {/* Dynamic sound equalizer bars when engine plays */}
      {isPlayingEngine && (
        <div className="flex items-center justify-center gap-1.5 py-4 my-2">
          <span className="text-xs text-[#f6e05e] font-bold mr-2 animate-pulse">Dźwięk Silnika:</span>
          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 35].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, h, 12] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
              className="w-1.5 bg-gradient-to-t from-[#d4af37] to-[#f6e05e] rounded-full"
            />
          ))}
        </div>
      )}

      {/* Sound Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        
        {/* Button 1: Engine Start */}
        <button
          onClick={handlePlayEngine}
          disabled={isPlayingEngine || isMuted}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
            isPlayingEngine
              ? 'border-[#f6e05e] bg-[#d4af37]/25 shadow-lg shadow-[#d4af37]/30 scale-102'
              : 'border-white/10 bg-white/5 hover:border-[#d4af37]/50 hover:bg-white/10 disabled:opacity-40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] flex items-center justify-center font-bold">
              {isPlayingEngine ? <Square className="w-4 h-4 text-[#f6e05e] fill-[#f6e05e]" /> : <Play className="w-4 h-4 text-[#f6e05e] fill-[#f6e05e] ml-0.5" />}
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/50 text-[#f6e05e] border border-white/10">
              1.6 HDi
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">Posłuchaj Silnika</h4>
          <p className="text-[11px] text-gray-400">Odpalanie, świst turbiny i rozruch</p>
        </button>

        {/* Button 2: Kluczyk / Zamek */}
        <button
          onClick={handlePlayLock}
          disabled={isMuted}
          className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#d4af37]/50 hover:bg-white/10 text-left transition-all duration-300 disabled:opacity-40 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center">
              <Key className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/50 text-sky-300 border border-white/10">
              Zamek
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">Kluczyk & Pilot</h4>
          <p className="text-[11px] text-gray-400">Sygnał centralnego zamka</p>
        </button>

        {/* Button 3: Klakson */}
        <button
          onClick={handlePlayHorn}
          disabled={isMuted}
          className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#d4af37]/50 hover:bg-white/10 text-left transition-all duration-300 disabled:opacity-40 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-white/10">
              Klakson
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">Sygnał Klaksonu</h4>
          <p className="text-[11px] text-gray-400">Dwutonowy sygnał Citroën</p>
        </button>

        {/* Button 4: Przełącznik Świateł */}
        <button
          onClick={handlePlaySwitch}
          disabled={isMuted}
          className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#d4af37]/50 hover:bg-white/10 text-left transition-all duration-300 disabled:opacity-40 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/50 text-emerald-300 border border-white/10">
              Przekaźnik
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">Klik Świateł</h4>
          <p className="text-[11px] text-gray-400">Dźwięk włącznika reflektorów</p>
        </button>

      </div>

      {/* Active sound playing label */}
      {activeSoundName && !isPlayingEngine && (
        <div className="mt-4 text-center text-xs font-semibold text-[#f6e05e] bg-[#d4af37]/15 py-2 px-4 rounded-xl border border-[#d4af37]/30 animate-pulse">
          🔊 Odtwarzanie: {activeSoundName}
        </div>
      )}

    </div>
  );
}
