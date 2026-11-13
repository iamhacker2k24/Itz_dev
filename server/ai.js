
import OpenAI from "openai";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";

dotenv.config();

// 1. Load portfolio data
const portfolioData = JSON.parse(
    readFileSync(new URL("./data.json", import.meta.url), "utf-8")
);

const projectData = JSON.parse(
    readFileSync(new URL("./projects.json", import.meta.url), "utf-8")
);

// 2. Initialize AI client
const client = new OpenAI({
    apiKey: process.env.REQUESTY_API_KEY,
    baseURL: "https://router.requesty.ai/v1",
});

// 3. System instructions
const SYSTEM_INSTRUCTION = `
You are Debabrata Portfolio AI Chatbot.

IDENTITY:
- You are the official AI assistant of Debabrata Paul's portfolio.
- Answer visitors' questions about Debabrata, his skills, services, projects, and background.

STRICT RESPONSE FORMAT:
Always return valid JSON in exactly this structure:

{
  "answer": "Short answer to the user's question.",
  "suggestions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}

RULES:
1. Answer only the current question.
2. Keep answers short, ideally 20-50 words.
3. Always provide exactly 3 relevant suggestions.
4. Understand follow-up questions using conversation history.
5. Never invent information about Debabrata.
6. Use portfolio and project data as the primary sources.
7. If information is unavailable, say it is not listed.
8. Never return Markdown or code fences.
9. Use double quotes for JSON keys and string values.
10. Return exactly two properties: answer and suggestions.
11. Never include explanations outside JSON.

PORTFOLIO DATA:
${JSON.stringify(portfolioData)}

PROJECT DATA:
${JSON.stringify(projectData)}
`;

// 4. Conversation history
const history = [
    {
        role: "system",
        content: SYSTEM_INSTRUCTION,
    },
];

// 5. Extract and validate JSON
function extractJSON(data) {
    if (typeof data !== "string") {
        throw new Error("AI response must be a string.");
    }

    // Remove Markdown code fences and unnecessary whitespace
    let cleaned = data
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/\r?\n/g, " ")
        .trim();

    // Extract JSON object if extra text exists
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
        throw new Error("No valid JSON object found in AI response.");
    }

    cleaned = cleaned.slice(start, end + 1);

    let parsed;

    try {
        parsed = JSON.parse(cleaned);
    } catch (error) {
        throw new Error("AI returned invalid JSON: " + error.message);
    }

    // Validate response structure
    if (
        typeof parsed.answer !== "string" ||
        !Array.isArray(parsed.suggestions) ||
        parsed.suggestions.length !== 3 ||
        !parsed.suggestions.every(item => typeof item === "string")
    ) {
        throw new Error("AI returned an invalid response structure.");
    }

    // Return clean JSON object
    return {
        answer: parsed.answer.replace(/\r?\n/g, " ").trim(),
        suggestions: parsed.suggestions.map(item =>
            item.replace(/\r?\n/g, " ").trim()
        ),
    };
}

// 6. Chat function
export async function chat(userMessage) {
    try {
        if (!userMessage || typeof userMessage !== "string") {
            throw new Error("Please provide a valid message.");
        }

        history.push({
            role: "user",
            content: userMessage,
        });

        const response = await client.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages: history,
            temperature: 0.3,
            response_format: { type: "json_object" },
        });

        const assistantMessage = response.choices[0]?.message?.content;

        if (!assistantMessage) {
            throw new Error("AI returned an empty response.");
        }

        // Convert AI response into a proper JSON object
        const result = extractJSON(assistantMessage);

        // Save normalized JSON in conversation history
        history.push({
            role: "assistant",
            content: JSON.stringify(result),
        });

        // Keep system instruction + latest 20 messages
        if (history.length > 21) {
            history.splice(1, history.length - 21);
        }

        return result;

    } catch (error) {
        if (history.at(-1)?.role === "user") {
            history.pop();
        }

        console.error("AI Chat Error:", error.message);
        throw error;
    }
}

// 7. Test
// const response = await chat("Tell me about Debabrata's projects");
// console.log(response);
// console.log(JSON.stringify(response));
