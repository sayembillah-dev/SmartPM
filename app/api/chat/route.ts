import { NextRequest } from "next/server";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";
import { heavyClient, isAzureConfigured } from "@/lib/azure-openai";
import { chatSystemPrompt, type SprintContext } from "@/lib/prompts";
import { TOOL_DEFS, isToolName } from "@/lib/chat-tools";
import type { ChatMessage, ToolCallProposal } from "@/types";

export const runtime = "nodejs";

interface ChatPayload {
  messages: ChatMessage[];
  context: SprintContext;
}

function toOpenAIMessages(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  const out: ChatCompletionMessageParam[] = [];
  for (const m of messages) {
    if (m.role === "user") {
      out.push({ role: "user", content: m.content });
      continue;
    }
    const resolved = (m.toolCalls ?? []).filter((tc) => tc.status !== "pending");
    if (resolved.length > 0) {
      out.push({
        role: "assistant",
        content: m.content || null,
        tool_calls: resolved.map<ChatCompletionMessageToolCall>((tc) => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: JSON.stringify(tc.args) },
        })),
      });
      for (const tc of resolved) {
        out.push({
          role: "tool",
          tool_call_id: tc.id,
          content: tc.result ?? `{"status":"${tc.status}"}`,
        });
      }
    } else if (m.content) {
      out.push({ role: "assistant", content: m.content });
    }
  }
  return out;
}

export async function POST(req: NextRequest) {
  if (!isAzureConfigured()) {
    return Response.json(
      { error: "Azure OpenAI is not configured. Set AZURE_OPENAI_API_KEY and related env vars in .env.local." },
      { status: 503 }
    );
  }

  let body: ChatPayload;
  try {
    body = (await req.json()) as ChatPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.messages?.length) {
    return Response.json({ error: "messages array is required." }, { status: 400 });
  }

  const client = heavyClient();

  try {
    const stream = await client.chat.completions.create({
      model: "",
      messages: [
        { role: "system", content: chatSystemPrompt(body.context) },
        ...toOpenAIMessages(body.messages),
      ],
      tools: TOOL_DEFS,
      tool_choice: "auto",
      stream: true,
      temperature: 0.4,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        const partial = new Map<number, { id?: string; name?: string; args: string }>();

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta;
            if (!delta) continue;

            if (typeof delta.content === "string" && delta.content.length > 0) {
              send({ type: "text", delta: delta.content });
            }

            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const slot = partial.get(tc.index) ?? { args: "" };
                if (tc.id) slot.id = tc.id;
                if (tc.function?.name) slot.name = tc.function.name;
                if (tc.function?.arguments) slot.args += tc.function.arguments;
                partial.set(tc.index, slot);
              }
            }
          }

          for (const slot of partial.values()) {
            if (!slot.id || !slot.name || !isToolName(slot.name)) continue;
            let parsed: Record<string, unknown> = {};
            try {
              parsed = slot.args ? (JSON.parse(slot.args) as Record<string, unknown>) : {};
            } catch {
              // Skip malformed tool call rather than crashing the stream.
              continue;
            }
            const proposal: ToolCallProposal = {
              id: slot.id,
              name: slot.name,
              args: parsed,
              status: "pending",
            };
            send({ type: "tool_call", call: proposal });
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
    const msg = e instanceof Error ? e.message : "Azure OpenAI request failed.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
