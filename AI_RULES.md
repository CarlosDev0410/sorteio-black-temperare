# Product Requirements Document (PRD) - Sorteio Black Friday Temperare

## 1. Visão Geral do Projeto
Landing Page promocional para a campanha de Black Friday da Temperare. O objetivo é captar leads qualificados através de um sorteio de 2 Liquidificadores Blender Profissionais. O sistema gerencia inscrições, valida dados e bloqueia novos registros automaticamente após o prazo.

## 2. Stack Tecnológica

### Frontend
- **Framework:** React 18+ (Vite)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (Design System personalizado com tema Dark/Neon)
- **Ícones:** Lucide React
- **Gerenciamento de Estado:** React Hooks (useState, useEffect)
- **Validação de Formulário:** Zod
- **Roteamento:** React Router DOM (SPA)

### Backend (BaaS)
- **Plataforma:** Supabase
- **Banco de Dados:** PostgreSQL
- **Autenticação/API:** Supabase JS Client
- **Segurança:** Row Level Security (RLS)

### Infraestrutura
- **Hospedagem:** Vercel
- **CDN:** Vercel Edge Network

## 3. Arquitetura e Estrutura de Pastas

```
src/
├── integrations/
│   └── supabase/       # Configuração do cliente Supabase
├── react-app/
│   ├── components/     # Componentes reutilizáveis (Modal, Form, Timer)
│   ├── hooks/          # Hooks personalizados (useCountdown)
│   ├── pages/          # Páginas da aplicação (Home)
│   └── index.css       # Estilos globais e diretivas Tailwind
└── shared/
    └── types.ts        # Definições de tipos TypeScript e Schemas Zod
```

## 4. Lógica de Negócio e Componentes Chave

### 4.1. Formulário de Sorteio (`RaffleForm.tsx`)
O formulário é o núcleo da aplicação, implementado como um "Wizard" de 3 etapas para melhorar a UX e taxa de conversão.

- **Máquina de Estado:** Controla a etapa atual (`currentStep`) e a visibilidade de inputs condicionais.
- **Etapas:**
    1.  **Perfil:** Identificação básica (Área de atuação, Já é cliente, Origem).
    2.  **Pesquisa:** Dados de marketing (Produto buscado, Intenção de negócio, Feedback).
    3.  **Cadastro:** Dados sensíveis (Nome, Email, Telefone, Aceite de marketing).
- **Lógica Condicional:**
    - Seleção de "Outro" em *Como conheceu* e *Área de atuação* revela um input de texto livre.
- **Validação:**
    - Realizada a cada transição de etapa via função `validateStep`.
    - Schema Zod rigoroso em `types.ts` garante integridade dos dados antes do envio.
    - **Regra Crítica:** Todos os campos são obrigatórios, exceto "Feedback".

### 4.2. Contagem Regressiva e Bloqueio (`useCountdown.ts` & `Home.tsx`)
- **Hook `useCountdown`:** Calcula o tempo restante até `2025-11-28T13:00:00`.
- **Bloqueio Automático:**
    - Quando o contador chega a zero, a variável de estado `isExpired` torna-se `true`.
    - O componente `RegistrationClosed` substitui o formulário.
    - O botão "Participe Agora" no header é ocultado.

### 4.3. Segurança (RLS)
A segurança não depende apenas do frontend. Uma política RLS no Supabase impede inserções fora do prazo:
```sql
create policy "Permitir inscricao apenas dentro do prazo"
on "public"."raffle_entries"
for insert
to anon
with check (now() < '2025-11-28 13:00:00-03');
```

## 5. Modelo de Dados (`raffle_entries`)

| Coluna | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | uuid | Sim | Chave primária (gerada automaticamente) |
| `created_at` | timestamptz | Sim | Data de criação |
| `name` | text | Sim | Nome completo do participante |
| `email` | text | Sim | E-mail para contato |
| `contact` | text | Sim | Telefone com DDD (validado no front) |
| `area_of_expertise` | text | Sim | Área de atuação (ex: Gastronomia) |
| `is_client` | text | Sim | Se já é cliente (Sim/Não) |
| `how_they_found_us` | text | Sim | Origem do lead (Instagram, Google, etc.) |
| `current_product_search`| text | Sim | Produto que o lead busca no momento |
| `business_intent` | text | Sim | Se pretende abrir/expandir negócio (Sim/Não) |
| `accepts_marketing` | boolean | Sim | Opt-in para comunicações futuras |
| `feedback` | text | Não | Campo aberto para opiniões |
| `raffle_number` | int8 | Sim | Número da sorte (gerado por sequence/function no banco) |

## 6. Design System e UI/UX

- **Paleta de Cores:**
    - Primária: Vermelho Neon (`#dc2626` a `#ef4444`)
    - Fundo: Gradiente Dark (`slate-900` -> `black`)
    - Texto: Branco e Cinza (`gray-300`, `gray-400`)
- **Estilo Visual:** Glassmorphism (fundos translúcidos com blur), bordas sutis, sombras coloridas (glow).
- **Responsividade:** Layout adaptativo (Mobile First). O formulário e a imagem lateral se ajustam via Grid/Flexbox.

## 7. Variáveis de Ambiente

O projeto requer as seguintes variáveis no arquivo `.env` (local) ou nas configurações da Vercel:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

## 8. Comandos Úteis

- `npm run dev`: Inicia servidor de desenvolvimento.
- `npm run build`: Gera build de produção.
- `npm run preview`: Visualiza o build localmente.