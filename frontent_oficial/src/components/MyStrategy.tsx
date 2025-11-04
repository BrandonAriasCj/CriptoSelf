import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TradingChart } from './TradingChart';
import { BacktestingChart } from './BacktestingChart';
import { SimpleBacktestingChart } from './SimpleBacktestingChart';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Play, 
  Pause,
  TrendingUp,
  Activity,
  Volume2,
  BarChart3,
  Zap,
  TestTube,
  Settings,
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Shield,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  LineChart
} from 'lucide-react';
// import { toast } from 'sonner';

// Función temporal para toast hasta que se configure correctamente
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.log('❌', message)
};

interface Trigger {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  enabled: boolean;
  params: Record<string, any>;
}

const availableTriggers = [
  {
    id: 'ma_cross',
    type: 'ma_cross',
    name: 'Cruce de Medias Móviles',
    description: 'Se activa cuando la media rápida cruza la media lenta',
    icon: TrendingUp,
    category: 'Tendencia',
    params: { fast_period: 9, slow_period: 21, direction: 'up' }
  },
  {
    id: 'volume_spike',
    type: 'volume_spike',
    name: 'Pico de Volumen',
    description: 'Se activa cuando el volumen supera un umbral específico',
    icon: Volume2,
    category: 'Volumen',
    params: { multiplier: 2.0, period: 20 }
  },
  {
    id: 'rsi_level',
    type: 'rsi_level',
    name: 'Nivel RSI',
    description: 'Se activa cuando el RSI alcanza niveles de sobrecompra/sobreventa',
    icon: BarChart3,
    category: 'Momentum',
    params: { period: 14, oversold: 30, overbought: 70 }
  },
  {
    id: 'price_breakout',
    type: 'price_breakout',
    name: 'Ruptura de Precio',
    description: 'Se activa cuando el precio rompe niveles de soporte/resistencia',
    icon: Activity,
    category: 'Precio',
    params: { period: 20, threshold: 0.02 }
  },
  {
    id: 'bollinger_squeeze',
    type: 'bollinger_squeeze',
    name: 'Compresión Bollinger',
    description: 'Se activa cuando las bandas de Bollinger se contraen',
    icon: Zap,
    category: 'Volatilidad',
    params: { period: 20, std_dev: 2, squeeze_threshold: 0.01 }
  }
];

interface BacktestingConfig {
  symbol: string;
  timeframe: string;
  fecha_inicio: string;
  fecha_fin: string;
  capital_inicial: number;
  ema_fast: number;
  ema_slow: number;
  rsi_period: number;
  stop_loss_mult: number;
  take_profit_mult: number;
  risk_per_trade: number;
  min_volume: number;
  adx_threshold: number;
  bollinger_period: number;
  atr_period: number;
}

const defaultBacktestConfig: BacktestingConfig = {
  symbol: 'BTC/USDT',
  timeframe: '5m',
  fecha_inicio: '2025-01-01',
  fecha_fin: '2025-09-05',
  capital_inicial: 1000,
  ema_fast: 9,
  ema_slow: 21,
  rsi_period: 14,
  stop_loss_mult: 2.0,
  take_profit_mult: 4.0,
  risk_per_trade: 0.02,
  min_volume: 5,
  adx_threshold: 25,
  bollinger_period: 20,
  atr_period: 14
};

export function MyStrategy() {
  const [strategyName, setStrategyName] = useState('Mi Estrategia Principal');
  const [isActive, setIsActive] = useState(true);
  const [showTradingChart, setShowTradingChart] = useState(false);
  const [showBacktesting, setShowBacktesting] = useState(false);
  const [showBacktestConfig, setShowBacktestConfig] = useState(false);
  const [backtestConfig, setBacktestConfig] = useState<BacktestingConfig>(defaultBacktestConfig);
  const [backtestData, setBacktestData] = useState(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestError, setBacktestError] = useState(null);
  const [chartView, setChartView] = useState<'detailed' | 'simple'>('detailed');
  const [configTab, setConfigTab] = useState<'basic' | 'strategy' | 'advanced'>('basic');
  const [activeTriggers, setActiveTriggers] = useState<Trigger[]>([
    {
      ...availableTriggers[0],
      id: 'trigger_1',
      enabled: true
    },
    {
      ...availableTriggers[1],
      id: 'trigger_2',
      enabled: false
    }
  ]);

  const addTrigger = (triggerType: string) => {
    const template = availableTriggers.find(t => t.type === triggerType);
    if (template) {
      const newTrigger: Trigger = {
        ...template,
        id: `trigger_${Date.now()}`,
        enabled: true
      };
      setActiveTriggers(prev => [...prev, newTrigger]);
      toast.success('Trigger agregado exitosamente');
    }
  };

  const removeTrigger = (id: string) => {
    setActiveTriggers(prev => prev.filter(t => t.id !== id));
    toast.success('Trigger eliminado');
  };

  const toggleTrigger = (id: string) => {
    setActiveTriggers(prev => 
      prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
    );
  };

  const updateTriggerParam = (id: string, param: string, value: any) => {
    setActiveTriggers(prev =>
      prev.map(t => 
        t.id === id 
          ? { ...t, params: { ...t.params, [param]: value } }
          : t
      )
    );
  };

  const handleBacktest = async () => {
    setIsBacktesting(true);
    setBacktestError(null);
    setShowBacktesting(true);

    try {
      const response = await fetch('http://localhost:8000/api/backtesting/run-custom/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backtestConfig)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setBacktestData(result);
      toast.success('Backtesting completado exitosamente');
    } catch (err) {
      setBacktestError(err instanceof Error ? err.message : 'Error desconocido');
      toast.error('Error en el backtesting');
    } finally {
      setIsBacktesting(false);
    }
  };

  const updateBacktestConfig = (key: keyof BacktestingConfig, value: string | number) => {
    setBacktestConfig(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: 'conservative' | 'aggressive' | 'scalping') => {
    const presets = {
      conservative: {
        ...defaultBacktestConfig,
        stop_loss_mult: 1.5,
        take_profit_mult: 3.0,
        risk_per_trade: 0.01,
        rsi_period: 21,
        adx_threshold: 30
      },
      aggressive: {
        ...defaultBacktestConfig,
        stop_loss_mult: 3.0,
        take_profit_mult: 6.0,
        risk_per_trade: 0.05,
        rsi_period: 7,
        adx_threshold: 20
      },
      scalping: {
        ...defaultBacktestConfig,
        timeframe: '1m',
        ema_fast: 5,
        ema_slow: 13,
        stop_loss_mult: 0.5,
        take_profit_mult: 1.5,
        risk_per_trade: 0.01
      }
    };
    
    setBacktestConfig(presets[preset]);
    toast.success(`Preset ${preset} aplicado`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tendencia': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'Volumen': return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
      case 'Momentum': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'Precio': return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'Volatilidad': return 'bg-orange-900/30 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  // Si se debe mostrar el gráfico de trading, renderizar ese componente
  if (showTradingChart) {
    return <TradingChart onClose={() => setShowTradingChart(false)} />;
  }

  // Si se debe mostrar el backtesting, renderizar la interfaz de backtesting
  if (showBacktesting) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header del Backtesting */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBacktesting(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Estrategia
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TestTube className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Backtesting: {strategyName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Análisis histórico de rendimiento
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBacktestConfig(!showBacktestConfig)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                  {showBacktestConfig ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </Button>
                <Button
                  onClick={handleBacktest}
                  disabled={isBacktesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isBacktesting ? 'Ejecutando...' : 'Ejecutar Backtesting'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Panel de Configuración */}
        {showBacktestConfig && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración de Backtesting
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Presets */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">🎯 Presets Rápidos</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => applyPreset('conservative')}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <Shield className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-left">
                      <p className="font-medium">Conservador</p>
                      <p className="text-xs text-muted-foreground">Bajo riesgo, SL ajustado</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPreset('aggressive')}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <Zap className="w-5 h-5 text-red-600 mb-2" />
                    <div className="text-left">
                      <p className="font-medium">Agresivo</p>
                      <p className="text-xs text-muted-foreground">Alto riesgo, TP amplio</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPreset('scalping')}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <Clock className="w-5 h-5 text-green-600 mb-2" />
                    <div className="text-left">
                      <p className="font-medium">Scalping</p>
                      <p className="text-xs text-muted-foreground">1m, EMAs rápidas</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Tabs de Configuración */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                {[
                  { id: 'basic', label: 'Básico', icon: Calendar },
                  { id: 'strategy', label: 'Estrategia', icon: TrendingUp },
                  { id: 'advanced', label: 'Avanzado', icon: BarChart3 }
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant="ghost"
                    onClick={() => setConfigTab(id as any)}
                    className={`flex items-center gap-2 border-b-2 rounded-none ${
                      configTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Configuración Básica */}
              {configTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Par de Trading</Label>
                    <Select
                      value={backtestConfig.symbol}
                      onValueChange={(value) => updateBacktestConfig('symbol', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                        <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Timeframe</Label>
                    <Select
                      value={backtestConfig.timeframe}
                      onValueChange={(value) => updateBacktestConfig('timeframe', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Minuto</SelectItem>
                        <SelectItem value="5m">5 Minutos</SelectItem>
                        <SelectItem value="15m">15 Minutos</SelectItem>
                        <SelectItem value="1h">1 Hora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Fecha Inicio</Label>
                    <Input
                      type="date"
                      value={backtestConfig.fecha_inicio}
                      onChange={(e) => updateBacktestConfig('fecha_inicio', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Fecha Fin</Label>
                    <Input
                      type="date"
                      value={backtestConfig.fecha_fin}
                      onChange={(e) => updateBacktestConfig('fecha_fin', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Capital Inicial: ${backtestConfig.capital_inicial}</Label>
                    <input
                      type="range"
                      min="100"
                      max="100000"
                      step="100"
                      value={backtestConfig.capital_inicial}
                      onChange={(e) => updateBacktestConfig('capital_inicial', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Configuración de Estrategia */}
              {configTab === 'strategy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>EMA Rápida: {backtestConfig.ema_fast}</Label>
                    <input
                      type="range"
                      min="3"
                      max="50"
                      value={backtestConfig.ema_fast}
                      onChange={(e) => updateBacktestConfig('ema_fast', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>EMA Lenta: {backtestConfig.ema_slow}</Label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={backtestConfig.ema_slow}
                      onChange={(e) => updateBacktestConfig('ema_slow', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>Stop Loss: {backtestConfig.stop_loss_mult}x</Label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={backtestConfig.stop_loss_mult}
                      onChange={(e) => updateBacktestConfig('stop_loss_mult', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>Take Profit: {backtestConfig.take_profit_mult}x</Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={backtestConfig.take_profit_mult}
                      onChange={(e) => updateBacktestConfig('take_profit_mult', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>RSI Período: {backtestConfig.rsi_period}</Label>
                    <input
                      type="range"
                      min="7"
                      max="30"
                      value={backtestConfig.rsi_period}
                      onChange={(e) => updateBacktestConfig('rsi_period', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>Riesgo por Trade: {(backtestConfig.risk_per_trade * 100).toFixed(1)}%</Label>
                    <input
                      type="range"
                      min="0.005"
                      max="0.1"
                      step="0.005"
                      value={backtestConfig.risk_per_trade}
                      onChange={(e) => updateBacktestConfig('risk_per_trade', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Configuración Avanzada */}
              {configTab === 'advanced' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Volumen Mínimo: {backtestConfig.min_volume}</Label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={backtestConfig.min_volume}
                      onChange={(e) => updateBacktestConfig('min_volume', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>ADX Threshold: {backtestConfig.adx_threshold}</Label>
                    <input
                      type="range"
                      min="15"
                      max="40"
                      value={backtestConfig.adx_threshold}
                      onChange={(e) => updateBacktestConfig('adx_threshold', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>Bollinger Bands: {backtestConfig.bollinger_period}</Label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={backtestConfig.bollinger_period}
                      onChange={(e) => updateBacktestConfig('bollinger_period', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label>ATR Período: {backtestConfig.atr_period}</Label>
                    <input
                      type="range"
                      min="7"
                      max="30"
                      value={backtestConfig.atr_period}
                      onChange={(e) => updateBacktestConfig('atr_period', Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Risk/Reward Visualization */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">📊 Métricas de Riesgo</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      1:{(backtestConfig.take_profit_mult / backtestConfig.stop_loss_mult).toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Risk/Reward</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {((1 / (1 + backtestConfig.stop_loss_mult / backtestConfig.take_profit_mult)) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Win Rate Necesario</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      ${(backtestConfig.capital_inicial * backtestConfig.risk_per_trade).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Riesgo por Trade</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isBacktesting && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Ejecutando backtesting...</p>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {backtestError && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400">Error: {backtestError}</p>
            </CardContent>
          </Card>
        )}

        {/* Resultados del Backtesting */}
        {backtestData && (
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
                      {backtestData.fechas?.length || 0} velas
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
                    <p className="text-sm text-green-700 dark:text-green-300">Rentabilidad</p>
                    <p className="font-bold text-green-900 dark:text-green-100">
                      {backtestData.resumen?.rentabilidad_porcentaje?.toFixed(2) || '0.00'}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Tasa de Acierto</p>
                    <p className="font-bold text-purple-900 dark:text-purple-100">
                      {backtestData.resumen?.tasa_acierto?.toFixed(1) || '0.0'}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Gráfico de Backtesting
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={chartView === 'detailed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('detailed')}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Completo
                    </Button>
                    <Button
                      variant={chartView === 'simple' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('simple')}
                    >
                      <LineChart className="w-4 h-4 mr-1" />
                      Simple
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {chartView === 'detailed' ? (
                  <BacktestingChart data={backtestData} />
                ) : (
                  <SimpleBacktestingChart data={backtestData} />
                )}
              </CardContent>
            </Card>

            {/* Resumen de Resultados */}
            <div className="flex flex-row gap-6">
              {/* Análisis de Patrones */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Análisis de Patrones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {backtestData.patronVela?.filter((p: any) => p > 0).length || 0}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Patrones Detectados
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {backtestData.patronVela ? 
                          ((backtestData.patronVela.filter((p: any) => p > 0).length / backtestData.patronVela.length) * 100).toFixed(1)
                          : '0.0'
                        }%
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tasa de Detección
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen Financiero */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Resumen Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Capital */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-lg font-bold">
                          ${backtestData.resumen?.capital_inicial?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-xs text-muted-foreground">Capital Inicial</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-lg font-bold">
                          ${backtestData.resumen?.capital_final?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-xs text-muted-foreground">Capital Final</p>
                      </div>
                    </div>

                    {/* Operaciones */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">
                          {backtestData.resumen?.operaciones_totales || 0}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Total</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                          {backtestData.resumen?.operaciones_ganadas || 0}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">Ganadas</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <p className="text-lg font-bold text-red-600">
                          {backtestData.resumen?.operaciones_perdidas || 0}
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300">Perdidas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Strategy Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{strategyName}</CardTitle>
                <p>Powered by CriptoSelf</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Estado:</Label>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={setIsActive}
                />
                <Badge className={isActive ? 'bg-green-600' : 'bg-gray-600'}>
                  {isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Nombre de la Estrategia</Label>
              <Input
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                onClick={handleBacktest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Ejecutar Backtesting
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Triggers */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Triggers Activos</CardTitle>
              <p className="text-muted-foreground">Señales que activarán tu estrategia de trading</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTriggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <Card key={trigger.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{trigger.name}</h4>
                            <p className="text-sm text-muted-foreground">{trigger.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(trigger.category)}>
                            {trigger.category}
                          </Badge>
                          <Switch
                            checked={trigger.enabled}
                            onCheckedChange={() => toggleTrigger(trigger.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTrigger(trigger.id)}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Trigger Parameters */}
                      {trigger.enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t">
                          {Object.entries(trigger.params).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-xs text-muted-foreground capitalize">
                                {key.replace('_', ' ')}
                              </Label>
                              <Input
                                type={typeof value === 'number' ? 'number' : 'text'}
                                value={value}
                                onChange={(e) => updateTriggerParam(
                                  trigger.id, 
                                  key, 
                                  typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
                                )}
                                className="text-sm h-8"
                                step={typeof value === 'number' ? '0.1' : undefined}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {activeTriggers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No hay triggers configurados</p>
                  <p className="text-sm">Agrega tu primer trigger para comenzar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add New Trigger */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Agregar Trigger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTriggers.map((trigger) => {
                const Icon = trigger.icon;
                const isAdded = activeTriggers.some(t => t.type === trigger.type);
                
                return (
                  <Button
                    key={trigger.type}
                    variant="outline"
                    className="w-full h-auto p-3 justify-start"
                    onClick={() => addTrigger(trigger.type)}
                    disabled={isAdded}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">{trigger.name}</p>
                        <p className="text-xs text-muted-foreground">{trigger.category}</p>
                      </div>
                      {isAdded ? (
                        <Badge variant="outline" className="text-xs">
                          Agregado
                        </Badge>
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Strategy Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Triggers Activos</span>
                <Badge>
                  {activeTriggers.filter(t => t.enabled).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Estado</span>
                <Badge className={isActive ? 'bg-green-600' : 'bg-gray-600'}>
                  {isActive ? 'Ejecutándose' : 'Pausada'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Última Activación</span>
                <span className="text-sm">Hace 2 horas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}