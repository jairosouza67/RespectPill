import { useState, useEffect } from 'react';
import { useTrackerStore } from '../stores/trackerStore';
import { useAuthStore } from '../stores/authStore';
import { Users, Heart, Plus, CheckCircle, Calendar as CalendarIcon, Globe } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Comunidade() {
    const { user } = useAuthStore();
    const { trackers, loadTrackers, saveTrackerValue } = useTrackerStore();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Form states
    const [contribution, setContribution] = useState('');

    useEffect(() => {
        if (user) {
            loadTrackers(user.id);
        }
    }, [user, loadTrackers]);

    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    // Get trackers for selected date
    const communityTracker = trackers.find(t => t.date === dateKey && t.type === 'community');

    const handleSaveContribution = async () => {
        if (!user || !contribution) return;

        await saveTrackerValue(user.id, dateKey, 'community', {
            completed: true,
            contribution: contribution,
            timestamp: new Date().toISOString()
        });
        setContribution('');
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
                    <h1 className="text-3xl font-bold text-white mb-2">Comunidade & Serviço</h1>
                    <p className="text-zinc-400">
                        O verdadeiro poder está em servir.
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
                {/* Contribution Section */}
                <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Heart className="h-5 w-5 text-orange-400" />
                            </div>
                            <h2 className="font-semibold text-white">Contribuição do Dia</h2>
                        </div>
                        {communityTracker?.value?.contribution && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                    </div>

                    <div className="p-6">
                        {communityTracker?.value?.contribution ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                                    <Globe className="h-8 w-8 text-orange-500" />
                                </div>
                                <h3 className="text-white font-medium mb-1">Impacto Gerado</h3>
                                <p className="text-zinc-500 px-4 italic">"{communityTracker.value.contribution}"</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Como você serviu hoje?</label>
                                    <textarea
                                        value={contribution}
                                        onChange={(e) => setContribution(e.target.value)}
                                        rows={4}
                                        className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all resize-none"
                                        placeholder="Ajuda, doação, mentoria ou ato de serviço..."
                                    />
                                </div>

                                <button
                                    onClick={handleSaveContribution}
                                    disabled={!contribution}
                                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Registrar Contribuição</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Community Stats / Info */}
                <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <h2 className="font-semibold text-white">Tribo</h2>
                        </div>
                    </div>

                    <div className="p-6 text-center">
                        <div className="mb-6">
                            <h3 className="text-white font-medium mb-2">Seu Papel na Tribo</h3>
                            <p className="text-zinc-400 text-sm">
                                "Você é a média das 5 pessoas com quem mais convive."
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-dark-900 p-4 rounded-xl border border-white/5">
                                <div className="text-2xl font-bold text-white mb-1">0</div>
                                <div className="text-xs text-zinc-500 uppercase">Mentorados</div>
                            </div>
                            <div className="bg-dark-900 p-4 rounded-xl border border-white/5">
                                <div className="text-2xl font-bold text-white mb-1">0</div>
                                <div className="text-xs text-zinc-500 uppercase">Projetos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-dark-850 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Consistência Social</h3>
                    <div className="flex items-center space-x-2 text-sm text-zinc-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => {
                        const dayKey = format(day, 'yyyy-MM-dd');
                        const dayTracker = trackers.find(t => t.date === dayKey && t.type === 'community');
                        const isToday = isSameDay(day, new Date());
                        const hasActivity = !!dayTracker?.value?.contribution;

                        return (
                            <div key={dayKey} className="flex flex-col items-center space-y-2">
                                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-zinc-500'}`}>
                                    {format(day, 'EEE', { locale: ptBR }).slice(0, 3)}
                                </span>
                                <div className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all ${hasActivity
                                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                        : 'bg-dark-900 border-white/5 text-zinc-700'
                                    }`}>
                                    {hasActivity && <Heart className="h-4 w-4" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
