import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { generateDietPlan, DietPlan } from '../../lib/ai';

export const DietGeneratorModal = ({ onClose }: { onClose: () => void }) => {
    const { profile, saveDietPlan } = useAuthStore();
    const [step, setStep] = useState<'input' | 'loading' | 'result'>(profile?.dietPlan ? 'result' : 'input');
    
    const [weight, setWeight] = useState(profile?.weight?.toString() || '');
    const [height, setHeight] = useState(profile?.height?.toString() || '');
    const [goal, setGoal] = useState('Perda de Peso');
    const [meals, setMeals] = useState('3');
    const [preferences, setPreferences] = useState('');

    const [dietPlan, setDietPlan] = useState<DietPlan | null>(profile?.dietPlan || null);

    const handleGenerate = async () => {
        if (!weight || !height || !preferences) return;
        setStep('loading');
        const plan = await generateDietPlan(weight, height, goal, meals, preferences);
        if (plan) {
            setDietPlan(plan);
            saveDietPlan(plan);
            setStep('result');
        } else {
            setStep('input');
            alert("Erro ao gerar dieta. Tente novamente com mais detalhes.");
        }
    };

    const reset = () => {
        setDietPlan(null);
        saveDietPlan(undefined);
        setStep('input');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
             <div className="bg-neutral-950 border border-neutral-800 w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
                 <div className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="text-neutral-500 hover:text-white flex items-center gap-1 text-xs uppercase tracking-widest transition-colors">
                             Voltar
                        </button>
                        <div className="h-4 w-px bg-neutral-800"></div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="text-white">🥩</span> Arquitetura Nutricional
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
                </div>

                <div className="p-8">
                    {step === 'input' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
                            <div className="bg-neutral-900/30 p-4 border border-neutral-800">
                                <p className="text-sm text-neutral-400 italic">
                                    "O corpo é construído na cozinha, esculpido no ginásio. Este sistema gera protocolos de combustível tático e acessível."
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Peso (kg)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-cobalt-600 outline-none"
                                        placeholder="Ex: 80"
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Altura (cm)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-cobalt-600 outline-none"
                                        placeholder="Ex: 180"
                                        value={height}
                                        onChange={e => setHeight(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Objetivo Tático</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Perda de Peso', 'Ganho de Massa', 'Manutenção'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setGoal(g)}
                                            className={`p-3 text-sm font-bold uppercase tracking-wider border transition-all ${goal === g ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Refeições por Dia</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['2', '3', '4', '5+'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMeals(m)}
                                            className={`p-3 text-sm font-bold uppercase tracking-wider border transition-all ${meals === m ? 'bg-cobalt-600 text-white border-cobalt-600' : 'border-neutral-800 text-neutral-600 hover:border-neutral-600'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold-600 uppercase tracking-widest">Inventário de Preferências</label>
                                <textarea 
                                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-gold-600 outline-none h-32 resize-none"
                                    placeholder="O que você costuma comer? O que você gosta? Tem alergias? (Ex: Gosto de frango, ovo, arroz, banana. Odeio peixe. Como às 12h e 20h.)"
                                    value={preferences}
                                    onChange={e => setPreferences(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={!weight || !height || !preferences}
                                className={`w-full py-5 font-bold uppercase tracking-widest text-sm transition-all ${
                                    !weight || !height || !preferences
                                    ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                                    : 'bg-cobalt-600 text-white hover:bg-cobalt-500 shadow-[0_0_20px_rgba(59,91,219,0.2)]'
                                }`}
                            >
                                Gerar Protocolo Nutricional
                            </button>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="w-16 h-16 border-4 border-neutral-800 border-t-cobalt-600 rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h3 className="text-white text-lg font-medium animate-pulse">Calculando Macros...</h3>
                                <p className="text-neutral-500 text-sm mt-2">Otimizando custo-benefício e densidade nutricional.</p>
                            </div>
                        </div>
                    )}

                    {step === 'result' && dietPlan && (
                        <div className="space-y-8 animate-fade-in">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Estratégia Definida</p>
                                    <h3 className="text-3xl text-white font-black uppercase italic">{dietPlan.title}</h3>
                                </div>
                                <div className="flex items-center gap-4 bg-neutral-900 p-3 border border-neutral-800">
                                     <div className="text-center px-4 border-r border-neutral-800">
                                        <div className="text-xs text-neutral-500 uppercase">Calorias</div>
                                        <div className="text-xl font-mono font-bold text-white">{dietPlan.calories}</div>
                                     </div>
                                     <div className="text-center px-2">
                                        <div className="text-[10px] text-neutral-500 uppercase">Prot</div>
                                        <div className="text-sm font-mono font-bold text-cobalt-400">{dietPlan.macros?.protein || '-'}</div>
                                     </div>
                                     <div className="text-center px-2">
                                        <div className="text-[10px] text-neutral-500 uppercase">Carb</div>
                                        <div className="text-sm font-mono font-bold text-gold-400">{dietPlan.macros?.carbs || '-'}</div>
                                     </div>
                                     <div className="text-center px-2">
                                        <div className="text-[10px] text-neutral-500 uppercase">Gord</div>
                                        <div className="text-sm font-mono font-bold text-emerald-400">{dietPlan.macros?.fats || '-'}</div>
                                     </div>
                                </div>
                            </div>

                            <div className="bg-neutral-900/30 border-l-4 border-gold-600 p-4">
                                <p className="text-neutral-300 italic text-sm">"{dietPlan.strategy}"</p>
                            </div>

                            <div className="space-y-6">
                                {dietPlan.meals?.map((meal, idx) => (
                                    <div key={idx} className="border border-neutral-800 bg-neutral-900/20 p-6 hover:border-neutral-700 transition-colors">
                                        <h4 className="text-lg text-white font-bold mb-4 uppercase flex items-center gap-2">
                                            <span className="w-2 h-2 bg-cobalt-600 rounded-full"></span>
                                            {meal.name}
                                        </h4>
                                        <ul className="space-y-2">
                                            {meal.items?.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm border-b border-neutral-800/50 pb-2 last:border-0">
                                                    <span className="text-neutral-600">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={reset}
                                className="w-full py-4 mt-8 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 uppercase tracking-widest text-xs font-bold transition-all"
                            >
                                Recalcular Protocolo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};