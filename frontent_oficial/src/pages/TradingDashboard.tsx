import { useState, useEffect } from 'react';
import PriceChart from '../components/PriceChart';
import { TradingPanel } from '../components/TradingPanel';
import { OrderBook } from '../components/OrderBook';
import { BacktestingDemo } from '../components/BacktestingDemo';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Zap, BarChart3, DollarSign } from 'lucide-react';

const marketData = {
  'BTC/USDT': { price: 55550.75, change: 2.45, volume: '1.2B', marketCap: '845B', volatility: 3.2 },
  'ETH/USDT': { price: 2645.32, change: -1.23, volume: '850M', marketCap: '318B', volatility: 4.1 },
  'ADA/USDT': { price: 0.4521, change: 5.67, volume: '320M', marketCap: '16B', volatility: 6.8 },
  'SOL/USDT': { price: 98.45, change: 3.21, volume: '180M', marketCap: '42B', volatility: 7.2 },
};

export function TradingDashboard() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [currentPrice, setCurrentPrice] = useState(marketData[selectedPair].price);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const basePrice = marketData[selectedPair].price;
      const variation = (Math.random() - 0.5) * (basePrice * 0.001);
      setCurrentPrice((prev: number) => prev + variation);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const priceChange = ((currentPrice - marketData[selectedPair].price) / marketData[selectedPair].price) * 100;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(marketData).map(([pair, data]) => (
          <Card
            key={pair}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedPair === pair
              ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10'
              : 'hover:shadow-md'
              }`}
            onClick={() => setSelectedPair(pair)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{pair.split('/')[0].slice(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{pair}</h3>
                    <p className="text-xs text-muted-foreground">Vol: {data.volume}</p>
                  </div>
                </div>
                <Badge
                  variant={data.change >= 0 ? "default" : "destructive"}
                  className={`text-xs ${data.change >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}`}
                >
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <p className="text-lg font-bold">
                    ${pair === selectedPair ? currentPrice.toFixed(2) : data.price.toLocaleString()}
                  </p>
                  {pair === selectedPair && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cap: {data.marketCap}</span>
                  <span>Vol: {data.volatility}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Pair Info */}
      <Card className="bg-gradient-to-r from-card via-card to-muted/20 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">{selectedPair.split('/')[0].slice(0, 3)}</span>
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {selectedPair}
                  {priceChange >= 0 ?
                    <TrendingUp className="w-6 h-6 text-green-600" /> :
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  }
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Volatilidad: {marketData[selectedPair].volatility}% •
                  Cap. de Mercado: {marketData[selectedPair].marketCap}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="text-center md:text-right">
                <p className="text-3xl font-bold">${currentPrice.toFixed(2)}</p>
                <p className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}%
                  <span className="text-xs text-muted-foreground ml-1">24h</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Alertas
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Análisis
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Price Chart */}
        <div className="xl:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Gráfico de Precios
                  <Badge variant="outline" className="ml-2">En Vivo</Badge>
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs hover:bg-primary/10"
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PriceChart selectedPair={selectedPair} />
            </CardContent>
          </Card>
        </div>
        {/* Backtesting Demo Section */}
        <div className="xl:col-span-4">
          <BacktestingDemo />
        </div>

        {/* Trading Panel & Order Book */}
        <div className="space-y-4">
          <TradingPanel selectedPair={selectedPair} currentPrice={currentPrice} />
          <OrderBook selectedPair={selectedPair} />
        </div>
      </div>



      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Volumen 24h</p>
              <p className="font-bold text-blue-900 dark:text-blue-100">{marketData[selectedPair].volume}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300">Máximo 24h</p>
              <p className="font-bold text-green-900 dark:text-green-100">
                ${(currentPrice * 1.045).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Volatilidad</p>
              <p className="font-bold text-purple-900 dark:text-purple-100">
                {marketData[selectedPair].volatility}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}