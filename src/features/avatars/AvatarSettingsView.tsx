import React, { useState, useRef } from 'react';
import { AvatarInfo, UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import { Upload, Trash2, Eye, EyeOff, Move, AlertCircle } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const selectedId = prefs?.selectedAvatarId || 'water-drop';

  const handleSelect = async (avatarId: string) => {
    await api.selectAvatar(avatarId);
    onRefresh();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate type
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setUploadError('Please select a PNG, JPG, or WebP image file.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setUploadLoading(true);
    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      await api.uploadAvatar(buffer, file.name, file.type);
      onRefresh();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload avatar.');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteCustom = async (avatarId: string) => {
    await api.deleteCustomAvatar(avatarId);
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

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {uploadError}
        </div>
      )}

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

      {/* Custom Avatar Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Custom Uploaded Avatars
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your personal mascot (PNG, JPG, WebP up to 5MB). Stored safely in local user data.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Upload size={14} /> {uploadLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>

        {/* Custom Avatars List */}
        {avatars.filter((a) => a.type === 'custom').length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-slate-400">
            <Upload size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium">No custom avatars uploaded yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Upload Image" above to add your own mascot.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {avatars
              .filter((a) => a.type === 'custom')
              .map((avatar) => {
                const isSelected = avatar.id === selectedId;
                return (
                  <div
                    key={avatar.id}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-teal-500 ring-2 ring-teal-400/30 bg-teal-50/50 dark:bg-teal-950/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'
                    }`}
                  >
                    <div
                      onClick={() => handleSelect(avatar.id)}
                      className="w-16 h-16 cursor-pointer mb-2 rounded-lg overflow-hidden bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-xs"
                    >
                      <img
                        src={avatar.src}
                        alt={avatar.name}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate w-full">
                      {avatar.name}
                    </span>

                    <div className="flex items-center gap-1 mt-2 w-full">
                      <button
                        onClick={() => handleSelect(avatar.id)}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Use'}
                      </button>
                      <button
                        onClick={() => handleDeleteCustom(avatar.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Delete avatar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
