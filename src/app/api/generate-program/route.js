import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const body = await req.json();

        const prompt = `
            You are the Clinical Director at El-Olam Special Home and Rehabilitation Centre.
            We have a multidisciplinary team: Occupational Therapists (OT), Speech Therapists (ST), and Physiotherapists (PT).

            CLIENT ASSESSMENT DATA:
            ${JSON.stringify(body)}

            TASK:
            Generate a Professional 3-Year Strategic Rehabilitation Plan.
            
            STRUCTURE:
            1. **Case Summary**: Brief clinical overview.
            2. **3-Year Ultimate Target**: Define the primary goal we aim to achieve for this child by the end of 3 years (e.g., Functional Independence, School Readiness, or Enhanced Communication).
            
            3. **Phased Roadmap**:
               - **Year 1 (Foundation)**: Focus on immediate sensory regulation and basic motor/communication skills.
               - **Year 2 (Development)**: Focus on complex task execution and social interaction.
               - **Year 3 (Integration)**: Focus on autonomy, academic/vocational readiness, and long-term maintenance.

            4. **Specialist Directives**:
               - **Occupational Therapy Focus**: Sensory and fine motor.
               - **Physiotherapy Focus**: Gross motor and physical milestones.
               - **Speech & Communication Focus**: Expressive and receptive language.

            TONE: 
            Professional, clinical, and goal-oriented.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return NextResponse.json({ output: response.text() });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}