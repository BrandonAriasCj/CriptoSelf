import React, { useState } from 'react';
import { backtestingService } from '../services/api';
import { BacktestingResult, CustomBacktestingRequest, StrategyInfo } from '../types/backtesting';

const Backtesting: React.FC = () => {
  const [result, setResult] = useState<BacktestingResult | null>(null);
  const [strategyInfo, setStrategyInfo] = useState<StrategyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customParams, setCustomParams] = useState<CustomBacktestingRequest>({
    symbol: 'BTC/USDT',
    timeframe: '5m',
    fecha_inicio: '2025-01-01',
    fecha_fin: '2025-03-01',
    capital_inicial: 100,
  });

  const runDemo = async () => {
    setIsLoading(true);
    setError('');
    try {
      const demoResult = await backtestingService.runDemo();
      setResult(demoResult);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error ejecutando demo');
    } finally {
      setIsLoading(false);
    }
  };

  const runCustom = async () => {
    setIsLoading(true);
    setError('');
    try {
      const customResult = await backtestingService.runCustom(customParams);
      setResult(customResult);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error ejecutando backtesting personalizado');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStrategyInfo = async () => {
    try {
      const info = await backtestingService.getStrategyInfo();
      setStrategyInfo(info);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error cargando información de estrategia');
    }
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomParams(prev => ({
      ...prev,
      [name]: name === 'capital_inicial' ? Number(value) : value,
    }));
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📈 Sistema de Backtesting</h1>
        <p>Ejecuta estrategias de trading y analiza los resultados históricos.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <h3>🚀 Demo Rápido</h3>
          <p>Ejecuta el backtesting con parámetros predeterminados:</p>
          <ul>
            <li>Symbol: BTC/USDT</li>
            <li>Timeframe: 5m</li>
            <li>Período: 2025-01-01 a 2025-09-05</li>
            <li>Capital inicial: $100</li>
          </ul>
          <button 
            onClick={runDemo}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Ejecutando...' : 'Ejecutar Demo'}
          </button>
        </div>

        <div className="card">
          <h3>⚙️ Backtesting Personalizado</h3>
          <div className="form-group">
            <label className="form-label">Symbol:</label>
            <select
              name="symbol"
              className="form-input"
              value={customParams.symbol}
              onChange={handleParamChange}
            >
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="ADA/USDT">ADA/USDT</option>
              <option value="DOT/USDT">DOT/USDT</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Timeframe:</label>
            <select
              name="timeframe"
              className="form-input"
              value={customParams.timeframe}
              onChange={handleParamChange}
            >
              <option value="1m">1 minuto</option>
              <option value="5m">5 minutos</option>
              <option value="15m">15 minutos</option>
              <option value="1h">1 hora</option>
              <option value="4h">4 horas</option>
              <option value="1d">1 día</option>
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Fecha inicio:</label>
              <input
                type="date"
                name="fecha_inicio"
                className="form-input"
                value={customParams.fecha_inicio}
                onChange={handleParamChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha fin:</label>
              <input
                type="date"
                name="fecha_fin"
                className="form-input"
                value={customParams.fecha_fin}
                onChange={handleParamChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Capital inicial ($):</label>
            <input
              type="number"
              name="capital_inicial"
              className="form-input"
              value={customParams.capital_inicial}
              onChange={handleParamChange}
              min="1"
              step="0.01"
            />
          </div>

          <button 
            onClick={runCustom}
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? 'Ejecutando...' : 'Ejecutar Personalizado'}
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>📋 Información de Estrategia</h3>
          <button 
            onClick={loadStrategyInfo}
            className="btn btn-secondary"
          >
            Cargar Info
          </button>
        </div>

        {strategyInfo && (
          <div className="grid grid-2">
            <div>
              <h4>Estrategia: {strategyInfo.strategy_name}</h4>
              <h5>Indicadores:</h5>
              <ul>
                {strategyInfo.indicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5>Parámetros:</h5>
              <ul>
                {Object.entries(strategyInfo.parameters).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="card">
          <h3>📊 Resultados del Backtesting</h3>
          
          <div className="grid grid-3">
            <div className="card">
              <h4>💰 Rendimiento</h4>
              <p><strong>Capital inicial:</strong> ${result.capital_inicial.toFixed(2)}</p>
              <p><strong>Capital final:</strong> ${result.capital_final.toFixed(2)}</p>
              <p><strong>Ganancia/Pérdida:</strong> 
                <span style={{ color: result.ganancia_perdida >= 0 ? 'green' : 'red' }}>
                  ${result.ganancia_perdida.toFixed(2)}
                </span>
              </p>
              <p><strong>Rentabilidad:</strong> 
                <span style={{ color: result.rentabilidad_porcentaje >= 0 ? 'green' : 'red' }}>
                  {result.rentabilidad_porcentaje.toFixed(2)}%
                </span>
              </p>
            </div>

            <div className="card">
              <h4>📈 Operaciones</h4>
              <p><strong>Total:</strong> {result.operaciones_totales}</p>
              <p><strong>Ganadas:</strong> <span style={{ color: 'green' }}>{result.operaciones_ganadas}</span></p>
              <p><strong>Perdidas:</strong> <span style={{ color: 'red' }}>{result.operaciones_perdidas}</span></p>
              <p><strong>Tasa de acierto:</strong> {result.tasa_acierto.toFixed(2)}%</p>
            </div>

            <div className="card">
              <h4>⚙️ Parámetros</h4>
              <p><strong>Symbol:</strong> {result.parametros.symbol}</p>
              <p><strong>Timeframe:</strong> {result.parametros.timeframe}</p>
              <p><strong>Período:</strong> {result.parametros.fecha_inicio} - {result.parametros.fecha_fin}</p>
            </div>
          </div>

          {result.output_log && (
            <div className="card">
              <h4>📝 Log de Ejecución</h4>
              <pre style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '14px'
              }}>
                {result.output_log}
              </pre>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Ejecutando backtesting... Esto puede tomar unos momentos.</p>
        </div>
      )}
    </div>
  );
};

export default Backtesting;