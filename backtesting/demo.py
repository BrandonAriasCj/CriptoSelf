import backtrader as bt
import ccxt
import pandas as pd
import datetime
import matplotlib.pyplot as plt
import time


class PatronVela(bt.Indicator):
    lines = ('maxima', 'status')
    
    plotinfo = dict(subplot=False)  # Para mostrarlo en el gráfico principal
    plotlines = dict(
        maxima=dict(marker='^', markersize=8.0, color='blue', fillstyle='full')  # Flecha hacia arriba en los máximos
    )

    def __init__(self):
        self.addminperiod(3)  # Necesitamos al menos 3 velas para evaluar un máximo
            
    def dibujarSigno(self, pos):
        self.lines.maxima[pos] = self.data.high[pos]
    

    def isVPositiva(self, pos):
        if self.data.close[pos] > self.data.open[pos]:
            return True
        elif self.data.close[pos] < self.data.open[pos]:
            return False
    def isNeutral(self, pos):
        if self.data.close[pos] == self.data.open[pos]:
            return True
        else:
            return False
        
    def diff_OpenClose(self, pos):
        diferencia = abs(self.data.open[pos] - self.data.close[pos])
        return diferencia
    
    def diff_LowHigh(self, pos):
        diferencia = abs(self.data.low[pos] - self.data.high[pos])
        return diferencia
    
    def sombraSuperior(self, pos):
        if self.isVPositiva(pos):
            sombra = abs(self.data.high[pos] - self.data.close[pos])
        elif not self.isVPositiva(pos):
            sombra = abs(self.data.high[pos] - self.data.open[pos])
        return sombra
    
    def sombraInferior(self, pos):
        if self.isVPositiva(pos):
            sombra = abs(self.data.open[pos] - self.data.low[pos])
        elif not self.isVPositiva(pos):
            sombra = abs(self.data.close[pos] - self.data.low[pos])
        return sombra

    # Detecta patron de 2 velas, positiva y negativa respectivamente, en donde
    # el cuerpo de la segunda es el doble que el curpo de la primera
    def next1(self):
        if (self.isVPositiva(-1) and
            not self.isVPositiva(0) and
            self.diff(-1)*2 <= self.diff(0)):
            
            self.dibujarSigno(0)
        else:
            self.lines.maxima[0] = float('nan') 

    # Detecta patron de 3 velas donde las dos anteriores son positivas
    # Y la tercera es negativa pero envuelve a las 2 anteriores
    def next(self):
        if (self.isVPositiva(-3) and
            self.isVPositiva(-2) and
            self.isVPositiva(-1) and
            not self.isVPositiva(0) and
            self.data.close[0] < self.data.open[-3] and
            not self.isVPositiva(1)):
            
            self.dibujarSigno(0)
            self.lines.status[0] = 1
        else:
            self.lines.status[0] = 0

    # Detecta velas con poco curpo en relacion a su rango de low - high
    def next3(self):
        if (self.diff_LowHigh(0)/30 >= self.diff_OpenClose(0)):
            self.dibujarSigno(0)
        else:
            self.lines.maxima[0] = float('nan')
    
    # Detecta velas dogi donde tanto la sombra inferior y superior son mayor o igual
    # al doble del cuerpo
    def next4(self):
        if (self.sombraSuperior(0) >= self.diff_OpenClose(0)*2 and
            self.sombraInferior(0) >= self.diff_OpenClose(0)*2):
            self.dibujarSigno(0)
        else:
            self.lines.maxima[0] = float('nan')

    # Detactar vela martillo rojo
    def next5(self):
        if (self.diff_OpenClose(0)*3 < self.sombraInferior(0) and
            self.diff_OpenClose(0)/3 > self.sombraSuperior(0) and
            not self.isVPositiva(0)):
            self.dibujarSigno(0)

    # Detactar vela martillo verde
    def next6(self):
        if (self.diff_OpenClose(0)*2 < self.sombraInferior(0) and
            self.diff_OpenClose(0)/3 > self.sombraSuperior(0) and
            not self.isVPositiva(0)):
            self.dibujarSigno(0)
            self.lines.status[0] = 1
        else:
            self.lines.status[0] = 0

    # Martillo invertido
    def next7(self):
        if (self.diff_OpenClose(0)/2 > self.sombraInferior(0) and
            self.diff_OpenClose(0)*3 < self.sombraSuperior(0) and
            self.isVPositiva):
            self.dibujarSigno(0)
    
    def next8(self):
        if self.isNeutral(0):
            self.dibujarSigno(0)

class ScalpingStrategy(bt.Strategy):
    params = dict(
        ema_fast=9,
        ema_slow=21,
        macd1=12,
        macd2=26,
        macdsig=9,
        rsi_period=7,
        bollinger_period=20,
        atr_period=14,
        stop_loss_mult=0.5,  # Reducido para mejorar RR
        take_profit_mult=4.0, # Aumentado para mejorar RR
        risk_per_trade=0.02,  # Máximo 2% del capital en riesgo
        min_volume=5,         # Filtrar volumen bajo
        adx_period=14,        # Para detectar tendencias
        adx_threshold=20      # Evitar mercados laterales
    )

    def __init__(self):
        
        self.loss_streak = 0
        self.cnt = 0
        self.ganadas = 0
        self.perdidas = 0
        self.vNegativas = 0

        self.patronVela1 = PatronVela(self.data)
        self.vol_ma_values = []
        self.datas_close = []
        self.vol_ma = bt.indicators.SimpleMovingAverage(self.data.volume, period=10)

        self.order = None
        self.entry_bar = None

    def next(self):

        self.vol_ma_values.append(self.vol_ma[0])
        self.datas_close.append(self.data.close[0])
        if not self.position:
            if self.patronVela1.status[0] == 1 :
                precio = self.data.close[0]
                self.sell_bracket(limitprice=precio * 0.95, price=precio, stopprice=precio*1.06, size=0.001)
                self.buy(size=0.001)
                #print(f'Se compra en la vela: {len(self)}')
                self.entry_bar = len(self)  # Guarda el número de vela donde se compra
        elif self.position and self.entry_bar and len(self) >= self.entry_bar + 3:
            self.close()  # Cierra la posición después de X velas

    def notify_trade(self, trade):
        if trade.isclosed:
            self.cnt += 1
            resultado = trade.pnl
            if resultado > 0:
                self.ganadas += 1
                self.loss_streak = 0
                print(f"📅 Fecha: {self.data.datetime.date(0)}, Resultado: {round(resultado, 3)}")
            else:
                self.perdidas += 1
                self.loss_streak += 1
                print(f"📅 Fecha: {self.data.datetime.date(0)}, Resultado: {round(resultado, 3)}")

# Función para descargar datos
def get_ccxt_data(symbol, timeframe, since, limit=100000):    
    exchange = ccxt.kraken()
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since, limit)
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df.set_index('timestamp', inplace=True)
    #print(df)
    return df

# Configuración y ejecución
if __name__ == '__main__':
    for i in range(1):
        cerebro = bt.Cerebro()
        cerebro.addstrategy(ScalpingStrategy)
        cerebro.addindicator(PatronVela)

        def dataGen(timefr, time, compress):
            symbol = 'BTC/USDT'
            timeframe = timefr
            tiempo = time
            since = ccxt.kraken().parse8601(tiempo)
            data_df = get_ccxt_data(symbol, timeframe, since)

            data = bt.feeds.PandasData(
                dataname=data_df,
                timeframe=bt.TimeFrame.Minutes,
                compression=compress,
                fromdate=datetime.datetime(2025, 1, 1),
                todate=datetime.datetime(2025, 9, 5)
            )
            return data
        
        #datax = dataGen('5m', f'2025-01-01T00:00:00Z', 1)
        data = dataGen('5m', f'2025-01-01T00:00:00Z', 5)
        #datax = dataGen('5m', f'2025-01-01T00:00:00Z', 1)

        cerebro.adddata(data)
        cerebro.broker.set_cash(100)
        #cerebro.broker.setcommission(leverage=10, commission=0.001)

        print(f"Capital inicial: {cerebro.broker.getvalue():.2f}")
        instancia = cerebro.run()[0]
        print(f"Capital final: {cerebro.broker.getvalue():.2f}")
        print(f"Cerradas Totales: {instancia.cnt}")
        print(f"Ganadas: {instancia.ganadas}")
        print(f"Perdidas: {instancia.perdidas}")
        print(f"Velas negativas: {instancia.vNegativas}")

        cerebro.plot(start=75, end=1000,style='candlestick', iplot=False)

        #plt.savefig("graficagood.png")
        
        plt.show()
        #print(f"Acierto: {(instancia.ganadas / instancia.cnt) * 100:.2f}%")
        time.sleep(2)
