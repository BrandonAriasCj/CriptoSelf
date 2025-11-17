from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import backtrader as bt
import json
import io
import sys
from contextlib import redirect_stdout
from .demo import ScalpingStrategy, PatronVela, get_ccxt_data
from .custom_strategy import CustomScalpingStrategy
import datetime
import ccxt
import pandas as pd

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes


@api_view(['GET'])
@permission_classes([AllowAny])
def run_backtesting_demo(request):
    """
    Ejecuta el demo de backtesting y retorna los resultados
    """
    try:
        # Capturar la salida del print
        output_buffer = io.StringIO()
        
        with redirect_stdout(output_buffer):
            # Crear instancia de cerebro
            cerebro = bt.Cerebro()
            cerebro.addstrategy(ScalpingStrategy)
            cerebro.addindicator(PatronVela)

            # Generar datos
            symbol = 'BTC/USDT'
            timeframe = '5m'
            tiempo = '2025-01-01T00:00:00Z'
            since = ccxt.kraken().parse8601(tiempo)
            data_df = get_ccxt_data(symbol, timeframe, since)

            data = bt.feeds.PandasData(
                dataname=data_df,
                timeframe=bt.TimeFrame.Minutes,
                compression=5,
                fromdate=datetime.datetime(2025, 1, 1),
                todate=datetime.datetime(2025, 9, 5)
            )

            cerebro.adddata(data)
            cerebro.broker.set_cash(100)

            capital_inicial = cerebro.broker.getvalue()
            print(f"Capital inicial: {capital_inicial:.2f}")
            
            # Ejecutar backtesting
            instancia = cerebro.run()[0]

            data = cerebro.datas[0]
            estrategia = cerebro.runstrats[0][0]

            # Extraer datos correctamente de las líneas de Backtrader
            fechas = [bt.num2date(x) for x in data.lines.datetime.array]
            precios = list(data.lines.close.array)  # Usar .array para obtener todos los valores
            indi = list(estrategia.patronVela1.lines.status.array)  # Usar la línea status del indicador
            volma = list(estrategia.vol_ma.lines.sma.array)  # Usar la línea sma del indicador vol_ma
            historico_vol_max = list(estrategia.vol_ma_values)
            datas_close_list = list(estrategia.datas_close)
            
            # Debug: Imprimir información sobre los datos extraídos
            print(f"DEBUG - Fechas extraídas: {len(fechas)}")
            print(f"DEBUG - Precios extraídos: {len(precios)}")
            print(f"DEBUG - Primeros 3 precios: {precios[:3] if len(precios) > 3 else precios}")
            print(f"DEBUG - Últimos 3 precios: {precios[-3:] if len(precios) > 3 else precios}")
            print(f"DEBUG - Indicadores extraídos: {len(indi)}")
            print(f"DEBUG - Volumen MA extraído: {len(volma)}")

            # Convertir NaN a None para JSON válido
            import math
            indi_clean = [None if (isinstance(x, float) and math.isnan(x)) else x for x in indi]
            volma_clean = [None if (isinstance(x, float) and math.isnan(x)) else x for x in volma]
            precios_clean = [None if (isinstance(x, float) and math.isnan(x)) else x for x in precios]

            print(f"DEBUG - Precios después de limpiar: {len(precios_clean)}")
            print(f"DEBUG - Primeros 3 precios limpios: {precios_clean[:3] if len(precios_clean) > 3 else precios_clean}")

            capital_final = cerebro.broker.getvalue()
            print(f"Capital final: {capital_final:.2f}")
            print(f"Cerradas Totales: {instancia.cnt}")
            print(f"Ganadas: {instancia.ganadas}")
            print(f"Perdidas: {instancia.perdidas}")
            print(f"Velas negativas: {instancia.vNegativas}")

        # Obtener la salida capturada
        output_text = output_buffer.getvalue()
        
        # Preparar respuesta estructurada

        # Calcular métricas de rendimiento
        ganancia_perdida = capital_final - capital_inicial
        rentabilidad_porcentaje = ((capital_final - capital_inicial) / capital_inicial) * 100 if capital_inicial > 0 else 0
        tasa_acierto = (instancia.ganadas / instancia.cnt * 100) if instancia.cnt > 0 else 0

        respuesta_json = JsonResponse({
                "fechas": [f.strftime("%Y-%m-%d %H:%M:%S") for f in fechas],
                "precio": precios_clean,
                "patronVela": indi_clean,
                "volma": volma_clean,
                "historial": historico_vol_max,
                "datas closed": datas_close_list,
                # Agregar resumen de resultados
                "resumen": {
                    "capital_inicial": capital_inicial,
                    "capital_final": capital_final,
                    "ganancia_perdida": ganancia_perdida,
                    "rentabilidad_porcentaje": rentabilidad_porcentaje,
                    "operaciones_totales": instancia.cnt,
                    "operaciones_ganadas": instancia.ganadas,
                    "operaciones_perdidas": instancia.perdidas,
                    "tasa_acierto": tasa_acierto,
                    "racha_perdidas": getattr(instancia, 'loss_streak', 0),
                    "velas_negativas": getattr(instancia, 'vNegativas', 0)
                }
         })
        
        data = respuesta_json
        print("data: ", data.content)
        return respuesta_json
        #return Response(resultado, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'error_type': type(e).__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def run_custom_backtesting(request):
    """
    Ejecuta backtesting con parámetros personalizados
    """
    try:
        # Obtener parámetros del request
        data = request.data
        #print(data)
        symbol = data.get('symbol', 'BTC/USDT')
        timeframe = data.get('timeframe', '5m')
        fecha_inicio = data.get('fecha_inicio', '2025-01-01')
        fecha_fin = data.get('fecha_fin', '2025-09-05')
        capital_inicial = data.get('capital_inicial', 1000)
        
        # Parámetros de estrategia
        ema_fast = data.get('ema_fast', 9)
        ema_slow = data.get('ema_slow', 21)
        rsi_period = data.get('rsi_period', 14)
        stop_loss_mult = data.get('stop_loss_mult', 2.0)
        take_profit_mult = data.get('take_profit_mult', 4.0)
        risk_per_trade = data.get('risk_per_trade', 0.02)
        min_volume = data.get('min_volume', 5)
        adx_threshold = data.get('adx_threshold', 25)
        bollinger_period = data.get('bollinger_period', 20)
        atr_period = data.get('atr_period', 14)
        
        # Validar fechas
        try:
            fecha_inicio_dt = datetime.datetime.strptime(fecha_inicio, '%Y-%m-%d')
            fecha_fin_dt = datetime.datetime.strptime(fecha_fin, '%Y-%m-%d')
        except ValueError:
            return Response({
                'status': 'error',
                'message': 'Formato de fecha inválido. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Logs de diagnóstico ANTES de capturar stdout
        print("=" * 80)
        print("🚀 INICIANDO BACKTESTING PERSONALIZADO")
        print(f"  Symbol: {symbol}")
        print(f"  Timeframe: {timeframe}")
        print(f"  Fecha inicio: {fecha_inicio}")
        print(f"  Fecha fin: {fecha_fin}")
        print(f"  Capital inicial: {capital_inicial}")
        print("=" * 80)
        
        # Generar datos ANTES del redirect_stdout
        tiempo = f'{fecha_inicio}T00:00:00Z'
        since = ccxt.kraken().parse8601(tiempo)
        print(f"📡 Solicitando datos de Kraken...")
        print(f"  Since timestamp: {since}")
        
        data_df = get_ccxt_data(symbol, timeframe, since)
        
        print(f"✅ Datos recibidos de Kraken:")
        print(f"  Total de velas: {len(data_df)}")
        if len(data_df) > 0:
            print(f"  Primera fecha: {data_df.index[0]}")
            print(f"  Última fecha: {data_df.index[-1]}")
            print(f"  Primeras 3 velas:")
            print(data_df.head(3))
        else:
            print("  ⚠️ NO SE RECIBIERON DATOS DE KRAKEN")
            return Response({
                'status': 'error',
                'message': 'No se pudieron obtener datos de Kraken para el período especificado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Capturar la salida del print solo para backtrader
        output_buffer = io.StringIO()
        
        # TEMPORALMENTE DESHABILITADO para ver logs
        # with redirect_stdout(output_buffer):
        if True:  # Simular el with para mantener la indentación
            # Crear instancia de cerebro
            cerebro = bt.Cerebro()
            
            # Usar estrategia personalizada con parámetros
            cerebro.addstrategy(
                CustomScalpingStrategy,
                ema_fast=ema_fast,
                ema_slow=ema_slow,
                rsi_period=rsi_period,
                stop_loss_mult=stop_loss_mult,
                take_profit_mult=take_profit_mult,
                risk_per_trade=risk_per_trade,
                min_volume=min_volume,
                adx_threshold=adx_threshold,
                bollinger_period=bollinger_period,
                atr_period=atr_period
            )
            cerebro.addindicator(PatronVela)
            # NO FILTRAR POR FECHAS - usar todos los datos que Kraken devuelve
            # El problema es que Kraken devuelve datos recientes, no históricos
            data = bt.feeds.PandasData(
                dataname=data_df,
                timeframe=bt.TimeFrame.Minutes,
                compression=5
                # fromdate y todate comentados para usar todos los datos disponibles
                # fromdate=fecha_inicio_dt,
                # todate=fecha_fin_dt
            )

            cerebro.adddata(data)
            cerebro.broker.set_cash(capital_inicial)

            capital_inicial_real = cerebro.broker.getvalue()
            print(f"Capital inicial: {capital_inicial_real:.2f}")
            
            # Ejecutar backtesting
            try:
                print(f"Iniciando backtesting con {len(data_df)} velas de datos")
                print(f"Rango de fechas: {data_df.index[0]} a {data_df.index[-1]}")
                print(f"Primeras 5 velas:")
                print(data_df.head())
                
                instancia = cerebro.run()[0]
                print("Backtest terminado correctamente.")
            except IndexError as e:
                print("=" * 80)
                print("ERROR DE ÍNDICE EN BACKTRADER:")
                print(f"Mensaje: {e}")
                print(f"Datos disponibles: {len(data_df)} velas")
                print(f"Configuración:")
                print(f"  - Symbol: {symbol}")
                print(f"  - Timeframe: {timeframe}")
                print(f"  - Fecha inicio: {fecha_inicio}")
                print(f"  - Fecha fin: {fecha_fin}")
                import traceback
                traceback.print_exc()
                print("=" * 80)
                raise
            except Exception as e:
                print("=" * 80)
                print("ERROR GENERAL EN BACKTRADER:")
                print(f"Tipo: {type(e).__name__}")
                print(f"Mensaje: {e}")
                import traceback
                traceback.print_exc()
                print("=" * 80)
                raise

            #import winsound; winsound.Beep(500, 500);

            data = cerebro.datas[0]
            estrategia = cerebro.runstrats[0][0]

            # Extraer datos correctamente de las líneas de Backtrader
            print("Extrayendo datos del backtesting...")
            
            # IMPORTANTE: Usar get() en lugar de array para obtener todos los datos
            fechas = []
            precios = []
            indi = []
            volma = []
            
            # Iterar sobre todos los datos disponibles
            for i in range(len(data)):
                try:
                    fechas.append(bt.num2date(data.datetime[i]))
                    precios.append(data.close[i])
                    
                    # Intentar obtener el indicador si existe
                    try:
                        indi.append(estrategia.patronVela1.lines.status[i])
                    except:
                        indi.append(0)
                    
                    # Intentar obtener el volumen MA si existe
                    try:
                        volma.append(estrategia.vol_ma.lines.sma[i])
                    except:
                        volma.append(None)
                except:
                    break
            
            historico_vol_max = list(estrategia.vol_ma_values)
            datas_close_list = list(estrategia.datas_close)
            
            print(f"Datos extraídos del loop:")
            print(f"  Fechas: {len(fechas)}")
            print(f"  Precios: {len(precios)}")
            print(f"  Indicador: {len(indi)}")
            print(f"  Volumen MA: {len(volma)}")
            print(f"  Historial: {len(historico_vol_max)}")
            print(f"  Datas closed: {len(datas_close_list)}")
            
            # USAR LOS DATOS GUARDADOS POR LA ESTRATEGIA
            if len(datas_close_list) > len(precios):
                print(f"⚠️ Usando datos guardados por la estrategia en lugar del loop")
                precios = datas_close_list
                volma = historico_vol_max
                
                # Intentar extraer el indicador correctamente
                indi = []
                try:
                    # Acceder al indicador desde la estrategia
                    for i in range(len(precios)):
                        try:
                            valor = estrategia.patronVela1.lines.status[i]
                            indi.append(float(valor) if valor is not None else 0)
                        except:
                            indi.append(0)
                    
                    patrones_encontrados = sum(1 for x in indi if x > 0)
                    print(f"📊 Patrones encontrados: {patrones_encontrados} de {len(indi)}")
                except Exception as e:
                    print(f"⚠️ Error extrayendo indicador: {e}")
                    indi = [0] * len(precios)
                
                # Generar fechas desde el DataFrame
                fechas = [fecha.to_pydatetime() for fecha in data_df.index[:len(precios)]]
                
                print(f"✅ Datos corregidos:")
                print(f"  Fechas: {len(fechas)}")
                print(f"  Precios: {len(precios)}")
                print(f"  Indicador: {len(indi)}")
                print(f"  Volumen MA: {len(volma)}")
            
            # Convertir NaN a None para JSON válido
            import math
            indi_clean = [None if (isinstance(x, float) and math.isnan(x)) else float(x) if x is not None else 0 for x in indi]
            volma_clean = [None if (isinstance(x, float) and math.isnan(x)) else float(x) if x is not None else None for x in volma]
            precios_clean = [None if (isinstance(x, float) and math.isnan(x)) else float(x) if x is not None else None for x in precios]


            capital_final = cerebro.broker.getvalue()
            print(f"Capital final: {capital_final:.2f}")
            print(f"Cerradas Totales: {instancia.cnt}")
            print(f"Ganadas: {instancia.ganadas}")
            print(f"Perdidas: {instancia.perdidas}")

        # Obtener la salida capturada
        output_text = output_buffer.getvalue()
        
        # Calcular métricas de rendimiento
        ganancia_perdida = capital_final - capital_inicial_real
        rentabilidad_porcentaje = ((capital_final - capital_inicial_real) / capital_inicial_real) * 100 if capital_inicial_real > 0 else 0
        tasa_acierto = (instancia.ganadas / instancia.cnt * 100) if instancia.cnt > 0 else 0

        # Preparar respuesta estructurada similar al demo
        return JsonResponse({
            "fechas": [f.strftime("%Y-%m-%d %H:%M:%S") for f in fechas],
            "precio": precios_clean,
            "patronVela": indi_clean,
            "volma": volma_clean,
            "historial": historico_vol_max,
            "datas closed": datas_close_list,
            # Agregar resumen de resultados
            "resumen": {
                "capital_inicial": capital_inicial_real,
                "capital_final": capital_final,
                "ganancia_perdida": ganancia_perdida,
                "rentabilidad_porcentaje": rentabilidad_porcentaje,
                "operaciones_totales": instancia.cnt,
                "operaciones_ganadas": instancia.ganadas,
                "operaciones_perdidas": instancia.perdidas,
                "tasa_acierto": tasa_acierto,
                "racha_perdidas": getattr(instancia, 'loss_streak', 0),
                "velas_negativas": getattr(instancia, 'vNegativas', 0)
            },
            # Parámetros utilizados
            "parametros_utilizados": {
                "symbol": symbol,
                "timeframe": timeframe,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "capital_inicial": capital_inicial,
                "ema_fast": ema_fast,
                "ema_slow": ema_slow,
                "rsi_period": rsi_period,
                "stop_loss_mult": stop_loss_mult,
                "take_profit_mult": take_profit_mult,
                "risk_per_trade": risk_per_trade
            }
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'error_type': type(e).__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_strategy_info(request):
    """
    Retorna información sobre la estrategia de backtesting
    """
    try:
        strategy_info = {
            'strategy_name': 'ScalpingStrategy',
            'indicators': [
                'PatronVela (Indicador personalizado)',
                'EMA Fast (9)',
                'EMA Slow (21)',
                'MACD (12, 26, 9)',
                'RSI (7)',
                'Bollinger Bands (20)',
                'ATR (14)',
                'ADX (14)'
            ],
            'parameters': {
                'ema_fast': 9,
                'ema_slow': 21,
                'macd1': 12,
                'macd2': 26,
                'macdsig': 9,
                'rsi_period': 7,
                'bollinger_period': 20,
                'atr_period': 14,
                'stop_loss_mult': 0.5,
                'take_profit_mult': 4.0,
                'risk_per_trade': 0.02,
                'min_volume': 5,
                'adx_period': 14,
                'adx_threshold': 20
            },
            'patron_vela_methods': [
                'next1: Patrón de 2 velas (positiva y negativa)',
                'next: Patrón de 3 velas envolvente',
                'next3: Velas con poco cuerpo',
                'next4: Velas doji',
                'next5: Martillo rojo',
                'next6: Martillo verde',
                'next7: Martillo invertido',
                'next8: Velas neutrales'
            ]
        }
        
        return Response(strategy_info, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




