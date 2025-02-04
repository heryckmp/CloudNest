"use client";

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SimpleChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: input }),
      });

      const data = await response.json();
      
      // Adiciona resposta do assistente
      const assistantMessage = {
        role: 'assistant',
        content: Array.isArray(data) ? data[0].generated_text : data.generated_text
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.'
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-[#334766]">
      <div className="flex flex-col gap-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.role === 'user'
                  ? 'bg-[#3B82F6] text-white dark:bg-[#FFB5C5]'
                  : 'bg-gray-100 dark:bg-[#3D547A] dark:text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-lg border p-2 dark:bg-[#3D547A] dark:text-white dark:border-[#4A6491]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#3B82F6] px-4 py-2 text-white dark:bg-[#FFB5C5] disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default SimpleChatComponent; 