import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY || '',
  baseURL: 'https://api.x.ai/v1',
});

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return NextResponse.json({ 
      error: "API key is missing. Please add XAI_API_KEY to your .env.local file." 
    }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array format" }, { status: 400 });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a highly intelligent, professional Market Intelligence Assistant built into the TrendKart dashboard. 
You specialize in Indian mobile accessories and electronics. You advise the shop owner (who runs a shop in Jalandhar, Punjab) 
on what products to stock, profit margins, consumer trends, and how to maximize revenue. 
Keep your responses concise, actionable, and professional. 
Format your responses using clean markdown (bolding, lists) to make it easy to scan.`
    };

    const completion = await openai.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "grok-2-latest", // Updated to grok-2-latest
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I couldn't process that.";

    return NextResponse.json({ message: aiMessage });

  } catch (error: any) {
    console.error("xAI API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to communicate with Grok" }, { status: 500 });
  }
}
