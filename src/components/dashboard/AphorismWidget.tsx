import { Quote } from 'lucide-react';

const APHORISMS = [
    { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn" },
    { text: "O que fazemos na vida ecoa na eternidade.", author: "Maximus" },
    { text: "A dor é temporária. A glória é eterna.", author: "Desconhecido" },
    { text: "Não conte os dias, faça os dias contarem.", author: "Muhammad Ali" },
    { text: "Seja a mudança que você quer ver no mundo.", author: "Mahatma Gandhi" }
];

export default function AphorismWidget() {
    // Get a quote based on the day of the year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quote = APHORISMS[dayOfYear % APHORISMS.length];

    return (
        <div className="bg-dark-850 p-6 border border-white/10 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-gold-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="h-px w-8 bg-gold-500"></div>
                    <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Aforismo do Dia</span>
                </div>

                <blockquote className="mb-4">
                    <p className="text-xl font-light text-white italic leading-relaxed">
                        "{quote.text}"
                    </p>
                </blockquote>

                <cite className="text-sm text-zinc-400 font-normal not-italic">
                    — {quote.author}
                </cite>
            </div>
        </div>
    );
}
