/**
 * AI Service Module - OpenRouter Integration
 * 
 * Integração com OpenRouter para usar modelos como Grok, GPT-4, Claude 3, etc.
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Respect Pill';

// Modelo padrão definido pelo usuário (Grok)
// Verifique o ID correto no OpenRouter. Usando um genérico aqui, ajuste conforme necessário.
const AI_MODEL = "x-ai/grok-beta"; 

export interface DietPlan {
    id: string;
    userId: string;
    name: string;
    description: string;
    calories: number;
    meals: Meal[];
    createdAt: string;
}

export interface Meal {
    name: string;
    time: string;
    foods: Food[];
    calories: number;
}

export interface Food {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface WorkoutPlan {
    id: string;
    userId: string;
    name: string;
    description: string;
    duration: number; // in weeks
    workouts: Workout[];
    createdAt: string;
}

export interface Workout {
    day: string;
    name: string;
    exercises: Exercise[];
    duration: number; // in minutes
}

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: number; // in seconds
    notes?: string;
}

export interface DailyTask {
    id: string;
    date: string;
    title: string;
    description: string;
    pillar: string;
    duration: number; // in minutes
    completed: boolean;
}

interface Profile {
    age?: number;
    weight?: number;
    height?: number;
    activityLevel?: string;
    goals?: string[];
    restrictions?: string[];
    experienceLevel?: string;
    dailyTimePreference?: string;
    workSchedule?: string;
    sleepHours?: number;
    allergies?: string[];
    injuries?: string[];
    priorityGoals?: string[];
}

/**
 * Função genérica para chamar a API do OpenRouter
 */
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
                "response_format": { "type": "json_object" } // Força resposta JSON se o modelo suportar
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
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

/**
 * Generate a personalized diet plan based on user profile
 */
export async function generateDietPlan(profile: Profile): Promise<DietPlan> {
    const systemPrompt = `
    Você é um nutricionista esportivo de elite.
    Gere um plano de dieta completo em formato JSON estrito.
    O JSON deve seguir exatamente esta estrutura:
    {
        "name": "string",
        "description": "string",
        "calories": number,
        "meals": [
            {
                "name": "string",
                "time": "string (HH:MM)",
                "calories": number,
                "foods": [
                    { "name": "string", "quantity": "string", "calories": number, "protein": number, "carbs": number, "fats": number }
                ]
            }
        ]
    }
    Não inclua markdown, apenas o JSON cru.
    `;

    const userPrompt = `
    Crie uma dieta para um homem com o seguinte perfil:
    Idade: ${profile.age}
    Peso: ${profile.weight}kg
    Altura: ${profile.height}cm
    Nível de Atividade: ${profile.activityLevel}
    Objetivos: ${profile.goals?.join(', ')}
    Restrições: ${profile.restrictions?.join(', ')}
    Alergias: ${profile.allergies?.join(', ')}
    `;

    try {
        const aiData = await callOpenRouter(systemPrompt, userPrompt);
        
        return {
            id: `diet-${Date.now()}`,
            userId: '',
            createdAt: new Date().toISOString(),
            ...aiData
        };
    } catch (error) {
        console.log("Fallback to mock diet due to error");
        // Fallback simples se a API falhar ou não estiver configurada
        return {
            id: `diet-mock-${Date.now()}`,
            userId: '',
            name: 'Plano Exemplo (API Indisponível)',
            description: 'Configure a API Key para gerar planos reais.',
            calories: 2000,
            meals: [],
            createdAt: new Date().toISOString()
        };
    }
}

/**
 * Generate a personalized workout plan based on user profile
 */
export async function generateWorkoutPlan(profile: Profile): Promise<WorkoutPlan> {
    const systemPrompt = `
    Você é um treinador de força e condicionamento de elite.
    Gere um plano de treino semanal em formato JSON estrito.
    O JSON deve seguir exatamente esta estrutura:
    {
        "name": "string",
        "description": "string",
        "duration": number (semanas),
        "workouts": [
            {
                "day": "string (ex: Segunda)",
                "name": "string",
                "duration": number (minutos),
                "exercises": [
                    { "name": "string", "sets": number, "reps": "string", "rest": number (segundos), "notes": "string" }
                ]
            }
        ]
    }
    Não inclua markdown, apenas o JSON cru.
    `;

    const userPrompt = `
    Crie um treino para um homem com o seguinte perfil:
    Nível de Experiência: ${profile.experienceLevel}
    Objetivos: ${profile.goals?.join(', ')}
    Lesões: ${profile.injuries?.join(', ')}
    Tempo Disponível: ${profile.dailyTimePreference} minutos
    `;

    try {
        const aiData = await callOpenRouter(systemPrompt, userPrompt);
        
        return {
            id: `workout-${Date.now()}`,
            userId: '',
            createdAt: new Date().toISOString(),
            ...aiData
        };
    } catch (error) {
        console.log("Fallback to mock workout due to error");
        return {
            id: `workout-mock-${Date.now()}`,
            userId: '',
            name: 'Treino Exemplo (API Indisponível)',
            description: 'Configure a API Key para gerar treinos reais.',
            duration: 4,
            workouts: [],
            createdAt: new Date().toISOString()
        };
    }
}

/**
 * Generate a 90-day personalized protocol with daily tasks
 */
export async function generate90DayPlan(profile: Profile): Promise<DailyTask[]> {
    // Para o plano de 90 dias, gerar tudo de uma vez pode estourar o limite de tokens.
    // Vamos gerar um padrão semanal e replicar, ou pedir apenas a estrutura base.
    // Por enquanto, vamos manter uma lógica híbrida ou pedir apenas a primeira semana e replicar logicamente.
    
    const systemPrompt = `
    Você é um estrategista de desenvolvimento pessoal masculino.
    Crie uma rotina diária ideal baseada nos pilares: Corpo, Mente e Disciplina.
    Retorne um JSON com uma lista de 5 tarefas diárias padrão que devem ser repetidas.
    Estrutura JSON:
    {
        "tasks": [
            { "title": "string", "description": "string", "pillar": "corpo|mente|disciplina", "duration": number }
        ]
    }
    `;

    const userPrompt = `
    Perfil:
    Objetivos: ${profile.priorityGoals?.join(', ')}
    Horário de Trabalho: ${profile.workSchedule}
    Tempo Disponível: ${profile.dailyTimePreference} minutos
    `;

    try {
        const aiData = await callOpenRouter(systemPrompt, userPrompt);
        const baseTasks = aiData.tasks;
        
        const tasks: DailyTask[] = [];
        const startDate = new Date();

        // Generate tasks for 90 days based on the AI pattern
        for (let day = 0; day < 90; day++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + day);
            const dateStr = date.toISOString().split('T')[0];

            baseTasks.forEach((task: any, index: number) => {
                tasks.push({
                    id: `task-${day}-${index}`,
                    date: dateStr,
                    title: task.title,
                    description: task.description,
                    pillar: task.pillar,
                    duration: task.duration,
                    completed: false
                });
            });
        }

        return tasks;

    } catch (error) {
        console.log("Fallback to mock plan due to error");
        return [];
    }
}