/**
 * ============================================================================
 * МОИ ДАННЫЕ (КОНФИГУРАЦИЯ И СТРУКТУРА СТАЙЛИНГА)
 * ============================================================================
 * Файл компонентов и интерфейса для продажи автомобиля Citroen C4 Picasso 2007.
 * Все тексты для клиентов строго на ПОЛЬСКОМ языке.
 * Разработчик может легко редактировать данные в src/carData.ts
 */

import React, { useState, useEffect } from 'react';
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
  ArrowUp
} from 'lucide-react';
import { CAR_CONFIG } from './carData';
import { PhotoManagerModal, GalleryItem } from './components/PhotoManagerModal';
import { CepikHistory } from './components/CepikHistory';
import { getIDBItem, setIDBItem, removeIDBItem } from './utils/idbStorage';

export default function App() {
  // Состояния интерфейса
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

  // Авторизация владельца объявления (Admin/Owner Mode)
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
    if (adminPinInput === '0586') {
      setIsAdmin(true);
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
    setIsAdmin(false);
    try {
      localStorage.removeItem('citroen_is_admin');
    } catch {
      // ignore
    }
  };

  // Галерея и главное фото с поддержкой IndexedDB и localStorage
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

  // Загрузка сохраненных данных из IndexedDB при старте
  useEffect(() => {
    let active = true;
    async function loadStoredData() {
      const idbGallery = await getIDBItem<GalleryItem[]>('citroen_custom_gallery');
      if (active && idbGallery && Array.isArray(idbGallery)) {
        setGallery(idbGallery);
      }
      const idbHero = await getIDBItem<string>('citroen_custom_hero');
      if (active && idbHero) {
        setHeroImage(idbHero);
      }
    }
    loadStoredData();
    return () => { active = false; };
  }, []);

  const handleUpdateGallery = (newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    setIDBItem('citroen_custom_gallery', newGallery);
    try {
      localStorage.setItem('citroen_custom_gallery', JSON.stringify(newGallery));
    } catch {
      // Игнорируем QuotaExceededError для localStorage, так как данные сохранены в IndexedDB
    }
  };

  const handleUpdateHero = (newHeroSrc: string) => {
    setHeroImage(newHeroSrc);
    setIDBItem('citroen_custom_hero', newHeroSrc);
    try {
      localStorage.setItem('citroen_custom_hero', newHeroSrc);
    } catch {
      // Игнорируем QuotaExceededError для localStorage
    }
  };

  const handleResetDefaults = () => {
    setGallery(CAR_CONFIG.images.gallery);
    setHeroImage(CAR_CONFIG.images.hero);
    removeIDBItem('citroen_custom_gallery');
    removeIDBItem('citroen_custom_hero');
    try {
      localStorage.removeItem('citroen_custom_gallery');
      localStorage.removeItem('citroen_custom_hero');
    } catch {
      // ignore
    }
  };

  const handleDeleteImage = (id: number | string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = gallery.filter((item) => item.id !== id);
    handleUpdateGallery(updated);
  };

  // Форма записи на тест-драйв
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '12:00',
    comment: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Форма прямой связи
  const [contactMessage, setContactMessage] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Эффект темнения шапки и отображения кнопки "наверх" при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Копирование VIN в буфер обмена
  const handleCopyVin = () => {
    navigator.clipboard.writeText(CAR_CONFIG.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2500);
  };

  // Отфильтрованные изображения для галереи
  const filteredGallery = gallery.filter(item => 
    galleryFilter === 'Wszystkie' || item.category === galleryFilter
  );

  // Обработка бронирования тест-драйва
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsTestDriveOpen(false);
      setBookingForm({ name: '', phone: '', date: '', time: '12:00', comment: '' });
    }, 3000);
  };

  // Обработка сообщения
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactMessage({ name: '', phone: '', email: '', message: '' });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 relative overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* =========================================================================
          1. ЭКСКЛЮЗИВНЫЙ МНОГОСЛОЙНЫЙ АНИМИРОВАННЫЙ ФОН
         ========================================================================= */}
      <div className="lux-bg-mesh" />
      <div className="lux-light-beams" />
      <div className="lux-hex-grid" />
      <div className="lux-orb-1" />
      <div className="lux-orb-2" />
      <div className="lux-orb-3" />
      
      {/* Анимированные золотые частицы на фоне */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="lux-particle w-2 h-2 top-[15%] left-[10%]" style={{ animationDelay: '0s', animationDuration: '14s' }} />
        <div className="lux-particle w-3 h-3 top-[35%] left-[80%]" style={{ animationDelay: '2s', animationDuration: '18s' }} />
        <div className="lux-particle w-2 h-2 top-[60%] left-[25%]" style={{ animationDelay: '5s', animationDuration: '12s' }} />
        <div className="lux-particle w-2.5 h-2.5 top-[80%] left-[70%]" style={{ animationDelay: '1s', animationDuration: '16s' }} />
        <div className="lux-particle w-1.5 h-1.5 top-[25%] left-[50%]" style={{ animationDelay: '4s', animationDuration: '10s' }} />
        <div className="lux-particle w-2 h-2 top-[70%] left-[85%]" style={{ animationDelay: '7s', animationDuration: '15s' }} />
        <div className="lux-particle w-3 h-3 top-[45%] left-[12%]" style={{ animationDelay: '3s', animationDuration: '20s' }} />
      </div>

      <div className="lux-vignette" />

      {/* =========================================================================
          2. ФИКСИРОВАННАЯ ШАПКА (HEADER)
         ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 h-[80px] z-[1000] transition-all duration-300 flex items-center justify-between px-4 sm:px-8 md:px-12 ${
          isScrolled 
            ? 'bg-[#0a0a0f]/95 shadow-2xl shadow-black/80 backdrop-blur-[20px] border-b border-[#d4af37]/20' 
            : 'bg-[#0a0a0f]/80 backdrop-blur-[20px] border-b border-white/5'
        }`}
      >
        {/* Логотип слева */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center bg-gradient-to-br from-[#d4af37]/20 to-black group-hover:border-[#d4af37] group-hover:scale-105 transition-all duration-300 shadow-md shadow-[#d4af37]/20">
            <Car className="w-5 h-5 text-[#f6e05e]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline font-bold font-display tracking-wider text-[20px] sm:text-[22px] leading-tight">
              <span className="gold-shimmer-text">citroen</span>
              <span className="text-white font-extrabold mx-0.5">c4</span>
              <span className="text-[#f6e05e] font-display italic">picasso</span>
              <span className="text-xs px-1.5 py-0.5 ml-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] font-mono tracking-normal">.pl</span>
            </div>
            <span className="text-[9px] tracking-[2px] text-gray-400 uppercase font-medium">
              Oficjalne Ogłoszenie Sprzedaży
            </span>
          </div>
        </a>

        {/* Навигационное меню для десктопа */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#specyfikacja" className="hover:text-[#d4af37] transition-colors">Specyfikacja</a>
          <a href="#wyposazenie" className="hover:text-[#d4af37] transition-colors">Wyposażenie</a>
          <a href="#galeria" className="hover:text-[#d4af37] transition-colors">Galeria</a>
          <a href="#serwis" className="hover:text-[#d4af37] transition-colors">Historia</a>
          <a href="#opis" className="hover:text-[#d4af37] transition-colors">Opis</a>
          <a href="#kontakt" className="hover:text-[#d4af37] transition-colors">Kontakt</a>
        </nav>

        {/* Правая часть: Быстрый контакт, кнопка вызова модального окна и статус Właściciela */}
        <div className="hidden sm:flex items-center gap-3">
          <a 
            href="#kontakt"
            className="flex items-center gap-2 text-sm font-semibold text-gray-200 hover:text-[#d4af37] transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <Send className="w-4 h-4 text-[#d4af37]" />
            <span>Napisz do mnie</span>
          </a>



          {/* Кнопка авторизации / статуса владельца */}
          <button
            onClick={() => isAdmin ? handleAdminLogout() : setIsAdminModalOpen(true)}
            className={`p-2.5 rounded-full border text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-md ${
              isAdmin
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f6e05e] hover:bg-red-500/20 hover:border-red-500 hover:text-red-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37]/50'
            }`}
            title={isAdmin ? "Wyłącz tryb edycji (Właściciel)" : "Tryb Właściciela (Dodawanie / Zmiana zdjęć)"}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4 text-[#f6e05e]" /> : <Lock className="w-4 h-4" />}
            <span className="hidden xl:inline text-xs">{isAdmin ? "Tryb Edycji" : "Właściciel"}</span>
          </button>
        </div>

        {/* Мобильная кнопка меню */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-[#d4af37] hover:bg-white/5"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Мобильное выпадающее меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[80px] left-0 right-0 bg-[#0a0a0f]/98 border-b border-[#d4af37]/20 p-6 z-[999] lg:hidden backdrop-blur-2xl flex flex-col gap-4 text-center shadow-2xl"
          >
            <a 
              href="#specyfikacja" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-200 hover:text-[#d4af37] text-lg font-medium border-b border-white/5"
            >
              Specyfikacja & Cechy
            </a>
            <a 
              href="#wyposazenie" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-200 hover:text-[#d4af37] text-lg font-medium border-b border-white/5"
            >
              Wyposażenie
            </a>
            <a 
              href="#galeria" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-200 hover:text-[#d4af37] text-lg font-medium border-b border-white/5"
            >
              Galeria Zdjęć
            </a>
            <a 
              href="#serwis" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-200 hover:text-[#d4af37] text-lg font-medium border-b border-white/5"
            >
              Historia Serwisowa
            </a>
            <a 
              href="#kontakt" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-200 hover:text-[#d4af37] text-lg font-medium"
            >
              Kontakt
            </a>

            <div className="pt-4 flex flex-col gap-3">
              <a 
                href="#kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#d4af37]" />
                Napisz wiadomość
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. ГЛАВНАЯ ПРЕЗЕНТАЦИОННАЯ СЕКЦИЯ (HERO SECTION)
         ========================================================================= */}
      <section className="relative pt-[120px] pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Левая часть: Главный заголовок, цена и кнопки */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Главное название H1 */}
            <div>
              <h1 className="heading-h1">
                {CAR_CONFIG.brand} <span className="font-extrabold">{CAR_CONFIG.model}</span>
              </h1>
            </div>

            {/* Подзаголовок с важными характеристиками */}
            <p className="text-gray-300 text-lg sm:text-xl font-light leading-relaxed">
              Rok <span className="text-[#f6e05e] font-semibold">{CAR_CONFIG.year}</span> • Niezawodny silnik{' '}
              <span className="text-[#f6e05e] font-semibold">{CAR_CONFIG.engine}</span> • Przebieg{' '}
              <span className="text-[#f6e05e] font-semibold">{CAR_CONFIG.mileage}</span>
            </p>

            {/* Блок с ценой */}
            <div className="p-6 rounded-2xl glass-card flex flex-wrap items-baseline justify-between gap-4 border-l-4 border-l-[#d4af37]">
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400 block mb-1">Cena do negocjacji</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b]">
                    {CAR_CONFIG.pricePLN}
                  </span>
                </div>
              </div>

            </div>



            {/* Быстрая строка фактов */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center sm:text-left">
              <div>
                <span className="text-xs text-gray-400 block">Lokalizacja</span>
                <span className="text-sm font-semibold text-gray-200 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  {CAR_CONFIG.location}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Skrzynia</span>
                <span className="text-sm font-semibold text-gray-200">{CAR_CONFIG.transmission}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Paliwo</span>
                <span className="text-sm font-semibold text-gray-200">{CAR_CONFIG.fuelType}</span>
              </div>
            </div>

          </motion.div>

          {/* Правая часть: Шоукейс фотографии с плавающими карточками */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative group"
          >
            {/* Фоновое аура-свечение золота */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#f6e05e]/25 via-[#d4af37]/40 to-[#b8860b]/25 rounded-[2.2rem] blur-2xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 pointer-events-none" />

            {/* Главный контейнер карточки */}
            <div className="relative rounded-[2rem] p-2.5 sm:p-3 bg-gradient-to-b from-white/15 via-white/5 to-black/80 border border-[#d4af37]/40 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(212,175,55,0.3)] transition-all duration-500 hover:border-[#f6e05e]/80">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 shadow-inner group/img">
                <img 
                  src={heroImage} 
                  alt="Citroën C4 Picasso 2007"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Оверлей градиент */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Верхняя панель: кнопка Лайк & Управления */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-end pointer-events-auto">
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => setIsPhotoManagerOpen(true)}
                        className="px-3 py-1.5 rounded-full bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/30"
                        title="Dodaj lub zmień zdjęcia"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Zmień zdjęcia</span>
                      </button>
                    )}

                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:border-[#d4af37] hover:bg-black transition-all shadow-lg active:scale-90"
                      aria-label="Dodaj do ulubionych"
                    >
                      <Heart className={`w-4 h-4 transition-transform duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </div>

                {/* Кнопка увеличения */}
                <div className="absolute bottom-3.5 right-3.5 flex items-center text-xs font-medium text-gray-200">
                  <button 
                    onClick={() => setSelectedImageIndex(0)}
                    className="bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b] text-black font-extrabold px-3.5 py-1.5 rounded-xl backdrop-blur-md hover:brightness-110 transition-all shadow-lg shadow-[#d4af37]/30 flex items-center gap-1.5 active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Powiększ
                  </button>
                </div>
              </div>

              {/* Плавающая карточка 1: Экономия (Średnie spalanie 5.6 l / 100 km) */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-3 left-2 sm:-bottom-5 sm:-left-4 max-w-[240px] sm:max-w-none px-4 py-3 rounded-2xl flex items-center border border-[#d4af37]/60 shadow-[0_15px_35px_rgba(212,175,55,0.25)] bg-[#0c0c16]/95 backdrop-blur-xl z-10 hover:border-[#f6e05e] hover:shadow-[0_20px_40px_rgba(246,224,94,0.35)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-300 block font-bold">Średnie spalanie</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/40">Eko</span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f6e05e] via-white to-[#d4af37] tracking-tight">
                    5.6 l <span className="text-xs font-semibold text-gray-300">/ 100 km</span>
                  </span>
                </div>
              </motion.div>

              {/* Плавающая карточка 2: Оптический обзор Visiospace */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 right-2 sm:-top-5 sm:-right-4 max-w-[240px] sm:max-w-none px-4 py-3 rounded-2xl flex items-center border border-[#d4af37]/60 shadow-[0_15px_35px_rgba(212,175,55,0.25)] bg-[#0c0c16]/95 backdrop-blur-xl z-10 hover:border-[#f6e05e] hover:shadow-[0_20px_40px_rgba(246,224,94,0.35)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-300 block font-bold">Panoramy Visiospace</span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f6e05e] to-[#d4af37] tracking-tight">
                    Szyba 180°
                  </span>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          4. БЛОК ХАРАКТЕРИСТИК (UBEZPIECZENIE, BADANIE, SERWIS, OPONY, WŁAŚCICIEL)
         ========================================================================= */}
      <section id="specyfikacja" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        {/* Заголовок H2 с декоративными золотыми линиями */}
        <div className="heading-h2-container">
          <h2 className="heading-h2">
            Kondycja i formalności
          </h2>
        </div>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 -mt-4 text-sm font-light">
          Pełny wgląd w stan prawny i techniczny pojazdu. Wszystkie formalności opłacone na rok do przodu.
        </p>

        {/* Сетка из 6 стеклянных карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAR_CONFIG.keySpecs.map((spec, index) => {
            const isWarning = spec.badgeType === 'warning';
            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-6 rounded-2xl relative group transition-all flex flex-col justify-between ${
                  isWarning
                    ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60'
                    : 'hover:border-[#d4af37]/50'
                }`}
              >
                <div>
                  {/* Шапка карточки */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-3xl p-2.5 rounded-xl border transition-colors ${
                      isWarning
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        : 'bg-white/5 border-white/10 group-hover:bg-[#d4af37]/10'
                    }`}>
                      {spec.icon}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-[#d4af37]/15 text-[#f6e05e] border-[#d4af37]/30'
                    }`}>
                      {spec.badge}
                    </span>
                  </div>

                  {/* Заголовок и значение */}
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">
                    {spec.title}
                  </h3>
                  <p className={`text-xl font-bold mb-2 transition-colors ${
                    isWarning
                      ? 'text-amber-200 group-hover:text-amber-300'
                      : 'text-white group-hover:text-[#f6e05e]'
                  }`}>
                    {spec.value}
                  </p>
                </div>

                {/* Описание внизу */}
                <p className={`text-xs font-light border-t pt-3 mt-2 ${
                  isWarning
                    ? 'text-amber-200/80 border-amber-500/20'
                    : 'text-gray-400 border-white/5'
                }`}>
                  {spec.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. ТЕХНИЧЕСКИЙ ПАСПОРТ И VIN (DANE TECHNICZNE)
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#d4af37]/20 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                Specyfikacja Fabryczna
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Dane Techniczne Pojazdu
              </h3>
            </div>

            {/* Кнопка копирования VIN */}
            <div className="w-full md:w-auto bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Numer VIN</span>
                <span className="font-mono text-sm font-bold text-[#f6e05e] tracking-wider">{CAR_CONFIG.vin}</span>
              </div>
              <button
                onClick={handleCopyVin}
                className="px-3 py-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedVin ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedVin ? 'Skopiowano!' : 'Kopiuj'}</span>
              </button>
            </div>
          </div>

          {/* Таблица технических параметров */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Marka & Model</span>
              <span className="font-semibold text-white">{CAR_CONFIG.brand} {CAR_CONFIG.model}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Rok Produkcji</span>
              <span className="font-semibold text-white">{CAR_CONFIG.year} r.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Silnik</span>
              <span className="font-semibold text-white">{CAR_CONFIG.engine}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Pojemność Skokowa</span>
              <span className="font-semibold text-white">1560 cm³</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Przebieg</span>
              <span className="font-semibold text-white">{CAR_CONFIG.mileage}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Kolor Nadwozia</span>
              <span className="font-semibold text-white">{CAR_CONFIG.color}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Typ Nadwozia</span>
              <span className="font-semibold text-white">{CAR_CONFIG.bodyType}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Skrzynia Biegów</span>
              <span className="font-semibold text-white">{CAR_CONFIG.transmission}</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. BOGATE WYPOSAŻENIE (EQUIPMENT CHECKLIST)
         ========================================================================= */}
      <section id="wyposazenie" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="heading-h2-container">
          <h2 className="heading-h2">
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
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/30"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
                <h3 className="text-lg font-bold text-white font-display">
                  {cat.category}
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. ГАЛЕРЕЯ ФОТОГРАФИЙ (GALERIA ZDJĘĆ)
         ========================================================================= */}
      <section id="galeria" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f6e05e] text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            Fotogaleria HD
          </span>
          <div className="heading-h2-container">
            <h2 className="heading-h2">
              Galeria Pojazdu
            </h2>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto text-sm font-light mt-2">
            Kliknij dowolne zdjęcie, aby otworzyć pełnoekranowy podgląd w wysokiej rozdzielczości.
          </p>
        </div>

        {/* Фильтры категорий и кнопка добавления фото */}
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
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
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
              onClick={() => setIsPhotoManagerOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37]/20 text-[#f6e05e] border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-[#d4af37]/20"
            >
              <Upload className="w-4 h-4" />
              <span>Dodaj / Zarządzaj zdjęciami</span>
            </button>
          )}
        </div>

        {/* Сетка фотографий */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedImageIndex(gallery.findIndex(g => g.id === img.id))}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#f6e05e]/60 hover:shadow-[0_12px_35px_rgba(212,175,55,0.22)] transition-all duration-500 relative aspect-[4/3] flex flex-col justify-between"
              >
                <img 
                  src={img.src} 
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Постоянная верхняя плашка: категория */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-[#f6e05e] text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {img.category}
                  </span>

                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteImage(img.id, e)}
                        title="Usuń zdjęcie z galerii"
                        className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white transition-all hover:scale-110 shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-1.5 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-white group-hover:bg-[#d4af37] group-hover:text-black transition-all duration-300 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Нижний оверлей градиент при наведении */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                  <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white text-base font-bold font-display group-hover:text-[#f6e05e] transition-colors">
                      {img.title}
                    </h4>
                    <span className="text-[11px] text-gray-300 font-light flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-3 h-3 text-[#f6e05e]" />
                      Powiększ zdjęcie HD
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-white/20 my-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Brak zdjęć w tej kategorii
            </h3>
            <p className="text-xs text-gray-400 max-w-md mb-6">
              {isAdmin 
                ? "Galeria jest obecnie pusta. Jako właściciel możesz w każdej chwili dodać własne zdjęcia samochodu."
                : "W tej kategorii nie ma obecnie opublikowanych zdjęć."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setIsPhotoManagerOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all shadow-lg shadow-[#d4af37]/20 flex items-center gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                <span>Dodaj pierwsze zdjęcie</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          8. HISTORIA POJAZDU & RAPORT CEPIK
         ========================================================================= */}
      <section id="serwis" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        
        <div className="heading-h2-container">
          <h2 className="heading-h2">
            Historia Pojazdu & Raport CEPiK
          </h2>
        </div>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 -mt-4 text-sm font-light">
          Oficjalna, transparentna historia rejestracyjna i diagnostyczna z Krajowego Rejestru Pojazdów CEPiK wraz z udokumentowanym przebiegiem.
        </p>

        <CepikHistory onOpenTestDrive={() => setIsTestDriveOpen(true)} />

      </section>

      {/* =========================================================================
          9. ПОДРОБНОЕ ОПИСАНИЕ С ВЛАДЕЛЬЦЕМ (OPIS SAMOCHODU)
         ========================================================================= */}
      <section id="opis" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[#d4af37]/20 relative">
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 text-[#d4af37] mb-2">
              <Info className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Słowo od właściciela</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold font-display text-white italic">
              „Samochód, który nigdy nie zawiódł mojej rodziny.”
            </h3>

            <div className="space-y-4 text-gray-300 font-light text-base leading-relaxed">
              {CAR_CONFIG.descriptionParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Карточка подписи продавца */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{CAR_CONFIG.seller.name}</span>
                <span className="text-xs text-gray-400">Prywatny Właściciel • {CAR_CONFIG.seller.city}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. ЧASTO ZADAWANE PYTANIA (FAQ ACCORDION)
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto z-10 relative">
        
        <div className="heading-h2-container">
          <h2 className="heading-h2">
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
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white text-base font-display">
                  {faq.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#d4af37] transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
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
          11. БЛОК СВЯЗИ / ЗАПИСИ (KONTAKT SECTION)
         ========================================================================= */}
      <section id="kontakt" className="py-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
              Bezpośredni Kontakt
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display text-white leading-tight">
              Zainteresowany? Porozmawiajmy.
            </h2>
            <p className="text-gray-300 font-light text-sm">
              Zapraszam na oględziny i jazdę próbną w Warszawie. Skontaktuj się ze mną przez Telegram, WhatsApp, Facebook lub formularz.
            </p>

            <div className="space-y-3 pt-2">
              {/* Telegram Card */}
              <a
                href={CAR_CONFIG.seller.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 group hover:border-[#229ED9]/60 hover:bg-[#229ED9]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9] group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Szybka Wiadomość</span>
                    <span className="text-base font-bold text-white group-hover:text-[#229ED9] transition-colors">
                      Telegram
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#229ED9]/20 border border-[#229ED9]/40 text-xs font-semibold text-[#229ED9] group-hover:bg-[#229ED9] group-hover:text-white transition-all">
                  Otwórz
                </span>
              </a>

              {/* WhatsApp Card */}
              <a
                href={CAR_CONFIG.seller.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 group hover:border-[#25D366]/60 hover:bg-[#25D366]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.486 1.333 5.003L2 22l5.129-1.341a9.96 9.96 0 004.881 1.28h.004c5.506 0 9.989-4.478 9.99-9.985A9.957 9.957 0 0012.012 2zm.004 18.256h-.003a8.27 8.27 0 01-4.218-1.156l-.302-.18-3.13.818.835-3.048-.198-.314a8.28 8.28 0 01-1.272-4.391c0-4.568 3.719-8.286 8.289-8.286 2.213 0 4.293.863 5.857 2.428a8.232 8.232 0 012.425 5.858c-.001 4.569-3.72 8.287-8.287 8.287z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Czat 24/7</span>
                    <span className="text-base font-bold text-white group-hover:text-[#25D366] transition-colors">
                      WhatsApp
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-xs font-semibold text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all">
                  Otwórz
                </span>
              </a>

              {/* Facebook Card */}
              <a
                href={CAR_CONFIG.seller.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 group hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Profil i Messenger</span>
                    <span className="text-base font-bold text-white group-hover:text-[#1877F2] transition-colors">
                      Facebook
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 text-xs font-semibold text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                  Otwórz
                </span>
              </a>

              <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Miejsce Oględzin</span>
                  <span className="text-sm font-bold text-white">{CAR_CONFIG.seller.city}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Godziny Kontaktu</span>
                  <span className="text-sm font-bold text-white">{CAR_CONFIG.seller.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Форма отправки сообщения */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[#d4af37]/20 relative">
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Wyślij Wiadomość do Sprzedającego
              </h3>
              <p className="text-xs text-gray-400 mb-6 font-light">
                Zostaw swój numer — oddzwonię w ciągu 30 minut.
              </p>

              {contactSuccess ? (
                <div className="p-6 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37] text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
                  <h4 className="text-lg font-bold text-white">Dziękujemy za wiadomość!</h4>
                  <p className="text-xs text-gray-300">Skontaktuję się z Tobą najszybciej jak to możliwe.</p>
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
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors text-sm"
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
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Wiadomość / Pytanie</label>
                    <textarea 
                      rows={4}
                      placeholder="Dzień dobry, chciałbym dopytać o..."
                      value={contactMessage.message}
                      onChange={(e) => setContactMessage({ ...contactMessage, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl cta-button font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Wyślij Wiadomość</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          12. СТРУКТУРНЫЙ И КРАСИВЫЙ ПОДВАЛ (FOOTER)
         ========================================================================= */}
      <footer className="bg-[#050505] border-t border-white/10 px-6 sm:px-10 pt-[60px] pb-[100px] md:pb-[60px] text-gray-400 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Колонка 1: Название i описание */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-6 h-6 text-[#d4af37]" />
              <span className="text-xl font-bold font-display tracking-wider text-white">
                <span className="gold-shimmer-text">citroen</span>c4<span className="text-[#f6e05e] italic">picasso</span><span className="text-[#d4af37]">.pl</span>
              </span>
            </div>
          </div>

          {/* Колонка 2: Меню с золотыми точками-маркерами */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-bold font-display tracking-wider border-b border-white/10 pb-2">
              Szybka Nawigacja
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <a href="#" className="hover:text-[#d4af37] transition-colors">Strona Główna</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <a href="#galeria" className="hover:text-[#d4af37] transition-colors">Galeria Zdjęć</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <a href="#serwis" className="hover:text-[#d4af37] transition-colors">Historia Serwisowa</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <a href="#wyposazenie" className="hover:text-[#d4af37] transition-colors">Wyposażenie</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <a href="#kontakt" className="hover:text-[#d4af37] transition-colors">Kontakt</a>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контакты i иконки соцсетей (используем emoji/unicode иконки) */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-bold font-display tracking-wider border-b border-white/10 pb-2">
              Kontakt & Portale
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-300">
                <span className="text-[#d4af37]">💬</span>
                <span>Komunikatory: Telegram / WhatsApp / FB</span>
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <span className="text-[#d4af37]">✉️</span>
                <span>E-mail: {CAR_CONFIG.seller.email}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <span className="text-[#d4af37]">📍</span>
                <span>{CAR_CONFIG.seller.city}</span>
              </p>
            </div>

            {/* Соцсети в виде юникод-иконок */}
            <div className="pt-2 flex items-center gap-3">
              <a 
                href={CAR_CONFIG.seller.olxUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-200 hover:text-[#d4af37] hover:border-[#d4af37] transition-all"
              >
                🌐 OLX
              </a>
              <a 
                href={CAR_CONFIG.seller.facebookUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-200 hover:text-[#d4af37] hover:border-[#d4af37] transition-all"
              >
                📘 Facebook
              </a>
              <a 
                href={CAR_CONFIG.seller.instagramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-200 hover:text-[#d4af37] hover:border-[#d4af37] transition-all"
              >
                📸 Instagram
              </a>
            </div>
          </div>

        </div>

        {/* Тонкая золотая линия и авторские права */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026. Wszystkie prawa zastrzeżone.</p>
          <p className="text-gray-400">Ogłoszenie Prywatne • Citroën C4 Picasso 2007</p>
          <button
            onClick={() => isAdmin ? handleAdminLogout() : setIsAdminModalOpen(true)}
            className="text-xs text-gray-500 hover:text-[#f6e05e] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-[#f6e05e]" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isAdmin ? "Wyłącz Tryb Właściciela" : "Panel Właściciela"}</span>
          </button>
        </div>
      </footer>

      {/* =========================================================================
          13. МОДАЛЬНОЕ ОКНО ЗАПИСИ НА ТЕСТ-ДРАЙВ (UMÓW JAZDĘ PRÓBNĄ)
         ========================================================================= */}
      <AnimatePresence>
        {isTestDriveOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 max-w-md w-full relative bg-[#0a0a0f]"
            >
              <button 
                onClick={() => setIsTestDriveOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Umów Jazdę Próbną
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Wybierz dogodny termin oględzin Citroena C4 Picasso w Warszawie.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="p-6 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
                  <h4 className="text-lg font-bold text-white">Rezerwacja przyjęta!</h4>
                  <p className="text-xs text-gray-300">Potwierdzę godzinę telefonicznie.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
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
                      <label className="text-xs text-gray-400 block mb-1">Data Oględzin</label>
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

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Uwagi (opcjonalnie)</label>
                    <input 
                      type="text"
                      placeholder="Chciałbym sprawdzić auto w stacji diagnostycznej..."
                      value={bookingForm.comment}
                      onChange={(e) => setBookingForm({ ...bookingForm, comment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl cta-button font-bold text-sm mt-2"
                  >
                    Potwierdź Rezerwację
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          14. МОДАЛЬНЫЙ ПРОСМОТР ФОТОГРАФИЙ ПОЛНОЭКРАННЫЙ (LIGHTBOX)
         ========================================================================= */}
      <AnimatePresence>
        {selectedImageIndex !== null && gallery[selectedImageIndex] && (
          <div className="fixed inset-0 z-[2500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Левая стрелка */}
            <button 
              onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Изображение */}
            <div className="max-w-5xl max-h-[85vh] relative flex flex-col items-center">
              <img 
                src={gallery[selectedImageIndex].src} 
                alt={gallery[selectedImageIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="text-[#d4af37] text-xs font-bold uppercase tracking-wider block">
                  {gallery[selectedImageIndex].category} ({selectedImageIndex + 1} / {gallery.length})
                </span>
                <h4 className="text-xl font-bold font-display text-white mt-1">
                  {gallery[selectedImageIndex].title}
                </h4>
              </div>
            </div>

            {/* Правая стрелка */}
            <button 
              onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % gallery.length)}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          15. МОДАЛЬНОЕ ОКНО УПРАВЛЕНИЯ ФОТОГРАФИЯМИ
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
          16. МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ ВЛАДЕЛЬЦА (PANEL WŁAŚCICIELA)
         ========================================================================= */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl relative bg-[#0a0a0f]"
            >
              <button
                onClick={() => {
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
                  <h3 className="text-xl font-bold text-white font-display">
                    Panel Właściciela
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dostęp do zarządzania zdjęciami pojazdu
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

      {/* Floating status badge for Admin mode */}
      {isAdmin && (
        <div className="fixed bottom-20 left-4 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border border-[#d4af37]/60 p-2 px-3.5 rounded-full flex items-center gap-2 shadow-2xl text-xs text-[#f6e05e]">
          <ShieldCheck className="w-4 h-4 text-[#f6e05e]" />
          <span className="font-semibold hidden sm:inline">Tryb Właściciela (Edycja)</span>
          <button
            onClick={handleAdminLogout}
            className="ml-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all text-[11px] font-bold"
            title="Zablokuj tryb edycji"
          >
            Zablokuj
          </button>
        </div>
      )}

      {/* =========================================================================
          15. МОБИЛЬНАЯ ФИКСИРОВАННАЯ НИЖНЯЯ ПАНЕЛЬ СВЯЗИ (MOBILE STICKY ACTION BAR)
         ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-[#d4af37]/30 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="#kontakt"
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Send className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Kontakt</span>
        </a>
        <button
          onClick={() => setIsTestDriveOpen(true)}
          className="flex-1 py-2.5 px-3 rounded-xl cta-button font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-black"
        >
          <Calendar className="w-3.5 h-3.5 text-black" />
          <span>Jazda Próbna</span>
        </button>
      </div>

      {/* =========================================================================
          16. КНОПКА ВОЗВРАТА НАВЕРХ (FLOATING BACK TO TOP BUTTON)
         ========================================================================= */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-8 right-5 z-50 p-3.5 rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#d4af37]/60 text-[#f6e05e] hover:bg-gradient-to-r hover:from-[#f6e05e] hover:to-[#d4af37] hover:text-black shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(246,224,94,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center"
            aria-label="Do góry"
            title="Przewiń do góry"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
