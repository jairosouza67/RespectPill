import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { generateRelationshipAudit, RelationalAudit } from '../../lib/ai';

export const RelationalAuditModal = ({ onClose }: { onClose: () => void }) => {
    const { profile, saveRelationalAudit } = useAuthStore();
    
    const [commScore, setCommScore] = useState(5);
    const [intimacyScore, setIntimacyScore] = useState(5);
    const [visionScore, setVisionScore] = useState(5);
    const [friction, setFriction] = useState('');
    const [gratitude, setGratitude] = useState('');
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<RelationalAudit | null>(profile?.relationalAudit || null);

    const runAnalysis = async () => {
        if (!friction || !gratitude) return;
        setIsAnalyzing(true);
        const analysis = await generateRelationshipAudit(commScore, intimacyScore, visionScore, friction, gratitude);
        setResult(analysis);
        saveRelationalAudit(analysis || undefined);
        setIsAnalyzing(false);
    };

    const clear = () => {
        setResult(null);
        saveRelationalAudit(undefined);
    }

    const RangeInput = ({ label, value, setValue }: { label: string, value: number, setValue: (v: number) => void }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{label}</label>
                <span className="text-xl font-mono text-white font-bold">{value}/10</span>
            </div>
            <input 
                type="range" min="0" max="10" step="1" 
                value={value} onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cobalt-600 hover:accent-cobalt-500 transition-all"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="text-neutral-500 hover:text-white flex items-center gap-1 text-xs uppercase tracking-widest transition-colors">
                             Voltar
                        </button>
                        <div className="h-4 w-px bg-neutral-800"></div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="text-purple-500">⚔️</span> Auditoria Relacional
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
                </div>

                <div className="p-8">
                    {!result ? (
                        <div className="space-y-8">
                            <div className="bg-neutral-900/50 p-4 border border-neutral-800 rounded text-sm text-neutral-400 italic">
                                "A qualidade da sua vida é determinada pela qualidade dos seus relacionamentos. Seja brutalmente honesto com os dados."
                            </div>

                            <div className="space-y-6">
                                <RangeInput label="Comunicação Operacional" value={commScore} setValue={setCommScore} />
                                <RangeInput label="Intimidade & Conexão" value={intimacyScore} setValue={setIntimacyScore} />
                                <RangeInput label="Alinhamento de Visão" value={visionScore} setValue={setVisionScore} />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Ponto de Atrito (Últimos 15 dias)</label>
                                    <textarea 
                                        className="w-full bg-black border border-neutral-800 p-4 text-sm text-white focus:border-cobalt-600 outline-none h-24 resize-none"
                                        placeholder="Onde houve falha? Seja específico e objetivo."
                                        value={friction}
                                        onChange={(e) => setFriction(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Valor Agregado (Gratidão)</label>
                                    <textarea 
                                        className="w-full bg-black border border-neutral-800 p-4 text-sm text-white focus:border-gold-600 outline-none h-24 resize-none"
                                        placeholder="O que seu parceiro fez de excepcional?"
                                        value={gratitude}
                                        onChange={(e) => setGratitude(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={runAnalysis}
                                disabled={isAnalyzing || !friction || !gratitude}
                                className={`w-full py-5 font-bold uppercase tracking-widest text-sm transition-all ${
                                    isAnalyzing || !friction || !gratitude
                                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                }`}
                            >
                                {isAnalyzing ? 'Processando Dinâmica...' : 'Gerar Relatório de Impacto'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Status da União</p>
                                    <h3 className="text-3xl font-bold text-white">Diagnóstico Final</h3>
                                </div>
                                <div className="text-right">
                                     <div className={`text-5xl font-mono font-bold ${result.healthScore >= 80 ? 'text-emerald-500' : result.healthScore >= 60 ? 'text-gold-500' : 'text-red-500'}`}>
                                        {result.healthScore}
                                     </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs text-cobalt-500 font-bold uppercase tracking-widest mb-3">Análise Tática</h4>
                                <p className="text-neutral-300 leading-relaxed bg-neutral-900 p-4 border-l-2 border-cobalt-600">
                                    {result.diagnosis}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs text-gold-500 font-bold uppercase tracking-widest mb-3">Plano de Ação Imediato</h4>
                                <ul className="space-y-3">
                                    {result.actionPlan.map((step, idx) => (
                                        <li key={idx} className="flex gap-4 bg-neutral-900/50 p-4 border border-neutral-800">
                                            <span className="font-mono text-neutral-600 font-bold">0{idx + 1}</span>
                                            <span className="text-neutral-200 text-sm font-medium">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
                                <p className="text-xs text-neutral-500 uppercase tracking-[0.3em] mb-4">Cláusula de Ouro (Vigência: 15 dias)</p>
                                <blockquote className="text-xl md:text-2xl font-serif italic text-white leading-relaxed">
                                    "{result.goldenClause}"
                                </blockquote>
                            </div>

                            <button 
                                onClick={clear}
                                className="w-full py-4 mt-8 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 uppercase tracking-widest text-xs font-bold transition-all"
                            >
                                Nova Auditoria
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};