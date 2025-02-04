# CloudNest - Modern Storage Management Solution

<div align="center">
  <br />
    <img 
      src="https://raw.githubusercontent.com/heryckmp/CloudNest/main/public/assets/images/cloudnest-banner.png" 
      alt="CloudNest - Modern Storage Management Solution"
      style="width: 100%; max-width: 1200px; border-radius: 10px;"
    />
  <br />

  <div>
     <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
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
8. 🤖 [Assistente AI](#assistente-ai)
9. 🔄 [Atualizações Recentes](#atualizações-recentes)

## 🚀 Introdução

CloudNest é uma plataforma de gerenciamento de armazenamento e compartilhamento de arquivos de última geração que revoluciona a forma como os usuários interagem com seu conteúdo digital. Construída com as mais recentes tecnologias web, oferece uma experiência segura, intuitiva e sem complicações para gerenciar e compartilhar arquivos na nuvem.

## ⚙️ Tecnologias

- **Frontend**: React 19 com Next.js 15
- **Backend**: Appwrite Cloud
- **Estilização**: TailwindCSS com ShadCN
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: React Context API
- **Autenticação**: Appwrite Auth

## 🔋 Funcionalidades

- **Gerenciamento Inteligente de Arquivos**
  - Organização avançada com categorização inteligente
  - Suporte a operações em lote
  - Histórico de versões

- **Segurança Aprimorada**
  - Criptografia ponta a ponta para arquivos sensíveis
  - Autenticação de dois fatores
  - Controles granulares de permissão

- **Interface Moderna**
  - Suporte a tema claro/escuro
  - Design responsivo para todos os dispositivos
  - Interface intuitiva com arrastar e soltar

- **Busca Inteligente**
  - Capacidade de busca em texto completo
  - Indexação de conteúdo de arquivos
  - Opções avançadas de filtro

- **Colaboração em Tempo Real**
  - Compartilhamento de arquivos com permissões personalizáveis
  - Suporte a espaço de trabalho em equipe
  - Rastreamento de atividades e notificações

## 🌟 Inovações

CloudNest introduz várias características inovadoras que o destacam:

1. **Otimização Inteligente de Armazenamento**
   - Detecção automática de duplicatas
   - Algoritmos inteligentes de compressão
   - Cache preditivo

2. **Organização Baseada em IA**
   - Categorização automática de arquivos
   - Sugestões baseadas em conteúdo
   - Sistema inteligente de tags

3. **Medidas Avançadas de Segurança**
   - Criptografia de conhecimento zero
   - Integridade de arquivos verificada por blockchain
   - Detecção avançada de ameaças

## 🤸 Início Rápido

1. **Clone o repositório**
```bash
git clone https://github.com/heryckmp/cloudnest.git
cd cloudnest
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT=""
NEXT_PUBLIC_APPWRITE_DATABASE=""
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=""
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=""
NEXT_PUBLIC_APPWRITE_BUCKET=""
NEXT_APPWRITE_KEY=""
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 🎨 Sistema de Design

CloudNest possui um sistema de design abrangente que garante consistência e acessibilidade:

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

## 🤖 Assistente AI

O CloudNest agora inclui um assistente AI integrado que oferece:

- **Chat Interativo**: Interface de chat amigável para interação com IA
- **Modelo Avançado**: Integração com o modelo BlenderBot da Hugging Face
- **Respostas Contextuais**: Respostas inteligentes baseadas no contexto da conversa
- **Tratamento de Erros**: Sistema robusto de tratamento de erros e feedback ao usuário
- **Interface Responsiva**: Design adaptativo que funciona em qualquer dispositivo

Para usar o assistente AI:
1. Navegue até a seção AI Assistant
2. Digite sua mensagem na caixa de texto
3. Aguarde a resposta do assistente
4. Continue a conversa naturalmente

## 🔄 Atualizações Recentes

### Versão 0.2.0 (Fevereiro 2024)

1. **Novo Assistente AI**
   - Implementação do chat com IA usando Hugging Face
   - Interface de usuário moderna e responsiva
   - Sistema de tratamento de erros aprimorado

2. **Melhorias na Interface**
   - Novos ícones animados para tipos de arquivo
   - Efeitos hover aprimorados nos cards
   - Correções no tema escuro

3. **Otimizações Técnicas**
   - Migração para App Router do Next.js
   - Melhor tratamento de erros na API
   - Correções de tipagem TypeScript

4. **Segurança**
   - Implementação segura de variáveis de ambiente
   - Melhor proteção das chaves de API
   - Validação aprimorada de requisições

---

<div align="center">
  <h3>Desenvolvedor</h3>
  <a href="https://github.com/heryckmp">GitHub</a>
</div>