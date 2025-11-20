import { useState } from 'react';
import { analyzeThought, CognitiveAnalysis } from '../../lib/ai';

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
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
                 <div className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="text-neutral-500 hover:text-white flex items-center gap-1 text-xs uppercase tracking-widest transition-colors">
                             Voltar
                        </button>
                        <div className="h-4 w-px bg-neutral-800"></div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="text-white">🧠</span> Engenharia Cognitiva
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
                </div>

                <div className="p-8">
                    {step === 'input' && (
                        <div className="space-y-8 animate-fade-in">
                             <div className="bg-neutral-900/30 p-6 border border-neutral-800">
                                <p className="text-sm text-neutral-400 font-serif italic leading-relaxed">
                                    "Não são as coisas que perturbam os homens, mas a opinião que têm delas." <br/>
                                    <span className="text-xs text-neutral-600 not-italic mt-2 block uppercase tracking-widest font-sans font-bold">— Epicteto</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-cobalt-500 uppercase tracking-widest block">1. O Evento Gatilho (Realidade Objetiva)</label>
                                    <input 
                                        className="w-full bg-black border-b-2 border-neutral-800 p-4 text-white placeholder-neutral-700 focus:border-cobalt-600 outline-none transition-colors"
                                        placeholder="O que aconteceu de fato? (Sem julgamentos)"
                                        value={situation}
                                        onChange={(e) => setSituation(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-red-500 uppercase tracking-widest block">2. A Narrativa Tóxica (Sua Interpretação)</label>
                                    <textarea 
                                        className="w-full bg-black border border-neutral-800 p-4 text-white placeholder-neutral-700 focus:border-red-900 outline-none h-32 resize-none transition-colors"
                                        placeholder="O que sua mente está te dizendo sobre isso? O que você teme?"
                                        value={thought}
                                        onChange={(e) => setThought(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={!situation || !thought}
                                className={`w-full py-5 font-bold uppercase tracking-widest text-sm transition-all ${
                                    !situation || !thought
                                    ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                }`}
                            >
                                Reestruturar Realidade
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white text-lg font-medium animate-pulse">Examinando Lógica...</h3>
                                <p className="text-neutral-500 text-sm mt-2">Identificando falácias e aplicando princípios estoicos.</p>
                            </div>
                        </div>
                    )}

                    {step === 'result' && analysis && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-start gap-4 p-6 bg-red-900/10 border border-red-900/30">
                                <div>
                                    <h4 className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Distorção Detectada</h4>
                                    <h3 className="text-xl font-bold text-white mb-2">{analysis.distortion}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{analysis.analysis}</p>
                                </div>
                            </div>

                            <div className="p-8 border border-gold-600/30 bg-gradient-to-br from-neutral-900 to-black relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 blur-3xl rounded-full"></div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> A Verdade
                                </h4>
                                <p className="text-lg md:text-xl text-white font-serif leading-relaxed">
                                    "{analysis.reframe}"
                                </p>
                            </div>

                            <div className="bg-neutral-900 p-6 border-l-4 border-cobalt-600">
                                <h4 className="text-cobalt-500 text-xs font-bold uppercase tracking-widest mb-2">Protocolo Imediato</h4>
                                <p className="text-white font-medium">
                                    {analysis.action}
                                </p>
                            </div>

                            <button 
                                onClick={reset}
                                className="w-full py-4 mt-8 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 uppercase tracking-widest text-xs font-bold transition-all"
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