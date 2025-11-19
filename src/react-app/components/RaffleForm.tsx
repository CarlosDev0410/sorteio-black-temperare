import { useState } from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { ZodError } from "zod";
import { RaffleEntrySchema, type RaffleEntry } from "@/shared/types";
import { supabase } from "@/integrations/supabase/client";

export default function RaffleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<RaffleEntry>>({
    name: "",
    contact: "",
    area_of_expertise: "",
    email: "",
    is_client: "",
    how_they_found_us: "",
    desired_product: "",
    feedback: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const { error: insertError } = await supabase
      .from("raffle_entries")
      .insert([formData]);

    setIsLoading(false);

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        setError("Este número de telefone já foi cadastrado.");
      } else {
        setError("Ocorreu um erro ao registrar sua participação. Tente novamente.");
      }
      return;
    }
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="relative group h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all"></div>
        <div className="relative bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 h-full flex flex-col justify-center text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 mx-auto">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Participação Confirmada!
          </h3>
          <p className="text-gray-400">
            Seus dados foram registrados. Boa sorte no sorteio!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all"></div>
      <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Inscreva-se e Concorra!</h3>
        <p className="text-gray-400 text-center mb-6">Preencha seus dados para participar.</p>
        
        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 max-h-[450px]">
          {/* Required Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Seu nome" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefone (com DDD) *</label>
            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Área de Atuação *</label>
            <select name="area_of_expertise" value={formData.area_of_expertise} onChange={handleChange} required className="input-field">
              <option value="">Selecione sua área</option>
              <option value="Gastronomia Profissional">Gastronomia Profissional</option>
              <option value="Chef/Cozinheiro">Chef/Cozinheiro</option>
              <option value="Nutrição">Nutrição</option>
              <option value="Confeitaria">Confeitaria</option>
              <option value="Outros">Outros</option>
              <option value="Não trabalho no ramo">Não trabalho no ramo</option>
            </select>
          </div>

          {/* Optional Fields */}
          <hr className="border-gray-700 my-4" />
          <p className="text-center text-gray-400 text-sm -mt-2 mb-2">Campos Opcionais</p>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Você já é cliente da Temperare?</label>
            <select name="is_client" value={formData.is_client} onChange={handleChange} className="input-field">
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Como conheceu a Temperare?</label>
            <select name="how_they_found_us" value={formData.how_they_found_us} onChange={handleChange} className="input-field">
                <option value="">Selecione</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Indicação">Indicação de amigo</option>
                <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Qual produto você mais deseja?</label>
            <input type="text" name="desired_product" value={formData.desired_product} onChange={handleChange} placeholder="Ex: Liquidificador, Forno" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deixe sua opinião sobre a Temperare</label>
            <textarea name="feedback" value={formData.feedback} onChange={handleChange} rows={2} placeholder="Sua mensagem..." className="input-field"></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-primary mt-4">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "QUERO PARTICIPAR!"}
          </button>

          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-center text-yellow-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <span className="font-bold">ATENÇÃO:</span> A validação do ganhador será feita exclusivamente por telefone. Cadastros com número incorreto, inexistente ou que não atendam a ligação serão desclassificados automaticamente.
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background-image: linear-gradient(to right, #8B5CF6, #EC4899);
          color: white;
          font-weight: bold;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          transform: scale(1);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
        }
        .btn-primary:hover {
          background-image: linear-gradient(to right, #7C3AED, #D946EF);
          transform: scale(1.02);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: rgba(17, 24, 39, 0.5);
          border: 1px solid #4B5563;
          border-radius: 0.75rem;
          color: white;
          placeholder-color: #6B7280;
          transition: all 0.3s;
        }
        .input-field:focus {
          outline: none;
          box-shadow: 0 0 0 2px #8B5CF6;
          border-color: transparent;
        }
        /* Custom scrollbar for the form */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </div>
  );
}