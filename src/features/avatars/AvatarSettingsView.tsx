import React, { useState } from 'react';
import { AvatarInfo, UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import { Eye, EyeOff, Move, Box, Sparkles, Footprints } from 'lucide-react';
import { AnimatedCharacter } from '../../components/AnimatedCharacter';

interface AvatarSettingsViewProps {
  avatars: AvatarInfo[];
  prefs: UserPreferences | null;
  onRefresh: () => void;
}

export const AvatarSettingsView: React.FC<AvatarSettingsViewProps> = ({
  avatars,
  prefs,
  onRefresh,
}) => {
  const selectedId = prefs?.selectedAvatarId || 'water-drop';

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [avatarFilter, setAvatarFilter] = useState<'all' | '3d' | '2d'>('all');
  const [globalWalkPreview, setGlobalWalkPreview] = useState<boolean>(false);

  const isTamil = prefs?.language === 'ta';

  const handleSelect = async (avatarId: string) => {
    await api.selectAvatar(avatarId);
    onRefresh();
  };

  const handleSizeChange = async (size: 'compact' | 'standard' | 'large') => {
    await api.updatePreferences({ companionSize: size });
    onRefresh();
  };

  const handleToggleVisibility = async () => {
    if (prefs?.companionVisible) {
      await api.hideCompanion();
    } else {
      await api.showCompanion();
    }
    onRefresh();
  };

  const handleResetPosition = async () => {
    await api.setCompanionPosition({ x: 100, y: 100 });
    onRefresh();
  };

  const filteredAvatars = avatars
    .filter((a) => a.type === 'builtin')
    .filter((a) => {
      if (avatarFilter === '3d') return Boolean(a.modelSrc);
      if (avatarFilter === '2d') return !a.modelSrc;
      return true;
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Companion Display Settings Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 uppercase tracking-wide">
              {isTamil ? 'திரை தோழன் கட்டுப்பாடு' : 'Desktop Overlay Mascot'}
            </span>
          </div>
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1">
            {isTamil ? 'மிதக்கும் தோழன் அமைப்புகள்' : 'Floating Companion Controls'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
            {isTamil
              ? 'உங்கள் டெஸ்க்டாப்பில் எப்போதும் சுறுசுறுப்பாக இயங்கும் 3D தோழனை தேர்வு செய்து அளவை மாற்றலாம்.'
              : 'The floating companion stays pinned to your screen, walking and prompting healthy habits.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap self-stretch md:self-auto justify-between md:justify-end">
          {/* Size Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
            {(['compact', 'standard', 'large'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSizeChange(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  prefs?.companionSize === s
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Walk All Preview Toggle */}
          <button
            type="button"
            onClick={() => setGlobalWalkPreview(!globalWalkPreview)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              globalWalkPreview
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
            title="Preview all models walking simultaneously"
          >
            <Footprints size={14} />
            <span>{globalWalkPreview ? (isTamil ? 'நடை இயங்குகிறது' : 'Walking ON') : (isTamil ? 'அனைத்தும் நடக்க' : 'Walk All')}</span>
          </button>

          {/* Visibility Toggle */}
          <button
            type="button"
            onClick={handleToggleVisibility}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              prefs?.companionVisible
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {prefs?.companionVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{prefs?.companionVisible ? (isTamil ? 'தோழன் தெரிகிறது' : 'Companion Visible') : (isTamil ? 'மறைக்கப்பட்டுள்ளது' : 'Companion Hidden')}</span>
          </button>

          {/* Reset Position */}
          <button
            type="button"
            onClick={handleResetPosition}
            title={isTamil ? 'மூலைக்கு தோழனை நகர்த்து' : 'Reset position to screen corner'}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Move size={16} />
          </button>
        </div>
      </div>

      {/* Built-in Avatars Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              {isTamil ? 'தோழன் கதாபாத்திரங்கள் (3D & 2D)' : 'Choose Your Companion Mascot'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTamil
                ? 'தேர்ந்தெடுக்கப்பட்ட தோழன் உங்கள் டெஸ்க்டாப்பில் உலாவும்.'
                : 'Selected mascot appears directly on your desktop with 3D locomotion.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setAvatarFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                avatarFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {isTamil ? `அனைத்தும் (${avatars.length})` : `All (${avatars.length})`}
            </button>
            <button
              type="button"
              onClick={() => setAvatarFilter('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                avatarFilter === '3d'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-sky-600 dark:text-sky-400 hover:text-sky-700'
              }`}
            >
              <Box size={12} />
              <span>{isTamil ? '3D மாடல்கள்' : '3D Models'}</span>
            </button>
            <button
              type="button"
              onClick={() => setAvatarFilter('2d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                avatarFilter === '2d'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Sparkles size={12} />
              <span>{isTamil ? 'அனிமேஷன்' : 'Animated'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAvatars.map((avatar) => {
            const isSelected = avatar.id === selectedId;
            const isWalkingActive = isSelected || hoveredId === avatar.id || globalWalkPreview;

            return (
              <div
                key={avatar.id}
                onClick={() => handleSelect(avatar.id)}
                onMouseEnter={() => setHoveredId(avatar.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 cursor-pointer transition-all flex flex-col justify-between items-center text-center group ${
                  isSelected
                    ? 'border-teal-500 ring-4 ring-teal-400/20 shadow-lg bg-teal-50/20 dark:bg-teal-950/20'
                    : 'border-slate-200/80 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-2">
                  {avatar.modelSrc ? (
                    <span className="inline-flex items-center gap-1 bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-sky-300/40 dark:border-sky-800">
                      <Box size={10} /> 3D Model
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-300/40">
                      <Sparkles size={10} /> Animated
                    </span>
                  )}

                  {isWalkingActive && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Footprints size={10} className="animate-bounce" />
                      <span>Walking</span>
                    </span>
                  )}
                </div>

                <div className="w-28 h-28 my-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                  <AnimatedCharacter
                    avatar={avatar}
                    sizeClasses="w-full h-full"
                    isWalking={isWalkingActive}
                  />
                </div>

                <div className="w-full mt-2">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {avatar.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed h-8">
                    {avatar.description}
                  </p>

                  <div className="mt-3 w-full">
                    <span
                      className={`block py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-600'
                      }`}
                    >
                      {isSelected ? (isTamil ? 'செயலில் உள்ளது' : 'Active Companion') : (isTamil ? 'தேர்வு செய்' : 'Select Companion')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
