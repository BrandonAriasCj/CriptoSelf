import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ShoppingCart, TrendingDown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TradingPanelProps {
  selectedPair: string;
  currentPrice: number;
}

export function TradingPanel({ selectedPair, currentPrice }: TradingPanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  const handleBuy = () => {
    if (!amount) {
      toast.error('Ingresa una cantidad válida');
      return;
    }
    
    const orderData = {
      type: 'buy',
      pair: selectedPair,
      amount: parseFloat(amount),
      price: orderType === 'market' ? currentPrice : parseFloat(price),
      orderType
    };
    
    toast.success(`Orden de compra ejecutada: ${amount} ${selectedPair.split('/')[0]} a $${orderData.price.toFixed(2)}`);
    setAmount('');
    setPrice('');
  };

  const handleSell = () => {
    if (!amount) {
      toast.error('Ingresa una cantidad válida');
      return;
    }
    
    const orderData = {
      type: 'sell',
      pair: selectedPair,
      amount: parseFloat(amount),
      price: orderType === 'market' ? currentPrice : parseFloat(price),
      orderType
    };
    
    toast.success(`Orden de venta ejecutada: ${amount} ${selectedPair.split('/')[0]} a $${orderData.price.toFixed(2)}`);
    setAmount('');
    setPrice('');
  };

  const calculateTotal = () => {
    const priceToUse = orderType === 'market' ? currentPrice : parseFloat(price) || 0;
    const amountValue = parseFloat(amount) || 0;
    return (priceToUse * amountValue).toFixed(2);
  };

  return (
    
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Panel de Trading
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Type Selection */}
        <div>
          <Label>Tipo de Orden</Label>
          <Select value={orderType} onValueChange={(value: 'market' | 'limit' | 'stop') => setOrderType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Mercado</SelectItem>
              <SelectItem value="limit">Límite</SelectItem>
              <SelectItem value="stop">Stop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Input (for limit and stop orders) */}
        {orderType !== 'market' && (
          <div>
            <Label>Precio {orderType === 'stop' ? 'Stop' : 'Límite'}</Label>
            <Input
              type="number"
              placeholder={`$${currentPrice.toFixed(2)}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <Label>Cantidad ({selectedPair.split('/')[0]})</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>


        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['25%', '50%', '75%', '100%'].map((percentage) => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              onClick={() => {
                // Simulate available balance calculation
                const availableBalance = 1000; // Mock balance
                const percentValue = parseInt(percentage) / 100;
                const calculatedAmount = (availableBalance * percentValue) / currentPrice;
                setAmount(calculatedAmount.toFixed(6));
              }}
            >
              {percentage}
            </Button>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total:</span>
            <span className="font-semibold">${calculateTotal()} USDT</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm">Comisión:</span>
            <span className="text-sm text-muted-foreground">$0.50</span>
          </div>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleBuy} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!amount}
          >
            Comprar
          </Button>
          <Button 
            onClick={handleSell}
            variant="destructive"
            disabled={!amount}
          >
            Vender
          </Button>
        </div>

        {/* Market Info */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span>Precio Actual:</span>
            <span className="font-semibold">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Spread:</span>
            <span className="text-muted-foreground">0.02%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Volumen 24h:</span>
            <span className="text-muted-foreground">1.2B USDT</span>
          </div>
        </div>



        {/* Risk Warning */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Trading de criptomonedas conlleva riesgo. Solo invierte lo que puedas permitirte perder.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}