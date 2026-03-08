import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import PDFParser from 'pdf-parse/lib/pdf-parse.js';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const htmlFile = formData.get('html_file') as File;
        const nitFile = formData.get('nit_file') as File;
        const boqFile = formData.get('boq_file') as File;

        let combinedText = "";

        if (htmlFile) {
            const htmlText = await htmlFile.text();
            const $ = load(htmlText);
            $('script, style, nav, footer, header').remove();
            combinedText += "--- TENDER HTML CONTENT ---\n" + $('body').text().replace(/\s+/g, ' ').trim() + "\n\n";
        }

        if (nitFile) {
            const buf = await nitFile.arrayBuffer();
            const data = await PDFParser(Buffer.from(buf));
            combinedText += "--- NIT PDF CONTENT ---\n" + data.text.replace(/\s+/g, ' ').trim() + "\n\n";
        }

        if (boqFile) {
            const buf = await boqFile.arrayBuffer();
            const data = await PDFParser(Buffer.from(buf));
            combinedText += "--- BOQ PDF CONTENT ---\n" + data.text.replace(/\s+/g, ' ').trim() + "\n\n";
        }

        if (combinedText.length === 0) {
            throw new Error("No readable content found in the provided files.");
        }

        const textToProcess = combinedText.substring(0, 50000);

        const prompt = `You are an Indian government tender data extraction engine.
From the provided tender content (HTML + NIT + BOQ), extract structured information.
Return ONLY valid JSON. Do NOT explain anything. Do NOT add extra text.

Fields:
- tender_title
- tender_id
- reference_number
- authority_department
- state
- city
- work_description_summary
- tender_value_inr (numeric only)
- estimated_cost_inr (numeric only)
- emd_amount_inr (numeric only)
- tender_fee_inr (numeric only)
- completion_period_months (numeric)
- publish_date (YYYY-MM-DD)
- bid_start_date (YYYY-MM-DD)
- bid_end_date (YYYY-MM-DD)
- bid_opening_date (YYYY-MM-DD)
- work_category (Road/Railway/Building/Solar/etc.)
- contract_type (EPC/Item Rate/HAM/BOT/etc.)
- similar_work_clause_exact_text
- turnover_requirement_exact_text
- net_worth_requirement_exact_text

Content:
${textToProcess}`;

        const extraction = await extractWithFallback(prompt);
        const validated = validateAndNormalize(extraction);

        return NextResponse.json(validated);

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

async function extractWithFallback(prompt: string) {
    const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY;
    const GROQ_KEY = process.env.VITE_GROQ_API_KEY;
    const OPENROUTER_KEY = process.env.VITE_OPENROUTER_API_KEY;

    // 1. Try Groq
    if (GROQ_KEY) {
        try {
            const groq = new OpenAI({ apiKey: GROQ_KEY, baseURL: "https://api.groq.com/openai/v1" });
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-specdec",
                response_format: { type: "json_object" },
                temperature: 0.1,
            });
            return JSON.parse(completion.choices[0].message.content || "{}");
        } catch (e) {
            console.warn("Groq failed, falling back...");
        }
    }

    // 2. Try OpenRouter
    if (OPENROUTER_KEY) {
        try {
            const openRouter = new OpenAI({ apiKey: OPENROUTER_KEY, baseURL: "https://openrouter.ai/api/v1" });
            const completion = await openRouter.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "deepseek/deepseek-chat",
                response_format: { type: "json_object" },
                temperature: 0.1,
            });
            return JSON.parse(completion.choices[0].message.content || "{}");
        } catch (e) {
            console.warn("OpenRouter failed, falling back...");
        }
    }

    // 3. Try Gemini
    if (GEMINI_KEY) {
        try {
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
                })
            });
            const data = await resp.json();
            return JSON.parse(data.candidates[0].content.parts[0].text);
        } catch (e) {
            console.error("Gemini failed");
        }
    }

    throw new Error("All AI models failed.");
}

function validateAndNormalize(data: any) {
    const result = { ...data };
    ['tender_value_inr', 'estimated_cost_inr', 'emd_amount_inr', 'tender_fee_inr', 'completion_period_months'].forEach(field => {
        let val = result[field];
        if (typeof val === 'string') val = parseFloat(val.replace(/[^0-9.]/g, ''));
        result[field] = (typeof val === 'number' && !isNaN(val)) ? Math.max(0, val) : 0;
    });

    ['publish_date', 'bid_start_date', 'bid_end_date', 'bid_opening_date'].forEach(field => {
        if (result[field]) {
            const d = new Date(result[field]);
            if (!isNaN(d.getTime())) result[field] = d.toISOString().split('T')[0];
            else result[field] = null;
        }
    });
    return result;
}
