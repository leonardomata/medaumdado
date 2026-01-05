# Me Dá um Dado! 📊

Plataforma SaaS completa para centralizar dados de marketing, mídia paga, orgânico, social, CRM e canais personalizados, gerando dashboards automáticos por empresa, canal e ferramenta.

## 🚀 Características

### ✨ Principais Funcionalidades

- **Multi-empresa (Multi-tenant)**: Gerencie uma ou mais empresas em uma única conta
- **Importação de Dados Flexível**:
  - Google Sheets (link ou dados copiados)
  - Upload de Excel / CSV
  - Texto colado (formato CSV com detecção automática de delimitador)
- **Dashboards Automáticos**:
  - Visão geral com métricas principais
  - Gráficos de evolução temporal
  - Performance por canal e ferramenta
  - Funil de conversão completo
- **Sistema de Filtros**: Filtre por empresa, período, canal e ferramenta
- **Explorador de Dados**: Visualize todos os dados importados
- **Relatórios Personalizados**: Gere relatórios em PDF, Excel ou CSV
- **Modo Claro e Escuro**: Interface adaptável às preferências do usuário

### 📊 Métricas Suportadas

O sistema suporta mais de 20 métricas diferentes:

- **Tráfego**: Impressões, Alcance, Cliques, CTR
- **Investimento**: CPC, CPM, Investimento Total
- **Conversões**: Conversões, Custo por Conversão, Taxa de Conversão
- **Receita**: Receita, ROAS, Ticket Médio
- **Leads**: Leads, Oportunidades, Vendas
- **Engajamento**: Sessões, Usuários, Engajamento, Seguidores
- **Email Marketing**: Emails Enviados, Abertos, Clicados

### 🎯 Canais e Ferramentas

**Canais Suportados**:
- ADS (Mídia Paga)
- Orgânico
- Social Media
- CRM
- Email Marketing
- Personalizado

**Ferramentas Integradas**:
- Google Ads
- Meta Ads (Facebook/Instagram)
- GA4 (Google Analytics 4)
- Search Console
- Instagram
- TikTok
- LinkedIn
- Mailchimp
- RD Station
- Outras personalizadas

## 🏗️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (gráficos)
- **Lucide React** (ícones)

### Backend
- **Next.js API Routes**
- **NextAuth.js** (autenticação)
- **Prisma ORM**
- **PostgreSQL**

### Processamento de Dados
- **PapaParse** (CSV parsing)
- **XLSX** (Excel processing)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd medaumdado
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medaumdado?schema=public"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Execute as migrações do banco**
```bash
npm run db:push
```

5. **Gere o Prisma Client**
```bash
npm run db:generate
```

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

7. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📚 Estrutura do Projeto

```
medaumdado/
├── app/                          # Aplicação Next.js (App Router)
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login/
│   │   └── registro/
│   ├── (dashboard)/              # Rotas protegidas do dashboard
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── empresas/             # Gestão de empresas
│   │   ├── importacoes/          # Sistema de importação
│   │   ├── explorador/           # Explorador de dados
│   │   ├── relatorios/           # Relatórios
│   │   └── configuracoes/        # Configurações
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   ├── register/             # Registro de usuários
│   │   ├── empresas/             # CRUD de empresas
│   │   ├── importacoes/          # Importações
│   │   └── dashboard/            # Dados agregados
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Landing page
├── components/                   # Componentes React
│   ├── dashboard/                # Componentes do dashboard
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── metric-card.tsx
│   │   └── chart-wrapper.tsx
│   ├── ui/                       # Componentes UI reutilizáveis
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   └── providers.tsx             # Providers (Theme, Session)
├── lib/                          # Bibliotecas e utilitários
│   ├── prisma.ts                 # Cliente Prisma
│   ├── auth.ts                   # Configuração NextAuth
│   └── import-utils.ts           # Funções de processamento
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Schema do banco de dados
├── public/                       # Arquivos estáticos
├── .env                          # Variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
├── next.config.js                # Configuração do Next.js
├── package.json                  # Dependências do projeto
├── tailwind.config.ts            # Configuração do Tailwind
└── tsconfig.json                 # Configuração do TypeScript
```

## 🗄️ Banco de Dados

### Tabelas Principais

1. **usuarios**: Dados dos usuários e planos
2. **empresas**: Empresas/clientes gerenciados
3. **importacoes**: Histórico de importações
4. **mapeamento_campos**: Mapeamento de colunas nas importações
5. **dados_marketing**: Base unificada de todas as métricas

### Diagrama ER Simplificado

```
Usuario (1) ──── (*) Empresa
   │                  │
   │                  │
   └── (*) Importacao (*)
           │
           └── (*) DadosMarketing
```

## 💳 Planos

### Starter
- ✅ 1 empresa
- ✅ Até 5 ferramentas
- ✅ Dashboards básicos

### Pro
- ✅ Até 5 empresas
- ✅ Ferramentas ilimitadas
- ✅ Dashboards completos

### Agência
- ✅ Empresas ilimitadas
- ✅ Preparado para white-label
- ✅ Compartilhamento com clientes

## 🎨 Interface

- Interface SaaS moderna e responsiva
- Totalmente em **Português do Brasil**
- Modo claro e escuro
- Design system consistente
- Estados vazios com mensagens explicativas
- Feedbacks visuais em todas as ações

## 🔐 Segurança

- Autenticação via NextAuth.js
- Senhas criptografadas com bcrypt
- Proteção de rotas no servidor e cliente
- Validação de dados de entrada
- Isolamento de dados por usuário (multi-tenant)

## 📈 Fluxo de Uso

1. **Cadastro**: Crie sua conta (plano Starter gratuito)
2. **Adicione Empresa**: Cadastre sua primeira empresa
3. **Importe Dados**:
   - Escolha o método (Google Sheets, Excel, CSV ou texto)
   - Pré-visualize os dados
   - Mapeie as colunas para os campos do sistema
   - Confirme a importação
4. **Visualize Dashboards**: Acesse métricas e gráficos automáticos
5. **Explore Dados**: Use filtros para análises específicas
6. **Gere Relatórios**: Exporte relatórios personalizados

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS (Amplify, EC2)
- Google Cloud
- Azure

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
npm run db:generate  # Gera Prisma Client
npm run db:push      # Sincroniza schema com banco
npm run db:studio    # Abre Prisma Studio (GUI do banco)
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a [MIT License](LICENSE).

## 🙏 Agradecimentos

- Next.js Team
- Vercel
- Prisma Team
- Recharts
- Todos os contribuidores de código aberto

---

**Me Dá um Dado!** - Centralize seus dados de marketing e tome decisões baseadas em dados reais! 📊✨
