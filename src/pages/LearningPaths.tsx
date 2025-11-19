import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { BookOpen, Play, FileText, Headphones, Clock, Lock, ArrowRight, Star } from 'lucide-react';

interface ContentModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'text' | 'pdf' | 'quiz';
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  pillar: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  isLocked: boolean;
  prerequisites: string[];
  order: number;
  tags: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  pillar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: ContentModule[];
  totalDuration: number;
  progress: number;
  isActive: boolean;
}

const typeIcons = {
  video: Play,
  audio: Headphones,
  text: FileText,
  pdf: FileText,
  quiz: BookOpen
};

const PILLARS = {
  'body': { label: 'Corpo', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  'mind': { label: 'Mente', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  'posture': { label: 'Postura & Presença', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'affective': { label: 'Vida Afetiva', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  'sexuality': { label: 'Sexualidade', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  'discipline': { label: 'Disciplina & Rotina', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'career': { label: 'Propósito de Vida', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  'community': { label: 'Comunidade & Identidade', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
};

export default function LearningPaths() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);

      // Load content modules
      const contentRef = collection(db, 'content');
      const q = query(
        contentRef,
        where('isActive', '==', true),
        orderBy('order', 'asc'),
        limit(100)
      );

      const querySnapshot = await getDocs(q);

      const modules: ContentModule[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        modules.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          duration: data.duration,
          level: data.level,
          pillar: data.pillar,
          thumbnailUrl: data.thumbnailUrl,
          contentUrl: data.contentUrl,
          isLocked: data.isLocked || false,
          prerequisites: data.prerequisites || [],
          order: data.order || 0,
          tags: data.tags || []
        });
      });

      // Group modules by pillar and level
      const pathsByPillar: Record<string, Record<string, ContentModule[]>> = {};

      modules.forEach(module => {
        if (!pathsByPillar[module.pillar]) {
          pathsByPillar[module.pillar] = {};
        }
        if (!pathsByPillar[module.pillar][module.level]) {
          pathsByPillar[module.pillar][module.level] = [];
        }
        pathsByPillar[module.pillar][module.level].push(module);
      });

      // Create learning paths
      const learningPaths: LearningPath[] = [];

      Object.entries(pathsByPillar).forEach(([pillar, levels]) => {
        Object.entries(levels).forEach(([level, modules]) => {
          const totalDuration = modules.reduce((sum, m) => sum + m.duration, 0);
          const progress = Math.round((modules.filter(m => !m.isLocked).length / modules.length) * 100);

          learningPaths.push({
            id: `${pillar}-${level}`,
            title: `${getPillarName(pillar)} - ${getLevelName(level)}`,
            description: getPathDescription(pillar),
            pillar,
            level: level as 'beginner' | 'intermediate' | 'advanced',
            modules: modules.sort((a, b) => a.order - b.order),
            totalDuration,
            progress,
            isActive: progress > 0 && progress < 100
          });
        });
      });

      // If no paths found (e.g. empty DB), create mock paths for visualization
      if (learningPaths.length === 0) {
        Object.keys(PILLARS).forEach(pillar => {
          learningPaths.push({
            id: `${pillar}-beginner`,
            title: `${getPillarName(pillar)}`,
            description: getPathDescription(pillar),
            pillar,
            level: 'beginner',
            modules: [],
            totalDuration: 0,
            progress: 0,
            isActive: false
          });
        });
      }

      setPaths(learningPaths);
      setActivePath(learningPaths[0]?.id || null);

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPillarName = (pillar: string) => {
    return PILLARS[pillar as keyof typeof PILLARS]?.label || pillar;
  };

  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      'beginner': 'Iniciante',
      'intermediate': 'Intermediário',
      'advanced': 'Avançado'
    };
    return names[level] || level;
  };

  const getPathDescription = (pillar: string) => {
    const descriptions: Record<string, string> = {
      'body': 'Domine sua biologia, nutrição e performance física.',
      'mind': 'Desenvolva resiliência, foco e clareza mental.',
      'posture': 'Construa uma presença magnética e linguagem corporal poderosa.',
      'affective': 'Cultive relacionamentos saudáveis e inteligência emocional.',
      'sexuality': 'Explore a energia sexual como fonte de vitalidade e conexão.',
      'discipline': 'Estabeleça rotinas inquebráveis e autodisciplina.',
      'career': 'Acelere seu crescimento profissional e habilidades de comunicação.',
      'community': 'Encontre seu propósito e contribua para algo maior.'
    };

    return descriptions[pillar] || 'Trilha de aprendizado personalizada';
  };

  const handleModuleClick = (module: ContentModule) => {
    if (module.isLocked) {
      return;
    }
    console.log('Opening module:', module.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cobalt-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando trilhas...</p>
        </div>
      </div>
    );
  }

  const activePathData = paths.find(p => p.id === activePath);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Currículo</h1>
          <p className="text-zinc-400">
            O mapa completo para sua evolução nas 8 áreas fundamentais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - Paths List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Trilhas Disponíveis</h3>
          <div className="space-y-2">
            {paths.map(path => {
              const pillarStyle = PILLARS[path.pillar as keyof typeof PILLARS] || PILLARS.body;
              const isActive = activePath === path.id;

              return (
                <button
                  key={path.id}
                  onClick={() => setActivePath(path.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${isActive
                    ? `bg-dark-800 ${pillarStyle.border} shadow-lg shadow-black/20`
                    : 'bg-dark-850 border-white/5 hover:bg-dark-800 hover:border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isActive ? pillarStyle.color : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                      {getPillarName(path.pillar)}
                    </span>
                    {path.progress > 0 && (
                      <span className="text-xs text-zinc-500">{path.progress}%</span>
                    )}
                  </div>
                  <h4 className={`font-medium mb-1 ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                    {getLevelName(path.level)}
                  </h4>
                  <div className="w-full bg-dark-900 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white' : 'bg-zinc-700'}`}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content - Modules */}
        <div className="lg:col-span-8">
          {activePathData ? (
            <div className="bg-dark-850 rounded-2xl border border-white/10 overflow-hidden">
              {/* Path Header */}
              <div className="p-8 border-b border-white/10 bg-gradient-to-br from-dark-800 to-dark-900 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Star className="h-32 w-32 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white border border-white/10`}>
                      {getLevelName(activePathData.level)}
                    </span>
                    <div className="flex items-center text-zinc-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.ceil(activePathData.totalDuration / 60)}h total
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    {activePathData.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed max-w-2xl">
                    {activePathData.description}
                  </p>
                </div>
              </div>

              {/* Modules List */}
              <div className="p-6">
                {activePathData.modules.length > 0 ? (
                  <div className="space-y-4">
                    {activePathData.modules.map((module) => {
                      const IconComponent = typeIcons[module.type];

                      return (
                        <div
                          key={module.id}
                          onClick={() => handleModuleClick(module)}
                          className={`group relative flex items-center p-4 rounded-xl border transition-all duration-300 ${module.isLocked
                            ? 'bg-dark-900/50 border-white/5 opacity-50 cursor-not-allowed'
                            : 'bg-dark-800 border-white/5 hover:border-cobalt-500/30 hover:bg-dark-750 cursor-pointer'
                            }`}
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${module.isLocked
                              ? 'bg-dark-900 border-white/5 text-zinc-600'
                              : 'bg-cobalt-500/10 border-cobalt-500/20 text-cobalt-400 group-hover:text-cobalt-300'
                              }`}>
                              {module.isLocked ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                <IconComponent className="h-5 w-5" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-medium truncate ${module.isLocked ? 'text-zinc-500' : 'text-white group-hover:text-cobalt-100'}`}>
                                {module.title}
                              </h3>
                              {!module.isLocked && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                                  {module.type}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500 truncate">
                              {module.description}
                            </p>
                          </div>

                          <div className="flex-shrink-0 ml-4 flex items-center">
                            {!module.isLocked && (
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 mb-4">
                      <BookOpen className="h-8 w-8 text-zinc-600" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Em Breve</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">
                      Os módulos desta trilha estão sendo preparados pelos nossos especialistas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] text-zinc-500">
              Selecione uma trilha para começar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}