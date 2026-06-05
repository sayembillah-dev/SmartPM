import { NextRequest } from "next/server";
import { heavyClient, isAzureConfigured } from "@/lib/azure-openai";

export const runtime = "nodejs";

interface ExplainPayload {
  selectedText: string;
  aiResponse: string;
  userPrompt: string;
  mode: "explain" | "define";
}

export async function POST(req: NextRequest) {
  if (!isAzureConfigured()) {
    return Response.json({ error: "Azure OpenAI not configured." }, { status: 503 });
  }

  let body: ExplainPayload;
  try {
    body = (await req.json()) as ExplainPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { selectedText, aiResponse, userPrompt, mode } = body;

  const systemPrompt =
    mode === "explain"
      ? `You are a friendly PM coach. The user is reading an AI project management response and highlighted a phrase. Explain what it means in 1–3 plain sentences that anyone can understand. Use real-world PM context. Be warm and conversational. No bullet points — just clear prose.`
      : `You are a PM terminology expert. The user highlighted a term or phrase in an AI project management response. Give a clear, concise definition in 1–2 sentences grounded in real Agile/Scrum/PM practice. Make it easy for a non-expert to understand. No bullet points — just clear prose.`;

  const userMessage = `User asked the AI: "${userPrompt || "(no context)"}"
AI responded: "${aiResponse.slice(0, 600)}${aiResponse.length > 600 ? "…" : ""}"

Selected text: "${selectedText}"

${mode === "explain" ? "Explain" : "Define"} the selected text.`;

  try {
    const client = heavyClient();
    const stream = await client.chat.completions.create({
      model: "",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
      temperature: 0.4,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) send({ type: "text", delta });
          }
          send({ type: "done" });
          controller.close();
        } catch (e) {
          const message = e instanceof Error ? e.message : "Stream failed.";
          send({ type: "error", message });
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
