/**
 * AI Service Module
 * 
 * This module provides AI-powered content generation for:
 * - Diet plans
 * - Workout plans
 * - 90-day personalized protocols
 * 
 * Currently using mock implementations that can be replaced with real AI API calls
 * (OpenAI GPT-4, Google Gemini, etc.)
 */

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
 * Generate a personalized diet plan based on user profile
 * TODO: Replace with actual AI API call
 */
export async function generateDietPlan(profile: Profile): Promise<DietPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const calories = calculateCalories(profile);

    return {
        id: `diet-${Date.now()}`,
        userId: '',
        name: 'Plano Nutricional Personalizado',
        description: `Plano de ${calories} calorias diárias baseado no seu perfil`,
        calories,
        meals: [
            {
                name: 'Café da Manhã',
                time: '07:00',
                calories: Math.round(calories * 0.25),
                foods: [
                    { name: 'Ovos mexidos', quantity: '3 unidades', calories: 210, protein: 18, carbs: 2, fats: 15 },
                    { name: 'Pão integral', quantity: '2 fatias', calories: 140, protein: 6, carbs: 24, fats: 2 },
                    { name: 'Abacate', quantity: '1/2 unidade', calories: 120, protein: 1, carbs: 6, fats: 11 }
                ]
            },
            {
                name: 'Almoço',
                time: '12:00',
                calories: Math.round(calories * 0.35),
                foods: [
                    { name: 'Frango grelhado', quantity: '200g', calories: 330, protein: 62, carbs: 0, fats: 7 },
                    { name: 'Arroz integral', quantity: '150g', calories: 195, protein: 4, carbs: 41, fats: 2 },
                    { name: 'Brócolis', quantity: '100g', calories: 35, protein: 3, carbs: 7, fats: 0 }
                ]
            },
            {
                name: 'Lanche',
                time: '16:00',
                calories: Math.round(calories * 0.15),
                foods: [
                    { name: 'Whey protein', quantity: '1 scoop', calories: 120, protein: 24, carbs: 3, fats: 1 },
                    { name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fats: 0 }
                ]
            },
            {
                name: 'Jantar',
                time: '19:00',
                calories: Math.round(calories * 0.25),
                foods: [
                    { name: 'Salmão', quantity: '150g', calories: 280, protein: 34, carbs: 0, fats: 15 },
                    { name: 'Batata doce', quantity: '150g', calories: 130, protein: 2, carbs: 30, fats: 0 },
                    { name: 'Salada verde', quantity: '100g', calories: 20, protein: 1, carbs: 4, fats: 0 }
                ]
            }
        ],
        createdAt: new Date().toISOString()
    };
}

/**
 * Generate a personalized workout plan based on user profile
 * TODO: Replace with actual AI API call
 */
export async function generateWorkoutPlan(profile: Profile): Promise<WorkoutPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const level = profile.experienceLevel || 'beginner';
    const isAdvanced = level === 'advanced';

    return {
        id: `workout-${Date.now()}`,
        userId: '',
        name: `Treino ${level === 'beginner' ? 'Iniciante' : level === 'intermediate' ? 'Intermediário' : 'Avançado'}`,
        description: 'Programa de treino personalizado focado em hipertrofia e força',
        duration: 12,
        workouts: [
            {
                day: 'Segunda',
                name: 'Peito e Tríceps',
                duration: 60,
                exercises: [
                    { name: 'Supino reto', sets: isAdvanced ? 4 : 3, reps: '8-12', rest: 90 },
                    { name: 'Supino inclinado', sets: isAdvanced ? 4 : 3, reps: '8-12', rest: 90 },
                    { name: 'Crucifixo', sets: 3, reps: '12-15', rest: 60 },
                    { name: 'Tríceps testa', sets: 3, reps: '10-12', rest: 60 },
                    { name: 'Tríceps corda', sets: 3, reps: '12-15', rest: 60 }
                ]
            },
            {
                day: 'Terça',
                name: 'Costas e Bíceps',
                duration: 60,
                exercises: [
                    { name: 'Barra fixa', sets: isAdvanced ? 4 : 3, reps: '6-10', rest: 90 },
                    { name: 'Remada curvada', sets: isAdvanced ? 4 : 3, reps: '8-12', rest: 90 },
                    { name: 'Pulldown', sets: 3, reps: '10-12', rest: 60 },
                    { name: 'Rosca direta', sets: 3, reps: '10-12', rest: 60 },
                    { name: 'Rosca martelo', sets: 3, reps: '12-15', rest: 60 }
                ]
            },
            {
                day: 'Quarta',
                name: 'Descanso ou Cardio Leve',
                duration: 30,
                exercises: [
                    { name: 'Caminhada', sets: 1, reps: '30min', rest: 0, notes: 'Ritmo moderado' }
                ]
            },
            {
                day: 'Quinta',
                name: 'Pernas',
                duration: 70,
                exercises: [
                    { name: 'Agachamento', sets: isAdvanced ? 5 : 4, reps: '6-10', rest: 120 },
                    { name: 'Leg press', sets: 4, reps: '10-12', rest: 90 },
                    { name: 'Cadeira extensora', sets: 3, reps: '12-15', rest: 60 },
                    { name: 'Cadeira flexora', sets: 3, reps: '12-15', rest: 60 },
                    { name: 'Panturrilha', sets: 4, reps: '15-20', rest: 45 }
                ]
            },
            {
                day: 'Sexta',
                name: 'Ombros e Abdômen',
                duration: 55,
                exercises: [
                    { name: 'Desenvolvimento', sets: 4, reps: '8-12', rest: 90 },
                    { name: 'Elevação lateral', sets: 3, reps: '12-15', rest: 60 },
                    { name: 'Elevação frontal', sets: 3, reps: '12-15', rest: 60 },
                    { name: 'Abdominal supra', sets: 3, reps: '15-20', rest: 45 },
                    { name: 'Prancha', sets: 3, reps: '60s', rest: 45 }
                ]
            }
        ],
        createdAt: new Date().toISOString()
    };
}

/**
 * Generate a 90-day personalized protocol with daily tasks
 * TODO: Replace with actual AI API call
 */
export async function generate90DayPlan(_profile: Profile): Promise<DailyTask[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tasks: DailyTask[] = [];
    const startDate = new Date();

    // Generate tasks for 90 days
    for (let day = 0; day < 90; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        // Morning routine
        tasks.push({
            id: `task-${day}-1`,
            date: dateStr,
            title: 'Banho Gelado',
            description: '3 minutos de água fria para ativar o sistema nervoso',
            pillar: 'corpo',
            duration: 5,
            completed: false
        });

        // Workout (every other day)
        if (day % 2 === 0) {
            tasks.push({
                id: `task-${day}-2`,
                date: dateStr,
                title: 'Treino de Força',
                description: 'Seguir o plano de treino personalizado',
                pillar: 'corpo',
                duration: 60,
                completed: false
            });
        }

        // Daily reading
        tasks.push({
            id: `task-${day}-3`,
            date: dateStr,
            title: 'Leitura Diária',
            description: '20 páginas de desenvolvimento pessoal',
            pillar: 'mente',
            duration: 30,
            completed: false
        });

        // Meditation
        tasks.push({
            id: `task-${day}-4`,
            date: dateStr,
            title: 'Meditação',
            description: '10 minutos de meditação guiada',
            pillar: 'mente',
            duration: 10,
            completed: false
        });

        // Weekly check-in (every 7 days)
        if (day % 7 === 0) {
            tasks.push({
                id: `task-${day}-5`,
                date: dateStr,
                title: 'Revisão Semanal',
                description: 'Avaliar progresso e ajustar metas',
                pillar: 'disciplina',
                duration: 30,
                completed: false
            });
        }
    }

    return tasks;
}

/**
 * Calculate daily calorie needs based on profile
 */
function calculateCalories(profile: Profile): number {
    if (!profile.weight || !profile.height || !profile.age) {
        return 2000; // Default
    }

    // Mifflin-St Jeor Equation (for men)
    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };

    const multiplier = activityMultipliers[profile.activityLevel || 'moderate'] || 1.55;
    const tdee = bmr * multiplier;

    // Adjust based on goals
    if (profile.goals?.includes('lose_weight')) {
        return Math.round(tdee - 500); // 500 calorie deficit
    } else if (profile.goals?.includes('gain_muscle')) {
        return Math.round(tdee + 300); // 300 calorie surplus
    }

    return Math.round(tdee);
}
