"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MAX_MESSAGES = 50;

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Olá! Eu sou o assistente do CloudNest. Como posso ajudar você hoje?',
  timestamp: Date.now()
};

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (messages.length >= MAX_MESSAGES) {
      setError("Limite de mensagens atingido. Por favor, limpe o histórico para continuar.");
      return;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.generated_text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-[#334766]">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assistente CloudNest</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pergunte qualquer coisa sobre seus arquivos e documentos</p>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Limpar Chat
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex flex-col gap-4 min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex flex-col max-w-[80%] rounded-xl p-4 ${
                message.role === 'user'
                  ? 'bg-brand text-white dark:bg-[#FFB5C5] ml-4'
                  : 'bg-white dark:bg-[#3D547A] dark:text-white mr-4 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className={`text-xs mt-2 ${
                message.role === 'user' 
                  ? 'text-white/80' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-lg border p-3 bg-white dark:bg-[#3D547A] dark:text-white dark:border-[#4A6491] focus:outline-none focus:ring-2 focus:ring-brand dark:focus:ring-[#FFB5C5]"
          disabled={loading || messages.length >= MAX_MESSAGES}
        />
        <button
          type="submit"
          disabled={loading || messages.length >= MAX_MESSAGES}
          className="px-6 rounded-lg bg-brand text-white dark:bg-[#FFB5C5] disabled:opacity-50 hover:bg-brand/90 dark:hover:bg-[#FFB5C5]/90 transition-colors"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {/* Message Counter */}
      {messages.length > 1 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {messages.length - 1} / {MAX_MESSAGES} mensagens
        </p>
      )}
    </div>
  );
};

export default ChatComponent; 