# CloudNest - Solução Moderna de Gerenciamento de Armazenamento

<div align="center">
  <br />
    <img 
      src="https://raw.githubusercontent.com/heryckmp/CloudNest/main/public/assets/images/cloudnest-banner.png" 
      alt="CloudNest - Solução Moderna de Gerenciamento de Armazenamento"
      style="width: 100%; max-width: 1200px; border-radius: 10px;"
    />
  <br />

  <div>
     <img src="https://img.shields.io/badge/-Next_JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript_5-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>
<h3 align="center">Plataforma de Próxima Geração para Compartilhamento de Arquivos</h3>

   <div align="center">
     Desenvolvido por <a href="https://github.com/heryckmp" target="_blank"><b>Erick Moreira</b></a>
    </div>
</div>

## 📋 Índice

1. 🚀 [Introdução](#introdução)
2. ⚙️ [Tecnologias](#tecnologias)
3. 🔋 [Funcionalidades](#funcionalidades)
4. 🌟 [Inovações](#inovações)
5. 🤸 [Início Rápido](#início-rápido)
6. 🎨 [Sistema de Design](#sistema-de-design)
7. 🔒 [Segurança](#segurança)
8. 🤖 [Assistente IA](#assistente-ia)
9. 🔄 [Atualizações Recentes](#atualizações-recentes)

## 🚀 Introdução

O CloudNest é uma plataforma moderna de gerenciamento e compartilhamento de arquivos que revoluciona a forma como os usuários interagem com seu conteúdo digital. Construída com as mais recentes tecnologias web, oferece uma experiência segura, intuitiva e sem complicações para gerenciar e compartilhar arquivos na nuvem.

## ⚙️ Tecnologias

- **Frontend**: 
  - Next.js 15 com App Router
  - React 19
  - TypeScript 5
- **Backend**: 
  - Appwrite Cloud
  - API de IA Hugging Face
- **Estilização**: 
  - TailwindCSS 3.4
  - ShadcnUI
  - Radix UI
- **Gerenciamento de Estado**: 
  - React Context API
  - Server Actions
- **Visualização de Dados**:
  - Recharts
- **Autenticação**: 
  - Appwrite Auth com OTP

## 🔋 Funcionalidades

- **Gerenciamento Inteligente de Arquivos**
  - Organização automática por tipo de arquivo
  - Cálculo de armazenamento total por categoria
  - Visualização de uso de espaço em tempo real
  - Suporte a múltiplos formatos de arquivo

- **Interface Moderna**
  - Design responsivo mobile-first
  - Tema claro/escuro automático
  - Animações suaves e feedback visual
  - Painel interativo com gráficos

- **Busca Avançada**
  - Pesquisa em tempo real
  - Filtros por tipo de arquivo
  - Ordenação personalizada
  - Visualização prévia de resultados

- **Gerenciamento de Arquivos**
  - Upload com arrastar e soltar
  - Renomeação de arquivos
  - Compartilhamento seguro
  - Download direto
  - Visualização de detalhes

## 🌟 Inovações

O CloudNest apresenta várias características inovadoras:

1. **Otimização Inteligente de Armazenamento**
   - Monitoramento de uso em tempo real
   - Gráficos interativos de utilização
   - Análise de tendências de uso

2. **Organização Baseada em IA**
   - Assistente de IA integrado
   - Respostas contextuais
   - Sugestões inteligentes

3. **Medidas Avançadas de Segurança**
   - Autenticação OTP
   - Proteção contra uploads maliciosos
   - Controle granular de permissões

## 🤸 Início Rápido

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9 ou superior)
- Conta no Appwrite Cloud
- Credenciais do projeto Appwrite

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/heryckmp/CloudNest.git
cd CloudNest
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
   
Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Configurações públicas (client-side)
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT="sua_project_id_aqui"
NEXT_PUBLIC_APPWRITE_DATABASE="sua_database_id_aqui"
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION="sua_collection_id_usuarios"
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION="sua_collection_id_arquivos"
NEXT_PUBLIC_APPWRITE_BUCKET="sua_bucket_id_aqui"

# Chave secreta (server-side apenas)
NEXT_APPWRITE_KEY="sua_api_key_secreta_aqui"
```

4. **Obtenha as credenciais do Appwrite**

Siga estes passos para conseguir os valores:

- **Endpoint**: Já pré-configurado (não altere)
- **Project ID**: Painel do Appwrite → Configurações → Geral
- **Database ID**: Appwrite → Bancos de Dados → Seu Banco → Configurações
- **Collection IDs**: Dentro do Banco de Dados, clique em cada coleção → Configurações
- **Bucket ID**: Appwrite → Armazenamento → Seu Bucket → Configurações
- **API Key**: Appwrite → Visão Geral → Chaves de API → Criar Chave de API
  - Selecione escopos: users.read, users.write, files.read, files.write

5. **Inicie o servidor**
```bash
npm run dev
```

6. Acesse: `http://localhost:3000`

### 💡 Dicas Importantes

- Nunca faça commit de suas credenciais! O arquivo `.env.local` já está no `.gitignore` por padrão
- Para ambientes de produção, use variáveis de ambiente no seu serviço de hospedagem
- Em caso de erros de permissão, verifique os escopos da Chave de API no Appwrite

## 🎨 Sistema de Design

O CloudNest possui um sistema de design abrangente que garante consistência e acessibilidade:

- **Paleta de Cores**: Cores cuidadosamente selecionadas para temas claro e escuro
- **Tipografia**: Hierarquia de fontes moderna e legível
- **Componentes**: Componentes de UI reutilizáveis e acessíveis
- **Animações**: Design de movimento suave e proposital

## 🔒 Segurança

A segurança está no núcleo da arquitetura do CloudNest:

- Criptografia ponta a ponta
- Auditorias regulares de segurança
- Conformidade com LGPD
- Protocolos seguros de compartilhamento de arquivos
- Controle avançado de acesso

## 🤖 Assistente IA

O CloudNest agora inclui um assistente de IA integrado que oferece:

- **Chat Interativo**: Interface amigável para interação com IA
- **Modelo Avançado**: Integração com o modelo BlenderBot da Hugging Face
- **Respostas Contextuais**: Respostas inteligentes baseadas no contexto da conversa
- **Tratamento de Erros**: Sistema robusto de tratamento de erros e feedback ao usuário
- **Interface Responsiva**: Design adaptativo para qualquer dispositivo

Para usar o assistente IA:
1. Navegue até a seção Assistente IA
2. Digite sua mensagem na caixa de texto
3. Aguarde a resposta do assistente
4. Continue a conversa naturalmente

## 🔄 Atualizações Recentes

### Versão 0.3.0 (Março 2024)

1. **Melhorias no Painel**
   - Novo gráfico de armazenamento com Recharts
   - Visualização de atividade do usuário
   - Cálculo de espaço usado por categoria

2. **Interface Aprimorada**
   - Novo tema escuro otimizado
   - Ícones animados para tipos de arquivo
   - Menu de ações com três pontos
   - Botão de logout com texto responsivo

3. **Funcionalidades de Arquivo**
   - Visualização prévia de imagens melhorada
   - Suporte a mais tipos de arquivo
   - Ordenação avançada de arquivos
   - Busca em tempo real aprimorada

4. **Segurança e Desempenho**
   - Autenticação OTP implementada
   - Melhor tratamento de erros
   - Otimização de carregamento
   - Feedback visual aprimorado

---

<div align="center">
  <h3>Desenvolvedor</h3>
  <a href="https://github.com/heryckmp">GitHub</a>
</div>