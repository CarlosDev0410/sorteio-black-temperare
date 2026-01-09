# 🎁 Sorteio Black Friday - Temperare

Aplicação web para sorteio promocional da Black Friday da Temperare, oferecendo aos participantes a chance de ganhar 2 Liquidificadores Blender Profissionais de 1450w.

### PREVIEW
`blackfriday.lojastemperare.com.br/`

## 📋 Sobre o Projeto

Este é um projeto de landing page interativa para o sorteio da Black Friday da Temperare, desenvolvido com React e TypeScript. A aplicação permite que os usuários se inscrevam no sorteio preenchendo um formulário com suas informações, incluindo dados pessoais, área de atuação e feedback opcional sobre a marca.

### ✨ Funcionalidades Principais

- **Formulário de Inscrição**: Sistema completo de cadastro com validação de dados
- **Contador Regressivo**: Exibição em tempo real do tempo restante até o sorteio
- **Design Responsivo**: Interface totalmente adaptável para mobile e desktop
- **Validação de Dados**: Validação com Zod tanto no frontend quanto no backend
- **Prevenção de Duplicatas**: Sistema que impede múltiplas inscrições com o mesmo telefone
- **Interface Premium**: Design moderno com gradientes, efeitos de blur e animações suaves
- **Integração com Supabase**: Armazenamento seguro dos dados dos participantes

### 🎯 Informações Coletadas

**Campos Obrigatórios:**
- Nome completo
- Telefone com DDD (formatação automática)
- Área de atuação profissional

**Campos Opcionais:**
- E-mail
- Status de cliente (Sim/Não)
- Como conheceu a Temperare
- Produto desejado
- Feedback sobre a marca

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Biblioteca de ícones
- **Zod** - Validação de schemas

### Backend e Infraestrutura
- **Supabase** - Backend-as-a-Service (banco de dados e autenticação)
- **Capacitor** - Possibilidade de build para Android/iOS

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade CSS cross-browser

## 📁 Estrutura do Projeto

```
sorteio-black/
├── src/
│   ├── react-app/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── CountdownTimer.tsx
│   │   │   └── RaffleForm.tsx
│   │   ├── pages/              # Páginas da aplicação
│   │   │   └── Home.tsx
│   │   ├── hooks/              # Custom hooks
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Entry point
│   ├── integrations/           # Integrações externas
│   │   └── supabase/
│   └── shared/                 # Tipos e schemas compartilhados
├── public/                     # Arquivos estáticos
│   ├── logo.png
│   └── produto-sorteio.png
├── capacitor.config.ts         # Configuração mobile
├── tailwind.config.js          # Configuração Tailwind
└── vite.config.ts             # Configuração Vite
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou pnpm

### Instalação e Execução

```bash
# Instalar dependências
npm install
# ou
pnpm install

# Executar em modo de desenvolvimento
npm run dev
# ou
pnpm dev

# Build para produção
npm run build
# ou
pnpm build

# Verificar tipos TypeScript
npm run check
# ou
pnpm check

# Executar linting
npm run lint
# ou
pnpm lint
```

O projeto estará disponível em `http://localhost:5173`

## 🎨 Design e UX

A aplicação apresenta um design moderno e premium com:

- **Gradientes vibrantes**: Combinação de roxo, rosa e preto
- **Efeitos de blur**: Background com efeitos de profundidade
- **Animações suaves**: Transições e hover effects
- **Tipografia moderna**: Hierarquia clara e legível
- **Feedback visual**: Estados de loading, sucesso e erro
- **Responsividade**: Layout adaptável para todos os dispositivos

## 📱 Suporte Mobile

O projeto está configurado com Capacitor, permitindo builds nativos para:
- Android
- iOS

## 🔒 Segurança e Validação

- Validação de formulários no cliente com Zod
- Constraint de unicidade no banco de dados para prevenir duplicatas
- Formatação automática de telefone
- Validação de e-mail
- Mensagens de erro claras e específicas

## 📅 Informações do Sorteio

- **Data do Sorteio**: 28 de Novembro de 2025
- **Prêmio**: 2 Liquidificadores Blender Profissionais 1450w 2L com temporizador
- **Validação**: Por telefone (números inválidos são desclassificados)

## 📝 Regras de Desenvolvimento

Consulte o arquivo `AI_RULES.md` para diretrizes detalhadas de desenvolvimento, incluindo convenções de código, estrutura de arquivos e boas práticas do projeto.

## 📄 Licença

Este projeto é de propriedade da Temperare.

---

**Desenvolvido para Temperare** - Sua Cozinha Sempre Profissional
