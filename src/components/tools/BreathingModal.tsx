import { useState, useEffect, useRef } from 'react';

const panicAffirmations = [
    "Isso é temporário. Vai passar.",
    "Você está seguro aqui e agora.",
    "Sinta o chão firme sob seus pés.",
    "Sua respiração é sua âncora.",
    "Apenas observe, não julgue.",
    "Você é maior que sua ansiedade.",
    "O corpo sabe se regular. Confie.",
    "Solte o controle. Apenas respire.",
    "Este momento é seguro."
];

export const BreathingModal = ({ onClose }: { onClose: () => void }) => {
    const [rhythm, setRhythm] = useState(0);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
    const [timer, setTimer] = useState(4);
    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [message, setMessage] = useState("Prepare-se...");
    const [affirmation, setAffirmation] = useState(panicAffirmations[0]);

    const rhythms = [
        { name: "Quadrada (Foco)", in: 4, hold: 4, out: 4, holdEmpty: 4, color: 'text-cobalt-500', circle: 'border-cobalt-500' },
        { name: "Relaxamento (4-7-8)", in: 4, hold: 7, out: 8, holdEmpty: 0, color: 'text-emerald-500', circle: 'border-emerald-500' },
        { name: "Coerência (Equilíbrio)", in: 5, hold: 0, out: 5, holdEmpty: 0, color: 'text-gold-500', circle: 'border-gold-500' }
    ];

    const currentRhythm = rhythms[rhythm];
    const intervalRef = useRef<any>(null);

    const messages = {
        inhale: ["Inspire calma...", "Receba energia...", "Encha os pulmões..."],
        hold: ["Segure...", "Mantenha o foco...", "Estabilidade..."],
        exhale: ["Expire a tensão...", "Solte o peso...", "Deixe ir..."],
        holdEmpty: ["Vazio...", "Silêncio...", "Paz..."]
    };

    const vibrate = () => {
        if (navigator.vibrate) navigator.vibrate(50);
    };

    useEffect(() => {
        startCycle();
        return () => stopCycle();
    }, [rhythm]);

    const stopCycle = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const startCycle = () => {
        stopCycle();
        setIsActive(true);
        setIsPaused(false);
        setPhase('inhale');
        setTimer(currentRhythm.in);
        setMessage("Inspire profundamente");
        setAffirmation(panicAffirmations[Math.floor(Math.random() * panicAffirmations.length)]);
        processCycle();
    };

    const processCycle = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev > 1) return prev - 1;
                return 0;
            });
        }, 1000);
    };

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            processCycle();
        } else {
            setIsPaused(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    const stopSession = () => {
        stopCycle();
        setIsActive(false);
        setIsPaused(false);
        setTimer(currentRhythm.in);
        setPhase('inhale');
        setMessage("Pronto para iniciar");
    };

    useEffect(() => {
        if (!isActive || isPaused) return;
        
        if (timer === 0) {
            vibrate();
            const nextPhase = getNextPhase(phase);
            let duration = getDuration(nextPhase);
            let actualNextPhase = nextPhase;
            
            if (duration === 0) {
                 actualNextPhase = getNextPhase(nextPhase);
                 duration = getDuration(actualNextPhase);
            }

            setPhase(actualNextPhase);
            setTimer(duration);
            
            const msgs = messages[actualNextPhase];
            if (msgs) setMessage(msgs[Math.floor(Math.random() * msgs.length)]);

            if (actualNextPhase === 'inhale') {
                setAffirmation(panicAffirmations[Math.floor(Math.random() * panicAffirmations.length)]);
            }
        }
    }, [timer, isActive, isPaused, phase, rhythm]);

    const getNextPhase = (p: string) => {
        if (p === 'inhale') return 'hold';
        if (p === 'hold') return 'exhale';
        if (p === 'exhale') return 'holdEmpty';
        return 'inhale';
    };

    const getDuration = (p: string) => {
        if (p === 'inhale') return currentRhythm.in;
        if (p === 'hold') return currentRhythm.hold;
        if (p === 'exhale') return currentRhythm.out;
        return currentRhythm.holdEmpty;
    };

    const getCircleStyle = () => {
        const base = "w-64 h-64 rounded-full border-4 flex items-center justify-center transition-all duration-[1000ms] ease-linear relative ";
        
        if (!isActive) return base + "scale-100 bg-black border-neutral-800";
        if (isPaused) return base + `scale-100 bg-neutral-900 ${currentRhythm.circle} opacity-50`;

        if (phase === 'inhale') return base + `scale-110 bg-neutral-800/50 ${currentRhythm.circle} shadow-[0_0_50px_rgba(255,255,255,0.1)]`;
        if (phase === 'hold') return base + `scale-110 bg-neutral-800/50 ${currentRhythm.circle}`;
        if (phase === 'exhale') return base + `scale-90 bg-black ${currentRhythm.circle}`;
        return base + `scale-90 bg-black border-neutral-800`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
             <div className="w-full max-w-md p-6 flex flex-col items-center relative h-full md:h-auto justify-center">
                <div className="absolute top-6 left-6 md:top-0 md:left-0 w-full flex justify-between items-center z-20">
                    <button onClick={onClose} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group px-4 py-2 bg-black/50 rounded-full border border-neutral-800">
                        <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                    </button>
                </div>

                <div className="flex gap-2 mb-8 z-10 mt-12 md:mt-0">
                    {rhythms.map((r, idx) => (
                        <button
                            key={idx}
                            onClick={() => setRhythm(idx)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all ${
                                rhythm === idx 
                                ? 'bg-neutral-100 text-black border-white' 
                                : 'bg-transparent text-neutral-600 border-neutral-800 hover:border-neutral-600'
                            }`}
                        >
                            {r.name.split(' ')[0]}
                        </button>
                    ))}
                </div>

                <div className="relative mb-8 cursor-pointer" onClick={isActive ? togglePause : startCycle}>
                    <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
                        isActive && !isPaused && (phase === 'inhale' || phase === 'hold') ? 'bg-white scale-125' : 'bg-transparent scale-90'
                    }`}></div>

                    <div className={getCircleStyle()}>
                        <div className="text-center z-10">
                            {!isActive ? (
                                <div className="text-white">Iniciar</div>
                            ) : (
                                <>
                                    <span className={`block text-4xl font-black mb-2 transition-colors ${currentRhythm.color}`}>
                                        {(phase === 'hold' || phase === 'holdEmpty') ? '' : timer}
                                        {isPaused && <span className="text-xs block mt-1 text-white">PAUSA</span>}
                                    </span>
                                    {!isPaused && (
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                                            {phase === 'inhale' && 'Inspirar'}
                                            {phase === 'hold' && 'Segurar'}
                                            {phase === 'exhale' && 'Expirar'}
                                            {phase === 'holdEmpty' && 'Aguardar'}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center h-32 space-y-4">
                    <div>
                        <h2 className={`text-xl md:text-2xl font-light text-white mb-1 transition-opacity ${isPaused ? 'opacity-50' : 'opacity-100'}`}>
                            "{message}"
                        </h2>
                        <p className="text-xs text-neutral-600 uppercase tracking-widest">
                            {rhythms[rhythm].name}
                        </p>
                    </div>
                    
                    <div className={`transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <p className="text-sm font-medium text-cobalt-400 italic">
                            {affirmation}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4">
                    <button 
                        onClick={stopSession}
                        disabled={!isActive}
                        className={`p-4 rounded-full border transition-all ${
                            isActive 
                            ? 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white' 
                            : 'border-neutral-800 text-neutral-800 cursor-not-allowed'
                        }`}
                    >
                        Parar
                    </button>

                    <button 
                        onClick={isActive ? togglePause : startCycle}
                        className="p-6 rounded-full bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        {!isActive || isPaused ? "Play" : "Pause"}
                    </button>
                </div>
             </div>
        </div>
    );
};