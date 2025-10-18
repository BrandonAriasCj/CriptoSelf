import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TradingChart } from './TradingChart';
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
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

export function MyStrategy() {
  const [strategyName, setStrategyName] = useState('Mi Estrategia Principal');
  const [isActive, setIsActive] = useState(true);
  const [showTradingChart, setShowTradingChart] = useState(false);
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

  const handleBacktest = () => {
    setShowTradingChart(true);
    toast.success('Iniciando análisis de backtesting...');
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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Strategy Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{strategyName}</CardTitle>
                <p className="">Powered by CriptoSelf</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="">Estado:</Label>
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
              <Label className="">Nombre de la Estrategia</Label>
              <Input
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
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
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Triggers */}
        <div className="lg:col-span-2">
          <Card className="">
            <CardHeader>
              <CardTitle className="">Triggers Activos</CardTitle>
              <p className="text-gray-400">Señales que activarán tu estrategia de trading</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTriggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <Card key={trigger.id} className="">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 " />
                          </div>
                          <div>
                            <h4 className="font-medium">{trigger.name}</h4>
                            <p className="text-sm">{trigger.description}</p>
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
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Trigger Parameters */}
                      {trigger.enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-600">
                          {Object.entries(trigger.params).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-xs text-gray-400 scapitalize">
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
                                className="bg-gray-700 border-gray-500 text-white text-sm h-8"
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
                <div className="text-center py-8 text-gray-400">
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
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Agregar Trigger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTriggers.map((trigger) => {
                const Icon = trigger.icon;
                const isAdded = activeTriggers.some(t => t.type === trigger.type);
                
                return (
                  <Button
                    key={trigger.type}
                    variant="outline"
                    className="w-full h-auto p-3 border-gray-600 hover:bg-gray-800 justify-start"
                    onClick={() => addTrigger(trigger.type)}
                    disabled={isAdded}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-white text-sm">{trigger.name}</p>
                        <p className="text-xs text-gray-400">{trigger.category}</p>
                      </div>
                      {isAdded ? (
                        <Badge variant="outline" className="text-xs">
                          Agregado
                        </Badge>
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
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
              <CardTitle className="">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="">Triggers Activos</span>
                <Badge className="">
                  {activeTriggers.filter(t => t.enabled).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="">Estado</span>
                <Badge className={isActive ? 'bg-green-600' : 'bg-gray-600'}>
                  {isActive ? 'Ejecutándose' : 'Pausada'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="">Última Activación</span>
                <span className="text-sm">Hace 2 horas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}