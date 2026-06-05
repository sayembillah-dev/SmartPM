import { NextRequest } from "next/server";
import { heavyClient, isAzureConfigured } from "@/lib/azure-openai";
import { summarySystemPrompt, type SprintContext } from "@/lib/prompts";

export const runtime = "nodejs";

interface SummaryPayload {
  context: SprintContext;
}

export async function POST(req: NextRequest) {
  if (!isAzureConfigured()) {
    return Response.json(
      { error: "Azure OpenAI is not configured. Set AZURE_OPENAI_API_KEY and related env vars in .env.local." },
      { status: 503 }
    );
  }

  let body: SummaryPayload;
  try {
    body = (await req.json()) as SummaryPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const client = heavyClient();

  try {
    const completion = await client.chat.completions.create({
      model: "",
      messages: [
        { role: "system", content: summarySystemPrompt(body.context) },
        { role: "user", content: "Generate the sprint summary report now." },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    return new Response(content, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Azure OpenAI request failed.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
