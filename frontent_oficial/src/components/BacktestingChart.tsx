import React from 'react';
const Plot = React.lazy(() => import('./PlotlyFactory'));

interface BacktestingChartProps {
  data: {
    fechas: string[];
    precio: number[];
    patronVela: number[];
    volma: number[];
    historial: number[];
    'datas closed': number[];
  };
}

export const BacktestingChart: React.FC<BacktestingChartProps> = ({ data }) => {
  // Preparar datos para el gráfico con mejor formato de fechas
  const chartData = (data?.fechas || []).map((fecha, index) => ({
    fecha: fecha, // Mantener formato original para mejor ordenamiento
    fechaDisplay: fecha ? new Date(fecha).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '',
    precio: data.precio?.[index] ?? 0,
    volumen: data.volma?.[index] ?? 0,
    patron: data.patronVela?.[index] ?? 0,
    historial: data.historial?.[index] ?? 0
  })).filter(d => d.precio !== null && d.precio !== undefined && !isNaN(d.precio));

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-900/50 rounded-lg border border-gray-800">
        <p className="text-gray-400">No hay datos suficientes para mostrar el gráfico</p>
      </div>
    );
  }

  // Calcular rangos para mejor visualización
  const precios = chartData.map(d => d.precio);
  const minPrecio = precios.length > 0 ? Math.min(...precios) : 0;
  const maxPrecio = precios.length > 0 ? Math.max(...precios) : 100;
  const rangoPrecio = maxPrecio - minPrecio;

  const volumenes = chartData.map(d => d.volumen);
  const maxVolumen = volumenes.length > 0 ? Math.max(...volumenes) : 100;

  // Trace para el precio
  const priceTrace = {
    x: chartData.map(d => d.fecha),
    y: chartData.map(d => d.precio),
    type: 'scatter' as const,
    mode: 'lines' as const,
    name: 'Precio BTC/USDT',
    line: { color: '#f59e0b', width: 3 },
    hovertemplate: '<b>%{text}</b><br>Precio: $%{y:.2f}<extra></extra>',
    text: chartData.map(d => d.fechaDisplay)
  };

  // Trace para el volumen (como barras)
  const volumeTrace = {
    x: chartData.map(d => d.fecha),
    y: chartData.map(d => d.volumen),
    type: 'bar' as const,
    name: 'Volumen',
    yaxis: 'y2',
    marker: { color: 'rgba(16, 185, 129, 0.6)' },
    hovertemplate: '<b>%{text}</b><br>Volumen: %{y:.0f}<extra></extra>',
    text: chartData.map(d => d.fechaDisplay)
  };

  // Trace para patrones de velas (solo puntos donde hay patrón)
  const patternsData = chartData.filter(d => d.patron > 0);
  const patternTrace = {
    x: patternsData.map(d => d.fecha),
    y: patternsData.map(d => d.precio),
    type: 'scatter' as const,
    mode: 'markers' as const,
    name: 'Señales de Trading',
    marker: {
      color: '#ef4444',
      size: 12,
      symbol: 'triangle-up',
      line: { color: '#ffffff', width: 2 }
    },
    hovertemplate: '<b>%{text}</b><br>Señal: $%{y:.2f}<extra></extra>',
    text: patternsData.map(d => d.fechaDisplay)
  };

  return (
    <div className="w-full">
      <React.Suspense fallback={<div className="h-[500px] w-full flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg animate-pulse">Cargando gráfico...</div>}>
        <Plot
          data={[priceTrace, volumeTrace, patternTrace]}
          layout={{
            title: {
              text: 'Análisis de Backtesting - BTC/USDT',
              font: { color: '#e5e7eb', size: 18 }
            },
            paper_bgcolor: '#111827',
            plot_bgcolor: '#1f2937',
            font: { color: '#d1d5db' },
            xaxis: {
              title: { text: 'Tiempo', font: { color: '#9ca3af' } },
              gridcolor: '#374151',
              zerolinecolor: '#4b5563',
              tickangle: -45,
              type: 'date'
            },
            yaxis: {
              title: { text: 'Precio (USDT)', font: { color: '#f59e0b' } },
              gridcolor: '#374151',
              zerolinecolor: '#4b5563',
              side: 'left',
              range: [minPrecio - (rangoPrecio * 0.05), maxPrecio + (rangoPrecio * 0.05)]
            },
            yaxis2: {
              title: { text: 'Volumen', font: { color: '#10b981' } },
              overlaying: 'y',
              side: 'right',
              showgrid: false,
              range: [0, maxVolumen * 1.2]
            },
            legend: {
              orientation: 'h',
              y: -0.2,
              x: 0.5,
              xanchor: 'center',
              font: { color: '#d1d5db', size: 12 },
              bgcolor: 'rgba(17, 24, 39, 0.9)',
              bordercolor: '#374151',
              borderwidth: 1
            },
            margin: { l: 70, r: 70, t: 80, b: 120 },
            autosize: true,
            hovermode: 'x unified',
            showlegend: true,
            dragmode: 'zoom'
          }}
          useResizeHandler
          style={{ width: '100%', height: '500px' }}
          config={{
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            toImageButtonOptions: {
              format: 'png',
              filename: 'backtesting_chart',
              height: 500,
              width: 1000,
              scale: 1
            }
          }}
        />
      </React.Suspense>
    </div>
  );
};