import React, { useEffect, useRef, useState } from "react";

interface Position {
  id: string;
  type: 'long' | 'short';
  pair: string;
  size: number;
  entryPrice: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: Date;
  status: 'open' | 'closed';
  pnl: number;
  unrealizedPnL: number;
}

interface PriceChartProps {
  selectedPair?: string;
  positions?: Position[];
  currentPrice?: number;
}

interface PriceData {
  time: string;
  price: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  selectedPair = 'BTC/USDT', 
  positions = [], 
  currentPrice: externalCurrentPrice 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const wsRef = useRef<WebSocket | null>(null);

  // Constantes para la persistencia
  const HISTORY_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
  const STORAGE_KEY_PREFIX = 'priceChart_';

  // Mapear pares de trading a símbolos de Binance
  const getSymbolForPair = (pair: string): string => {
    const symbolMap: { [key: string]: string } = {
      'BTC/USDT': 'btcusdt',
      'ETH/USDT': 'ethusdt',
      'ADA/USDT': 'adausdt',
      'SOL/USDT': 'solusdt',
    };
    return symbolMap[pair] || 'btcusdt';
  };

  // Funciones de persistencia
  const getStorageKey = (pair: string) => `${STORAGE_KEY_PREFIX}${pair}`;

  const saveDataToStorage = (pair: string, data: PriceData[]) => {
    try {
      const storageData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(getStorageKey(pair), JSON.stringify(storageData));
    } catch (error) {
      console.warn('Error saving price data to localStorage:', error);
    }
  };

  const loadDataFromStorage = (pair: string): PriceData[] => {
    try {
      const stored = localStorage.getItem(getStorageKey(pair));
      if (!stored) return [];

      const { data, timestamp } = JSON.parse(stored);
      const now = Date.now();

      // Si los datos son muy antiguos (más de 5 minutos), no los usar
      if (now - timestamp > HISTORY_DURATION) {
        localStorage.removeItem(getStorageKey(pair));
        return [];
      }

      // Filtrar datos que sean más antiguos de 5 minutos
      const cutoffTime = now - HISTORY_DURATION;
      return data.filter((point: PriceData) =>
        new Date(point.time).getTime() > cutoffTime
      );
    } catch (error) {
      console.warn('Error loading price data from localStorage:', error);
      return [];
    }
  };

  const cleanOldData = (data: PriceData[]): PriceData[] => {
    const cutoffTime = Date.now() - HISTORY_DURATION;
    return data.filter(point =>
      new Date(point.time).getTime() > cutoffTime
    );
  };

  // Generar datos simulados solo si no hay datos en storage
  const generateSimulatedData = (pair: string): PriceData[] => {
    const data: PriceData[] = [];
    const basePrice = pair === 'BTC/USDT' ? 55000 :
      pair === 'ETH/USDT' ? 2600 :
        pair === 'ADA/USDT' ? 0.45 : 98;

    const now = Date.now();

    // Variación máxima por paso para cada par
    const maxStepVariation = pair === 'ADA/USDT' ? 0.001 : // ±0.1% por paso para ADA
      pair === 'BTC/USDT' ? 0.0005 : // ±0.05% por paso para BTC
        pair === 'ETH/USDT' ? 0.0008 : // ±0.08% por paso para ETH
          0.001; // ±0.1% por paso para otros

    let currentPrice = basePrice;

    // Generar puntos con continuidad (random walk)
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now - i * 10000).toISOString(); // 10 segundos por punto

      // Aplicar variación pequeña al precio anterior
      const variation = (Math.random() - 0.5) * maxStepVariation;
      currentPrice = currentPrice * (1 + variation);

      data.push({
        time,
        price: Number(currentPrice.toFixed(pair === 'ADA/USDT' ? 4 : 2)),
      });
    }

    return data;
  };




  // Dibujar el gráfico de líneas en canvas
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || priceData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Configurar colores
    const lineColor = '#3b82f6';
    const fillColor = 'rgba(59, 130, 246, 0.1)';
    const gridColor = '#374151';
    const textColor = '#9ca3af';

    // Calcular rangos con zoom automático adaptativo
    const prices = priceData.map((d: PriceData) => d.price);
    const rawMinPrice = Math.min(...prices);
    const rawMaxPrice = Math.max(...prices);
    const rawRange = rawMaxPrice - rawMinPrice;

    // Calcular el precio promedio para determinar el contexto
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // Determinar el rango mínimo basado en el precio promedio y el par
    let minRangePercent: number;
    if (selectedPair === 'ADA/USDT') {
      minRangePercent = 0.002; // 0.2% para ADA (más sensible)
    } else if (selectedPair === 'BTC/USDT') {
      minRangePercent = 0.001; // 0.1% para BTC
    } else if (selectedPair === 'ETH/USDT') {
      minRangePercent = 0.0015; // 0.15% para ETH
    } else {
      minRangePercent = 0.002; // 0.2% para otros
    }

    const minRange = avgPrice * minRangePercent;

    // Si el rango real es muy pequeño, usar el rango mínimo
    const effectiveRange = Math.max(rawRange, minRange);

    // Calcular padding adicional (10% del rango efectivo)
    const padding_percent = 0.1;
    const rangePadding = effectiveRange * padding_percent;

    // Aplicar el rango con padding
    const minPrice = rawMinPrice - rangePadding;
    const maxPrice = rawMaxPrice + rangePadding;
    const priceRange = maxPrice - minPrice;

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Dibujar grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Líneas horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Etiquetas de precio
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2), padding - 5, y + 4);
    }

    // Líneas verticales (tiempo)
    const timeSteps = 6;
    for (let i = 0; i <= timeSteps; i++) {
      const x = padding + (chartWidth / timeSteps) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // Etiquetas de tiempo
      if (i < priceData.length) {
        const dataIndex = Math.floor((priceData.length - 1) * (i / timeSteps));
        const timeStr = new Date(priceData[dataIndex].time).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        });
        ctx.fillStyle = textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(timeStr, x, height - padding + 15);
      }
    }

    // Crear path para el área bajo la línea
    ctx.beginPath();
    priceData.forEach((point: PriceData, index: number) => {
      const x = padding + (chartWidth / (priceData.length - 1)) * index;
      const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Completar el área hasta el fondo
    if (priceData.length > 0) {
      const lastX = padding + chartWidth;
      const lastY = padding + ((maxPrice - priceData[priceData.length - 1].price) / priceRange) * chartHeight;
      ctx.lineTo(lastX, lastY);
      ctx.lineTo(lastX, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();

      // Rellenar área
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    // Dibujar línea principal
    ctx.beginPath();
    priceData.forEach((point: PriceData, index: number) => {
      const x = padding + (chartWidth / (priceData.length - 1)) * index;
      const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar puntos en la línea
    priceData.forEach((point: PriceData, index: number) => {
      const x = padding + (chartWidth / (priceData.length - 1)) * index;
      const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = lineColor;
      ctx.fill();
    });

    // Dibujar posiciones de trading
    if (positions && positions.length > 0) {
      positions.forEach((position: Position) => {
        if (position.pair !== selectedPair) return;

        const entryY = padding + ((maxPrice - position.entryPrice) / priceRange) * chartHeight;
        
        // Encontrar el punto temporal más cercano a la entrada
        const entryTime = position.timestamp.getTime();
        let entryX = padding;
        
        // Buscar la posición X basada en el tiempo de entrada
        const timeRange = priceData.length > 1 ? 
          new Date(priceData[priceData.length - 1].time).getTime() - new Date(priceData[0].time).getTime() : 
          300000; // 5 minutos por defecto
        
        if (timeRange > 0) {
          const timeFromStart = entryTime - new Date(priceData[0]?.time || Date.now()).getTime();
          const timeRatio = Math.max(0, Math.min(1, timeFromStart / timeRange));
          entryX = padding + (chartWidth * timeRatio);
        }

        // Línea horizontal de entrada
        ctx.strokeStyle = position.type === 'long' ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(entryX, entryY);
        ctx.lineTo(width - padding, entryY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Marcador de entrada
        ctx.beginPath();
        if (position.type === 'long') {
          // Triángulo hacia arriba para LONG
          ctx.moveTo(entryX, entryY - 8);
          ctx.lineTo(entryX - 6, entryY + 4);
          ctx.lineTo(entryX + 6, entryY + 4);
        } else {
          // Triángulo hacia abajo para SHORT
          ctx.moveTo(entryX, entryY + 8);
          ctx.lineTo(entryX - 6, entryY - 4);
          ctx.lineTo(entryX + 6, entryY - 4);
        }
        ctx.closePath();
        ctx.fillStyle = position.type === 'long' ? '#22c55e' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Etiqueta de la posición
        const labelText = `${position.type.toUpperCase()} ${position.size}`;
        const labelWidth = ctx.measureText(labelText).width + 16;
        const labelX = Math.min(entryX + 10, width - padding - labelWidth);
        const labelY = entryY - 20;

        ctx.fillStyle = position.type === 'long' ? '#22c55e' : '#ef4444';
        ctx.fillRect(labelX, labelY - 8, labelWidth, 16);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(labelText, labelX + 8, labelY + 2);

        // Dibujar Stop Loss si existe
        if (position.stopLoss) {
          const slY = padding + ((maxPrice - position.stopLoss) / priceRange) * chartHeight;
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(entryX, slY);
          ctx.lineTo(width - padding, slY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Etiqueta SL
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(width - padding - 35, slY - 8, 30, 16);
          ctx.fillStyle = 'white';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SL', width - padding - 20, slY + 2);
        }

        // Dibujar Take Profit si existe
        if (position.takeProfit) {
          const tpY = padding + ((maxPrice - position.takeProfit) / priceRange) * chartHeight;
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(entryX, tpY);
          ctx.lineTo(width - padding, tpY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Etiqueta TP
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(width - padding - 35, tpY - 8, 30, 16);
          ctx.fillStyle = 'white';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('TP', width - padding - 20, tpY + 2);
        }

        // Mostrar P&L no realizado para posiciones abiertas
        if (position.status === 'open' && position.unrealizedPnL !== 0) {
          const pnlColor = position.unrealizedPnL >= 0 ? '#22c55e' : '#ef4444';
          const pnlText = `${position.unrealizedPnL >= 0 ? '+' : ''}$${position.unrealizedPnL.toFixed(2)}`;
          
          ctx.fillStyle = pnlColor;
          ctx.fillRect(entryX + 50, entryY - 25, 60, 14);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pnlText, entryX + 80, entryY - 17);

          // Línea de P&L desde entrada hasta precio actual
          const currentPriceY = padding + ((maxPrice - (externalCurrentPrice || currentPrice)) / priceRange) * chartHeight;
          ctx.strokeStyle = pnlColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([1, 3]);
          ctx.beginPath();
          ctx.moveTo(entryX, entryY);
          ctx.lineTo(width - padding - 10, currentPriceY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Mostrar precio actual
    const displayPrice = externalCurrentPrice || currentPrice;
    if (displayPrice > 0 && priceData.length > 0) {
      const currentY = padding + ((maxPrice - displayPrice) / priceRange) * chartHeight;

      // Línea horizontal del precio actual
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, currentY);
      ctx.lineTo(width - padding, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Punto del precio actual
      const lastX = padding + chartWidth;
      ctx.beginPath();
      ctx.arc(lastX, currentY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Etiqueta del precio actual
      ctx.fillStyle = '#10b981';
      ctx.fillRect(width - padding - 80, currentY - 12, 75, 24);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayPrice.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2), width - padding - 42, currentY + 4);
    }

    // Indicador de zoom adaptativo
    if (rawRange < minRange) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.fillRect(padding + 10, padding + 10, 120, 25);
      ctx.fillStyle = 'white';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🔍 Zoom adaptativo', padding + 15, padding + 27);
    }
  };





  // Configurar WebSocket
  useEffect(() => {
    // Cerrar WebSocket anterior
    if (wsRef.current) {
      wsRef.current.close();
    }

    setIsLoading(true);

    // Intentar cargar datos del storage primero
    let initialData = loadDataFromStorage(selectedPair);

    // Si no hay datos en storage o son insuficientes, generar algunos datos base
    if (initialData.length === 0) {
      initialData = generateSimulatedData(selectedPair);
    }

    // Limpiar datos antiguos
    initialData = cleanOldData(initialData);

    setPriceData(initialData);
    setCurrentPrice(initialData[initialData.length - 1]?.price || 0);

    const symbol = getSymbolForPair(selectedPair);
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsLoading(false);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.k) {
            const k = message.k;
            const newPrice = parseFloat(k.c);
            if (!externalCurrentPrice) {
              setCurrentPrice(newPrice);
            }

            // Agregar nuevo punto de precio
            const newTime = new Date().toISOString();
            const newPricePoint: PriceData = {
              time: newTime,
              price: newPrice,
            };

            setPriceData((prev: PriceData[]) => {
              let updated = [...prev];

              // Agregar nuevo punto
              updated.push(newPricePoint);

              // Limpiar datos antiguos (más de 5 minutos)
              updated = cleanOldData(updated);

              // Guardar en localStorage
              saveDataToStorage(selectedPair, updated);

              return updated;
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = () => {
        setIsLoading(false);
      };

      ws.onclose = () => {
        setIsLoading(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setIsLoading(false);
    }

    // Simulador de datos en tiempo real como fallback
    const simulateRealTimeData = () => {
      setPriceData((prev: PriceData[]) => {
        if (prev.length === 0) return prev;

        // Usar el último precio como base para continuidad
        const lastPrice = prev[prev.length - 1].price;

        // Variación más pequeña y realista
        const maxVariation = selectedPair === 'ADA/USDT' ? 0.002 : // ±0.2% para ADA
          selectedPair === 'BTC/USDT' ? 0.001 : // ±0.1% para BTC
            selectedPair === 'ETH/USDT' ? 0.0015 : // ±0.15% para ETH
              0.002; // ±0.2% para otros

        const variation = (Math.random() - 0.5) * maxVariation;
        const newPrice = lastPrice * (1 + variation);

        if (!externalCurrentPrice) {
          setCurrentPrice(newPrice);
        }

        const newPricePoint: PriceData = {
          time: new Date().toISOString(),
          price: Number(newPrice.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2)),
        };

        let updated = [...prev];
        updated.push(newPricePoint);
        updated = cleanOldData(updated);
        saveDataToStorage(selectedPair, updated);
        return updated;
      });
    };

    // Fallback: simular datos cada 10 segundos si no hay WebSocket
    const fallbackInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        simulateRealTimeData();
      }
    }, 10000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(fallbackInterval);
    };
  }, [selectedPair]);

  // Limpiar datos antiguos periódicamente
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setPriceData(prev => {
        const cleaned = cleanOldData(prev);
        if (cleaned.length !== prev.length) {
          saveDataToStorage(selectedPair, cleaned);
        }
        return cleaned;
      });
    }, 30000); // Limpiar cada 30 segundos

    return () => clearInterval(cleanupInterval);
  }, [selectedPair]);

  // Dibujar cuando cambien los datos
  useEffect(() => {
    drawChart();
  }, [priceData, currentPrice, positions, externalCurrentPrice]);

  // Configurar canvas al montar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        drawChart();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setMousePos({x: event.clientX, y: event.clientY});

      // Verificar si el mouse está sobre alguna posición
      let foundPosition: Position | null = null;
      
      if (positions && positions.length > 0) {
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        if (priceData.length > 0) {
          const prices = priceData.map((d: PriceData) => d.price);
          const minPrice = Math.min(...prices) - (Math.max(...prices) - Math.min(...prices)) * 0.1;
          const maxPrice = Math.max(...prices) + (Math.max(...prices) - Math.min(...prices)) * 0.1;
          const priceRange = maxPrice - minPrice;

          positions.forEach((position: Position) => {
            if (position.pair !== selectedPair) return;

            const entryY = padding + ((maxPrice - position.entryPrice) / priceRange) * chartHeight;
            const entryTime = position.timestamp.getTime();
            
            let entryX = padding;
            const timeRange = priceData.length > 1 ? 
              new Date(priceData[priceData.length - 1].time).getTime() - new Date(priceData[0].time).getTime() : 
              300000;
            
            if (timeRange > 0) {
              const timeFromStart = entryTime - new Date(priceData[0]?.time || Date.now()).getTime();
              const timeRatio = Math.max(0, Math.min(1, timeFromStart / timeRange));
              entryX = padding + (chartWidth * timeRatio);
            }

            // Verificar si el mouse está cerca del marcador de posición
            if (Math.abs(x - entryX) < 15 && Math.abs(y - entryY) < 15) {
              foundPosition = position;
            }
          });
        }
      }

      setHoveredPosition(foundPosition);
    };

    const handleMouseLeave = () => {
      setHoveredPosition(null);
    };

    resizeCanvas();
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [positions, priceData, selectedPair]);

  return (
    <div className="relative w-full h-[400px] bg-card">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando gráfico de {selectedPair}...</span>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Información del precio actual */}
      {(externalCurrentPrice || currentPrice) > 0 && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
          <div className="text-sm text-muted-foreground">{selectedPair}</div>
          <div className="text-lg font-bold">
            ${(externalCurrentPrice || currentPrice).toFixed(selectedPair === 'ADA/USDT' ? 4 : 2)}
          </div>
          <div className="text-xs text-green-600">● En vivo</div>
          {positions.filter((p: Position) => p.status === 'open' && p.pair === selectedPair).length > 0 && (
            <div className="text-xs text-blue-600 mt-1">
              {positions.filter((p: Position) => p.status === 'open' && p.pair === selectedPair).length} posición(es) activa(s)
            </div>
          )}
        </div>
      )}

      {/* Controles del gráfico */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>Precio</span>
            </div>
          </div>
        {priceData.length > 0 && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                {Math.round((Date.now() - new Date(priceData[0].time).getTime()) / 60000)}m historial
              </span>
            </div>
          </div>
        )}
        {priceData.length > 1 && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                {(() => {
                  const prices = priceData.map(d => d.price);
                  const min = Math.min(...prices);
                  const max = Math.max(...prices);
                  const variation = ((max - min) / min * 100);
                  return `±${variation.toFixed(3)}%`;
                })()}
              </span>
            </div>
          </div>
        )}
        </div>
        
        {/* Leyenda de operaciones */}
        {positions && positions.some((p: Position) => p.pair === selectedPair) && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-green-500"></div>
                <span>Long</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-500"></div>
                <span>Short</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-0.5 bg-red-600" style={{borderStyle: 'dashed', borderWidth: '1px 0'}}></div>
                <span>SL/TP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip para posiciones */}
      {hoveredPosition && (
        <div 
          className="fixed z-50 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${hoveredPosition.type === 'long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-semibold">
                {hoveredPosition.type.toUpperCase()} {hoveredPosition.size} {hoveredPosition.pair}
              </span>
            </div>
            <div className="text-muted-foreground">
              Entrada: ${hoveredPosition.entryPrice.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2)}
            </div>
            {hoveredPosition.leverage > 1 && (
              <div className="text-orange-600">
                Apalancamiento: {hoveredPosition.leverage}x
              </div>
            )}
            {hoveredPosition.stopLoss && (
              <div className="text-red-600">
                Stop Loss: ${hoveredPosition.stopLoss.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2)}
              </div>
            )}
            {hoveredPosition.takeProfit && (
              <div className="text-green-600">
                Take Profit: ${hoveredPosition.takeProfit.toFixed(selectedPair === 'ADA/USDT' ? 4 : 2)}
              </div>
            )}
            {hoveredPosition.status === 'open' && (
              <div className={`font-semibold ${hoveredPosition.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                P&L: {hoveredPosition.unrealizedPnL >= 0 ? '+' : ''}${hoveredPosition.unrealizedPnL.toFixed(2)}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {hoveredPosition.timestamp.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
