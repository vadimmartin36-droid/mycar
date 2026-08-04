import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Trash2, ArrowUp, ArrowDown, Star, X, ImagePlus, Check, RotateCcw, Info } from 'lucide-react';
import { compressImage } from '../utils/idbStorage';

export interface GalleryItem {
  id: number | string;
  title: string;
  src: string;
  category: string;
}

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: GalleryItem[];
  heroImage: string;
  onUpdateGallery: (newGallery: GalleryItem[]) => void;
  onUpdateHero: (newHeroSrc: string) => void;
  onResetDefaults: () => void;
}

export function PhotoManagerModal({
  isOpen,
  onClose,
  gallery,
  heroImage,
  onUpdateGallery,
  onUpdateHero,
  onResetDefaults
}: PhotoManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'guide'>('upload');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Nadwozie');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Обработка загрузки файла с авто-сжатием
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) {
      setStatusMessage('Błąd: Wybierz pliki graficzne (JPG, PNG, WEBP)');
      return;
    }

    try {
      setStatusMessage(`Optymalizacja ${validFiles.length} zdjęć...`);
      const newItems: GalleryItem[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setStatusMessage(`Przetwarzanie zdjęcia ${i + 1} z ${validFiles.length}...`);
        const compressedDataUrl = await compressImage(file, 1600, 1200, 0.82);
        
        newItems.push({
          id: Date.now() + i,
          title: file.name.replace(/\.[^/.]+$/, "") || `Zdjęcie Citroën (${gallery.length + i + 1})`,
          src: compressedDataUrl,
          category: newCategory
        });
      }

      const updated = [...newItems, ...gallery];
      onUpdateGallery(updated);
      setUploadedPreview(null);
      setStatusMessage(`Pomyślnie dodano ${validFiles.length} zdjęć do galerii i zsynchronizowano z serwerem!`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Błąd podczas przetwarzania zdjęć.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleAddImage = () => {
    if (!uploadedPreview) {
      setStatusMessage('Wybierz zdjęcie do dodania!');
      return;
    }

    const newItem: GalleryItem = {
      id: Date.now(),
      title: newTitle.trim() || `Zdjęcie Citroën (${gallery.length + 1})`,
      src: uploadedPreview,
      category: newCategory
    };

    const updated = [newItem, ...gallery];
    onUpdateGallery(updated);
    setUploadedPreview(null);
    setNewTitle('');
    setStatusMessage('Pomyślnie dodano nowe zdjęcie do galerii!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= gallery.length) return;

    const updated = [...gallery];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    onUpdateGallery(updated);
  };

  const handleDelete = (id: number | string) => {
    const updated = gallery.filter((item) => item.id !== id);
    onUpdateGallery(updated);
    setStatusMessage('Zdjęcie zostało usunięte.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleSetHero = (src: string) => {
    onUpdateHero(src);
    setStatusMessage('Ustawiono nowe zdjęcie główne (Hero)!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#0d0e14] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100"
        >
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-gray-300 hover:bg-[#d4af37] hover:text-black transition-all"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Шапка модального окна */}
          <div className="mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e]">
                <ImagePlus className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Zarządzanie Zdjęciami Citroëna
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Dodawaj własne zdjęcia, zmieniaj kolejność lub ustawiaj główne zdjęcie ogłoszenia w czasie rzeczywistym.
            </p>
          </div>

          {/* Навигационные табы */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 flex-wrap">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Dodaj nowe zdjęcie</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'manage'
                  ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <ImagePlus className="w-4 h-4" />
              <span>Kolejność i usuwanie ({gallery.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Instrukcja plików</span>
            </button>

            <button
              onClick={onResetDefaults}
              className="ml-auto px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Przywróć domyślne</span>
            </button>
          </div>

          {/* Сообщение статуса */}
          {statusMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f6e05e] text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* СОДЕРЖИМОЕ ТАБОВ */}

          {/* ТАБ 1: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* ZONA DRAG AND DROP */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.01]'
                    : 'border-white/20 bg-black/40 hover:border-[#d4af37]/60'
                }`}
              >
                <input
                  type="file"
                  id="photo-upload-input"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="photo-upload-input" className="cursor-pointer block">
                  <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto mb-4 border border-[#d4af37]/40">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Przeciągnij i upuść zdjęcie samochodu tutaj
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Lub kliknij, aby wybrać plik z komputera / telefonu (JPG, PNG, WEBP)
                  </p>
                  <span className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs inline-block hover:bg-[#f6e05e] transition-colors">
                    Wybierz z dysku
                  </span>
                </label>
              </div>

              {/* ПРЕВЬЮ ЗАГРУЖЕННОГО */}
              {uploadedPreview && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/20">
                    <img src={uploadedPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tytuł zdjęcia (np. "Wnętrze - Skórzane fotele")</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Wpisz krótki opis zdjęcia..."
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 block mb-1">Kategoria</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Nadwozie" className="bg-black">Nadwozie (Z zewnątrz)</option>
                          <option value="Wnętrze" className="bg-black">Wnętrze (Kabina / Bagażnik)</option>
                          <option value="Detale" className="bg-black">Detale (Silnik / Felgi / Licznik)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleAddImage}
                        className="mt-5 px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all flex items-center gap-2 shadow-lg shadow-[#d4af37]/20"
                      >
                        <Check className="w-4 h-4" />
                        <span>Dodaj do galerii</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ТАБ 2: MANAGE */}
          {activeTab === 'manage' && (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              <p className="text-xs text-gray-400 mb-2">
                Możesz zmieniać kolejność zdjęć w galerii, usuwać niepotrzebne lub ustawić dowolne zdjęcie jako główne (Hero) na samej górze strony.
              </p>

              {gallery.map((item, index) => {
                const isHero = heroImage === item.src;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl bg-white/5 border flex items-center justify-between gap-4 transition-all ${
                      isHero ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="px-2 py-0.5 rounded bg-white/10">{item.category}</span>
                          {isHero && (
                            <span className="px-2 py-0.5 rounded bg-[#d4af37] text-black font-bold">
                              Zdjęcie Główne (Hero)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isHero && (
                        <button
                          onClick={() => handleSetHero(item.src)}
                          title="Ustaw jako główne zdjęcie (Hero)"
                          className="px-2.5 py-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] hover:bg-[#d4af37] hover:text-black transition-all text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ustaw jako Hero</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Przesuń w górę"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === gallery.length - 1}
                        title="Przesuń w dół"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Usuń zdjęcie"
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ТАБ 3: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#d4af37]" />
                Как сохранить фотографии прямо в код проекта? / Jak zapisać zdjęcia na stałe w kodzie?
              </h4>

              <div className="space-y-2">
                <p><strong>1. Загрузка через веб-интерфейс (быстро):</strong></p>
                <p className="text-gray-400 pl-3">
                  Во вкладке <em>"Dodaj nowe zdjęcie"</em> перетащите файлы с компьютера. Все загруженные фото мгновенно отобразятся на сайте и сохранятся в локальной памяти вашего браузера (`localStorage`).
                </p>

                <p className="pt-2"><strong>2. Сохранение исходных файлов в проект:</strong></p>
                <p className="text-gray-400 pl-3">
                  Поместите ваши файлы изображений в папку <code>src/assets/images/</code> и укажите ссылки на них в файле <code>src/carData.ts</code> в массиве <code>CAR_CONFIG.images.gallery</code>.
                </p>
              </div>
            </div>
          )}

          {/* Футер модального окна */}
          <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Łącznie zdjęć w galerii: <strong className="text-white">{gallery.length}</strong>
            </span>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f6e05e] transition-all"
            >
              Gotowe / Zamknij
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
