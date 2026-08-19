import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, image } = body;

  if (!text?.trim() && !image) {
    return NextResponse.json(
      { error: "Envie um texto ou uma imagem para verificar." },
      { status: 400 }
    );
  }

  const systemPrompt = `Você é um fact-checker especializado. Use a ferramenta de busca para pesquisar informações confiáveis e verificar a veracidade da afirmação ou imagem enviada.

Ao analisar imagens:
- Leia todo o texto visível na imagem
- Identifique o contexto visual (local, data, pessoas, eventos)
- Verifique se a imagem pode ser uma montagem ou estar fora de contexto
- Busque informações sobre o conteúdo mostrado

Responda APENAS com um JSON válido, sem blocos de código, sem texto extra:
{
  "verdict": "verdadeiro" | "falso" | "parcialmente verdadeiro" | "não verificável",
  "analysis": "Explicação clara em 2-4 frases em português sobre o que foi verificado e por quê chegou a esse veredito.",
  "sources": ["Fonte ou contexto 1", "Fonte ou contexto 2"]
}

Seja objetivo, preciso e baseado em fatos. Se a busca não retornar resultados claros, use "não verificável".`;

  try {
    // Monta o conteúdo da mensagem
    type ContentBlock =
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

    const userContent: ContentBlock[] = [];

    // Adiciona imagem se existir
    if (image) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        userContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: matches[1],
            data: matches[2],
          },
        });
      }
    }

    // Adiciona texto
    const textContent = text?.trim()
      ? `Verifique a veracidade desta afirmação: "${text}"`
      : "Analise esta imagem e verifique a veracidade do conteúdo mostrado.";

    userContent.push({ type: "text", text: textContent });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ type: "web_search_20250305", name: "web_search" }] as any,
      messages: [{ role: "user", content: userContent as any }],
    });

    const textResponse = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const clean = textResponse.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente." },
      { status: 500 }
    );
  }
}
