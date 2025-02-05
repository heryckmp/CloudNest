import { Metadata } from "next";
import ChatComponent from '@/components/ChatComponent';

export const metadata: Metadata = {
  title: "Assistente IA - CloudNest",
  description: "Assistente de IA para ajudar com seus arquivos e documentos",
};

export default function AIChat() {
  return (
    <div className="min-h-screen p-4 bg-white dark:bg-[#2A3B53]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-dark-100 dark:text-white">Assistente IA</h1>
        <ChatComponent />
      </div>
    </div>
  );
} 