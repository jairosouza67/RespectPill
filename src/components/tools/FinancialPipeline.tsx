import { useState } from 'react';
import { useAuthStore, FinancialTransaction } from '../../stores/authStore';
import { generateFinancialAudit, FinancialAudit } from '../../lib/ai';
import { ArrowLeft, X, TrendingUp } from 'lucide-react';

export const FinancialPipeline = ({ onClose }: { onClose: () => void }) => {
    const { profile, saveFinancialData } = useAuthStore();
    const savedData = profile?.financialData || { transactions: [], goal: '', lastAudit: undefined };

    const [transactions, setTransactions] = useState<FinancialTransaction[]>(savedData.transactions);
    const [goal, setGoal] = useState(savedData.goal);
    const [auditResult, setAuditResult] = useState<FinancialAudit | null>(savedData.lastAudit || null);
    
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('Essencial');
    const [isAuditing, setIsAuditing] = useState(false);

    const saveState = (txs: FinancialTransaction[], g: string, audit?: FinancialAudit) => {
        saveFinancialData({ transactions: txs, goal: g, lastAudit: audit });
    };

    const addTransaction = () => {
        if (!desc || !amount) return;
        const newTx: FinancialTransaction = {
            id: Date.now().toString(),
            description: desc,
            amount: parseFloat(amount),
            type,
            category
        };
        const newTxs = [...transactions, newTx];
        setTransactions(newTxs);
        saveState(newTxs, goal, auditResult || undefined);
        setDesc('');
        setAmount('');
    };

    const runAudit = async () => {
        if (transactions.length === 0) return;
        setIsAuditing(true);
        saveState(transactions, goal, auditResult || undefined);
        const result = await generateFinancialAudit(transactions, goal);
        setAuditResult(result);
        saveState(transactions, goal, result || undefined);
        setIsAuditing(false);
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const net = totalIncome - totalExpense;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-dark-900 border border-white/10 w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden rounded-2xl">
                <div className="p-6 border-b border-white/10 bg-dark-900/95 flex justify-between items-center sticky top-0">
                    <div className="flex items-center gap-4">
                         <button onClick={onClose} className="bg-transparent border-0 p-0 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                             <span className="text-sm font-medium">Voltar</span>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cobalt-500" />
                            <h2 className="text-lg font-bold text-white">Pipeline Financeiro</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-0 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    <div className="w-full md:w-1/2 border-r border-white/10 flex flex-col bg-dark-850 p-6 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-dark-900 border border-white/10 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Entradas</div>
                                <div className="text-emerald-500 font-mono font-bold">R$ {totalIncome.toFixed(2)}</div>
                            </div>
                            <div className="p-4 bg-dark-900 border border-white/10 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Saídas</div>
                                <div className="text-red-500 font-mono font-bold">R$ {totalExpense.toFixed(2)}</div>
                            </div>
                             <div className={`p-4 bg-dark-900 border rounded-lg ${net >= 0 ? 'border-emerald-900/30' : 'border-red-900/30'}`}>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Líquido</div>
                                <div className={`font-mono font-bold ${net >= 0 ? 'text-white' : 'text-red-400'}`}>R$ {net.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 bg-dark-900 p-4 border border-white/10 rounded-xl">
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Novo Registro</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setType('income')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border transition-all ${type === 'income' ? 'bg-emerald-900/30 text-emerald-500 border-emerald-900' : 'bg-transparent border-white/10 text-zinc-500'}`}>Entrada</button>
                                <button onClick={() => setType('expense')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border transition-all ${type === 'expense' ? 'bg-red-900/30 text-red-500 border-red-900' : 'bg-transparent border-white/10 text-zinc-500'}`}>Saída</button>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Descrição (ex: Salário, Aluguel)" 
                                className="w-full bg-dark-950 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:border-cobalt-600 outline-none"
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Valor" 
                                    className="w-1/2 bg-dark-950 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:border-cobalt-600 outline-none"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                                <select 
                                    className="w-1/2 bg-dark-950 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cobalt-600 outline-none"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option>Essencial</option>
                                    <option>Lazer</option>
                                    <option>Investimento</option>
                                    <option>Dívida</option>
                                    <option>Educação</option>
                                </select>
                            </div>
                            <button 
                                onClick={addTransaction}
                                className="w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                Adicionar Transação
                            </button>
                        </div>

                         <div className="space-y-2">
                            {transactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 border border-white/5 bg-dark-900/50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-white font-medium">{t.description}</div>
                                        <div className="text-xs text-zinc-500 uppercase">{t.category}</div>
                                    </div>
                                    <div className={`font-mono text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <div className="text-center py-8 text-zinc-600 text-xs uppercase tracking-widest">Nenhum registro</div>
                            )}
                         </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto bg-dark-900">
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4">Alvo Estratégico</h3>
                            <input 
                                type="text" 
                                placeholder="Qual seu objetivo? (ex: Juntar 10k em 6 meses)" 
                                className="w-full bg-dark-900 border-b-2 border-white/10 p-4 text-lg text-white placeholder-zinc-600 focus:border-gold-500 outline-none transition-colors font-light"
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                onBlur={() => saveState(transactions, goal, auditResult || undefined)}
                            />
                        </div>

                        <div className="flex-1">
                            {isAuditing ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <div className="w-12 h-12 border-4 border-dark-800 border-t-cobalt-600 rounded-full animate-spin"></div>
                                    <p className="text-cobalt-500 text-xs uppercase tracking-widest animate-pulse">Analisando padrões de consumo...</p>
                                </div>
                            ) : auditResult ? (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h3 className="text-2xl text-white font-bold uppercase">Relatório CFO</h3>
                                        <div className="text-right">
                                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Score de Saúde</div>
                                            <div className={`text-3xl font-mono font-bold ${auditResult.score > 70 ? 'text-emerald-500' : auditResult.score > 40 ? 'text-gold-500' : 'text-red-500'}`}>
                                                {auditResult.score}/100
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span> Detecção de Desperdício
                                        </h4>
                                        <ul className="space-y-2">
                                            {auditResult.wasteDetection.map((w, i) => (
                                                <li key={i} className="text-sm text-zinc-300 bg-dark-850 p-3 border-l-2 border-red-900 rounded-r-lg">
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-cobalt-500 rounded-full"></span> Análise de Burn Rate
                                        </h4>
                                        <p className="text-sm text-zinc-300 leading-relaxed border border-white/10 p-4 bg-dark-850 rounded-lg">
                                            {auditResult.burnRateAnalysis}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gold-500 rounded-full"></span> Estratégia de Ataque
                                        </h4>
                                        <p className="text-sm text-white font-medium leading-relaxed border-l-4 border-gold-500 pl-4 py-2">
                                            "{auditResult.strategy}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                    <p className="text-zinc-500 text-sm max-w-xs">Adicione transações e defina um objetivo para liberar a auditoria da IA.</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={runAudit}
                            disabled={transactions.length === 0 || isAuditing}
                            className={`w-full py-4 mt-4 font-bold rounded-xl uppercase tracking-widest text-sm transition-all ${
                                transactions.length > 0 
                                ? 'bg-cobalt-600 text-white hover:bg-cobalt-500 shadow-lg shadow-cobalt-500/20' 
                                : 'bg-dark-800 text-zinc-600 cursor-not-allowed'
                            }`}
                        >
                            {isAuditing ? 'Processando...' : 'Executar Auditoria Tática'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};