import CountdownTimer from "@/react-app/components/CountdownTimer";
import RaffleForm from "@/react-app/components/RaffleForm";
import { Zap, Instagram, Facebook, Youtube } from "lucide-react";

export default function Home() {
  const raffleDate = new Date("2025-11-28T00:00:00");

  const scrollToForm = () => {
    const formElement = document.getElementById("form-section");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Now Sticky */}
      <header className="sticky top-0 left-0 right-0 z-50 py-3 px-4 backdrop-blur-lg bg-black/60 border-b border-red-500/20 animate-fade-in-down">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <img
            src="logo.png"
            alt="Temperare Logo"
            className="h-16 md:h-20 object-cover"
          />
          <button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-4 py-3 md:px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/50 flex items-center justify-center text-sm md:text-base group relative overflow-hidden"
          >
            <span className="relative z-10">Participe Já</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-300 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
          </button>
        </div>
      </header>

      <div className="relative z-10">
        {/* Description Section - Centered */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 pt-20 md:pt-24">
          <div className="text-center mb-12">
            {/* Badge de Urgência */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full backdrop-blur-sm animate-pulse-subtle">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">BLACK FRIDAY ESPECIAL</span>
            </div>

            {/* Título Melhorado */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-2xl">
              <span className="text-white">MEGA SORTEIO</span><br />
              <span className="text-transparent bg-gradient-to-r from-red-500 to-red-400 bg-clip-text">
                BLACK FRIDAY
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-red-300 font-semibold mb-4">
              Concorra a 2 Liquidificadores Blender!
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Participe do nosso sorteio e ganhe <strong className="text-red-300">2 Blender Profissionais</strong> de 1450w com 2 litros de capacidade e temporizador!
              <span className="block text-sm text-gray-500 mt-2">
                *Produtos de alta performance para profissionais
              </span>
            </p>
          </div>

          {/* Countdown - Centered */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Faltam apenas
            </h3>

            <div className="scale-90 md:scale-100">
              <CountdownTimer targetDate={raffleDate} />
            </div>
          </div>

          {/* Unified Image and Form Card */}
          <div id="form-section" className="mb-16">
            <div className="relative group max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-black border border-red-500/30 rounded-3xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  {/* Form Side */}
                  <div>
                    <RaffleForm />
                  </div>
                  {/* Image Side */}
                  <div className="hidden md:block relative">
                    <img
                      src="produto-sorteio.png"
                      alt="Liquidificador Profissional"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Divisor com Borda Neon VERMELHA */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.8)]"></div>
                    {/* Gradient Overlay MUITO mais suave - só escurece na borda esquerda */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent from-80% via-black/10 to-black/70"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Expandido */}
        <footer className="py-12 px-4 border-t border-gray-800 bg-black/40 backdrop-blur-sm mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Coluna 1: Info do Sorteio */}
              <div className="text-center md:text-left">
                <h4 className="text-white font-bold mb-3">Sobre o Sorteio</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sorteio válido até 28/11/2025<br />
                  2 ganhadores serão sorteados<br />
                  Validação exclusiva por telefone
                </p>
              </div>

              {/* Coluna 2: Links */}
              <div className="text-center">
                <h4 className="text-white font-bold mb-3">Informações</h4>
                <a href="#" className="block text-red-400 hover:text-red-300 text-sm mb-2 transition-colors">
                  Regulamento Completo
                </a>
                <a href="#" className="block text-red-400 hover:text-red-300 text-sm transition-colors">
                  Política de Privacidade
                </a>
              </div>

              {/* Coluna 3: Social */}
              <div className="text-center md:text-right">
                <h4 className="text-white font-bold mb-3">Siga-nos</h4>
                <div className="flex gap-3 justify-center md:justify-end">
                  <a href="https://www.instagram.com/lojastemperare/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.facebook.com/lojastemperare?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://abre.ai/k5Ld" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="TikTok">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@lojastemperare" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="YouTube">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
              <p>TEMPERARE EQUIPAMENTOS PARA COZINHAS LTDA | Cnpj: 27.042.473/0001-08 | Rua Olimpo Qd 2/1 LT 1 - Jardim Olimpo - Duque de Caxias/RJ | Cep: 25.255-453 | sac@lojastemperare.com.br</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}