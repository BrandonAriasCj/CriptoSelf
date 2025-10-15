import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen } from 'lucide-react';

interface OrderBookProps {
  selectedPair: string;
}

interface Order {
  price: number;
  amount: number;
  total: number;
}

export function OrderBook({ selectedPair }: OrderBookProps) {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const basePrice = 43250;
      const newBids: Order[] = [];
      const newAsks: Order[] = [];

      // Generate bids (buy orders) - prices below current price
      for (let i = 0; i < 8; i++) {
        const price = basePrice - (i + 1) * Math.random() * 50;
        const amount = Math.random() * 5 + 0.1;
        newBids.push({
          price,
          amount,
          total: price * amount
        });
      }

      // Generate asks (sell orders) - prices above current price  
      for (let i = 0; i < 8; i++) {
        const price = basePrice + (i + 1) * Math.random() * 50;
        const amount = Math.random() * 5 + 0.1;
        newAsks.push({
          price,
          amount,
          total: price * amount
        });
      }

      setBids(newBids);
      setAsks(newAsks);
      
      if (newAsks.length > 0 && newBids.length > 0) {
        setSpread(newAsks[0].price - newBids[0].price);
      }
    };

    generateOrderBook();

    // Update order book periodically
    const interval = setInterval(() => {
      generateOrderBook();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatAmount = (amount: number) => amount.toFixed(4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Libro de Órdenes
          </span>
          <Badge variant="outline" className="text-xs">
            Spread: ${spread.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 px-4 py-2 border-b border-border text-xs text-muted-foreground">
          <span>Precio (USDT)</span>
          <span className="text-right">Cantidad</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="max-h-32 overflow-y-auto">
          {asks.slice().reverse().map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 gap-2 px-4 py-1 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-xs">
              <span className="text-red-600 font-mono">{formatPrice(ask.price)}</span>
              <span className="text-right font-mono">{formatAmount(ask.amount)}</span>
              <span className="text-right font-mono">{formatPrice(ask.total)}</span>
            </div>
          ))}
        </div>

        {/* Spread indicator */}
        <div className="px-4 py-2 bg-muted/30 border-y border-border">
          <div className="text-center text-xs text-muted-foreground">
            Spread: ${spread.toFixed(2)} ({((spread / ((asks[0]?.price + bids[0]?.price) / 2)) * 100).toFixed(3)}%)
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="max-h-32 overflow-y-auto">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 gap-2 px-4 py-1 hover:bg-green-50/50 dark:hover:bg-green-950/20 text-xs">
              <span className="text-green-600 font-mono">{formatPrice(bid.price)}</span>
              <span className="text-right font-mono">{formatAmount(bid.amount)}</span>
              <span className="text-right font-mono">{formatPrice(bid.total)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}