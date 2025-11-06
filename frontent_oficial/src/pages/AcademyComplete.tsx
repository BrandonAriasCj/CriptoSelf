import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  Star, 
  AlertCircle, 
  CheckCircle,
  Play,
  Lock,
  BarChart3,
  Target,
  Shield
} from 'lucide-react';
import { useAcademyCategories, useUserProgress, useCategoryLessons } from '../hooks/useAcademyApi';
import LessonViewer from '../components/LessonViewer';
import ProgressStats from '../components/ProgressStats';
import AuthStatus from '../components/AuthStatus';

interface LessonCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons_count: number;
}

interface UserProgress {
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  total_time_minutes: number;
  categories_progress: Array<{
    category: LessonCategory;
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
  }>;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lesson_type: 'theory' | 'practical' | 'quiz' | 'simulation';
  duration_minutes: number;
  order: number;
  user_progress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    progress_percentage: number;
  };
}

const AcademyComplete: React.FC = () => {
  const navigate = useNavigate();
  
  // Hooks para API
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    loadCategories 
  } = useAcademyCategories();
  
  const { 
    data: userProgress, 
    loading: progressLoading, 
    error: progressError, 
    loadProgress 
  } = useUserProgress();
  
  const { 
    data: categoryLessons, 
    loading: lessonsLoading, 
    error: lessonsError, 
    loadLessons,
    reset: resetLessons
  } = useCategoryLessons();

  // Estados locales
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [view, setView] = useState<'dashboard' | 'category' | 'lesson'>('dashboard');
  
  // Estados derivados
  const loading = categoriesLoading || progressLoading || lessonsLoading;
  const error = categoriesError?.message || progressError?.message || lessonsError?.message;

  useEffect(() => {
    loadAcademyData();
  }, []);

  const loadAcademyData = async () => {
    try {
      // Cargar categorías
      const categoriesResult = await loadCategories();
      
      // Cargar progreso del usuario (puede fallar si es usuario nuevo)
      await loadProgress();
      
      // Si no hay categorías de la API, usar datos de fallback
      if (!categoriesResult || categoriesResult.length === 0) {
        // Los datos de fallback se manejan en el hook
        console.log('Usando datos de fallback para categorías');
      }
    } catch (error) {
      console.error('Error loading academy data:', error);
    }
  };

  const loadCategoryLessons = async (categoryId: number) => {
    const lessonsResult = await loadLessons(categoryId);
    
    // Si no hay lecciones de la API, usar datos de ejemplo
    if (!lessonsResult || lessonsResult.length === 0) {
      console.log('Usando datos de ejemplo para lecciones');
      // Los datos de fallback se pueden manejar aquí si es necesario
    }
    
    setSelectedCategory(categoryId);
    setView('category');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-5 h-5" />;
      case 'practical': return <BarChart3 className="w-5 h-5" />;
      case 'quiz': return <Award className="w-5 h-5" />;
      case 'simulation': return <Play className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (lesson: Lesson) => {
    if (!lesson.user_progress) {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>;
    }

    switch (lesson.user_progress.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'in_progress':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          </div>
        );
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>;
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson.id);
    setView('lesson');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedCategory(null);
    setSelectedLesson(null);
    resetLessons(); // Reset de los hooks
  };

  const handleBackToCategory = () => {
    setView('category');
    setSelectedLesson(null);
  };

  const handleLessonComplete = () => {
    // Actualizar el progreso de la lección localmente
    // En una implementación completa, esto se enviaría al backend
    console.log(`Lección ${selectedLesson} completada`);
    
    // Volver a la vista de categoría
    handleBackToCategory();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Cargando Academia...</h2>
          <p className="text-gray-300">Preparando tu experiencia de aprendizaje</p>
        </div>
      </div>
    );
  }

  // Vista de lección individual
  if (view === 'lesson' && selectedLesson) {
    return (
      <LessonViewer
        lessonId={selectedLesson}
        onBack={handleBackToCategory}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Vista de categoría (lista de lecciones)
  if (view === 'category' && selectedCategory) {
    const category = (categories || []).find(c => c.id === selectedCategory);
    const lessons = categoryLessons || [];
    const completedLessons = lessons.filter(l => l.user_progress?.status === 'completed').length;
    const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
            >
              ← Volver a la Academia
            </button>

            <div className="flex items-center mb-4">
              {category && (
                <>
                  <span className="text-4xl mr-4">{category.icon}</span>
                  <div>
                    <h1 className="text-4xl font-bold text-white">{category.name}</h1>
                    <p className="text-gray-300 mt-2">
                      {lessons.length} lecciones • {completedLessons} completadas
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              Progreso: {progressPercentage.toFixed(1)}%
            </p>
          </div>

          {/* Lessons List */}
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 cursor-pointer hover:bg-white/15 transition-all duration-300"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {getStatusIcon(lesson)}
                    </div>

                    {/* Lesson Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {lesson.title}
                        </h3>
                        
                        {/* Lesson Type */}
                        <div className="flex items-center space-x-1 text-purple-400">
                          {getTypeIcon(lesson.lesson_type)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-3 leading-relaxed">
                        {lesson.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        {/* Duration */}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration_minutes} min
                        </div>

                        {/* Difficulty */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {getDifficultyText(lesson.difficulty)}
                        </span>

                        {/* Type */}
                        <span className="text-purple-400">
                          {lesson.lesson_type === 'theory' ? 'Teoría' :
                           lesson.lesson_type === 'practical' ? 'Práctica' :
                           lesson.lesson_type === 'quiz' ? 'Quiz' : 'Simulación'}
                        </span>
                      </div>

                      {/* Progress Bar for In Progress Lessons */}
                      {lesson.user_progress?.status === 'in_progress' && (
                        <div className="mt-3">
                          <div className="bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${lesson.user_progress.progress_percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {lesson.user_progress.progress_percentage}% completado
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lesson Number */}
                  <div className="text-2xl font-bold text-gray-500 ml-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vista principal del dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Academia de Trading
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aprende trading desde cero hasta nivel avanzado con nuestro programa académico completo.
              Teoría, práctica y evaluaciones para convertirte en un trader exitoso.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Status & Error Alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-8">
        <AuthStatus />
        
        {error && (
          <div className="bg-yellow-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-400/30 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressStats userProgress={userProgress} />
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(categories || []).map((category, index) => {
            const categoryProgress = userProgress?.categories_progress.find(
              cp => cp.category.id === category.id
            );
            
            return (
              <div
                key={category.id}
                className="group cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => loadCategoryLessons(category.id)}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="text-4xl mr-4 p-3 rounded-xl"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 mt-1">
                          {category.lessons_count} lecciones
                        </p>
                      </div>
                    </div>
                    
                    {categoryProgress && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {categoryProgress.progress_percentage.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          {categoryProgress.completed_lessons}/{categoryProgress.total_lessons}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Progress Bar */}
                  {categoryProgress && (
                    <div className="mb-6">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${categoryProgress.progress_percentage}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Category Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {category.lessons_count} lecciones
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      ~{category.lessons_count * 20} min
                    </div>
                    
                    {categoryProgress && categoryProgress.progress_percentage === 100 && (
                      <div className="flex items-center text-green-400">
                        <Award className="w-4 h-4 mr-2" />
                        Completado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Por qué elegir nuestra Academia?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Metodología probada, contenido actualizado y enfoque práctico para tu éxito en trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "Contenido Estructurado",
              description: "Programa académico diseñado progresivamente desde conceptos básicos hasta estrategias avanzadas"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Evaluaciones Prácticas",
              description: "Quizzes y ejercicios prácticos para validar tu comprensión y progreso"
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Certificaciones",
              description: "Obtén certificados al completar cada módulo y demuestra tus conocimientos"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyComplete;