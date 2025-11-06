# 🚀 Simulador de Trading Manual y Algorítmico

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Django](https://img.shields.io/badge/Django-4.2+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Plataforma completa de simulación de trading** que combina **trading manual en tiempo real** con **backtesting algorítmico avanzado**. Construida con Django REST Framework, React + Vite, y datos en tiempo real de Binance WebSocket.

> 🎯 **Ideal para**: Traders principiantes y avanzados, desarrolladores de estrategias algorítmicas, estudiantes de finanzas cuantitativas, y cualquiera que quiera practicar trading sin riesgo financiero.

## ⚡ Inicio Rápido

### Windows
```bash
# Doble clic o ejecutar:
start-dev.bat
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Multiplataforma
```bash
node start-dev.js
```

## 🌐 URLs de Desarrollo
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000  
- **Admin**: http://localhost:8000/admin

## ✨ Características Destacadas

### 🎯 Trading Manual
- **Simulación en tiempo real** con datos de Binance WebSocket
- **Apalancamiento configurable** de 1x hasta 100x
- **Stop Loss y Take Profit** automáticos
- **Gestión de riesgo** y margen profesional
- **P&L en tiempo real** con cálculos precisos

### 🤖 Trading Algorítmico
- **Backtesting histórico** con datos reales
- **Estrategias personalizables** con múltiples parámetros
- **Indicadores técnicos** avanzados (EMAs, RSI, Bollinger Bands)
- **Métricas de rendimiento** (Win Rate, Sharpe Ratio, Drawdown)
- **Presets de riesgo** predefinidos

### 📊 Visualización
- **Gráficos interactivos** con Canvas optimizado
- **Operaciones integradas** en el chart
- **UI Glassmorphism** adaptativa (claro/oscuro)
- **Responsive Design** para desktop y móvil  

## 🎯 Funcionalidades Completas

### 💹 Simulador de Trading Manual
- **Trading en tiempo real** con datos de Binance WebSocket
- **Múltiples pares de trading** (BTC/USDT, ETH/USDT, ADA/USDT, SOL/USDT)
- **Apalancamiento configurable** de 1x hasta 100x
- **Órdenes avanzadas**: Stop Loss y Take Profit automáticos
- **Gestión de margen** y cálculo de nivel de riesgo
- **P&L en tiempo real** con actualizaciones instantáneas
- **Visualización gráfica** de todas las operaciones en el chart
- **Historial de operaciones** detallado

### 🤖 Trading Algorítmico y Backtesting
- **Motor de backtesting** basado en Backtrader
- **Estrategias personalizables** con parámetros ajustables
- **Indicadores técnicos avanzados**:
  - EMAs (Medias Móviles Exponenciales)
  - RSI (Índice de Fuerza Relativa)
  - Bollinger Bands
  - ATR (Average True Range)
- **Patrones de velas** japonesas personalizados
- **Presets de gestión de riesgo**:
  - Conservador (1-2% por operación)
  - Moderado (2-5% por operación)
  - Agresivo (5-10% por operación)
- **Métricas de rendimiento completas**:
  - Win Rate y Profit Factor
  - Sharpe Ratio y Sortino Ratio
  - Maximum Drawdown
  - Retorno total y anualizado

### 📊 Visualización y UX Avanzada
- **Gráficos interactivos** con Canvas HTML5 optimizado
- **Integración completa** de operaciones en el chart
- **Tooltips dinámicos** con detalles de posiciones
- **Líneas de P&L** en tiempo real
- **Marcadores visuales** para entradas, Stop Loss y Take Profit
- **Interfaz Glassmorphism** moderna y elegante
- **Tema adaptativo** (claro/oscuro) automático
- **Diseño responsive** optimizado para desktop y móvil

### 🔐 Sistema de Autenticación Robusto
- **OAuth2** con Django OAuth Toolkit
- **Autenticación social** (Google, GitHub) con Django Allauth
- **Modelo de usuario personalizado** con perfiles extendidos
- **Gestión de tokens** con scopes granulares
- **Verificación de email** y recuperación de contraseña
- **Sesiones seguras** con expiración automática

### ⚡ Stack Tecnológico
- **Backend**: Django REST Framework + Backtrader
- **Frontend**: React 18 + Vite + TypeScript
- **Datos en tiempo real**: Binance WebSocket API
- **Gráficos**: Canvas HTML5 con renderizado optimizado
- **Estilos**: Tailwind CSS + Glassmorphism
- **Base de datos**: SQLite (configurable a PostgreSQL/MySQL)
- **Autenticación**: OAuth2 + JWT
- **Deployment**: Docker ready

## 🛠️ Instalación Manual

### Prerrequisitos
- Python 3.9+
- Node.js 16+
- Git

### Configuración del Backend

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd trading-simulator
```

2. **Crear entorno virtual**:
```bash
python -m venv venv
```

3. **Activar entorno virtual**:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

5. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

6. **Ejecutar migraciones**:
```bash
python manage.py makemigrations users
python manage.py makemigrations
python manage.py migrate
```

7. **Crear aplicación OAuth2**:
```bash
python manage.py create_oauth_app --name "Trading Simulator Frontend"
```

8. **Crear superusuario**:
```bash
python manage.py createsuperuser
```

### Configuración del Frontend

1. **Navegar al directorio del frontend**:
```bash
cd frontent_oficial
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Configurar las URLs del backend
```

### Ejecutar la Aplicación

**Opción 1: Scripts automáticos (Recomendado)**
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh

# Multiplataforma
node start-dev.js
```

**Opción 2: Manual**
```bash
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontent_oficial
npm run dev
```

## Endpoints de la API

### 🔐 Autenticación
- `POST /api/auth/register/` - Registro de usuarios
- `POST /api/auth/token/` - Obtener token OAuth2
- `GET /api/auth/profile/` - Ver/editar perfil de usuario
- `POST /api/auth/change-password/` - Cambiar contraseña
- `POST /api/auth/logout/` - Cerrar sesión
- `GET /api/auth/user-info/` - Información del usuario

### 📊 Backtesting
- `GET /api/backtesting/run-demo/` - Ejecutar demo de backtesting
- `POST /api/backtesting/run-custom/` - Backtesting personalizado
- `GET /api/backtesting/strategy-info/` - Información de estrategias

### 📝 Tareas
- `GET /api/health/` - Verificar estado de la API
- `GET /api/tasks/` - Listar todas las tareas
- `POST /api/tasks/` - Crear nueva tarea
- `GET /api/tasks/{id}/` - Obtener tarea específica
- `PUT /api/tasks/{id}/` - Actualizar tarea completa
- `PATCH /api/tasks/{id}/` - Actualizar tarea parcialmente
- `DELETE /api/tasks/{id}/` - Eliminar tarea

### 🌐 Autenticación Social
- `/accounts/google/login/` - Login con Google
- `/accounts/github/login/` - Login con GitHub

## Panel de Administración

Accede al panel de administración en: `http://localhost:8000/admin/`

## 📁 Estructura del Proyecto

```
trading-simulator/
├── backend/                    # Configuración principal Django
│   ├── settings.py            # Configuraciones del proyecto
│   ├── urls.py               # URLs principales
│   └── wsgi.py               # WSGI para deployment
├── api/                       # API REST principal
│   ├── models.py             # Modelos de datos
│   ├── views.py              # Vistas de la API
│   ├── serializers.py        # Serializadores DRF
│   └── urls.py               # URLs de la API
├── authentication/            # Sistema de autenticación
│   ├── views.py              # Vistas de auth
│   ├── permissions.py        # Permisos personalizados
│   └── urls.py               # URLs de autenticación
├── backtesting/              # Motor de backtesting
│   ├── models.py             # Modelos de estrategias
│   ├── views.py              # Vistas de backtesting
│   ├── custom_strategy.py    # Estrategias personalizadas
│   └── demo.py               # Demo de backtesting
├── users/                    # Gestión de usuarios
│   ├── models.py             # Modelo de usuario personalizado
│   └── serializers.py        # Serializadores de usuario
├── frontent_oficial/         # Frontend React + Vite
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   ├── contexts/        # Contextos React
│   │   ├── services/        # Servicios API
│   │   └── styles/          # Estilos CSS
│   ├── package.json         # Dependencias Node.js
│   └── vite.config.ts       # Configuración Vite
├── docs/                     # Documentación
├── requirements.txt          # Dependencias Python
├── manage.py                # Utilidad Django
├── start-dev.*              # Scripts de inicio
└── README.md                # Este archivo
```

## 🚀 Próximas Funcionalidades

- [ ] **Simulacion** con indicadores tecnicos
- [ ] **Estadisticas** y simulación de montecarlo
- [ ] **Academy** sección para el aprendizaje
- [ ] **Aplicacion mobil** informacion clave y notificaciones.
- [ ] - [ ] **Alertas y notificaciones** push en tiempo real

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

⭐ **¡Dale una estrella al proyecto si te resulta útil!** ⭐
