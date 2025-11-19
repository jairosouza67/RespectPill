import { Shield } from 'lucide-react';

interface CleanDaysWidgetProps {
    days: number;
    type?: 'porn' | 'alcohol' | 'drugs' | 'general';
}

export default function CleanDaysWidget({ days, type = 'porn' }: CleanDaysWidgetProps) {
    const getLabel = () => {
        switch (type) {
            case 'porn': return 'Sem Pornografia';
            case 'alcohol': return 'Sem Álcool';
            case 'drugs': return 'Sem Drogas';
            default: return 'Dias Limpos';
        }
    };

    return (
        <div className="bg-dark-850 p-6 border border-white/10 hover:border-cobalt-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-cobalt-400" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{getLabel()}</span>
                </div>
                {days > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-green-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Ativo</span>
                    </div>
                )}
            </div>

            <div className="flex items-end space-x-2">
                <span className="text-4xl font-light text-white tracking-tighter">
                    {days}
                </span>
                <span className="text-sm text-zinc-500 mb-1 font-light uppercase tracking-wide">
                    {days === 1 ? 'Dia' : 'Dias'}
                </span>
            </div>

            <div className="mt-4 w-full bg-dark-900 h-1 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cobalt-600 to-cobalt-400 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(days, 90) / 90 * 100}%` }}
                ></div>
            </div>

            <p className="mt-2 text-xs text-zinc-600 text-right">
                Meta: 90 dias
            </p>
        </div>
    );
}
