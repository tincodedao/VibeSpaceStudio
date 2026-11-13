import React, { useState } from 'react';
import { X, Shuffle, Check, Sliders, Sparkles, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useWallpaperStore, CURATED_WALLPAPERS } from '../stores/useWallpaperStore';
import { useUIStore } from '../stores/useUIStore';

export const WallpaperModal: React.FC = () => {
  const {
    currentWallpaper,
    customWallpapers,
    dimmerOpacity,
    blurRadius,
    setWallpaper,
    setDimmerOpacity,
    setBlurRadius,
    shuffleWallpaper,
    addCustomWallpaper,
    removeCustomWallpaper
  } = useWallpaperStore();

  const { activeDrawer, closeDrawer } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const isOpen = activeDrawer === 'wallpaper';

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Vibe' },
    { id: 'custom', label: `My Wallpapers (${customWallpapers.length})` },
    { id: 'forest', label: 'Forest 🌲' },
    { id: 'ocean', label: 'Ocean 🌊' },
    { id: 'mountains', label: 'Mountains 🏔' },
    { id: 'galaxy', label: 'Galaxy 🌌' },
    { id: 'cozy', label: 'Cozy 🏠' },
    { id: 'minimal', label: 'Minimal ✨' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    addCustomWallpaper(customTitle, customUrl);
    setCustomTitle('');
    setCustomUrl('');
    setShowAddForm(false);
    setSelectedCategory('custom');
  };

  const customItemsAsWallpaper = customWallpapers.map(cw => ({
    id: cw.id,
    title: cw.title,
    category: 'custom' as any,
    url: cw.url,
    thumbnail: cw.url,
    type: cw.type,
    isCustom: true
  }));

  const filtered = selectedCategory === 'custom'
    ? customItemsAsWallpaper
    : selectedCategory === 'all'
      ? [...customItemsAsWallpaper, ...CURATED_WALLPAPERS]
      : CURATED_WALLPAPERS.filter((w) => w.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-white/15 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display text-lg font-semibold text-on-surface">
                Atmospheric Wallpapers
              </h2>
              <p className="text-xs text-on-surface-variant">
                Chọn hình nền tĩnh lặng và chỉnh ánh sáng không gian
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-amber-400/30"
            >
              <Plus size={14} />
              <span>Thêm URL</span>
            </button>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Custom Wallpaper Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <ImageIcon size={15} />
              <span>Thêm hình nền từ Direct Image Link (Unsplash, Imgur, Pexels...)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tên hình nền (VD: Cyberpunk Tokyo)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
              />
              <input
                type="url"
                required
                placeholder="URL hình ảnh (https://...)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs transition-colors"
              >
                Lưu vào bộ sưu tập
              </button>
            </div>
          </form>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow'
                  : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Wallpaper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {filtered.map((wallpaper: any) => {
            const isSelected = currentWallpaper.id === wallpaper.id;
            return (
              <div
                key={wallpaper.id}
                onClick={() => setWallpaper(wallpaper)}
                className={`group relative aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-[1.02]'
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <img
                  src={wallpaper.thumbnail}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-2.5">
                  <span className="text-xs font-medium text-white truncate max-w-[80%]">
                    {wallpaper.title}
                  </span>
                  {wallpaper.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomWallpaper(wallpaper.id);
                      }}
                      className="p-1 rounded bg-black/50 text-white/60 hover:text-rose-400 transition-colors"
                      title="Xóa hình nền này"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visual Tuning Controls (Dimmer & Blur) */}
        <div className="bg-surface-container-high/40 p-4 rounded-2xl specular-rim space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Atmosphere Adjustments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dimmer Slider */}
            <div>
              <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
                <span>Overlay Dimmer</span>
                <span className="font-mono text-primary">
                  {Math.round(dimmerOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={dimmerOpacity}
                onChange={(e) => setDimmerOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 accent-primary cursor-pointer bg-white/10 rounded-lg appearance-none"
              />
            </div>

            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
                <span>Background Blur</span>
                <span className="font-mono text-primary">{blurRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={blurRadius}
                onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                className="w-full h-1.5 accent-primary cursor-pointer bg-white/10 rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Deck */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={shuffleWallpaper}
            className="px-4 py-2 rounded-full bg-surface-container-high/60 hover:bg-surface-bright text-xs text-on-surface font-medium flex items-center gap-2 specular-rim transition-all active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Random</span>
          </button>

          <button
            onClick={closeDrawer}
            className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
