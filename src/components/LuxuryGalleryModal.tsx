import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Sun, 
  Moon, 
  Lightbulb, 
  Volume2, 
  VolumeX,
  Layers
} from 'lucide-react';
import { GalleryItem } from './PhotoManagerModal';
import { audioSynth } from '../utils/audioSynthesizer';

interface LuxuryGalleryModalProps {
  selectedIndex: number | null;
  onClose: () => void;
  gallery: GalleryItem[];
  heroImage: string;
}

export function LuxuryGalleryModal({
  selectedIndex,
  onClose,
  gallery,
  heroImage
}: LuxuryGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(selectedIndex ?? 0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [nightShowcase, setNightShowcase] = useState<boolean>(false);

  // Sync index when selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== null) {
      setCurrentIndex(selectedIndex);
      setIsZoomed(false);
    }
  }, [selectedIndex]);

  // Keyboard Navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentIndex, gallery.length]);

  if (selectedIndex === null) return null;

  const currentItem = gallery[currentIndex] || {
    id: 'hero',
    title: 'Citroën C4 Picasso 2007 (Zdjęcie Główne)',
    src: heroImage,
    category: 'Nadwozie'
  };

  const handleNext = () => {
    audioSynth.playClick();
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
    setIsZoomed(false);
  };

  const handlePrev = () => {
    audioSynth.playClick();
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    setIsZoomed(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentItem.src);
    setCopiedLink(true);
    audioSynth.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    audioSynth.playClick();
    const link = document.createElement('a');
    link.href = currentItem.src;
    link.download = `citroen-c4-picasso-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[4000] bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none">
        
        {/* =========================================================================
            1. TOP BAR CONTROL PANEL
           ========================================================================= */}
        <div className="p-4 sm:p-6 flex items-center justify-between z-20 border-b border-white/10 bg-gradient-to-b from-black/80 to-transparent">
          
          {/* Photo Info & Counter */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] font-num">
              {currentIndex + 1} / {gallery.length}
            </span>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-display line-clamp-1">
                {currentItem.title}
              </h4>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Kategoria: <span className="text-[#f6e05e]">{currentItem.category || 'Wszystkie'}</span>
              </span>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2">
            
            {/* Night Showcase Glow Toggle */}
            <button
              onClick={() => {
                setNightShowcase(!nightShowcase);
                audioSynth.playSwitchSound();
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                nightShowcase 
                  ? 'bg-[#d4af37] text-black border-[#f6e05e] shadow-lg shadow-[#d4af37]/40 scale-105' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title="Włącz эффект свечения фар i Tryb Nocny"
            >
              <Lightbulb className={`w-4 h-4 ${nightShowcase ? 'text-black fill-black' : 'text-[#f6e05e]'}`} />
              <span className="hidden sm:inline">{nightShowcase ? 'Reflektory ON' : 'Tryb Nocny'}</span>
            </button>

            {/* Zoom toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              title={isZoomed ? "Pomniejsz" : "Powiększ"}
            >
              {isZoomed ? <Minimize2 className="w-4.5 h-4.5 text-[#f6e05e]" /> : <Maximize2 className="w-4.5 h-4.5" />}
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all hidden sm:flex items-center gap-1 text-xs"
              title="Kopiuj link do zdjęcia"
            >
              {copiedLink ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              title="Pobierz zdjęcie"
            >
              <Download className="w-4.5 h-4.5 text-[#f6e05e]" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                audioSynth.playClick();
                onClose();
              }}
              className="p-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* =========================================================================
            2. MAIN PHOTO CONTAINER & NAVIGATION ARROWS
           ========================================================================= */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden group">
          
          {/* Night Headlight Glow Overlay */}
          {nightShowcase && (
            <>
              <div className="headlight-cone-left" />
              <div className="headlight-cone-right" />
              <div className="absolute inset-0 bg-radial from-[#d4af37]/20 via-transparent to-black/90 pointer-events-none z-10" />
            </>
          )}

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-30 p-4 rounded-full bg-black/70 border border-white/20 text-white hover:bg-[#d4af37] hover:border-[#f6e05e] hover:text-black transition-all shadow-2xl active:scale-90"
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Main Image View */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`relative max-w-full max-h-[75vh] flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? 'cursor-zoom-out z-30' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={currentItem.src}
              alt={currentItem.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-[#d4af37]/30"
            />
          </motion.div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-30 p-4 rounded-full bg-black/70 border border-white/20 text-white hover:bg-[#d4af37] hover:border-[#f6e05e] hover:text-black transition-all shadow-2xl active:scale-90"
            aria-label="Następne zdjęcie"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

        </div>

        {/* =========================================================================
            3. BOTTOM THUMBNAIL STRIP
           ========================================================================= */}
        <div className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10 z-20">
          <div className="flex items-center gap-3 overflow-x-auto max-w-5xl mx-auto py-1 px-2 no-scrollbar justify-start sm:justify-center">
            {gallery.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id || idx}
                  onClick={() => {
                    audioSynth.playClick();
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    isActive
                      ? 'border-[#f6e05e] scale-110 shadow-lg shadow-[#d4af37]/40 ring-2 ring-[#d4af37]/50'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                  }`}
                >
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#d4af37]/20 border border-[#f6e05e]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </AnimatePresence>
  );
}
