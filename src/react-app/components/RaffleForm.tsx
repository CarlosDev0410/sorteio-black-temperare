import { useState } from "react";
import { Loader2, Check, AlertTriangle, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { ZodError } from "zod";
import { RaffleEntrySchema, type RaffleEntry } from "@/shared/types";
import { supabase } from "@/integrations/supabase/client";

const formatPhoneNumber = (value: string): string => {
  if (!value) return "";
  const digits = value.replace(/\D/g, '').substring(0, 11);
  let formatted = '';
  if (digits.length > 0) {
    formatted = '(' + digits.substring(0, 2);
  }
  if (digits.length >= 3) {
    formatted += ') ' + digits.substring(2, 7);
  }
  if (digits.length >= 8) {
    formatted += '-' + digits.substring(7, 11);
  }
  return formatted;
};

export default function RaffleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [raffleNumber, setRaffleNumber] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showOtherAreaInput, setShowOtherAreaInput] = useState(false);
  const totalSteps = 2;

  const [formData, setFormData] = useState<Partial<RaffleEntry>>({
    name: "",
    contact: "",
    area_of_expertise: "",
    email: "",
    is_client: "",
    how_they_found_us: "",
    feedback: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "contact") {
      setFormData({ ...formData, contact: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Outro") {
      setShowOtherInput(true);
      setFormData({ ...formData, how_they_found_us: "" });
    } else {
      setShowOtherInput(false);
      setFormData({ ...formData, how_they_found_us: value });
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Outros") {
      setShowOtherAreaInput(true);
      setFormData({ ...formData, area_of_expertise: "" });
    } else {
      setShowOtherAreaInput(false);
      setFormData({ ...formData, area_of_expertise: value });
    }
  };

  const validateStep = (step: number): boolean => {
    setError("");

    if (step === 1) {
      if (!formData.name || formData.name.trim() === "") {
        setError("Por favor, preencha seu nome completo.");
        return false;
      }
      if (!formData.contact || formData.contact.length < 14) {
        setError("Por favor, preencha um telefone válido com DDD.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      RaffleEntrySchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) setError(err.errors[0].message);
      setIsLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("raffle_entries")
      .insert([formData])
      .select();

    setIsLoading(false);

    if (insertError) {
      if (insertError.code === '23505') {
        setError("Este número de telefone já foi cadastrado.");
      } else {
        setError("Ocorreu um erro ao registrar sua participação. Tente novamente.");
      }
      return;
    }

    if (data && data[0] && data[0].raffle_number) {
      setRaffleNumber(data[0].raffle_number);
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="p-8 h-full flex flex-col justify-center text-center min-h-[600px]">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Participação Confirmada!
        </h3>
        {raffleNumber && (
          <div className="my-6">
            <p className="text-gray-300 mb-3 text-lg">Seu número da sorte é:</p>
            <div className="inline-block bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-1">
              <div className="bg-black rounded-xl px-8 py-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                  {raffleNumber}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">Guarde este número! Você receberá uma ligação caso seja sorteado.</p>
          </div>
        )}
        {!raffleNumber && (
          <p className="text-gray-300">
            Seus dados foram registrados. Boa sorte no sorteio!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-center min-h-[600px]">
      <h3 className="text-2xl font-bold text-white mb-2 text-center">Inscreva-se e Concorra!</h3>
      <p className="text-gray-300 text-center mb-6">Preencha o formulário para participar.</p>

      {/* Progress Indicator - Centralizado */}
      <div className="mb-6 flex flex-col items-center w-full">
        <div className="flex items-center justify-center mb-2 w-full max-w-xs mx-auto">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= step
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'bg-gray-700 text-gray-400'
                }`}>
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < totalSteps && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step ? 'bg-red-500' : 'bg-gray-700'
                  }`}></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400">
          Etapa {currentStep} de {totalSteps}
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ETAPA 1: Dados Essenciais */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-gray-400 text-center mb-4">Dados essenciais *</p>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telefone (com DDD) *</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className="input-field"
              />
            </div>

            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ATENÇÃO:</span> A validação do ganhador será feita exclusivamente por telefone. Cadastros com número incorreto, inexistente ou que não atendam a ligação serão desclassificados automaticamente.
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full btn-primary group mt-6"
            >
              <span>Próximo</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ETAPA 2: Perguntas de Marketing */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-gray-400 text-center mb-4">Perguntas adicionais (opcional)</p>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Área de Atuação *</label>
              <select
                name="area_of_expertise"
                value={showOtherAreaInput ? "Outros" : formData.area_of_expertise}
                onChange={handleAreaChange}
                className="input-field mb-2"
              >
                <option value="">Selecione sua área</option>
                <option value="Gastronomia Profissional">Gastronomia Profissional</option>
                <option value="Chef/Cozinheiro">Chef/Cozinheiro</option>
                <option value="Nutrição">Nutrição</option>
                <option value="Confeitaria">Confeitaria</option>
                <option value="Outros">Outros</option>
                <option value="Não trabalho no ramo">Não trabalho no ramo</option>
              </select>

              {showOtherAreaInput && (
                <input
                  type="text"
                  name="area_of_expertise"
                  value={formData.area_of_expertise}
                  onChange={handleChange}
                  placeholder="Digite sua área de atuação..."
                  className="input-field animate-fade-in"
                  autoFocus
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Você já é cliente da Temperare?</label>
              <select
                name="is_client"
                value={formData.is_client}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Como conheceu a Temperare?</label>
              <select
                name="how_they_found_us"
                value={showOtherInput ? "Outro" : formData.how_they_found_us}
                onChange={handleSourceChange}
                className="input-field mb-2"
              >
                <option value="">Selecione</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Indicação">Indicação de amigo</option>
                <option value="Outro">Outro</option>
              </select>

              {showOtherInput && (
                <input
                  type="text"
                  name="how_they_found_us"
                  value={formData.how_they_found_us}
                  onChange={handleChange}
                  placeholder="Digite como nos conheceu..."
                  className="input-field animate-fade-in"
                  autoFocus
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deixe sua opinião sobre a Temperare</label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={2}
                placeholder="Sua mensagem..."
                className="input-field resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 btn-secondary group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Voltar</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>PARTICIPAR!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-image: linear-gradient(to right, #dc2626, #ef4444);
          color: white;
          font-weight: bold;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          transform: scale(1);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.5);
        }
        .btn-primary:hover:not(:disabled) {
          background-image: linear-gradient(to right, #b91c1c, #dc2626);
          transform: scale(1.02);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #374151;
          color: white;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          border: 1px solid #4B5563;
        }
        .btn-secondary:hover {
          background-color: #4B5563;
          border-color: #6B7280;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #111827;
          border: 1px solid #4B5563;
          border-radius: 0.75rem;
          color: white;
          transition: all 0.3s;
        }
        .input-field:focus {
          outline: none;
          box-shadow: 0 0 0 2px #64748b;
          border-color: transparent;
        }
        .input-field::placeholder {
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}