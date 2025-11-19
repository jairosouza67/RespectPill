import { useState, useEffect } from 'react';
import { useTrackerStore } from '../stores/trackerStore';
import { useAuthStore } from '../stores/authStore';
import { Briefcase, DollarSign, Users, Plus, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Carreira() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers, saveTrackerValue } = useTrackerStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form states
  const [financialGoal, setFinancialGoal] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [networkingContact, setNetworkingContact] = useState('');

  useEffect(() => {
    if (user) {
      loadTrackers(user.id);
    }
  }, [user, loadTrackers]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Get trackers for selected date
  const careerTracker = trackers.find(t => t.date === dateKey && t.type === 'career');

  const handleSaveFinancial = async () => {
    if (!user || !currentAmount) return;

    const currentContacts = careerTracker?.value?.networkingContacts || [];
    const goal = financialGoal || careerTracker?.value?.financialGoal || 0;

    await saveTrackerValue(user.id, dateKey, 'career', {
      completed: true,
      financialGoal: parseFloat(goal.toString()),
      currentAmount: parseFloat(currentAmount),
      networkingContacts: currentContacts,
      timestamp: new Date().toISOString()
    });
    setCurrentAmount('');
  };

  const handleAddContact = async () => {
    if (!user || !networkingContact) return;

    const currentContacts = careerTracker?.value?.networkingContacts || [];
    const currentGoal = careerTracker?.value?.financialGoal || 0;
    const currentAmt = careerTracker?.value?.currentAmount || 0;

    await saveTrackerValue(user.id, dateKey, 'career', {
      completed: true,
      financialGoal: currentGoal,
      currentAmount: currentAmt,
      networkingContacts: [...currentContacts, networkingContact],
      timestamp: new Date().toISOString()
    });
    setNetworkingContact('');
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
          <h1 className="text-3xl font-bold text-white mb-2">Propósito de Vida</h1>
          <p className="text-zinc-400">
            Construa seu império e expanda sua influência.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Goals Section */}
        <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="font-semibold text-white">Metas Financeiras</h2>
            </div>
            {(careerTracker?.value?.currentAmount || 0) > 0 && (
              <div className="flex items-center space-x-1 text-cyan-500">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold">R$ {careerTracker?.value?.currentAmount}</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Progresso Mensal</span>
                <span className="text-white font-medium">
                  {Math.round(((careerTracker?.value?.currentAmount || 0) / (careerTracker?.value?.financialGoal || 10000)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((careerTracker?.value?.currentAmount || 0) / (careerTracker?.value?.financialGoal || 10000)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {!careerTracker?.value?.financialGoal && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Meta Mensal (R$)</label>
                  <input
                    type="number"
                    value={financialGoal}
                    onChange={(e) => setFinancialGoal(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                    placeholder="Ex: 10000"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Faturamento Hoje (R$)</label>
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                  placeholder="Ex: 500"
                />
              </div>

              <button
                onClick={handleSaveFinancial}
                disabled={!currentAmount}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Registrar Entrada</span>
              </button>
            </div>
          </div>
        </div>

        {/* Networking Section */}
        <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <h2 className="font-semibold text-white">Networking</h2>
            </div>
            {(careerTracker?.value?.networkingContacts?.length || 0) > 0 && (
              <div className="flex items-center space-x-1 text-indigo-500">
                <span className="font-bold">{careerTracker?.value?.networkingContacts?.length}</span>
                <span className="text-xs uppercase">contatos</span>
              </div>
            )}
          </div>

          <div className="p-6">
            {(careerTracker?.value?.networkingContacts?.length || 0) > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-medium text-zinc-400">Contatos de Hoje:</h3>
                {careerTracker?.value?.networkingContacts.map((contact: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-white bg-dark-900 p-2 rounded-lg border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>{contact}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Novo Contato / Conexão</label>
                <input
                  type="text"
                  value={networkingContact}
                  onChange={(e) => setNetworkingContact(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                  placeholder="Nome ou empresa..."
                />
              </div>

              <button
                onClick={handleAddContact}
                disabled={!networkingContact}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Contato</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-dark-850 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Consistência Profissional</h3>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayTracker = trackers.find(t => t.date === dayKey && t.type === 'career');
            const isToday = isSameDay(day, new Date());
            const hasActivity = (dayTracker?.value?.currentAmount || 0) > 0 || (dayTracker?.value?.networkingContacts?.length || 0) > 0;

            return (
              <div key={dayKey} className="flex flex-col items-center space-y-2">
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-zinc-500'}`}>
                  {format(day, 'EEE', { locale: ptBR }).slice(0, 3)}
                </span>
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all ${hasActivity
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : 'bg-dark-900 border-white/5 text-zinc-700'
                  }`}>
                  {hasActivity && <Briefcase className="h-4 w-4" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
