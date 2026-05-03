import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set in environment variables." }, { status: 500 });
        }

        const client = new Anthropic({ apiKey });
        const body = await req.json();

        const prompt = `
            You are the Clinical Director at El-Olam Special Home and Rehabilitation Centre.
            We have a multidisciplinary team: Occupational Therapists (OT), Speech Therapists (ST), and Physiotherapists (PT).

            CLIENT ASSESSMENT DATA:
            ${JSON.stringify(body, null, 2)}

            TASK: Generate a Professional 3-Year Strategic Rehabilitation Plan.
            
            STRUCTURE:
            1. **Case Summary**: Brief clinical overview.
            2. **3-Year Ultimate Target**: Define the primary goal we aim to achieve for this child by the end of 3 years.
            3. **Phased Roadmap**:
               - **Year 1 (Foundation)**: Sensory regulation and basic motor/communication skills.
               - **Year 2 (Development)**: Complex task execution and social interaction.
               - **Year 3 (Integration)**: Autonomy, academic/vocational readiness, and long-term maintenance.
            4. **Specialist Directives**:
               - **Occupational Therapy Focus**: Sensory and fine motor.
               - **Physiotherapy Focus**: Gross motor and physical milestones.
               - **Speech & Communication Focus**: Expressive and receptive language.

            TONE: Professional, clinical, and goal-oriented.
        `;

        const message = await client.messages.create({
            model: "claude-opus-4-5",
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt }],
        });

        return NextResponse.json({ output: message.content[0].text });

    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}