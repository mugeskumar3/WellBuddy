import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { WaterEntry } from '@shared/types';
import { Droplet, Plus, Trash2, Target, Calendar } from 'lucide-react';

interface WaterViewProps {
  onRefresh: () => void;
}

export const WaterView: React.FC<WaterViewProps> = ({ onRefresh }) => {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [goalMl, setGoalMl] = useState<number>(2000);
  const [weeklyHistory, setWeeklyHistory] = useState<{ date: string; waterMl: number }[]>([]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [newGoalInput, setNewGoalInput] = useState<string>('2000');
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    const [todayEntries, prefs, history] = await Promise.all([
      api.getWaterEntriesToday(),
      api.getPreferences(),
      api.getWeeklyHistory(),
    ]);
    setEntries(todayEntries);
    setGoalMl(prefs.waterDailyGoalMl);
    setNewGoalInput(String(prefs.waterDailyGoalMl));
    setWeeklyHistory(history);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLogged = entries.reduce((sum, e) => sum + e.amountMl, 0);
  const percent = Math.min(100, Math.round((totalLogged / goalMl) * 100));

  const handleLog = async (amount: number) => {
    if (amount <= 0 || isNaN(amount)) return;
    setLoading(true);
    try {
      await api.logWater(amount);
      await loadData();
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteWaterEntry(id);
    await loadData();
    onRefresh();
  };

  const handleSaveGoal = async () => {
    const val = parseInt(newGoalInput, 10);
    if (!isNaN(val) && val >= 500 && val <= 10000) {
      await api.updatePreferences({ waterDailyGoalMl: val });
      setGoalMl(val);
      setIsEditingGoal(false);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Goal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Animated Water Fill Gauge */}
          <div className="relative w-24 h-32 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border-2 border-sky-300 dark:border-sky-600 overflow-hidden flex flex-col justify-end shadow-inner">
            <div
              className="bg-gradient-to-t from-sky-600 to-sky-400 w-full transition-all duration-700 rounded-b-xl"
              style={{ height: `${percent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-lg text-slate-800 dark:text-white drop-shadow-sm">
              {percent}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full">
                Hydration Tracker
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {totalLogged} <span className="text-sm font-normal text-slate-500">/ {goalMl} ml</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {percent >= 100
                ? '🎉 Congratulations! You reached your daily hydration goal!'
                : `${Math.max(0, goalMl - totalLogged)} ml more needed to reach your target.`}
            </p>
          </div>
        </div>

        {/* Goal Setting Button */}
        <div className="flex items-center gap-3">
          {isEditingGoal ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="500"
                max="10000"
                step="100"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-semibold"
              />
              <span className="text-xs text-slate-400">ml</span>
              <button
                onClick={handleSaveGoal}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingGoal(false)}
                className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingGoal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Target size={14} /> Adjust Daily Goal ({goalMl} ml)
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Droplet size={16} className="text-sky-500" /> Log Water Intake
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[
            { label: 'Small Cup', amount: 150 },
            { label: 'Glass', amount: 250 },
            { label: 'Standard Mug', amount: 350 },
            { label: 'Water Bottle', amount: 500 },
          ].map((item) => (
            <button
              key={item.amount}
              onClick={() => handleLog(item.amount)}
              disabled={loading}
              className="p-3 bg-sky-50/70 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-100 dark:border-sky-900/40 rounded-xl text-center transition-all transform active:scale-95 disabled:opacity-50"
            >
              <span className="block font-bold text-sky-700 dark:text-sky-300 text-sm">
                +{item.amount} ml
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {item.label}
              </span>
            </button>
          ))}

          {/* Custom Input */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
            <input
              type="number"
              placeholder="Custom ml"
              min="10"
              max="5000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-transparent px-2 py-1 text-xs font-semibold focus:outline-none"
            />
            <button
              onClick={() => {
                const parsed = parseInt(customAmount, 10);
                if (parsed > 0) {
                  handleLog(parsed);
                  setCustomAmount('');
                }
              }}
              disabled={!customAmount || loading}
              className="p-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-40"
              title="Add custom amount"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 7-Day History Chart & Today's Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 7-Day Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar size={16} className="text-teal-500" /> Past 7 Days History
            </h4>
            <span className="text-xs text-slate-400">Target: {goalMl}ml</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
            {weeklyHistory.map((day) => {
              const dayPercent = Math.min(100, Math.round((day.waterMl / goalMl) * 100));
              const dateLabel = new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short',
              });

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {day.waterMl > 0 ? `${Math.round(day.waterMl / 100) / 10}L` : '0'}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg h-28 relative flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        dayPercent >= 100 ? 'bg-emerald-500' : 'bg-sky-400'
                      }`}
                      style={{ height: `${dayPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Log History */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3 flex items-center justify-between">
            <span>Today's Entries ({entries.length})</span>
            <span className="text-xs text-slate-400 font-normal">Sorted newest first</span>
          </h4>

          {entries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Droplet size={32} className="text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-medium">No water intake logged yet today.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Use the quick buttons above to record your first glass!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-xs">
                      💧
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {item.amountMl} ml
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {new Date(item.loggedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
