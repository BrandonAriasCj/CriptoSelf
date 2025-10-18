import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface BacktestingData {
  fechas: string[];
  precio: number[];
  patronVela: number[];
  volma: number[];
  historial: number[];
  'datas closed': number[];
}

export function BacktestingDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const runDemo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/backtesting/run-demo/');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = () => {
    if (!data) return [];
    
    return data.fechas.map((fecha, index) => ({
      fecha: new Date(fecha).toLocaleDateString(),
      precio: data.precio[index],
      volumen: data.volma[index] || 0,
      patron: data.patronVela[index] || 0
    })).slice(0, 100); // Mostrar solo los primeros 100 puntos para mejor rendimiento
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Simulación de Backtesting</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Estrategia de Scalping con Patrón de Velas - BTC/USDT
                </p>
              </div>
            </div>
            <button 
              onClick={runDemo} 
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Ejecutando...' : 'Ejecutar Demo'}
            </button>
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-4">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ejecutando simulación...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {data && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Datos Procesados</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">
                    {data.fechas.length} velas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Precio Final</p>
                  <p className="font-bold text-green-900 dark:text-green-100">
                    ${data.precio[data.precio.length - 1]?.toFixed(2) || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Volumen Promedio</p>
                  <p className="font-bold text-purple-900 dark:text-purple-100">
                    {(data.volma.reduce((a, b) => a + b, 0) / data.volma.length).toFixed(0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Datos de la Simulación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Data */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Precios BTC/USDT</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.fechas.slice(0, 10).map((fecha, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm text-muted-foreground">
                          {new Date(fecha).toLocaleDateString()}
                        </span>
                        <span className="font-mono font-semibold">
                          ${data.precio[index]?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Mostrando primeros 10 de {data.fechas.length} registros
                  </p>
                </div>

                {/* Volume Data */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Volumen de Trading</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.volma.slice(0, 10).map((vol, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm text-muted-foreground">
                          Vela {index + 1}
                        </span>
                        <span className="font-mono font-semibold">
                          {vol?.toFixed(0) || '0'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Promedio: {(data.volma.reduce((a, b) => a + b, 0) / data.volma.length).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análisis de Patrones de Velas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {data.patronVela.filter(p => p > 0).length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Patrones Detectados
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {((data.patronVela.filter(p => p > 0).length / data.patronVela.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Tasa de Detección
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {data.fechas.length}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Total de Velas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}