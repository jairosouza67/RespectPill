import { useState } from 'react';
import { IronLogModal } from '../components/tools/IronLogModal';
import { BreathingModal } from '../components/tools/BreathingModal';
import { CognitiveJournalModal } from '../components/tools/CognitiveJournalModal';
import { DietGeneratorModal } from '../components/tools/DietGeneratorModal';
import { FinancialPipeline } from '../components/tools/FinancialPipeline';
import { RelationalAuditModal } from '../components/tools/RelationalAuditModal';

const ToolCard = ({ title, desc, action, onClick }: { title: string, desc: string, action: string, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-neutral-900 border border-neutral-800 p-8 hover:border-gold-600/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">{title}</h3>
        <p className="text-sm text-neutral-500 mb-6 h-10">{desc}</p>
        <button className="text-xs font-bold uppercase tracking-widest text-cobalt-500 flex items-center gap-2 transition-colors">
            {action} <span className="text-lg">→</span>
        </button>
    </div>
);

export default function Tools() {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const closeModal = () => setActiveTool(null);

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto relative">
             <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Arsenal</h1>
             <p className="text-neutral-500 mb-12">Ferramentas operacionais para reforçar o Sistema 8-Core.</p>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard 
                    title="Iron Log" 
                    desc="IA Architect: Gera periodização baseada no Protocolo 8-Core."
                    action="Gerar Protocolo"
                    onClick={() => setActiveTool('iron_log')}
                />
                <ToolCard 
                    title="Botão de Pânico" 
                    desc="Intervenção imediata. Controle autonômico e regulação."
                    action="Ativar SOS"
                    onClick={() => setActiveTool('panic_button')}
                />
                <ToolCard 
                    title="Diário Cognitivo" 
                    desc="Templates de TCC para reenquadrar a ansiedade."
                    action="Nova Entrada"
                    onClick={() => setActiveTool('cognitive_journal')}
                />
                <ToolCard 
                    title="Arquitetura Nutricional" 
                    desc="Crie protocolos de alimentação tática baseados em macros e custo-efetividade."
                    action="Projetar Dieta"
                    onClick={() => setActiveTool('diet_generator')}
                />
                <ToolCard 
                    title="Pipeline Financeiro" 
                    desc="Rastreie fontes de renda, taxa de queima e auditoria IA."
                    action="Ver Ledger"
                    onClick={() => setActiveTool('financial_pipeline')}
                />
                <ToolCard 
                    title="Auditoria Relacional" 
                    desc="Script de check-in quinzenal para casais."
                    action="Iniciar Auditoria"
                    onClick={() => setActiveTool('relational_audit')}
                />
             </div>

             {activeTool === 'iron_log' && <IronLogModal onClose={closeModal} />}
             {activeTool === 'panic_button' && <BreathingModal onClose={closeModal} />}
             {activeTool === 'cognitive_journal' && <CognitiveJournalModal onClose={closeModal} />}
             {activeTool === 'diet_generator' && <DietGeneratorModal onClose={closeModal} />}
             {activeTool === 'financial_pipeline' && <FinancialPipeline onClose={closeModal} />}
             {activeTool === 'relational_audit' && <RelationalAuditModal onClose={closeModal} />}
        </div>
    );
}