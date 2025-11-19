import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import type { RaffleEntry } from "@/shared/types";

export default function RaffleForm() {
  const [formData, setFormData] = useState<RaffleEntry>({
    name: "",
    email: "",
    contact: "",
    area_of_expertise: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/raffle/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          contact: "",
          area_of_expertise: "",
        });
      } else {
        setError(data.error || "Erro ao enviar inscrição");
      }
    } catch (err) {
      setError("Erro ao enviar inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSuccess) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Inscrição Realizada!
          </h3>
          <p className="text-gray-400">
            Você está participando do sorteio. Boa sorte!
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-6 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Fazer outra inscrição
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
      <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 h-full flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">
          Inscreva-se e Concorra!
        </h3>
        <p className="text-gray-400 text-center mb-6">
          Preencha seus dados para participar do sorteio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-center">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Seu nome"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contato (com DDD)
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Área de Atuação
            </label>
            <select
              name="area_of_expertise"
              value={formData.area_of_expertise}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Selecione sua área</option>
              <option value="Gastronomia Profissional">
                Gastronomia Profissional
              </option>
              <option value="Chef/Cozinheiro">Chef/Cozinheiro</option>
              <option value="Nutrição">Nutrição</option>
              <option value="Confeitaria">Confeitaria</option>
              <option value="Outros">Outros</option>
              <option value="Não trabalho no ramo">
                Não trabalho no ramo
              </option>
            </select>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </span>
            ) : (
              "QUERO PARTICIPAR!"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
