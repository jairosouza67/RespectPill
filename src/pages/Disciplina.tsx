import { useState, useEffect } from 'react';
import { useTrackerStore } from '../stores/trackerStore';
import { useAuthStore } from '../stores/authStore';
import { CheckSquare, Clock, Plus, CheckCircle, Calendar as CalendarIcon, Target } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Disciplina() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers, saveTrackerValue } = useTrackerStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form states
  const [newHabit, setNewHabit] = useState('');
  const [customHabits, setCustomHabits] = useState<string[]>(['Acordar cedo', 'Leitura', 'Treino', 'Meditação']);

  useEffect(() => {
    if (user) {
      loadTrackers(user.id);
    }
  }, [user, loadTrackers]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Get trackers for selected date
  const habitsTracker = trackers.find(t => t.date === dateKey && t.type === 'habits');

  const toggleHabit = async (habit: string) => {
    if (!user) return;

    const currentCompleted = habitsTracker?.value?.completedHabits || [];
    const isCompleted = currentCompleted.includes(habit);

    let newCompleted;
    if (isCompleted) {
      newCompleted = currentCompleted.filter((h: string) => h !== habit);
    } else {
      newCompleted = [...currentCompleted, habit];
    }

    const adherence = Math.round((newCompleted.length / customHabits.length) * 100);

    await saveTrackerValue(user.id, dateKey, 'habits', {
      completed: true,
      completedHabits: newCompleted,
      adherence: adherence,
      timestamp: new Date().toISOString()
    });
  };

  const addCustomHabit = () => {
    if (newHabit && !customHabits.includes(newHabit)) {
      setCustomHabits([...customHabits, newHabit]);
      setNewHabit('');
    }
  };

  // Weekly progress
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Disciplina & Rotina</h1>
          <p className="text-zinc-400">
            A liberdade vem da disciplina inegociável.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-dark-850 p-1 rounded-lg border border-white/10">
          {[-2, -1, 0].map(offset => {
            const date = subDays(new Date(), Math.abs(offset));
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={offset}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isSelected
                    ? 'bg-dark-700 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {offset === 0 ? 'Hoje' : format(date, 'dd/MM')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Habits List Section */}
        <div className="lg:col-span-2 bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="font-semibold text-white">Checklist Diário</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-400">Aderência:</span>
              <span className={`font-bold ${(habitsTracker?.value?.adherence || 0) >= 80 ? 'text-green-500' :
                  (habitsTracker?.value?.adherence || 0) >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                {habitsTracker?.value?.adherence || 0}%
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-6">
              {customHabits.map(habit => {
                const isCompleted = habitsTracker?.value?.completedHabits?.includes(habit);
                return (
                  <button
                    key={habit}
                    onClick={() => toggleHabit(habit)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-dark-900 border-white/5 text-zinc-400 hover:bg-dark-800'
                      }`}
                  >
                    <span className={isCompleted ? '' : 'group-hover:text-zinc-300'}>{habit}</span>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-zinc-600 group-hover:border-zinc-500'
                      }`}>
                      {isCompleted && <CheckCircle className="h-4 w-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Adicionar novo hábito..."
                className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addCustomHabit()}
              />
              <button
                onClick={addCustomHabit}
                disabled={!newHabit}
                className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Routine Stats Section */}
        <div className="space-y-8">
          <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="font-semibold text-white">Rotina</h2>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-32 h-32">
                  <circle
                    className="text-dark-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-emerald-500"
                    strokeWidth="8"
                    strokeDasharray={365}
                    strokeDashoffset={365 - (365 * (habitsTracker?.value?.adherence || 0)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-3xl font-bold text-white">{habitsTracker?.value?.adherence || 0}%</span>
                  <span className="block text-xs text-zinc-500 uppercase tracking-wider">Hoje</span>
                </div>
              </div>
              <p className="text-zinc-400 text-sm">
                Mantenha a consistência para construir uma vida extraordinária.
              </p>
            </div>
          </div>

          <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="font-semibold text-white">Foco</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">Objetivo Principal</h3>
                <p className="text-zinc-500 text-sm italic mb-4">"Não negocie com sua mente."</p>
                <div className="w-full bg-dark-900 rounded-lg p-3 text-zinc-400 text-sm border border-white/5">
                  Completar todos os hábitos por 7 dias seguidos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-dark-850 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Consistência Disciplinar</h3>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayTracker = trackers.find(t => t.date === dayKey && t.type === 'habits');
            const isToday = isSameDay(day, new Date());
            const adherence = dayTracker?.value?.adherence || 0;

            return (
              <div key={dayKey} className="flex flex-col items-center space-y-2">
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-zinc-500'}`}>
                  {format(day, 'EEE', { locale: ptBR }).slice(0, 3)}
                </span>
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all ${adherence > 0
                    ? adherence >= 80
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : adherence >= 50
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                        : 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-dark-900 border-white/5 text-zinc-700'
                  }`}>
                  {adherence > 0 && <span className="text-xs font-bold">{adherence}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
