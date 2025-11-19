import CountdownTimer from "@/react-app/components/CountdownTimer";
import RaffleForm from "@/react-app/components/RaffleForm";
import { useElementHeight } from "@/hooks/useElementHeight";

export default function Home() {
  const raffleDate = new Date("2025-11-28T00:00:00");

  const scrollToForm = () => {
    const formElement = document.getElementById("form-section");
    formElement?.scrollIntoView({ behavior: "smooth" });

  const imageCard = useElementHeight();
  const formCard = useElementHeight();

  // A maior altura entre os dois define a altura dos dois
  const syncedHeight = Math.max(imageCard.height || 0, formCard.height || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 py-3 px-4 border-b border-gray-800/30 backdrop-blur-md bg-black/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <img
              src="logo.png"
              alt="Temperare Logo"
              className="h-20 md:h-24 object-cover"
            />
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 md:px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center gap-1 md:gap-2 text-sm"
            >
              <CountdownTimer targetDate={raffleDate} compact={true} />
            </button>
          </div>
        </header>

        {/* Description Section - Centered */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 pt-32 md:pt-40">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              MEGA SORTEIO DA BLACK!
            </h1>
            <h2 className="text-2xl md:text-3xl text-purple-300 font-semibold mb-4">
              Concorra a 2 Liquidificadores Blender!
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Participe do nosso sorteio e ganhe 2 <a href="https://www.lojastemperare.com.br/produto/liquidificador-blender-1450w-2-litros-alta-rotacao-com-temporizador-75441" target="blank">Blender Profissionais de 1450w com 2 litros de capacidade e com temporizador.</a>
            </p>
          </div>

          <div id="form-section" className="grid md:grid-cols-2 gap-8 mb-16">

            {/* ===========================
                🎨 IMAGE CARD
            ============================ */}
            <div
              ref={imageCard.refCallback}
              style={{ height: syncedHeight || "auto" }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 transition-opacity group-hover:opacity-75"></div>

              <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl overflow-hidden w-full h-full flex items-center justify-center p-1 shadow-xl">
                <img
                  src="produto-sorteio.png"
                  alt="Liquidificador Profissional"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* ===========================
                📋 FORM CARD
            ============================ */}
            <div
              ref={formCard.refCallback}
              style={{ height: syncedHeight || "auto" }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 transition-opacity group-hover:opacity-75"></div>

              <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 h-full overflow-y-auto shadow-xl">
                <RaffleForm />
              </div>
            </div>

          </div>




          {/* Countdown - Centered */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Faltam apenas
            </h3>
            <CountdownTimer targetDate={raffleDate} />
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>Sorteio válido até 28 de Novembro de 2025</p>
            <p className="mt-2">Temperare - Sua Cozinha Sempre Profissional</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
