import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { generateWorkoutPlan, WorkoutPlan } from '../../lib/ai';
import { ExercisePlayer } from './ExercisePlayer';

export const IronLogModal = ({ onClose }: { onClose: () => void }) => {
    const { profile, saveWorkoutPlan } = useAuthStore();
    const [step, setStep] = useState<'input' | 'loading' | 'result'>(profile?.workoutPlan ? 'result' : 'input');
    const [level, setLevel] = useState('Iniciante');
    const [days, setDays] = useState('3');
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(profile?.workoutPlan || null);
    const [viewingExercise, setViewingExercise] = useState<any | null>(null);

    const generateRoutine = async () => {
        setStep('loading');
        const plan = await generateWorkoutPlan(level, days);
        if (plan) {
            setWorkoutPlan(plan);
            saveWorkoutPlan(plan);
            setStep('result');
        } else {
            setStep('input');
            alert("Erro ao gerar treino. Tente novamente.");
        }
    };

    const resetWorkout = () => {
        setWorkoutPlan(null);
        saveWorkoutPlan(undefined);
        setStep('input');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
                
                <div className="p-8 border-b border-neutral-800 bg-neutral-900/50 sticky top-0 backdrop-blur-sm z-20">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={onClose} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group px-3 py-1.5 rounded-md hover:bg-neutral-800/50">
                            <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                        </button>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="text-gold-500">⚡</span> Iron Log AI
                    </h2>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Protocolo de Hipertrofia Tática</p>
                </div>

                <div className="p-8 flex-1">
                    {step === 'input' && (
                        <div className="space-y-8 max-w-lg mx-auto">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider">Nível de Experiência</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Iniciante', 'Intermediário', 'Avançado'].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setLevel(l)}
                                            className={`p-4 border text-sm font-medium transition-all ${level === l ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider">Dias Disponíveis / Semana</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {['2', '3', '4', '5'].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDays(d)}
                                            className={`p-4 border text-sm font-medium transition-all ${days === d ? 'bg-cobalt-600 text-white border-cobalt-600' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                                        >
                                            {d}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={generateRoutine}
                                className="w-full py-5 bg-gold-600 text-black font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
                            >
                                Arquitetar Treino
                            </button>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="w-16 h-16 border-4 border-neutral-800 border-t-gold-600 rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h3 className="text-white text-lg font-medium animate-pulse">Sintetizando Protocolo 8-Core...</h3>
                                <p className="text-neutral-500 text-sm mt-2">Calculando volume, intensidade e divisão ótima...</p>
                            </div>
                        </div>
                    )}

                    {step === 'result' && workoutPlan && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                                <div>
                                    <h3 className="text-3xl text-white font-black uppercase italic">{workoutPlan.title}</h3>
                                    <div className="flex gap-3 mt-2">
                                        <span className="px-2 py-1 bg-neutral-800 text-xs text-gold-500 uppercase font-bold rounded">{workoutPlan.level}</span>
                                        <span className="px-2 py-1 bg-neutral-800 text-xs text-cobalt-400 uppercase font-bold rounded">{workoutPlan.frequency}</span>
                                    </div>
                                </div>
                                <button onClick={resetWorkout} className="text-xs text-neutral-500 hover:text-white uppercase underline">Resetar</button>
                            </div>

                            <div className="grid gap-8">
                                {workoutPlan.schedule.map((day, idx) => (
                                    <div key={idx} className="border border-neutral-800 bg-neutral-900/30 p-6 rounded-sm">
                                        <h4 className="text-xl text-white font-bold mb-6 border-l-4 border-cobalt-600 pl-4 uppercase">{day.dayName}</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="text-neutral-500 border-b border-neutral-800 uppercase text-xs tracking-wider">
                                                        <th className="pb-3 font-medium pl-2">Visual</th>
                                                        <th className="pb-3 font-medium">Exercício</th>
                                                        <th className="pb-3 font-medium w-24">Séries</th>
                                                        <th className="pb-3 font-medium w-24">Reps</th>
                                                        <th className="pb-3 font-medium w-32">Técnica</th>
                                                        <th className="pb-3 font-medium w-24">Descanso</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-800">
                                                    {day.exercises.map((ex, i) => (
                                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                                            <td className="py-3 pl-2 w-12">
                                                                <button 
                                                                    onClick={() => setViewingExercise(ex)}
                                                                    className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:bg-cobalt-600 hover:border-cobalt-500 hover:text-white text-neutral-400 transition-all"
                                                                    title="Ver Execução"
                                                                >
                                                                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                                </button>
                                                            </td>
                                                            <td className="py-4 font-medium text-neutral-200">
                                                                {ex.name}
                                                            </td>
                                                            <td className="py-4 text-neutral-400">{ex.sets}</td>
                                                            <td className="py-4 text-neutral-400">{ex.reps}</td>
                                                            <td className="py-4 text-gold-600 text-xs font-bold uppercase">{ex.technique || '-'}</td>
                                                            <td className="py-4 text-neutral-500 text-xs">{ex.rest}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-neutral-900 p-4 border-l-2 border-gold-600 text-neutral-400 text-sm italic">
                                <span className="font-bold text-gold-600 not-italic uppercase text-xs block mb-1">Nota do Treinador:</span>
                                "{workoutPlan.notes}"
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {viewingExercise && (
                 <ExercisePlayer exercise={viewingExercise} onClose={() => setViewingExercise(null)} />
             )}
        </div>
    );
};