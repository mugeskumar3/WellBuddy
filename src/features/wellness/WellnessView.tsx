import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Eye, Activity, Play, Pause, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';

export const WellnessView: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'eye_rest' | 'stretches'>('eye_rest');

  // --- 20-20-20 Timer State ---
  const [eyeSeconds, setEyeSeconds] = useState<number>(20);
  const [isEyeRunning, setIsEyeRunning] = useState<boolean>(false);
  const [eyeCompleted, setEyeCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isEyeRunning && eyeSeconds > 0) {
      interval = setInterval(() => {
        setEyeSeconds((prev) => prev - 1);
      }, 1000);
    } else if (eyeSeconds === 0 && isEyeRunning) {
      setIsEyeRunning(false);
      setEyeCompleted(true);
      // Log to activity log
      api.completeReminder(`manual_eye_${Date.now()}`, 'eye_rest').then(onRefresh);
    }
    return () => clearInterval(interval);
  }, [isEyeRunning, eyeSeconds, onRefresh]);

  const resetEyeTimer = () => {
    setIsEyeRunning(false);
    setEyeSeconds(20);
    setEyeCompleted(false);
  };

  // --- Stretches Library ---
  const stretchList = [
    {
      id: 'neck',
      title: 'Neck Tilt & Roll',
      target: 'Cervical Spine & Trapezius',
      duration: '30 seconds',
      steps: [
        'Sit upright with your shoulders relaxed downward.',
        'Slowly tilt your right ear toward your right shoulder until you feel a gentle stretch.',
        'Hold for 10-15 seconds without forcing.',
        'Gently roll forward and repeat on the left side.',
      ],
      benefit: 'Relieves chronic tension from looking downward at monitors and laptops.',
    },
    {
      id: 'shoulders',
      title: 'Shoulder Shrugs & Retraction',
      target: 'Shoulders & Upper Back',
      duration: '30 seconds',
      steps: [
        'Raise your shoulders up toward your ears as high as comfortable.',
        'Squeeze your shoulder blades firmly together backward.',
        'Drop them down completely and exhale.',
        'Repeat smoothly 8 to 10 times in a circular motion.',
      ],
      benefit: 'Combats rounded desk posture and restores natural scapular alignment.',
    },
    {
      id: 'torso',
      title: 'Seated Torso Spinal Twist',
      target: 'Thoracic Spine & Obliques',
      duration: '40 seconds',
      steps: [
        'Sit tall with your feet flat on the floor.',
        'Place your right hand on the back of your chair and your left hand on your right knee.',
        'Gently twist your torso toward the right, looking over your right shoulder.',
        'Hold for 15-20 seconds with deep breaths, then switch sides.',
      ],
      benefit: 'Decompresses the spine and stimulates abdominal circulation.',
    },
    {
      id: 'wrists',
      title: 'Wrist Flex & Extension',
      target: 'Forearms, Wrists & Fingers',
      duration: '30 seconds',
      steps: [
        'Extend your right arm forward with palm facing away (stop sign).',
        'Use your left hand to gently pull your fingers backward.',
        'Hold for 15 seconds, then point fingers downward and repeat.',
        'Shake both hands out and switch arms.',
      ],
      benefit: 'Critical for mouse and keyboard users to prevent Carpal Tunnel Syndrome.',
    },
    {
      id: 'legs',
      title: 'Seated Hamstring Reach & Ankle Pumps',
      target: 'Lower Back, Hamstrings & Calves',
      duration: '45 seconds',
      steps: [
        'Sit on the edge of your chair and extend your right leg forward with heel on floor.',
        'Hinge gently at your hips with a flat back toward your right foot.',
        'Hold for 20 seconds while pumping your ankle up and down.',
        'Switch to your left leg and repeat.',
      ],
      benefit: 'Promotes venous blood return to prevent sluggish circulation in the legs.',
    },
  ];

  const [selectedStretch, setSelectedStretch] = useState(stretchList[0]);
  const [stretchTimer, setStretchTimer] = useState<number>(30);
  const [isStretchRunning, setIsStretchRunning] = useState<boolean>(false);
  const [stretchFinished, setStretchFinished] = useState<boolean>(false);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (isStretchRunning && stretchTimer > 0) {
      t = setInterval(() => setStretchTimer((s) => s - 1), 1000);
    } else if (stretchTimer === 0 && isStretchRunning) {
      setIsStretchRunning(false);
      setStretchFinished(true);
      api.completeReminder(`manual_stretch_${Date.now()}`, 'stretching').then(onRefresh);
    }
    return () => clearInterval(t);
  }, [isStretchRunning, stretchTimer, onRefresh]);

  const selectStretch = (item: (typeof stretchList)[0]) => {
    setSelectedStretch(item);
    setIsStretchRunning(false);
    setStretchTimer(30);
    setStretchFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('eye_rest')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
            activeTab === 'eye_rest'
              ? 'bg-teal-600 border-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Eye size={18} /> 20-20-20 Eye Rest Guide
        </button>
        <button
          onClick={() => setActiveTab('stretches')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
            activeTab === 'stretches'
              ? 'bg-teal-600 border-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Activity size={18} /> Guided Desk Stretches
        </button>
      </div>

      {activeTab === 'eye_rest' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interactive Countdown Circle */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full mb-4">
              Vision Health Break
            </span>

            <div className="relative w-48 h-48 flex items-center justify-center my-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100 dark:stroke-slate-700"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-emerald-500 transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - eyeSeconds / 20)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-100 font-mono">
                  0:{eyeSeconds.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {isEyeRunning ? 'Look 20 feet away' : eyeCompleted ? 'Complete!' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setIsEyeRunning(!isEyeRunning)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {isEyeRunning ? <Pause size={14} /> : <Play size={14} />}
                {isEyeRunning ? 'Pause' : 'Start 20s Break'}
              </button>
              <button
                onClick={resetEyeTimer}
                className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                title="Reset timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {eyeCompleted && (
              <div className="mt-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-xl flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Eye rest completed & logged! Your eyes thank you.
              </div>
            )}
          </div>

          {/* Explanation & Instructions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              The 20-20-20 Vision Rule
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Staring continuously at computer screens causes the ciliary muscles in your eyes to lock into
              a near-focus state, reducing your blink rate by up to 60% and causing dry eye, headache, and
              fatigue.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Every 20 Minutes</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pause what you are doing and turn away from all displays.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Look 20 Feet Away</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Gaze through a window or down a hallway at an object roughly 6 meters (20 ft) away.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">For 20 Seconds</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Blink gently several times to lubricate the cornea while the ciliary muscle fully relaxes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Stretches Library */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stretches List */}
          <div className="space-y-2">
            {stretchList.map((item) => {
              const isSelected = selectedStretch.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => selectStretch(item)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-100 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs">{item.title}</h4>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{item.target}</span>
                </div>
              );
            })}
          </div>

          {/* Stretch Detail & Guided Timer */}
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                  {selectedStretch.target}
                </span>
                <span className="text-xs text-slate-400">{selectedStretch.duration}</span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {selectedStretch.title}
              </h3>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 mb-4">
                💡 {selectedStretch.benefit}
              </p>

              {/* Steps */}
              <div className="space-y-2.5">
                {selectedStretch.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guided Timer Bar */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                  0:{stretchTimer.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400">
                  {isStretchRunning ? 'Holding stretch...' : stretchFinished ? 'Great work!' : 'Timer'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStretchRunning(!isStretchRunning)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {isStretchRunning ? <Pause size={14} /> : <Play size={14} />}
                  {isStretchRunning ? 'Pause' : 'Start Stretch'}
                </button>
                <button
                  onClick={() => {
                    setIsStretchRunning(false);
                    setStretchTimer(30);
                    setStretchFinished(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
