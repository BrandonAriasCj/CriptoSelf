import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Lección no encontrada</h2>
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{lesson.category_icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{lesson.category_name}</p>
              </div>
            </div>

            {/* Timer and Controls */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-mono text-primary">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-xs text-muted-foreground">
                  ~{lesson.duration_minutes} min
                </div>
              </div>
              
              <button
                onClick={() => setIsActive(!isActive)}
                className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso: {progress}%</span>
            <span>{progress === 100 ? 'Completada' : 'En progreso'}</span>
          </div>
        </div>

        {/* Lesson Content */}
        {!showQuiz && (
          <div className="bg-card rounded-xl p-8 border border-border mb-8">
            <div className="prose prose-base max-w-none
              prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:pb-3 prose-h1:border-b prose-h1:border-border
              prose-h2:text-2xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/50
              prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-primary
              prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:text-[15px]
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-foreground prose-em:italic
              prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:space-y-2
              prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:space-y-2
              prose-li:my-1.5 prose-li:leading-relaxed prose-li:text-[15px]
              prose-li>ul:mt-2 prose-li>ul:mb-2 prose-li>ul:ml-4 prose-li>ul:pl-4
              prose-li>ol:mt-2 prose-li>ol:mb-2 prose-li>ol:ml-4 prose-li>ol:pl-4
              prose-code:text-primary prose-code:bg-muted prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:rounded-r
              prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-primary/80
              prose-hr:border-border prose-hr:my-8
              prose-table:border-collapse prose-table:w-full
              prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-foreground
              prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:text-muted-foreground
              prose-img:rounded-lg prose-img:shadow-md
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                onClick={() => setProgress(Math.min(100, progress + 25))}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                Continuar
              </button>

              {progress >= 80 && (
                <button
                  onClick={completeLesson}
                  className="flex items-center gap-2 px-6 py-2 bg-chart-2 hover:bg-chart-2/90 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Completar Lección
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {showQuiz && lesson.quiz && (
          <div className="bg-card rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-chart-4" />
              <h2 className="text-2xl font-bold text-foreground">{lesson.quiz.title}</h2>
            </div>

            {!quizSubmitted ? (
              <>
                <p className="text-muted-foreground mb-6 text-sm">
                  Responde las siguientes preguntas para completar la lección. 
                  Puntuación mínima requerida: {lesson.quiz.passing_score}%
                </p>

                <div className="space-y-4">
                  {lesson.quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-muted/30 rounded-lg p-5 border border-border">
                      <h3 className="text-base font-semibold text-foreground mb-4">
                        {index + 1}. {question.question_text}
                      </h3>

                      <div className="space-y-2">
                        {question.answers.map((answer) => (
                          <label
                            key={answer.id}
                            className="flex items-center cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors border border-transparent hover:border-border"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={answer.id}
                              onChange={() => handleQuizAnswer(question.id, answer.id)}
                              className="mr-3 accent-primary"
                            />
                            <span className="text-foreground text-sm">{answer.answer_text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al contenido
                  </button>

                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Enviar Respuestas
                  </button>
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center">
                <div className={`text-6xl mb-4 ${quizResult.passed ? 'text-chart-2' : 'text-destructive'}`}>
                  {quizResult.passed ? '🎉' : '😔'}
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${quizResult.passed ? 'text-chart-2' : 'text-destructive'}`}>
                  {quizResult.passed ? '¡Felicitaciones!' : 'No aprobaste'}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Obtuviste {quizResult.percentage.toFixed(1)}% 
                  ({quizResult.score}/{quizResult.totalQuestions} correctas)
                </p>

                <div className="flex justify-center gap-4">
                  {!quizResult.passed && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Intentar de nuevo
                    </button>
                  )}
                  
                  <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2 bg-chart-2 hover:bg-chart-2/90 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <ArrowRight className="w-4 h-4" />
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