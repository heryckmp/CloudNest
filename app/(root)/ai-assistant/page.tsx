import { Metadata } from "next";
import ChatComponent from '@/components/ChatComponent';

export const metadata: Metadata = {
  title: "Assistente IA - CloudNest",
  description: "Assistente de IA para ajudar com seus arquivos e documentos",
};

const AIAssistantPage = () => {
  return (
    <div className="main-content">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="h1 text-dark-100 dark:text-white">Assistente IA</h1>
          <p className="body-1 mt-2 text-light-100">
            Use o assistente para ajudar com seus arquivos e documentos
          </p>
        </div>
        
        <ChatComponent />
      </div>
    </div>
  );
}

export default AIAssistantPage; 