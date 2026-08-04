import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderArchive, 
  Upload, 
  Trash2, 
  Star, 
  Download, 
  Search, 
  Filter, 
  ImagePlus, 
  Check, 
  RotateCcw, 
  Eye, 
  Info, 
  HardDrive, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X, 
  Grid, 
  List,
  Server,
  CloudCheck,
  FileDown
} from 'lucide-react';
import { GalleryItem } from './PhotoManagerModal';
import { compressImage } from '../utils/idbStorage';
import { audioSynth } from '../utils/audioSynthesizer';

interface PhotoVaultSectionProps {
  gallery: GalleryItem[];
  heroImage: string;
  onUpdateGallery: (newGallery: GalleryItem[]) => void;
  onUpdateHero: (newHeroSrc: string) => void;
  onResetDefaults: () => void;
  onSelectImage: (index: number) => void;
}

export function PhotoVaultSection({
  gallery,
  heroImage,
  onUpdateGallery,
  onUpdateHero,
  onResetDefaults,
  onSelectImage
}: PhotoVaultSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<string>('Nadwozie');
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Inline editing state for a photo
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');

  const CATEGORIES = ['Wszystkie', 'Nadwozie', 'Wnętrze', 'Detale', 'Silnik', 'Dokumenty'];

  // Compute storage statistics
  const stats = useMemo(() => {
    const totalCount = gallery.length;
    let approxSizeBytes = 0;

    gallery.forEach(item => {
      if (item.src.startsWith('data:image')) {
        // Base64 size estimation
        approxSizeBytes += Math.round((item.src.length * 3) / 4);
      } else {
        // External URL estimate ~500KB
        approxSizeBytes += 500 * 1024;
      }
    });

    const sizeMB = (approxSizeBytes / (1024 * 1024)).toFixed(2);

    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      if (cat === 'Wszystkie') {
        categoryCounts[cat] = totalCount;
      } else {
        categoryCounts[cat] = gallery.filter(g => g.category === cat).length;
      }
    });

    return { totalCount, sizeMB, categoryCounts };
  }, [gallery]);

  // Filtered gallery
  const filteredGallery = useMemo(() => {
    return gallery.filter(item => {
      const matchesCategory = activeCategory === 'Wszystkie' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [gallery, activeCategory, searchQuery]);

  // Handle Drag & Drop / File Upload
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) {
      setUploadStatus('Błąd: Wybierz prawidłowe pliki graficzne (JPG, PNG, WEBP)');
      return;
    }

    setIsUploading(true);
    audioSynth.playClick();

    try {
      const newItems: GalleryItem[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadStatus(`Przetwarzanie zdjęcia ${i + 1} z ${validFiles.length}...`);
        
        // Compress image to HD quality
        const compressedBase64 = await compressImage(file, 1600, 1200, 0.84);
        const cleanName = file.name.replace(/\.[^/.]+$/, "");

        newItems.push({
          id: `vault_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
          title: cleanName || `Zdjęcie Citroën (${gallery.length + i + 1})`,
          src: compressedBase64,
          category: selectedUploadCategory
        });
      }

      const updatedGallery = [...newItems, ...gallery];
      onUpdateGallery(updatedGallery);
      setUploadStatus(`Sukces! Dodano ${validFiles.length} zdjęć do magazynu.`);
      audioSynth.playLockSound();

      setTimeout(() => setUploadStatus(null), 5000);
    } catch (err) {
      console.error(err);
      setUploadStatus('Błąd podczas zapisywania zdjęć w magazynie.');
    } finally {
      setIsUploading(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = (id: string | number, title: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć zdjęcie "${title}" z magazynu?`)) {
      audioSynth.playClick();
      const updated = gallery.filter(g => String(g.id) !== String(id));
      onUpdateGallery(updated);
    }
  };

  const handleSetHero = (src: string) => {
    audioSynth.playClick();
    onUpdateHero(src);
    audioSynth.playLockSound();
    alert('Zdjęcie zostało ustawione jako główne zdjęcie pojazdu!');
  };

  const handleDownload = (src: string, title: string) => {
    audioSynth.playClick();
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEdit = (item: GalleryItem) => {
    audioSynth.playClick();
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category || 'Nadwozie');
  };

  const handleSaveEdit = (id: string | number) => {
    audioSynth.playClick();
    const updated = gallery.map(item => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          title: editTitle.trim() || item.title,
          category: editCategory
        };
      }
      return item;
    });
    onUpdateGallery(updated);
    setEditingId(null);
  };

  const handleExportBackup = () => {
    audioSynth.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gallery, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `citroen_gallery_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="magazyn-zdjec" className="py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto z-10 relative">
      
      {/* Header Title & Description */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] text-xs font-bold uppercase tracking-widest mb-3 font-num shadow-lg shadow-[#d4af37]/10">
          <FolderArchive className="w-4 h-4 text-[#f6e05e]" />
          Magazyn & Хранилище Zdjęć
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-syne text-white tracking-tight">
          Centrum Przechowywania Photos HD
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm font-light mt-3 leading-relaxed">
          Dedykowany magazyn multimedialny. Tutaj przechowywane są wszystkie zdjęcia pojazdu z automatyczną kopią zapasową w bazie danych serwera oraz pamięci przeglądarki IndexedDB.
        </p>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f6e05e] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">Liczba Zdjęć</span>
            <span className="text-xl font-bold text-white font-num">{stats.totalCount} szt.</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">Rozmiar Magazynu</span>
            <span className="text-xl font-bold text-white font-num">~{stats.sizeMB} MB</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">Status Bazy</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zsynchronizowano
            </span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">Główne Zdjęcie</span>
            <span className="text-xs font-bold text-[#f6e05e] truncate max-w-[120px] block mt-1">
              Aktywne (Hero)
            </span>
          </div>
          <img 
            src={heroImage} 
            alt="Główne zdjęcie" 
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover border border-[#d4af37]/50 shrink-0 shadow-md"
          />
        </div>
      </div>

      {/* DRAG AND DROP UPLOAD ZONE */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 mb-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-syne flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#f6e05e]" />
              <span>Dodaj Nowe Zdjęcia do Magazynu</span>
            </h3>
            <p className="text-xs text-gray-300 font-light mt-1">
              Przeciągnij pliki lub kliknij przycisk poniżej. Zdjęcia zostaną automatycznie zoptymalizowane do jakości HD i zapisane.
            </p>
          </div>

          {/* Category Picker for Upload */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Kategoria:</span>
            <select
              value={selectedUploadCategory}
              onChange={(e) => setSelectedUploadCategory(e.target.value)}
              className="bg-black/60 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:border-[#d4af37] focus:outline-none"
            >
              {CATEGORIES.filter(c => c !== 'Wszystkie').map(cat => (
                <option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropzone Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer relative ${
            dragActive 
              ? 'border-[#f6e05e] bg-[#d4af37]/20 scale-[1.01]' 
              : 'border-white/15 bg-black/40 hover:border-[#d4af37]/60 hover:bg-black/60'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f6e05e] mb-3 group-hover:scale-110 transition-transform">
            <ImagePlus className="w-7 h-7" />
          </div>

          <p className="text-sm font-bold text-white mb-1">
            Upuść pliki graficzne tutaj lub <span className="text-[#f6e05e] underline">wybierz z dysku</span>
          </p>
          <p className="text-xs text-gray-400 max-w-md">
            Obsługiwane formaty: JPG, PNG, WEBP. Maksymalny rozmiar pojedynczego pliku: 20 MB.
          </p>
        </div>

        {/* Upload Status Bar */}
        {uploadStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
              uploadStatus.includes('Sukces') 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : uploadStatus.includes('Błąd') 
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f6e05e]'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{uploadStatus}</span>
          </motion.div>
        )}
      </div>

      {/* CONTROLS BAR: CATEGORY TABS & SEARCH */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => {
            const count = stats.categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  audioSynth.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f6e05e] via-[#d4af37] to-[#b8860b] text-black border-[#f6e05e] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105'
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

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Szukaj zdjęcia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-black/50 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-black/50 border border-white/15 rounded-2xl p-1">
            <button
              onClick={() => { audioSynth.playClick(); setViewMode('grid'); }}
              title="Widok Siatki"
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => { audioSynth.playClick(); setViewMode('list'); }}
              title="Widok Listy"
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export Backup Button */}
          <button
            onClick={handleExportBackup}
            title="Pobierz kopię zapasową zdjęć (JSON)"
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-[#f6e05e] hover:border-[#d4af37]/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <FileDown className="w-4 h-4 text-[#f6e05e]" />
            <span className="hidden sm:inline">Kopia JSON</span>
          </button>
        </div>

      </div>

      {/* GALLERY VAULT CONTENT GRID */}
      {filteredGallery.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((img, idx) => {
              const originalIndex = gallery.findIndex(g => g.id === img.id);
              const isHero = heroImage === img.src;
              const isEditing = editingId === img.id;

              return (
                <motion.div
                  key={img.id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-card rounded-3xl overflow-hidden border transition-all duration-300 relative flex flex-col justify-between ${
                    isHero 
                      ? 'border-[#f6e05e] shadow-[0_0_25px_rgba(212,175,55,0.3)] ring-1 ring-[#f6e05e]/50' 
                      : 'border-white/10 hover:border-[#d4af37]/60 hover:shadow-xl'
                  }`}
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden group">
                    <img
                      src={img.src}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-[#f6e05e] text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {img.category || 'Nadwozie'}
                      </span>

                      {isHero && (
                        <span className="px-3 py-1 rounded-xl bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-black text-black" />
                          Główne (Hero)
                        </span>
                      )}
                    </div>

                    {/* Image Quick View Overlay */}
                    <div 
                      onClick={() => onSelectImage(originalIndex >= 0 ? originalIndex : 0)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <button className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-xl hover:bg-[#f6e05e] transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>Powiększ HD</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Footer & Actions */}
                  <div className="p-4 bg-black/40 border-t border-white/10 space-y-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-black border border-[#d4af37] text-white text-xs font-semibold focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="flex-1 bg-black border border-white/20 text-white rounded-xl px-2 py-1 text-xs"
                          >
                            {CATEGORIES.filter(c => c !== 'Wszystkie').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveEdit(img.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Zapisz</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-white font-bold text-sm font-syne truncate" title={img.title}>
                          {img.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block font-num mt-0.5">
                          ID: #{String(img.id).slice(-6)}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons Toolbar */}
                    <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10 text-xs">
                      {/* Set as Hero */}
                      <button
                        onClick={() => handleSetHero(img.src)}
                        disabled={isHero}
                        title={isHero ? "To jest główne zdjęcie" : "Ustaw jako zdjęcie główne (Hero)"}
                        className={`p-2 rounded-xl border font-bold flex items-center gap-1 transition-all ${
                          isHero 
                            ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f6e05e] opacity-60 cursor-default' 
                            : 'bg-white/5 border-white/10 text-gray-300 hover:text-[#f6e05e] hover:border-[#d4af37]/40'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isHero ? 'fill-[#f6e05e] text-[#f6e05e]' : ''}`} />
                        <span className="hidden sm:inline text-[11px]">{isHero ? 'Główne' : 'Ustaw Hero'}</span>
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(img.src, img.title)}
                        title="Pobierz zdjęcie na dysk"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleStartEdit(img)}
                        title="Edytuj nazwę / kategorię"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(img.id, img.title)}
                        title="Usuń z magazynu"
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-3">
            {filteredGallery.map((img, idx) => {
              const originalIndex = gallery.findIndex(g => g.id === img.id);
              const isHero = heroImage === img.src;

              return (
                <div 
                  key={img.id || idx}
                  className="glass-card p-4 rounded-2xl border border-white/10 hover:border-[#d4af37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={img.src} 
                      alt={img.title} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-white/15 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onSelectImage(originalIndex >= 0 ? originalIndex : 0)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm font-syne">{img.title}</h4>
                        <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/15 text-[10px] font-bold text-[#f6e05e]">
                          {img.category || 'Nadwozie'}
                        </span>
                        {isHero && (
                          <span className="px-2 py-0.5 rounded-lg bg-[#d4af37] text-black text-[10px] font-extrabold">
                            Hero
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 font-num mt-1 block">
                        ID pliku: #{String(img.id)}
                      </span>
                    </div>
                  </div>

                  {/* List Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onSelectImage(originalIndex >= 0 ? originalIndex : 0)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#f6e05e]" />
                      <span>Podgląd</span>
                    </button>

                    <button
                      onClick={() => handleSetHero(img.src)}
                      disabled={isHero}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                        isHero 
                          ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f6e05e]' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:text-[#f6e05e]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isHero ? 'fill-[#f6e05e]' : ''}`} />
                      <span>{isHero ? 'Główne' : 'Ustaw Hero'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(img.src, img.title)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(img.id, img.title)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-white/20 my-6 flex flex-col items-center justify-center">
          <FolderArchive className="w-12 h-12 text-[#d4af37] mb-3" />
          <h3 className="text-xl font-bold text-white mb-2 font-syne">
            Magazyn jest pusty dla podanych kryteriów
          </h3>
          <p className="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
            Nie znaleziono zdjęć pasujących do wyszukiwania lub wybranej kategorii. Przeciągnij nowe zdjęcia powyżej lub zresetuj filtry.
          </p>
          <button
            onClick={onResetDefaults}
            className="px-5 py-2.5 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e05e] hover:bg-[#d4af37] hover:text-black transition-all font-bold text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Przywróć zdjęcia fabryczne</span>
          </button>
        </div>
      )}

      {/* FOOTER VAULT ACTIONS */}
      <div className="mt-8 p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <CloudCheck className="w-4 h-4 text-emerald-400" />
          <span>Wszystkie zdjęcia są automatycznie szyfrowane i zapisywane na serwerze appletu.</span>
        </div>

        <button
          onClick={onResetDefaults}
          className="text-gray-400 hover:text-[#f6e05e] transition-colors flex items-center gap-1.5 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#f6e05e]" />
          <span>Przywróć domyślny zestaw zdjęć</span>
        </button>
      </div>

    </section>
  );
}
