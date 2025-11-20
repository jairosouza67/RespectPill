/**
 * AI Service Module - OpenRouter Integration
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Respect Pill';

// Modelo padrão (Grok ou similar via OpenRouter)
const AI_MODEL = "x-ai/grok-beta"; 

// --- Interfaces ---

export interface DietPlan {
    id: string;
    title: string;
    strategy: string;
    calories: number;
    macros: {
        protein: string;
        carbs: string;
        fats: string;
    };
    meals: {
        name: string;
        items: string[];
    }[];
    createdAt: string;
}

export interface WorkoutPlan {
    id: string;
    title: string;
    level: string;
    frequency: string;
    notes: string;
    schedule: {
        dayName: string;
        exercises: {
            name: string;
            sets: number;
            reps: string;
            rest: string;
            technique?: string;
        }[];
    }[];
    createdAt: string;
}

export interface FinancialAudit {
    score: number;
    wasteDetection: string[];
    burnRateAnalysis: string;
    strategy: string;
}

export interface RelationalAudit {
    healthScore: number;
    diagnosis: string;
    actionPlan: string[];
    goldenClause: string;
}

export interface CognitiveAnalysis {
    distortion: string;
    analysis: string;
    reframe: string;
    action: string;
}

// --- Core Function ---

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!OPENROUTER_API_KEY) {
        console.warn("VITE_OPENROUTER_API_KEY não encontrada. Usando mock fallback.");
        throw new Error("API Key não configurada");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": AI_MODEL,
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                "response_format": { "type": "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (e) {
            console.error("Erro ao fazer parse do JSON da IA:", content);
            throw new Error("A IA não retornou um JSON válido.");
        }

    } catch (error) {
        console.error("Erro na chamada AI:", error);
        throw error;
    }
}

// --- Tool Functions ---

export async function generateDietPlan(weight: string, height: string, goal: string, meals: string, preferences: string): Promise<DietPlan | null> {
    const systemPrompt = `
    Você é um nutricionista esportivo de elite focado em alta performance.
    Gere um plano de dieta em JSON estrito com a seguinte estrutura:
    {
        "title": "Nome do Protocolo (ex: Protocolo Metabólico Agressivo)",
        "strategy": "Resumo da estratégia em 1 frase",
        "calories": number,
        "macros": { "protein": "Xg", "carbs": "Xg", "fats": "Xg" },
        "meals": [
            { "name": "Nome da Refeição", "items": ["item 1", "item 2"] }
        ]
    }
    `;
    const userPrompt = `Perfil: ${weight}kg, ${height}cm. Objetivo: ${goal}. Refeições/dia: ${meals}. Preferências: ${preferences}`;

    try {
        const data = await callOpenRouter(systemPrompt, userPrompt);
        return { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
    } catch (e) {
        return null;
    }
}

export async function generateWorkoutPlan(level: string, days: string): Promise<WorkoutPlan | null> {
    const systemPrompt = `
    Você é um treinador de força de elite. Crie um treino periodizado em JSON estrito:
    {
        "title": "Nome do Treino (ex: Protocolo Híbrido 8-Core)",
        "level": "${level}",
        "frequency": "${days}x/semana",
        "notes": "Dica tática curta",
        "schedule": [
            {
                "dayName": "Dia X - Foco",
                "exercises": [
                    { "name": "Nome", "sets": number, "reps": "string", "rest": "string", "technique": "string (opcional)" }
                ]
            }
        ]
    }
    `;
    const userPrompt = `Nível: ${level}. Frequência: ${days} dias por semana. Foco: Hipertrofia e Força Funcional.`;

    try {
        const data = await callOpenRouter(systemPrompt, userPrompt);
        return { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
    } catch (e) {
        return null;
    }
}

export async function generateFinancialAudit(transactions: any[], goal: string): Promise<FinancialAudit | null> {
    const systemPrompt = `
    Você é um CFO implacável. Analise as finanças e retorne JSON estrito:
    {
        "score": number (0-100),
        "wasteDetection": ["item 1", "item 2"],
        "burnRateAnalysis": "Análise curta e direta sobre o fluxo de caixa",
        "strategy": "Uma ação tática imediata para atingir o objetivo"
    }
    `;
    const userPrompt = `Transações: ${JSON.stringify(transactions)}. Objetivo: ${goal}`;

    try {
        return await callOpenRouter(systemPrompt, userPrompt);
    } catch (e) {
        return null;
    }
}

export async function generateRelationshipAudit(comm: number, intimacy: number, vision: number, friction: string, gratitude: string): Promise<RelationalAudit | null> {
    const systemPrompt = `
    Você é um terapeuta de casais focado em dinâmica evolutiva. Retorne JSON estrito:
    {
        "healthScore": number (0-100),
        "diagnosis": "Análise brutalmente honesta da dinâmica",
        "actionPlan": ["Passo 1", "Passo 2", "Passo 3"],
        "goldenClause": "Uma regra inegociável para os próximos 15 dias"
    }
    `;
    const userPrompt = `Comunicação: ${comm}/10, Intimidade: ${intimacy}/10, Visão: ${vision}/10. Atrito: ${friction}. Gratidão: ${gratitude}`;

    try {
        return await callOpenRouter(systemPrompt, userPrompt);
    } catch (e) {
        return null;
    }
}

export async function analyzeThought(situation: string, thought: string): Promise<CognitiveAnalysis | null> {
    const systemPrompt = `
    Você é um especialista em TCC e Estoicismo. Analise o pensamento, identifique distorções e reestruture. JSON estrito:
    {
        "distortion": "Nome da distorção cognitiva (ex: Catastrofização)",
        "analysis": "Explicação lógica do erro",
        "reframe": "A verdade estoica/objetiva sobre a situação",
        "action": "Uma ação física imediata para quebrar o padrão"
    }
    `;
    const userPrompt = `Situação: ${situation}. Pensamento Automático: ${thought}`;

    try {
        return await callOpenRouter(systemPrompt, userPrompt);
    } catch (e) {
        return null;
    }
}

export async function findExerciseVideo(exerciseName: string): Promise<string | null> {
    // Mock implementation since we don't have YouTube API key
    // Returning null triggers the manual search fallback in the UI, which is safer/better UX than a broken video
    return null;
}

// Placeholder for legacy function support if needed
export async function generate90DayPlan(profile: any) {
    return [];
}