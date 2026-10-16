import React from 'react';
import { AvatarInfo, UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import { Eye, EyeOff, Move } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Companion Display Settings Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Floating Companion Controls
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            The floating mascot stays on your screen to remind and encourage you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Size Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            {(['compact', 'standard', 'large'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleSizeChange(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  prefs?.companionSize === s
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Visibility Toggle */}
          <button
            onClick={handleToggleVisibility}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              prefs?.companionVisible
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {prefs?.companionVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            {prefs?.companionVisible ? 'Companion Visible' : 'Companion Hidden'}
          </button>

          {/* Reset Position */}
          <button
            onClick={handleResetPosition}
            title="Reset position to screen corner"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Move size={16} />
          </button>
        </div>
      </div>

      {/* Built-in Avatars Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Choose Your Companion Avatar
          </h3>
          <span className="text-xs text-slate-400">Offline & locally rendered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {avatars
            .filter((a) => a.type === 'builtin')
            .map((avatar) => {
              const isSelected = avatar.id === selectedId;
              return (
                <div
                  key={avatar.id}
                  onClick={() => handleSelect(avatar.id)}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border cursor-pointer transition-all flex flex-col items-center text-center group ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-400/30 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="w-24 h-24 mb-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {avatar.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {avatar.description}
                  </p>

                  <div className="mt-3 w-full">
                    <span
                      className={`block py-1 rounded-lg text-xs font-semibold ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isSelected ? 'Active Avatar' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
