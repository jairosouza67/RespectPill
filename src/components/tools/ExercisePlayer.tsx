import { useState, useEffect } from 'react';
import { findExerciseVideo } from '../../lib/ai';
import { ArrowLeft, X } from 'lucide-react';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    technique?: string;
}

export const ExercisePlayer = ({ exercise, onClose }: { exercise: Exercise, onClose: () => void }) => {
    const [videoId, setVideoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchVideo = async () => {
            setLoading(true);
            const id = await findExerciseVideo(exercise.name);
            if (mounted) {
                setVideoId(id);
                setLoading(false);
            }
        };
        fetchVideo();
        return () => { mounted = false; };
    }, [exercise.name]);

    const externalSearchUrl = `https://www.youtube.com/results?search_query=DeltaBolic+${encodeURIComponent(exercise.name)}+shorts`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fade-in">
            <div className="bg-dark-950 border border-gold-500/30 w-full max-w-4xl shadow-2xl shadow-gold-900/10 relative flex flex-col overflow-hidden rounded-xl">
                 <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-950">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="bg-transparent border-0 p-0 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                {exercise.name} <span className="text-xs text-gold-500 px-1.5 py-0.5 bg-gold-900/20 rounded">@DeltaBolic</span>
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-0 p-2 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="aspect-video w-full bg-black relative group flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-dark-800 border-t-gold-500 rounded-full animate-spin"></div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Localizando Vídeo Tático...</p>
                        </div>
                    ) : videoId ? (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                            title={`DeltaBolic ${exercise.name}`}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <div className="text-center p-6">
                             <p className="text-zinc-500 mb-4">Conexão direta com o feed não estabelecida.</p>
                             <a 
                                href={externalSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-dark-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-dark-700 transition-colors rounded-lg"
                            >
                                Abrir Busca Manual
                             </a>
                        </div>
                    )}
                    
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5"></div>
                </div>

                <div className="p-6 bg-dark-900 space-y-4">
                    <div className="flex gap-4 text-xs uppercase tracking-widest font-mono text-zinc-400 border-b border-white/10 pb-4">
                        <div className="flex-1 text-center border-r border-white/10 last:border-0">
                            <span className="block text-gold-500 mb-1">Séries</span>
                            <span className="text-white font-bold">{exercise.sets}</span>
                        </div>
                        <div className="flex-1 text-center border-r border-white/10 last:border-0">
                            <span className="block text-gold-500 mb-1">Reps</span>
                            <span className="text-white font-bold">{exercise.reps}</span>
                        </div>
                        <div className="flex-1 text-center">
                            <span className="block text-gold-500 mb-1">Descanso</span>
                            <span className="text-white font-bold">{exercise.rest}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        {exercise.technique ? (
                            <div className="bg-cobalt-900/20 border border-cobalt-900/50 p-3 rounded-lg text-sm text-cobalt-200 flex-1 w-full">
                                <strong className="text-cobalt-500 uppercase text-xs block mb-1 tracking-wider">Técnica Avançada</strong>
                                {exercise.technique}
                            </div>
                        ) : (
                            <div className="bg-dark-800/30 border border-white/10 p-3 rounded-lg text-sm text-zinc-500 flex-1 text-center italic w-full">
                                Execução padrão com foco na fase excêntrica.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};