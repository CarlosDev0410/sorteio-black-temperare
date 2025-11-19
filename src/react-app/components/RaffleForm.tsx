import { useState, useEffect } from "react";
import { Loader2, Check, Mail, KeyRound } from "lucide-react";
import { ZodError } from "zod";
import { EmailSchema, RaffleEntryDetailsSchema, type RaffleEntryDetails } from "@/shared/types";
import { supabase } from "@/integrations/supabase/client";

type Step = "email" | "otp" | "details" | "success";

export default function RaffleForm() {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState<RaffleEntryDetails>({
    name: "",
    contact: "",
    area_of_expertise: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoading(true);
        const { data: existingEntry } = await supabase
          .from("participantes")
          .select("id")
          .eq("id", session.user.id)
          .single();
        
        if (existingEntry) {
          setStep("success");
        } else {
          setEmail(session.user.email || "");
          setStep("details");
        }
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      EmailSchema.parse({ email });
    } catch (err) {
      if (err instanceof ZodError) setError(err.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    setIsLoading(false);

    if (signInError) {
      setError("Não foi possível enviar o código. Tente novamente.");
      return;
    }
    setStep("otp");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token || token.length < 6) {
      setError("Por favor, insira um código válido.");
      return;
    }

    setIsLoading(true);
    const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setIsLoading(false);

    if (verifyError || !session) {
      setError("Código inválido ou expirado. Tente novamente.");
      return;
    }
    
    // Check if user already participated
    setIsLoading(true);
    const { data: existingEntry } = await supabase
      .from("participantes")
      .select("id")
      .eq("id", session.user.id)
      .single();
    setIsLoading(false);

    if (existingEntry) {
      setStep("success");
    } else {
      setStep("details");
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      RaffleEntryDetailsSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) setError(err.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão inválida. Por favor, comece novamente.");
      setStep("email");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("participantes")
      .insert([{ ...formData, id: user.id }]);
    setIsLoading(false);

    if (insertError) {
      setError("Ocorreu um erro ao salvar seus dados. Tente novamente.");
      return;
    }
    setStep("success");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderContent = () => {
    if (isLoading && step !== 'success') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
        </div>
      );
    }

    switch (step) {
      case "success":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Inscrição Confirmada!
            </h3>
            <p className="text-gray-400">
              Você já está participando do sorteio. Boa sorte!
            </p>
          </div>
        );
      
      case "otp":
        return (
          <>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Verifique seu E-mail</h3>
            <p className="text-gray-400 text-center mb-6">
              Enviamos um código de 6 dígitos para <span className="font-bold text-purple-300">{email}</span>.
            </p>
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Código de Verificação</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  maxLength={6}
                  placeholder="_ _ _ _ _ _"
                  className="w-full text-center tracking-[1em] px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verificar e Continuar"}
              </button>
              <button onClick={() => setStep('email')} type="button" className="w-full text-sm text-purple-400 hover:text-purple-300">
                Usar outro e-mail
              </button>
            </form>
          </>
        );

      case "details":
        return (
          <>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Complete seu Cadastro</h3>
            <p className="text-gray-400 text-center mb-6">Falta pouco! Preencha seus dados para participar.</p>
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Seu nome" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contato (com DDD)</label>
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Área de Atuação</label>
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
              <button type="submit" disabled={isLoading} className="w-full btn-primary">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "QUERO PARTICIPAR!"}
              </button>
            </form>
          </>
        );

      case "email":
      default:
        return (
          <>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Inscreva-se e Concorra!</h3>
            <p className="text-gray-400 text-center mb-6">Use seu melhor e-mail para participar.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" className="input-field" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continuar"}
              </button>
            </form>
          </>
        );
    }
  };

  return (
    <div className="relative group h-full">
      <div className={`absolute inset-0 bg-gradient-to-r ${step === 'success' ? 'from-green-600 to-emerald-600' : 'from-purple-600 to-pink-600'} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all`}></div>
      <div className={`relative bg-black/80 backdrop-blur-sm border ${step === 'success' ? 'border-green-500/30' : 'border-purple-500/30'} rounded-3xl p-8 h-full flex flex-col justify-center`}>
        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        {renderContent()}
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
      `}</style>
    </div>
  );
}