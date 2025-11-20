import { useState } from 'react';
import { analyzeThought, CognitiveAnalysis } from '../../lib/ai';
import { ArrowLeft, X, Brain } from 'lucide-react';

export const CognitiveJournalModal = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState('');
    const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);

    const handleSubmit = async () => {
        if (!situation || !thought) return;
        setStep('processing');
        const result = await analyzeThought(situation, thought);
        setAnalysis(result);
        setStep('result');
    };

    const reset = () => {
        setSituation('');
        setThought('');
        setAnalysis(null);
        setStep('input');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-dark-900 border border-white/10 w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto rounded-2xl">
                 <div className="p-6 border-b border-white/10 bg-dark-900/95 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="bg-transparent border-0 p-0 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                             <span className="text-sm font-medium">Voltar</span>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-bold text-white">Engenharia Cognitiva</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-0 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'input' && (
                        <div className="space-y-8 animate-fade-in">
                             <div className="bg-dark-850 p-6 border border-white/5 rounded-lg">
                                <p className="text-sm text-zinc-400 font-serif italic leading-relaxed">
                                    "Não são as coisas que perturbam os homens, mas a opinião que têm delas." <br/>
                                    <span className="text-xs text-zinc-600 not-italic mt-2 block uppercase tracking-widest font-sans font-bold">— Epicteto</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-cobalt-500 uppercase tracking-widest block">1. O Evento Gatilho (Realidade Objetiva)</label>
                                    <input 
                                        className="w-full bg-dark-950 border-b-2 border-white/10 p-4 text-white placeholder-zinc-700 focus:border-cobalt-600 outline-none transition-colors"
                                        placeholder="O que aconteceu de fato? (Sem julgamentos)"
                                        value={situation}
                                        onChange={(e) => setSituation(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-red-500 uppercase tracking-widest block">2. A Narrativa Tóxica (Sua Interpretação)</label>
                                    <textarea 
                                        className="w-full bg-dark-950 border border-white/10 p-4 text-white placeholder-zinc-700 focus:border-red-900 outline-none h-32 resize-none transition-colors rounded-lg"
                                        placeholder="O que sua mente está te dizendo sobre isso? O que você teme?"
                                        value={thought}
                                        onChange={(e) => setThought(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={!situation || !thought}
                                className={`w-full py-4 font-bold rounded-xl uppercase tracking-widest text-sm transition-all ${
                                    !situation || !thought
                                    ? 'bg-dark-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'
                                }`}
                            >
                                Reestruturar Realidade
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-dark-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white text-lg font-medium animate-pulse">Examinando Lógica...</h3>
                                <p className="text-zinc-500 text-sm mt-2">Identificando falácias e aplicando princípios estoicos.</p>
                            </div>
                        </div>
                    )}

                    {step === 'result' && analysis && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-start gap-4 p-6 bg-red-900/10 border border-red-900/30 rounded-lg">
                                <div>
                                    <h4 className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Distorção Detectada</h4>
                                    <h3 className="text-xl font-bold text-white mb-2">{analysis.distortion}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{analysis.analysis}</p>
                                </div>
                            </div>

                            <div className="p-8 border border-gold-500/30 bg-gradient-to-br from-dark-900 to-black relative overflow-hidden rounded-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl rounded-full"></div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> A Verdade
                                </h4>
                                <p className="text-lg md:text-xl text-white font-serif leading-relaxed">
                                    "{analysis.reframe}"
                                </p>
                            </div>

                            <div className="bg-dark-850 p-6 border-l-4 border-cobalt-600 rounded-r-lg">
                                <h4 className="text-cobalt-500 text-xs font-bold uppercase tracking-widest mb-2">Protocolo Imediato</h4>
                                <p className="text-white font-medium">
                                    {analysis.action}
                                </p>
                            </div>

                            <button 
                                onClick={reset}
                                className="w-full py-4 mt-8 bg-transparent border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 rounded-xl uppercase tracking-widest text-xs font-bold transition-all"
                            >
                                Nova Entrada
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};