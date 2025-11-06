import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Clock, 
  BookOpen, 
  Award,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface LessonViewerProps {
  lessonId: number;
  onBack: () => void;
  onComplete?: () => void;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  lesson_type: string;
  duration_minutes: number;
  category_name: string;
  category_icon: string;
  quiz?: {
    id: number;
    title: string;
    questions: QuizQuestion[];
    passing_score: number;
  };
}

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  answers: QuizAnswer[];
}

interface QuizAnswer {
  id: number;
  answer_text: string;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lessonId, onBack, onComplete }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  useEffect(() => {
    let interval: number;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        
        // Auto-update progress every 10 seconds
        if (timeSpent % 10 === 0 && timeSpent > 0) {
          setProgress(prev => Math.min(100, prev + 5));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeSpent]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      
      // Datos de ejemplo para la lección
      const mockLesson: Lesson = {
        id: lessonId,
        title: lessonId === 1 ? '¿Qué es el Trading?' : 'Terminología Básica del Trading',
        description: lessonId === 1 
          ? 'Introducción al mundo del trading y los mercados financieros'
          : 'Aprende los términos más importantes que todo trader debe conocer',
        content: lessonId === 1 ? `
# ¿Qué es el Trading?

El **trading** es la compra y venta de instrumentos financieros con el objetivo de obtener beneficios a corto plazo. A diferencia de la inversión a largo plazo, el trading se centra en aprovechar las fluctuaciones de precios en períodos más cortos.

## Conceptos Clave

### 1. Mercados Financieros
Los mercados financieros son plataformas donde se negocian activos como:
- **Acciones**: Participaciones en empresas
- **Forex**: Divisas internacionales
- **Criptomonedas**: Monedas digitales como Bitcoin, Ethereum
- **Commodities**: Materias primas como oro, petróleo

### 2. Tipos de Trading
- **Day Trading**: Operaciones que se abren y cierran el mismo día
- **Swing Trading**: Operaciones que duran días o semanas
- **Scalping**: Operaciones muy rápidas, minutos o segundos
- **Position Trading**: Operaciones a largo plazo

### 3. Participantes del Mercado
- **Retail Traders**: Traders individuales
- **Institucionales**: Bancos, fondos de inversión
- **Market Makers**: Proveedores de liquidez

## Ventajas y Riesgos

### Ventajas
✅ Potencial de ganancias rápidas
✅ Flexibilidad horaria
✅ Acceso global a mercados
✅ Apalancamiento disponible

### Riesgos
⚠️ Pérdidas pueden ser significativas
⚠️ Requiere conocimiento y experiencia
⚠️ Estrés emocional
⚠️ Costos de transacción

## Conclusión
El trading puede ser una actividad lucrativa, pero requiere educación, práctica y una gestión adecuada del riesgo.
        ` : `
# Terminología Básica del Trading

## Términos Fundamentales

### Posiciones
- **Long (Compra)**: Apostar a que el precio subirá
- **Short (Venta)**: Apostar a que el precio bajará
- **Posición Abierta**: Operación activa en el mercado
- **Posición Cerrada**: Operación finalizada

### Precios
- **Bid**: Precio de compra (lo que pagan por tu activo)
- **Ask**: Precio de venta (lo que pagas por el activo)
- **Spread**: Diferencia entre Bid y Ask
- **Slippage**: Diferencia entre precio esperado y ejecutado

### Órdenes
- **Market Order**: Orden a precio de mercado (inmediata)
- **Limit Order**: Orden a precio específico
- **Stop Loss**: Orden para limitar pérdidas
- **Take Profit**: Orden para asegurar ganancias

### Análisis
- **Soporte**: Nivel donde el precio tiende a rebotar hacia arriba
- **Resistencia**: Nivel donde el precio tiende a rebotar hacia abajo
- **Tendencia**: Dirección general del precio (alcista, bajista, lateral)
- **Volatilidad**: Medida de variación del precio

## Consejos Importantes
1. **Nunca inviertas más de lo que puedes permitirte perder**
2. **La educación es tu mejor inversión**
3. **Practica con cuentas demo antes de usar dinero real**
4. **Mantén un diario de trading**
        `,
        difficulty: 'beginner',
        lesson_type: lessonId === 2 ? 'quiz' : 'theory',
        duration_minutes: lessonId === 1 ? 15 : 20,
        category_name: 'Fundamentos del Trading',
        category_icon: '📚',
        quiz: lessonId === 2 ? {
          id: 1,
          title: 'Quiz: Terminología Básica',
          passing_score: 70,
          questions: [
            {
              id: 1,
              question_text: '¿Qué significa "Long" en trading?',
              question_type: 'multiple_choice',
              answers: [
                { id: 1, answer_text: 'Apostar a que el precio bajará' },
                { id: 2, answer_text: 'Apostar a que el precio subirá' },
                { id: 3, answer_text: 'Mantener una posición por mucho tiempo' }
              ]
            },
            {
              id: 2,
              question_text: '¿Qué es el "Spread"?',
              question_type: 'multiple_choice',
              answers: [
                { id: 4, answer_text: 'La diferencia entre Bid y Ask' },
                { id: 5, answer_text: 'El apalancamiento máximo' },
                { id: 6, answer_text: 'La volatilidad del mercado' }
              ]
            }
          ]
        } : undefined
      };
      
      setLesson(mockLesson);
      setIsActive(true);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = () => {
    setProgress(100);
    setIsActive(false);
    
    if (lesson?.quiz) {
      setShowQuiz(true);
    } else {
      onComplete?.();
    }
  };

  const handleQuizAnswer = (questionId: number, answerId: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const submitQuiz = () => {
    // Respuestas correctas: pregunta 1 = respuesta 2, pregunta 2 = respuesta 4
    const correctAnswers = { 1: 2, 2: 4 };
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;
    
    Object.entries(correctAnswers).forEach(([questionId, correctAnswerId]) => {
      if (quizAnswers[parseInt(questionId)] === correctAnswerId) {
        score++;
      }
    });
    
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= (lesson?.quiz?.passing_score || 70);
    
    setQuizResult({
      score,
      totalQuestions,
      percentage,
      passed
    });
    setQuizSubmitted(true);
    
    if (passed) {
      onComplete?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lección no encontrada</h2>
          <button
            onClick={onBack}
            className="text-purple-400 hover:text-purple-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-4">{lesson.category_icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
                <p className="text-gray-300 mt-1">{lesson.category_name}</p>
              </div>
            </div>

            {/* Timer and Controls */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-mono text-purple-400">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-gray-400">
                  ~{lesson.duration_minutes} min
                </div>
              </div>
              
              <button
                onClick={() => setIsActive(!isActive)}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Progreso: {progress}%</span>
            <span>{progress === 100 ? 'Completada' : 'En progreso'}</span>
          </div>
        </div>

        {/* Lesson Content */}
        {!showQuiz && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <div className="prose prose-invert prose-purple max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {lesson.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
              <button
                onClick={() => setProgress(Math.min(100, progress + 25))}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continuar
              </button>

              {progress >= 80 && (
                <button
                  onClick={completeLesson}
                  className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completar Lección
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {showQuiz && lesson.quiz && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">{lesson.quiz.title}</h2>
            </div>

            {!quizSubmitted ? (
              <>
                <p className="text-gray-300 mb-6">
                  Responde las siguientes preguntas para completar la lección. 
                  Puntuación mínima requerida: {lesson.quiz.passing_score}%
                </p>

                <div className="space-y-6">
                  {lesson.quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {index + 1}. {question.question_text}
                      </h3>

                      <div className="space-y-3">
                        {question.answers.map((answer) => (
                          <label
                            key={answer.id}
                            className="flex items-center cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={answer.id}
                              onChange={() => handleQuizAnswer(question.id, answer.id)}
                              className="mr-3 text-purple-600"
                            />
                            <span className="text-gray-300">{answer.answer_text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al contenido
                  </button>

                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                    className="flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enviar Respuestas
                  </button>
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center">
                <div className={`text-6xl mb-4 ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {quizResult.passed ? '🎉' : '😔'}
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {quizResult.passed ? '¡Felicitaciones!' : 'No aprobaste'}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  Obtuviste {quizResult.percentage.toFixed(1)}% 
                  ({quizResult.score}/{quizResult.totalQuestions} correctas)
                </p>

                <div className="flex justify-center space-x-4">
                  {!quizResult.passed && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Intentar de nuevo
                    </button>
                  )}
                  
                  <button
                    onClick={onBack}
                    className="flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonViewer;