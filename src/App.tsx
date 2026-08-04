/**
 * ============================================================================
 * CITROËN C4 PICASSO 2007 - LUXURY EXCLUSIVE PREVIEW LANDING PAGE
 * ============================================================================
 * Strona ogłoszenia sprzedaży samochodu Citroën C4 Picasso 2007.
 * Język strony: POLSKI (PL).
 * Kod obsługuje: Web Audio API, interaktywne reflektory, pełny luksusowy design,
 * powiadomienia Telegram, zarządzanie zdjęciami IndexedDB oraz tryb właściciela (PIN: 0586).
 */

import React, { useState, useEffect } from 'react';
import defaultConfig from './telegramDefaultConfig.json';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  Copy, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Send, 
  Car, 
  Clock, 
  Sparkles,
  ExternalLink,
  Info,
  ChevronDown,
  Award,
  Menu,
  Heart,
  Upload,
  ImagePlus,
  Trash2,
  Lock,
  Unlock,
  Key,
  Camera,
  ArrowUp,
  Bot,
  Loader2,
  AlertCircle,
  Settings,
  HelpCircle,
  Lightbulb,
  Volume2,
  VolumeX,
  Palette,
  Eye,
  Zap,
  Radio,
  Share2
} from 'lucide-react';
import { CAR_CONFIG } from './carData';
import { PhotoManagerModal, GalleryItem } from './components/PhotoManagerModal';
import { CepikHistory } from './components/CepikHistory';
import { LuxuryGalleryModal } from './components/LuxuryGalleryModal';
import { AudioDashboard } from './components/AudioDashboard';
import { getIDBItem, setIDBItem, removeIDBItem } from './utils/idbStorage';
import { audioSynth } from './utils/audioSynthesizer';

const defaultTelegramConfig = defaultConfig as { token: string; chatId: string };

export default function App() {
  // Cursor Light Spotlight Follower
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  
  // Interactive Headlights Glowing Beam Mode
  const [headlightsOn, setHeadlightsOn] = useState(false);

  // Color Theme Mood Switcher ('gold' | 'cyan' | 'emerald')
  const [themeMood, setThemeMood] = useState<'gold' | 'cyan' | 'emerald'>('gold');

  // Interface States
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('Wszystkie');
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [copiedVin, setCopiedVin] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  // Track Mouse Position for Glowing Cursor Light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Admin / Owner Mode PIN: 0586
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('admin') || urlParams.has('owner')) {
        localStorage.setItem('citroen_is_admin', 'true');
        return true;
      }
      return localStorage.getItem('citroen_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    if (adminPinInput === '0586') {
      setIsAdmin(true);
      audioSynth.playLockSound();
      try {
        localStorage.setItem('citroen_is_admin', 'true');
      } catch {
        // ignore
      }
      setIsAdminModalOpen(false);
      setAdminPinInput('');
      setAdminPinError('');
    } else {
      setAdminPinError('Nieprawidłowy kod PIN');
    }
  };

  const handleAdminLogout = () => {
    audioSynth.playClick();
    setIsAdmin(false);
    try {
      localStorage.removeItem('citroen_is_admin');
    } catch {
      // ignore
    }
  };

  // Gallery & Hero Image State with IDB Support
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('citroen_custom_gallery');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return CAR_CONFIG.images.gallery;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('citroen_custom_hero');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return CAR_CONFIG.images.hero;
  });

  const syncServerGallery = async (galleryData: GalleryItem[], heroImgData: string) => {
    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gallery: galleryData, heroImage: heroImgData })
      });
    } catch (err) {
      console.warn('Nie udało się zsynchronizować galerii z serwerem:', err);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadStoredData() {
      let localGallery: GalleryItem[] | null = null;
      let localHero: string | null = null;

      try {
        const idbGallery = await getIDBItem<GalleryItem[]>('citroen_custom_gallery');
        if (idbGallery && Array.isArray(idbGallery) && idbGallery.length > 0) {
          localGallery = idbGallery;
        } else {
          const lsGallery = localStorage.getItem('citroen_custom_gallery');
          if (lsGallery) localGallery = JSON.parse(lsGallery);
        }
      } catch (err) {
        console.warn('IDB gallery load error:', err);
      }

      try {
        const idbHero = await getIDBItem<string>('citroen_custom_hero');
        if (idbHero) {
          localHero = idbHero;
        } else {
          const lsHero = localStorage.getItem('citroen_custom_hero');
          if (lsHero) localHero = lsHero;
        }
      } catch (err) {
        console.warn('IDB hero load error:', err);
      }

      // Fetch server stored gallery
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          const serverGallery = Array.isArray(data.gallery) ? data.gallery : [];
          const serverHero = data.heroImage;

          // If server has gallery items and they are >= local gallery items
          if (serverGallery.length > 0 && (!localGallery || serverGallery.length >= localGallery.length)) {
            if (active) {
              setGallery(serverGallery);
              if (serverHero) setHeroImage(serverHero);
              try {
                localStorage.setItem('citroen_custom_gallery', JSON.stringify(serverGallery));
                if (serverHero) localStorage.setItem('citroen_custom_hero', serverHero);
              } catch {
                // ignore
              }
              await setIDBItem('citroen_custom_gallery', serverGallery);
              if (serverHero) await setIDBItem('citroen_custom_hero', serverHero);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Fetch server gallery error:', err);
      }

      // If server does not have photos or has fewer photos than local browser, sync local photos to server!
      if (localGallery && localGallery.length > 0) {
        if (active) {
          setGallery(localGallery);
          if (localHero) setHeroImage(localHero);
        }
        await syncServerGallery(localGallery, localHero || CAR_CONFIG.images.hero);
      }
    }

    loadStoredData();
    return () => { active = false; };
  }, []);

  const handleUpdateGallery = async (newGallery: GalleryItem[]) => {
    audioSynth.playClick();
    setGallery(newGallery);
    try {
      localStorage.setItem('citroen_custom_gallery', JSON.stringify(newGallery));
    } catch {
      // ignore
    }
    await setIDBItem('citroen_custom_gallery', newGallery);
    await syncServerGallery(newGallery, heroImage);
  };

  const handleUpdateHero = async (newHero: string) => {
    audioSynth.playClick();
    setHeroImage(newHero);
    try {
      localStorage.setItem('citroen_custom_hero', newHero);
    } catch {
      // ignore
    }
    await setIDBItem('citroen_custom_hero', newHero);
    await syncServerGallery(gallery, newHero);
  };

  const handleResetDefaults = async () => {
    audioSynth.playClick();
    setGallery(CAR_CONFIG.images.gallery);
    setHeroImage(CAR_CONFIG.images.hero);
    try {
      localStorage.removeItem('citroen_custom_gallery');
      localStorage.removeItem('citroen_custom_hero');
    } catch {
      // ignore
    }
    await removeIDBItem('citroen_custom_gallery');
    await removeIDBItem('citroen_custom_hero');
    await syncServerGallery([], CAR_CONFIG.images.hero);
  };

  const handleDeleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playClick();
    const updated = gallery.filter(item => item.id !== id);
    handleUpdateGallery(updated);
  };

  // Test Drive Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '12:00',
    comment: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Contact Form State
  const [contactMessage, setContactMessage] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Scroll position listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    audioSynth.playClick();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCopyVin = () => {
    audioSynth.playClick();
    navigator.clipboard.writeText(CAR_CONFIG.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2500);
  };

  const filteredGallery = gallery.filter(item => 
    galleryFilter === 'Wszystkie' || item.category === galleryFilter
  );

  // Telegram Integration State
  const [telegramToken, setTelegramToken] = useState<string>(() => {
    try {
      return localStorage.getItem('c4_telegram_token') || defaultTelegramConfig.token || '';
    } catch {
      return defaultTelegramConfig.token || '';
    }
  });

  const [telegramChatId, setTelegramChatId] = useState<string>(() => {
    try {
      return localStorage.getItem('c4_telegram_chat_id') || defaultTelegramConfig.chatId || '';
    } catch {
      return defaultTelegramConfig.chatId || '';
    }
  });

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramTestLoading, setTelegramTestLoading] = useState(false);
  const [isDetectingChatId, setIsDetectingChatId] = useState(false);
  const [telegramTestStatus, setTelegramTestStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatusMsg, setContactStatusMsg] = useState<string | null>(null);

  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingStatusMsg, setBookingStatusMsg] = useState<string | null>(null);

  const [serverTelegramReady, setServerTelegramReady] = useState(false);

  useEffect(() => {
    fetch('/api/telegram/config')
      .then(res => res.json())
      .then(data => {
        if (data && (data.token || data.chatId)) {
          if (data.token) setTelegramToken(data.token);
          if (data.chatId) setTelegramChatId(data.chatId);
          setServerTelegramReady(Boolean(data.isReady || (data.token && data.chatId)));
        } else {
          try {
            const localToken = (localStorage.getItem('c4_telegram_token') || defaultTelegramConfig.token || '').trim();
            const localChatId = (localStorage.getItem('c4_telegram_chat_id') || defaultTelegramConfig.chatId || '').trim();
            if (localToken || localChatId) {
              fetch('/api/telegram/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: localToken, chatId: localChatId }),
              })
                .then(r => r.json())
                .then(d => setServerTelegramReady(Boolean(d.isReady)));
            }
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const saveTelegramConfig = async (token: string, chatId: string) => {
    const trimmedToken = token.trim();
    const trimmedChatId = chatId.trim();
    setTelegramToken(trimmedToken);
    setTelegramChatId(trimmedChatId);
    try {
      localStorage.setItem('c4_telegram_token', trimmedToken);
      localStorage.setItem('c4_telegram_chat_id', trimmedChatId);
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: trimmedToken, chatId: trimmedChatId }),
      });
      const data = await res.json();
      setServerTelegramReady(Boolean(data.isReady));
    } catch (err) {
      console.error('Błąd zapisu na serwerze:', err);
    }
  };

  const sendTelegramNotification = async (text: string, overrideToken?: string, overrideChatId?: string) => {
    const token = (overrideToken !== undefined ? overrideToken : (telegramToken || defaultTelegramConfig.token || '')).trim();
    const chatId = (overrideChatId !== undefined ? overrideChatId : (telegramChatId || defaultTelegramConfig.chatId || '')).trim();

    try {
      const serverRes = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          token: token || undefined, 
          chatId: chatId || undefined 
        }),
      });
      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData && serverData.success) {
          return { success: true };
        }
        if (serverData && serverData.error) {
          return { success: false, error: serverData.error };
        }
      }
    } catch (serverErr) {
      console.log('Server send fallback:', serverErr);
    }

    if (!token || !chatId) {
      return { 
        success: false, 
        error: 'Brak wpisanego Bot Token lub Chat ID.' 
      };
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await res.json();
      if (data.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.description || 'Błąd Telegram API' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Błąd połączenia' };
    }
  };

  const handleDetectChatId = async () => {
    audioSynth.playClick();
    const token = telegramToken.trim();
    if (!token) {
      setTelegramTestStatus({
        type: 'error',
        message: '❌ Wpisz najpierw Bot Token!'
      });
      return;
    }

    setIsDetectingChatId(true);
    setTelegramTestStatus({ type: null, message: '' });

    try {
      const serverRes = await fetch('/api/telegram/detect-chat-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const serverData = await serverRes.json();

      if (serverData.success && serverData.latestChatId) {
        const idStr = String(serverData.latestChatId);
        setTelegramChatId(idStr);
        saveTelegramConfig(token, idStr);
        setTelegramTestStatus({
          type: 'success',
          message: `🎉 Znaleziono Chat ID: ${idStr}! Zapisano.`
        });
        setIsDetectingChatId(false);
        return;
      }

      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
      const data = await res.json();

      if (!data.ok) {
        setTelegramTestStatus({
          type: 'error',
          message: `❌ Błąd Telegram: ${data.description || 'Błędny Token'}`
        });
        setIsDetectingChatId(false);
        return;
      }

      const updates = data.result || [];
      if (updates.length === 0) {
        setTelegramTestStatus({
          type: 'error',
          message: '⚠️ Wyślij wiadomość /start do bota w Telegramie i spróbuj ponownie.'
        });
        setIsDetectingChatId(false);
        return;
      }

      const lastUpdate = updates[updates.length - 1];
      const detectedId = lastUpdate?.message?.chat?.id || lastUpdate?.my_chat_member?.chat?.id;

      if (detectedId) {
        const idStr = String(detectedId);
        setTelegramChatId(idStr);
        saveTelegramConfig(token, idStr);
        setTelegramTestStatus({
          type: 'success',
          message: `🎉 Chat ID: ${idStr}. Zapisano!`
        });
      }
    } catch (err: any) {
      setTelegramTestStatus({
        type: 'error',
        message: `❌ Błąd: ${err.message}`
      });
    } finally {
      setIsDetectingChatId(false);
    }
  };

  const handleTestTelegram = async () => {
    audioSynth.playClick();
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      setTelegramTestStatus({
        type: 'error',
        message: '❌ Wpisz Bot Token i Chat ID!'
      });
      return;
    }

    setTelegramTestLoading(true);
    setTelegramTestStatus({ type: null, message: '' });

    await saveTelegramConfig(telegramToken, telegramChatId);

    const testMsg = `🧪 <b>TEST POWIADOMIEŃ CITROËN C4 PICASSO</b>\n\n` +
      `✅ Połączenie z botem działa prawidłowo! Zapytania o samochód będą trafiać do tego czatu.`;

    const res = await sendTelegramNotification(testMsg);

    setTelegramTestLoading(false);
    if (res.success) {
      setTelegramTestStatus({
        type: 'success',
        message: '🎉 Wiadomość testowa wysłana pomyślnie!'
      });
    } else {
      setTelegramTestStatus({
        type: 'error',
        message: `❌ Błąd: ${res.error}`
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    setBookingSubmitting(true);
    setBookingStatusMsg(null);

    const messageText = `🏎️ <b>NOWA REZERWACJA JAZDY PRÓBNEJ</b>\n\n` +
      `👤 <b>Imię i Nazwisko:</b> ${bookingForm.name}\n` +
      `📞 <b>Telefon:</b> ${bookingForm.phone}\n` +
      `📅 <b>Data:</b> ${bookingForm.date || 'Nie określono'}\n` +
      `⏰ <b>Godzina:</b> ${bookingForm.time}\n` +
      `📝 <b>Komentarz:</b> ${bookingForm.comment || 'Brak'}\n\n` +
      `🚗 <i>Strona: citroenc4picasso.pl</i>`;

    const result = await sendTelegramNotification(messageText);

    setBookingSubmitting(false);
    setBookingSuccess(true);
    audioSynth.playLockSound();

    if (!result.success && (telegramToken || telegramChatId)) {
      setBookingStatusMsg(`Uwaga: ${result.error}`);
    }

    setTimeout(() => {
      setBookingSuccess(false);
      setIsTestDriveOpen(false);
      setBookingForm({ name: '', phone: '', date: '', time: '12:00', comment: '' });
      setBookingStatusMsg(null);
    }, 4000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    setContactSubmitting(true);
    setContactStatusMsg(null);

    const messageText = `✉️ <b>NOWA WIADOMOŚĆ KONTAKTOWA</b>\n\n` +
      `👤 <b>Imię:</b> ${contactMessage.name}\n` +
      `📞 <b>Telefon:</b> ${contactMessage.phone}\n` +
      `💬 <b>Wiadomość:</b>\n${contactMessage.message || 'Brak treści'}\n\n` +
      `🚗 <i>Strona: citroenc4picasso.pl</i>`;

    const result = await sendTelegramNotification(messageText);

    setContactSubmitting(false);
    setContactSuccess(true);
    audioSynth.playLockSound();

    if (!result.success && (telegramToken || telegramChatId)) {
      setContactStatusMsg(`Uwaga: ${result.error}`);
    }

    setTimeout(() => {
      setContactSuccess(false);
      setContactMessage({ name: '', phone: '', email: '', message: '' });
      setContactStatusMsg(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 relative overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* =========================================================================
          1. CURSOR SPOTLIGHT FOLLOWER & MULTI-LAYER DYNAMIC BACKGROUND
         ========================================================================= */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300" 
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.08), transparent 80%)`
        }}
      />

      <div className="lux-bg-mesh" />
      <div className="lux-light-beams" />
      <div className="lux-hex-grid" />
      <div className="lux-vignette" />
      
      {/* Floating Orbs */}
      <div className="lux-orb-1" />
      <div className="lux-orb-2" />
      <div className="lux-orb-3" />

      {/* Dynamic Gold Particles */}
      {[
        { top: '12%', left: '10%', size: '6px', delay: '0s' },
        { top: '28%', left: '85%', size: '8px', delay: '2s' },
        { top: '45%', left: '20%', size: '5px', delay: '4s' },
        { top: '65%', left: '75%', size: '7px', delay: '1s' },
        { top: '82%', left: '40%', size: '6px', delay: '3s' },
      ].map((p, i) => (
        <div
          key={i}
          className="lux-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay
          }}
        />
      ))}

      {/* =========================================================================
          2. STYLOWY HEADER & MENU NAWIGACYJNE (citroenc4picasso.pl)
         ========================================================================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#050608]/95 backdrop-blur-2xl border-b border-[#d4af37]/35 py-2 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.95)]' 
          : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent py-3 sm:py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* Logo i Domeny: citroenc4picasso.pl */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0" 
            onClick={() => audioSynth.playClick()}
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#f6e05e] via-[#d4af37] to-[#b8860b] p-0.5 shadow-lg shadow-[#d4af37]/40 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition-all duration-300">
                <div className="w-full h-full bg-[#050608] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-[#f6e05e] group-hover:rotate-6 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f6e05e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-[#d4af37] border-2 border-[#050608]"></span>
              </span>
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="font-syne font-extrabold text-base sm:text-2xl tracking-tight gold-shimmer-text group-hover:text-[#f6e05e] transition-colors leading-none">
                citroenc4picasso<span className="text-white font-black">.pl</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Capsular Pill Menu */}
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a0d14]/80 backdrop-blur-xl border border-[#d4af37]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-xs font-semibold text-gray-300 whitespace-nowrap">
            <a 
              href="#o-samochodzie" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              O Samochodzie
            </a>
            <a 
              href="#dane-techniczne" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              Specyfikacja
            </a>
            <a 
              href="#wyposazenie" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              Wyposażenie
            </a>
            <a 
              href="#galeria" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              Galeria HD
            </a>
            <a 
              href="#serwis" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              CEPiK
            </a>
            <a 
              href="#kontakt" 
              onClick={() => audioSynth.playClick()} 
              className="px-3.5 py-2 rounded-full hover:text-black hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              Kontakt
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mute Audio Button */}
            <button
              onClick={() => {
                const muted = audioSynth.toggleMute();
                if (!muted) audioSynth.playClick();
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-[#f6e05e] hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title={audioSynth.isMuted ? "Włącz efekty dźwiękowe" : "Wycisz efekty dźwiękowe"}
            >
              {audioSynth.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#f6e05e]" />}
            </button>

            {/* Admin PIN Login button */}
            <button
              onClick={() => {
                audioSynth.playClick();
                if (isAdmin) {
                  setIsPhotoManagerOpen(true);
                } else {
                  setIsAdminModalOpen(true);
                }
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-[#f6e05e] hover:bg-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
              title={isAdmin ? "Otwórz Panel Właściciela" : "Zaloguj jako Właściciel (PIN)"}
            >
              {isAdmin ? <Unlock className="w-4 h-4 text-[#f6e05e]" /> : <Lock className="w-4 h-4" />}
              <span className="hidden xl:inline">{isAdmin ? "Zarządzaj" : "Właściciel"}</span>
            </button>

            {/* Mobile Menu Dropdown Toggle */}
            <button
              onClick={() => {
                audioSynth.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden px-3 py-2 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f6e05e] hover:bg-[#d4af37]/25 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
              aria-label="Otwórz menu nawigacji"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="font-syne tracking-wide">Menu</span>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#07080d]/98 backdrop-blur-3xl border-b border-[#d4af37]/40 px-6 py-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto"
            >
              <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                <span className="font-syne font-extrabold text-base gold-shimmer-text">citroenc4picasso.pl</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/40 font-bold font-num">
                  Menu
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <a 
                  href="#o-samochodzie" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <Car className="w-4 h-4 text-[#f6e05e]" />
                  <span>O Samochodzie</span>
                </a>
                <a 
                  href="#dane-techniczne" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <Gauge className="w-4 h-4 text-[#f6e05e]" />
                  <span>Specyfikacja Techniczna</span>
                </a>
                <a 
                  href="#wyposazenie" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#f6e05e]" />
                  <span>Bogate Wyposażenie</span>
                </a>
                <a 
                  href="#galeria" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <Camera className="w-4 h-4 text-[#f6e05e]" />
                  <span>Fotogaleria HD</span>
                </a>
                <a 
                  href="#serwis" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#f6e05e]" />
                  <span>Raport CEPiK & Historia</span>
                </a>
                <a 
                  href="#kontakt" 
                  onClick={() => { audioSynth.playClick(); setMobileMenuOpen(false); }} 
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-200 hover:text-[#f6e05e] hover:bg-white/10 flex items-center gap-3 font-semibold text-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-[#f6e05e]" />
                  <span>Kontakt z Właścicielem</span>
                </a>
              </div>

              {/* Mobile Quick Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    setIsTestDriveOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 rounded-2xl cta-button text-xs font-extrabold flex items-center justify-center gap-2 text-black shadow-lg shadow-[#d4af37]/30"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>Zarezerwuj Jazdę Próbną</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => {
                      const nextTheme = themeMood === 'gold' ? 'cyan' : themeMood === 'cyan' ? 'emerald' : 'gold';
                      setThemeMood(nextTheme);
                      document.documentElement.setAttribute('data-theme', nextTheme);
                      audioSynth.playClick();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2"
                  >
                    <Palette className="w-4 h-4 text-[#f6e05e]" />
                    <span>Motyw</span>
                  </button>

                  <button
                    onClick={() => {
                      const muted = audioSynth.toggleMute();
                      if (!muted) audioSynth.playClick();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2"
                  >
                    {audioSynth.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#f6e05e]" />}
                    <span>{audioSynth.isMuted ? "Wyciszony" : "Dźwięki"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          3. GLÓWNA SEKCJA HERO z PRZYCISKIEM REFLEKTORÓW (HEADLIGHT BEAMS)
         ========================================================================= */}
      <section id="o-samochodzie" className="pt-32 sm:pt-40 pb-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lewa kolumna: Tekst i Nagłówek */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] font-num">
                {CAR_CONFIG.statusBadge}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-num">
                Ważne OC i Przegląd
              </span>
            </div>

            {/* Główny Nagłówek H1 */}
            <h1 className="heading-h1">
              Citroën C4 Picasso
            </h1>

            {/* Podtytuł i Cena */}
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="font-syne font-extrabold text-3xl sm:text-5xl text-[#f6e05e] gold-shimmer-text tracking-tight font-num">
                {CAR_CONFIG.price}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">
                Do negocjacji • Umowa kupna-sprzedaży
              </span>
            </div>

            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed max-w-xl">
              Wyjątkowo zadbany, rodzinny minivan z niezawodnym i oszczędnym silnikiem <strong className="text-white font-semibold">1.6 HDi (110 KM)</strong>. 
              Przestronne, panoramiczne wnętrze, niski udokumentowany przebieg oraz kompletny serwis.
            </p>

            {/* Główne Przyciski Akcji */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#kontakt"
                onClick={() => audioSynth.playClick()}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl cta-button font-syne font-extrabold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-[#d4af37]/25 text-black active:scale-98 transition-transform"
              >
                <Phone className="w-4 h-4 text-black" />
                <span>Zadzwoń do Właściciela</span>
              </a>

              <button
                onClick={() => {
                  setHeadlightsOn(!headlightsOn);
                  audioSynth.playSwitchSound();
                }}
                className={`w-full sm:w-auto px-6 py-4 rounded-2xl border font-bold text-xs tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  headlightsOn 
                    ? 'bg-[#d4af37] text-black border-[#f6e05e] shadow-lg shadow-[#d4af37]/40 scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-gray-200 hover:border-[#d4af37] hover:bg-white/10'
                }`}
              >
                <Lightbulb className={`w-4.5 h-4.5 ${headlightsOn ? 'text-black fill-black' : 'text-[#f6e05e]'}`} />
                <span>{headlightsOn ? 'Reflektory Włączone' : 'Włącz Światła Reflektorów'}</span>
              </button>
            </div>

            {/* Szybkie kluczowe cechy */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-[11px] text-gray-400 block font-semibold">PRZEBIEG</span>
                <span className="text-base sm:text-lg font-bold text-white font-num">{CAR_CONFIG.mileage}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block font-semibold">ROK</span>
                <span className="text-base sm:text-lg font-bold text-white font-num">{CAR_CONFIG.year} r.</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block font-semibold">SPALANIE</span>
                <span className="text-base sm:text-lg font-bold text-[#f6e05e] font-num">{CAR_CONFIG.fuelConsumption}</span>
              </div>
            </div>

          </div>

          {/* Prawa kolumna: Główna Fotografia Pojazdu z Efektem Światła */}
          <div className="lg:col-span-6 relative">
            <div className="relative group rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              
              {/* Headlight Beams Glow Overlay */}
              {headlightsOn && (
                <>
                  <div className="headlight-cone-left" />
                  <div className="headlight-cone-right" />
                  <div className="absolute inset-0 bg-radial from-[#d4af37]/20 via-transparent to-black/70 pointer-events-none z-10" />
                </>
              )}

              <img
                src={heroImage}
                alt="Citroën C4 Picasso 2007"
                referrerPolicy="no-referrer"
                className="w-full h-[340px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Tag na zdjęciu */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs z-20">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
                  <MapPin className="w-4 h-4 text-[#f6e05e]" />
                  <span className="font-semibold text-white">{CAR_CONFIG.location}</span>
                </div>

                <button
                  onClick={() => {
                    audioSynth.playClick();
                    setSelectedImageIndex(0);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-black font-bold flex items-center gap-1.5 hover:bg-[#f6e05e] transition-all shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Powiększ</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. INTERAKTYWNA STREFA DŹWIĘKOWA (AUDIO DASHBOARD)
         ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <AudioDashboard />
      </section>

      {/* =========================================================================
          5. SPECYFIKACJA TECHNICZNA POJAZDU
         ========================================================================= */}
      <section id="dane-techniczne" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Specyfikacja Fabryczna
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-syne text-white">
                Dane Techniczne Pojazdu
              </h3>
            </div>

            {/* Kopiowanie VIN */}
            <div className="w-full md:w-auto bg-black/40 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Numer VIN</span>
                <span className="font-num text-sm font-bold text-[#f6e05e] tracking-wider">{CAR_CONFIG.vin}</span>
              </div>
              <button
                onClick={handleCopyVin}
                className="px-3.5 py-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] hover:bg-[#d4af37] hover:text-black transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedVin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedVin ? 'Skopiowano!' : 'Kopiuj'}</span>
              </button>
            </div>
          </div>

          {/* Grid specyfikacji */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
            {[
              { label: 'Marka & Model', val: `${CAR_CONFIG.brand} ${CAR_CONFIG.model}` },
              { label: 'Rok Produkcji', val: `${CAR_CONFIG.year} r.` },
              { label: 'Silnik', val: CAR_CONFIG.engine },
              { label: 'Pojemność Skokowa', val: '1560 cm³' },
              { label: 'Przebieg', val: CAR_CONFIG.mileage },
              { label: 'Kolor Nadwozia', val: CAR_CONFIG.color },
              { label: 'Typ Nadwozia', val: CAR_CONFIG.bodyType },
              { label: 'Skrzynia Biegów', val: CAR_CONFIG.transmission },
            ].map((spec, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#d4af37]/30 transition-all">
                <span className="text-xs text-gray-400 block mb-1">{spec.label}</span>
                <span className="font-semibold text-white font-display">{spec.val}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. BOGATE WYPOSAŻENIE (EQUIPMENT CHECKLIST)
         ========================================================================= */}
      <section id="wyposazenie" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="heading-h2-container">
          <h2 className="heading-h2 font-syne">
            Kompletne Wyposażenie
          </h2>
        </div>

        <p className="text-center text-gray-400 max-w-[700px] w-full mx-auto mb-12 -mt-4 text-sm font-light">
          Wersja wyposażeniowa zaprojektowana dla najwyższego komfortu kierowcy i pasażerów podczas podróży.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CAR_CONFIG.equipmentCategories.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/10 hover:border-[#d4af37]/40"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
                <h3 className="text-lg font-bold text-white font-syne">
                  {cat.category}
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#f6e05e] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. LUKSUSOWA GALERIA ZDJĘĆ HD (BENTO GRID)
         ========================================================================= */}
      <section id="galeria" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f6e05e] text-xs font-bold uppercase tracking-wider mb-3 font-num">
            <Camera className="w-3.5 h-3.5" />
            Fotogaleria HD (Bento Layout)
          </span>
          <div className="heading-h2-container">
            <h2 className="heading-h2 font-syne">
              Galeria Pojazdu
            </h2>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto text-sm font-light mt-2">
            Kliknij dowolne zdjęcie, aby otworzyć luksusowy pełnoekranowy podgląd w wysokiej rozdzielczości.
          </p>
        </div>

        {/* Filtry kategorii i przycisk właściciela */}
        <div className="flex items-center justify-between gap-4 my-8 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            {['Wszystkie', 'Nadwozie', 'Wnętrze', 'Detale'].map((cat) => {
              const count = cat === 'Wszystkie' 
                ? gallery.length 
                : gallery.filter(i => i.category === cat).length;
              const isActive = galleryFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    audioSynth.playClick();
                    setGalleryFilter(cat);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b] text-black border-[#f6e05e] shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105'
                      : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border-white/10 hover:border-[#d4af37]/40'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                audioSynth.playClick();
                setIsPhotoManagerOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-[#d4af37]/20"
            >
              <Upload className="w-4 h-4" />
              <span>Dodaj / Zarządzaj zdjęciami</span>
            </button>
          )}
        </div>

        {/* Bento Grid Gallery */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  audioSynth.playClick();
                  setSelectedImageIndex(gallery.findIndex(g => g.id === img.id));
                }}
                className={`glass-card rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#f6e05e]/60 hover:shadow-[0_12px_40px_rgba(212,175,55,0.25)] transition-all duration-500 relative flex flex-col justify-between ${
                  idx % 5 === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <img 
                  src={img.src} 
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-[#f6e05e] text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {img.category}
                  </span>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteImage(img.id, e)}
                        title="Usuń zdjęcie z galerii"
                        className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white transition-all hover:scale-110 shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-white group-hover:bg-[#d4af37] group-hover:text-black transition-all duration-300 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                  <div>
                    <h4 className="text-white text-base sm:text-lg font-bold font-syne group-hover:text-[#f6e05e] transition-colors">
                      {img.title}
                    </h4>
                    <span className="text-[11px] text-gray-300 font-light flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-3 h-3 text-[#f6e05e]" />
                      Otwórz pełnoekranowy podgląd HD
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-white/20 my-4 flex flex-col items-center justify-center">
            <Car className="w-10 h-10 text-[#d4af37] mb-3" />
            <h3 className="text-xl font-bold text-white mb-2 font-syne">
              Brak zdjęć w tej kategorii
            </h3>
            <p className="text-xs text-gray-400 max-w-md">
              Przełącz kategorię na "Wszystkie", aby zobaczyć pełną fotogalerię.
            </p>
          </div>
        )}
      </section>

      {/* =========================================================================
          8. HISTORIA POJAZDU & RAPORT CEPIK
         ========================================================================= */}
      <section id="serwis" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="heading-h2-container">
          <h2 className="heading-h2 font-syne">
            Historia Pojazdu & CEPiK
          </h2>
        </div>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 -mt-4 text-sm font-light">
          Oficjalna, transparentna historia rejestracyjna z Krajowego Rejestru Pojazdów CEPiK.
        </p>

        <CepikHistory onOpenTestDrive={() => setIsTestDriveOpen(true)} />
      </section>

      {/* =========================================================================
          9. SŁOWO OD WŁAŚCICIELA (OPIS SAMOCHODU)
         ========================================================================= */}
      <section id="opis" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[#d4af37]/30 relative shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 text-[#f6e05e] mb-2">
              <Info className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest font-num">Słowo od właściciela</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold font-syne text-white italic">
              „Samochód, który nigdy nie zawiódł mojej rodziny.”
            </h3>

            <div className="space-y-4 text-gray-300 font-light text-base leading-relaxed">
              {CAR_CONFIG.descriptionParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block font-syne">{CAR_CONFIG.seller.name}</span>
                <span className="text-xs text-gray-400">Prywatny Właściciel • {CAR_CONFIG.seller.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FAQ ACCORDION
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto z-10 relative">
        <div className="heading-h2-container">
          <h2 className="heading-h2 font-syne">
            Pytania i Odpowiedzi
          </h2>
        </div>

        <div className="space-y-4">
          {CAR_CONFIG.faqs.map((faq, index) => (
            <div 
              key={index}
              className="glass-card rounded-2xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setActiveFaq(activeFaq === index ? null : index);
                }}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white text-base font-syne">
                  {faq.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#f6e05e] transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-sm text-gray-300 font-light border-t border-white/5 pt-4"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          11. KONTAKT SECTION
         ========================================================================= */}
      <section id="kontakt" className="py-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block font-num">
            Bezpośredni Kontakt
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-syne text-white leading-tight">
            Zainteresowany? Porozmawiajmy.
          </h2>
          <p className="text-gray-300 font-light text-sm">
            Zapraszam na oględziny w Warszawie. Skontaktuj się bezpośrednio ze mną.
          </p>

          <div className="space-y-3 pt-2 text-left">
            <a
              href={CAR_CONFIG.seller.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynth.playClick()}
              className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 group hover:border-[#229ED9]/60 hover:bg-[#229ED9]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9] group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Szybka Wiadomość</span>
                  <span className="text-base font-bold text-white group-hover:text-[#229ED9] transition-colors">
                    Telegram
                  </span>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 text-xs font-semibold text-[#229ED9] group-hover:bg-[#229ED9] group-hover:text-white transition-all">
                Otwórz
              </span>
            </a>

            <a
              href={`tel:${CAR_CONFIG.seller.phone.replace(/\s+/g, '')}`}
              onClick={() => audioSynth.playClick()}
              className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 group hover:border-[#f6e05e]/60 hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f6e05e] group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Telefon Bezpośredni</span>
                  <span className="text-base font-bold text-white group-hover:text-[#f6e05e] transition-colors font-num">
                    {CAR_CONFIG.seller.phone}
                  </span>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-xs font-semibold text-[#f6e05e] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                Zadzwoń
              </span>
            </a>
          </div>

          {/* Formularz Wiadomości */}
          <div className="pt-8 text-left">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white font-syne mb-4">
                Wyślij Wiadomość do Właściciela
              </h3>

              {contactSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <h4 className="font-bold text-base">Wiadomość została wysłana!</h4>
                  <p className="text-xs">Właściciel odpowie najszybciej jak to możliwe.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Twoje Imię</label>
                      <input 
                        type="text"
                        required
                        placeholder="np. Piotr"
                        value={contactMessage.name}
                        onChange={(e) => setContactMessage({ ...contactMessage, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Numer Telefonu</label>
                      <input 
                        type="tel"
                        required
                        placeholder="+48 ___ ___ ___"
                        value={contactMessage.phone}
                        onChange={(e) => setContactMessage({ ...contactMessage, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Treść Wiadomości</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Dzień dobry, chciałbym zapytać o..."
                      value={contactMessage.message}
                      onChange={(e) => setContactMessage({ ...contactMessage, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 rounded-xl cta-button font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {contactSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Wyślij Wiadomość</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-[#020304] z-10 relative text-center text-xs text-gray-400 space-y-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#f6e05e]" />
            <span className="font-syne font-bold text-white">Citroën C4 Picasso 2007 (1.6 HDi)</span>
          </div>

          <p>© {new Date().getFullYear()} Ogłoszenie Prywatne. Warszawa, Polska.</p>

          <button
            onClick={() => {
              audioSynth.playClick();
              setIsAdminModalOpen(true);
            }}
            className="text-gray-500 hover:text-[#f6e05e] transition-colors flex items-center gap-1 text-[11px]"
          >
            <Lock className="w-3 h-3" />
            <span>Panel Właściciela</span>
          </button>
        </div>
      </footer>

      {/* =========================================================================
          12. MODAL JAZDY PRÓBNEJ
         ========================================================================= */}
      <AnimatePresence>
        {isTestDriveOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl relative bg-[#0a0a0f] max-h-[90vh] overflow-y-auto my-auto"
            >
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setIsTestDriveOpen(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f6e05e]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-syne">
                    Umów Jazdę Próbną
                  </h3>
                  <p className="text-xs text-gray-400">
                    Oględziny w Warszawie w dogodnym terminie
                  </p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <h4 className="font-bold text-base">Rezerwacja Przyjęta!</h4>
                  <p className="text-xs">Właściciel skontaktuje się z Tobą telefonicznie.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Imię i Nazwisko</label>
                    <input 
                      type="text"
                      required
                      placeholder="np. Jan Kowalski"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Numer Telefonu</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+48 ___ ___ ___"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Data</label>
                      <input 
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Godzina</label>
                      <select 
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="10:00" className="bg-black">10:00</option>
                        <option value="12:00" className="bg-black">12:00</option>
                        <option value="14:00" className="bg-black">14:00</option>
                        <option value="16:00" className="bg-black">16:00</option>
                        <option value="18:00" className="bg-black">18:00</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3.5 rounded-xl cta-button font-bold text-sm mt-2 flex items-center justify-center gap-2"
                  >
                    {bookingSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <span>Potwierdź Rezerwację</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          13. LUKSUSOWY FULLSCREEN GALERIA MODAL (LUXURY LIGHTBOX)
         ========================================================================= */}
      <LuxuryGalleryModal
        selectedIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        gallery={gallery}
        heroImage={heroImage}
      />

      {/* =========================================================================
          14. MODAL ZARZĄDZANIA ZDJĘCIAMI
         ========================================================================= */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        gallery={gallery}
        heroImage={heroImage}
        onUpdateGallery={handleUpdateGallery}
        onUpdateHero={handleUpdateHero}
        onResetDefaults={handleResetDefaults}
      />

      {/* =========================================================================
          15. MODAL WŁAŚCICIELA PIN
         ========================================================================= */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl relative bg-[#0a0a0f] max-h-[90vh] overflow-y-auto my-auto"
            >
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setIsAdminModalOpen(false);
                  setAdminPinError('');
                  setAdminPinInput('');
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f6e05e]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-syne">
                    Panel Właściciela
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dostęp do edycji zdjęć pojazdu
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Wpisz kod PIN właściciela:
                  </label>
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="Wpisz PIN"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] text-center tracking-widest text-lg font-mono"
                    autoFocus
                  />
                  {adminPinError && (
                    <p className="text-red-400 text-xs mt-2 text-center font-medium">
                      {adminPinError}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      audioSynth.playClick();
                      setIsAdminModalOpen(false);
                      setAdminPinError('');
                      setAdminPinInput('');
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-xs hover:bg-white/10 transition-all"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all shadow-lg shadow-[#d4af37]/20"
                  >
                    Odblokuj edycję
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Floating Control Badge */}
      {isAdmin && (
        <div className="fixed bottom-20 left-4 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border border-[#d4af37]/60 p-2 px-3.5 rounded-full flex items-center gap-2 shadow-2xl text-xs text-[#f6e05e]">
          <ShieldCheck className="w-4 h-4 text-[#f6e05e]" />
          <span className="font-semibold hidden sm:inline">Tryb Właściciela</span>
          <button
            onClick={() => {
              audioSynth.playClick();
              setIsTelegramModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-full bg-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 border border-[#229ED9]/40"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Telegram Bot</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="ml-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all text-[11px] font-bold"
          >
            Zablokuj
          </button>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-[#d4af37]/30 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="#kontakt"
          onClick={() => audioSynth.playClick()}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Send className="w-3.5 h-3.5 text-[#f6e05e]" />
          <span>Kontakt</span>
        </a>
        <button
          onClick={() => {
            audioSynth.playClick();
            setIsTestDriveOpen(true);
          }}
          className="flex-1 py-2.5 px-3 rounded-xl cta-button font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-black"
        >
          <Calendar className="w-3.5 h-3.5 text-black" />
          <span>Jazda Próbna</span>
        </button>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-8 right-5 z-50 p-3.5 rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#d4af37]/60 text-[#f6e05e] hover:bg-[#d4af37] hover:text-black shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Przewiń do góry"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Telegram Config Modal */}
      <AnimatePresence>
        {isTelegramModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl relative bg-[#0a0a0f] my-8"
            >
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setIsTelegramModalOpen(false);
                  setTelegramTestStatus({ type: null, message: '' });
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/20 border border-[#229ED9]/50 flex items-center justify-center text-[#229ED9]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-syne">
                    Telegram Powiadomienia
                  </h3>
                  <p className="text-xs text-gray-400">
                    Otrzymuj wiadomości i rezerwacje prosto do Telegramu
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    1. Telegram Bot Token:
                  </label>
                  <input
                    type="text"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="7123456789:AAE... (od @BotFather)"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#229ED9] text-xs font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <label className="block text-xs font-semibold text-gray-300">
                      2. Chat ID / User ID:
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectChatId}
                      disabled={isDetectingChatId || !telegramToken}
                      className="text-[11px] text-[#229ED9] hover:text-white underline font-semibold flex items-center gap-1 disabled:opacity-40"
                    >
                      {isDetectingChatId ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Szukam Chat ID...</span>
                        </>
                      ) : (
                        <span>🔍 Wykryj Chat ID automatycznie</span>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="123456789"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#229ED9] text-xs font-mono"
                  />
                </div>

                {telegramTestStatus.type && (
                  <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                    telegramTestStatus.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/40 text-red-300'
                  }`}>
                    {telegramTestStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{telegramTestStatus.message}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={telegramTestLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/50 font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {telegramTestLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Wyślij wiadomość testową</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      saveTelegramConfig(telegramToken, telegramChatId);
                      setIsTelegramModalOpen(false);
                      setTelegramTestStatus({ type: null, message: '' });
                    }}
                    className="py-3 px-6 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all shadow-lg"
                  >
                    Zapisz i Zamknij
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
