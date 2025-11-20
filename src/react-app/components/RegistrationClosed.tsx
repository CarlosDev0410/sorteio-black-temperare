import { CalendarX, Instagram, Facebook, Youtube } from "lucide-react";

export default function RegistrationClosed() {
    return (
        <div className="max-w-3xl mx-auto text-center py-12 animate-fade-in-up">
            <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-red-900/20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
                    <CalendarX className="w-10 h-10 text-red-500" />
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                    Inscrições <span className="text-red-500">Encerradas</span>
                </h2>

                {/* Message */}
                <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                    O prazo para participar do nosso Mega Sorteio de Black Friday chegou ao fim.
                    Agradecemos a todos que se inscreveram!
                </p>

                {/* Info Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                    <h3 className="text-red-400 font-bold mb-2 text-lg">Fique Atento ao Resultado!</h3>
                    <p className="text-gray-400">
                        O sorteio será realizado hoje às <strong>14:00h</strong>.
                        Acompanhe nossas redes sociais para conhecer os ganhadores.
                    </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-6">
                    <a
                        href="https://www.instagram.com/lojastemperare/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-red-500/10 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Instagram</span>
                    </a>
                    <a
                        href="https://www.facebook.com/lojastemperare?mibextid=LQQJ4d"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-red-500/10 transition-colors">
                            <Facebook className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Facebook</span>
                    </a>
                    <a
                        href="https://www.youtube.com/@lojastemperare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-red-500/10 transition-colors">
                            <Youtube className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Youtube</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
