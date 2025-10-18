import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  BarChart3, 
  Calculator,
  Shield,
  TestTube,
  PlayCircle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: any;
  lessons: Lesson[];
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  progress: number;
}

const courses: Course[] = [
  {
    id: 'basics',
    title: 'Trading Cuantitativo Básico',
    description: 'Fundamentos del trading algorítmico',
    icon: Calculator,
    difficulty: 'Básico',
    progress: 75,
    lessons: [
      { id: '1', title: '¿Qué es el Trading Cuantitativo?', duration: '10 min', completed: true },
      { id: '2', title: 'Datos de Mercado', duration: '15 min', completed: true },
      { id: '3', title: 'Tipos de Estrategias', duration: '20 min', completed: true },
      { id: '4', title: 'Timeframes', duration: '10 min', completed: false }
    ]
  },
  {
    id: 'indicators',
    title: 'Indicadores Técnicos',
    description: 'Medias móviles, RSI, MACD y más',
    icon: BarChart3,
    difficulty: 'Intermedio',
    progress: 25,
    lessons: [
      { id: '1', title: 'Medias Móviles', duration: '25 min', completed: true },
      { id: '2', title: 'RSI y Momentum', duration: '30 min', completed: false },
      { id: '3', title: 'Bollinger Bands', duration: '20 min', completed: false },
      { id: '4', title: 'Análisis de Volumen', duration: '25 min', completed: false }
    ]
  },
  {
    id: 'strategies',
    title: 'Desarrollo de Estrategias',
    description: 'Crea estrategias rentables',
    icon: TrendingUp,
    difficulty: 'Avanzado',
    progress: 0,
    lessons: [
      { id: '1', title: 'Diseño de Estrategias', duration: '35 min', completed: false },
      { id: '2', title: 'Entry y Exit Rules', duration: '40 min', completed: false },
      { id: '3', title: 'Position Sizing', duration: '30 min', completed: false }
    ]
  },
  {
    id: 'risk',
    title: 'Gestión de Riesgo',
    description: 'Protege tu capital',
    icon: Shield,
    difficulty: 'Intermedio',
    progress: 0,
    lessons: [
      { id: '1', title: 'Stop Loss Básico', duration: '20 min', completed: false },
      { id: '2', title: 'Dimensionamiento', duration: '25 min', completed: false },
      { id: '3', title: 'Diversificación', duration: '30 min', completed: false }
    ]
  },
  {
    id: 'backtesting',
    title: 'Backtesting',
    description: 'Valida tus estrategias',
    icon: TestTube,
    difficulty: 'Avanzado',
    progress: 0,
    lessons: [
      { id: '1', title: 'Configurar Backtest', duration: '30 min', completed: false },
      { id: '2', title: 'Métricas Clave', duration: '25 min', completed: false },
      { id: '3', title: 'Optimización', duration: '35 min', completed: false }
    ]
  }
];

const quickTips = [
  'Siempre usa cuentas demo antes de dinero real',
  'Nunca arriesgues más del 2% por operación',
  'Backtesting es esencial para validar estrategias',
  'Documenta todos tus trades y resultados',
  'La gestión de riesgo es más importante que la rentabilidad'
];

export function Education() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-500/20 text-green-400';
      case 'Intermedio': return 'bg-yellow-500/20 text-yellow-400';
      case 'Avanzado': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (selectedCourse) {
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return null;

    return (
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedCourse(null)}
          >
            ← Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <course.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center gap-4">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{course.lessons.length} lecciones</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progreso</span>
                <span className="text-sm">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <Card key={lesson.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed ? 'bg-green-500' : 'bg-muted'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{lesson.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className={lesson.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                  >
                    {lesson.completed ? 'Completado' : 'Empezar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Academia CriptoSelf</CardTitle>
              <p className="text-muted-foreground">Aprende trading cuantitativo paso a paso</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const Icon = course.icon;
          
          return (
            <Card 
              key={course.id} 
              className="hover:border-muted-foreground transition-colors cursor-pointer"
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">{course.description}</p>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progreso</span>
                    <span className="text-sm">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{course.lessons.length} lecciones</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Consejos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}