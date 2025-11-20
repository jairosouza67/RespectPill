import { useState } from 'react';
import { IronLogModal } from '../components/tools/IronLogModal';
import { BreathingModal } from '../components/tools/BreathingModal';
import { CognitiveJournalModal } from '../components/tools/CognitiveJournalModal';
import { DietGeneratorModal } from '../components/tools/DietGeneratorModal';
import { FinancialPipeline } from '../components/tools/FinancialPipeline';
import { RelationalAuditModal } from '../components/tools/RelationalAuditModal';
import { Wrench, Zap, Brain, Utensils, TrendingUp, Users, ArrowRight } from 'lucide-react';

const ToolCard = ({ title, desc, action, icon: Icon, onClick }: { title: string, desc: string, action: string, icon: any, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-dark-850 border border-white/5 p-8 rounded-2xl hover:border-cobalt-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-2xl hover:shadow-cobalt-500/10 hover:-translate-y-1"
    >
        {/* Icon Background Effect */}
        <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white transform rotate-12 group-hover:rotate-0 duration-500">
            <Icon className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6 p-3 bg-dark-800 w-fit rounded-xl border border-white/5 group-hover:border-cobalt-500/30 group-hover:bg-cobalt-500/10 transition-colors">
                <Icon className="w-6 h-6 text-zinc-400 group-hover:text-cobalt-400 transition-colors" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cobalt-400 transition-colors">{title}</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed flex-grow">{desc}</p>
            
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-cobalt-400 transition-colors mt-auto">
                {action} 
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cobalt-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
);

export default function Tools() {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const closeModal = () => setActiveTool(null);

    return (
        <div className="space-y-8">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Arsenal</h1>
                    <p className="text-zinc-400">
                        Ferramentas táticas para reforçar o Sistema 8-Core.
                    </p>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard 
                    title="Iron Log" 
                    desc="IA Architect: Gera periodização de treino baseada no seu nível e disponibilidade."
                    action="Gerar Protocolo"
                    icon={Wrench}
                    onClick={() => setActiveTool('iron_log')}
                />
                <ToolCard 
                    title="Botão de Pânico" 
                    desc="Intervenção imediata para ansiedade. Controle autonômico e regulação respiratória."
                    action="Ativar SOS"
                    icon={Zap}
                    onClick={() => setActiveTool('panic_button')}
                />
                <ToolCard 
                    title="Diário Cognitivo" 
                    desc="Reenquadre pensamentos tóxicos usando princípios do Estoicismo e TCC."
                    action="Nova Entrada"
                    icon={Brain}
                    onClick={() => setActiveTool('cognitive_journal')}
                />
                <ToolCard 
                    title="Arquitetura Nutricional" 
                    desc="Crie protocolos de alimentação tática baseados em macros e custo-efetividade."
                    action="Projetar Dieta"
                    icon={Utensils}
                    onClick={() => setActiveTool('diet_generator')}
                />
                <ToolCard 
                    title="Pipeline Financeiro" 
                    desc="Rastreie fluxo de caixa e receba auditoria de IA para cortar desperdícios."
                    action="Ver Ledger"
                    icon={TrendingUp}
                    onClick={() => setActiveTool('financial_pipeline')}
                />
                <ToolCard 
                    title="Auditoria Relacional" 
                    desc="Diagnóstico brutalmente honesto da dinâmica do seu relacionamento."
                    action="Iniciar Auditoria"
                    icon={Users}
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