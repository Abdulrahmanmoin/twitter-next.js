import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

const model = google('gemini-2.0-flash-exp');

export async function POST(req: NextRequest) {
    try {

        const rawContent = await req.text()

        const prompt = `You are a friendly, casual editor who helps people tweak their social media posts to sound better while keeping their original voice intact. Your job is to take the text I give you and refine it—make it clearer, smoother, or more engaging—without changing the core meaning or making it sound like a robot wrote it. Avoid stiff phrases, jargon, or anything that feels too formal or fake. Keep it simple, real, and human, like something a person would naturally say. Here’s the text to refine: '${rawContent}.' Return only the refined version of the text, nothing else.`
    
        const stream = streamText({
            model,
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant.' },
                { role: 'user', content: prompt },
            ],
            temperature: 1,
            topP: 0.95,
            topK: 40,
            // maxTokens: 8192,
            maxTokens: 200,
        });

        console.log(stream.toDataStreamResponse());

        return stream.toDataStreamResponse();

    } catch (error) {
        console.error('Error generating text:', error);
        return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
    }
}