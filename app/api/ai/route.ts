import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt não fornecido" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('Chave da API não configurada');
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
          use_cache: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Erro na API do Hugging Face: ${response.status} ${response.statusText}`;
      console.error('Erro detalhado:', errorData);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data || !data[0]?.generated_text) {
      return NextResponse.json(
        { error: "Resposta inválida da API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ generated_text: data[0].generated_text });

  } catch (error) {
    console.error('Erro no servidor:', error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 