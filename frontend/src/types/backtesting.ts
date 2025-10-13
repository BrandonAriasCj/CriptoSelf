export interface BacktestingResult {
  status: string;
  capital_inicial: number;
  capital_final: number;
  ganancia_perdida: number;
  rentabilidad_porcentaje: number;
  operaciones_totales: number;
  operaciones_ganadas: number;
  operaciones_perdidas: number;
  velas_negativas?: number;
  tasa_acierto: number;
  output_log: string;
  parametros: BacktestingParameters;
}

export interface BacktestingParameters {
  symbol: string;
  timeframe: string;
  fecha_inicio: string;
  fecha_fin: string;
  capital_inicial?: number;
}

export interface CustomBacktestingRequest {
  symbol?: string;
  timeframe?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  capital_inicial?: number;
}

export interface StrategyInfo {
  strategy_name: string;
  indicators: string[];
  parameters: {
    [key: string]: number | string;
  };
  patron_vela_methods: string[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}