# 🚀 CriptoSelf - Plataforma de Trading Algorítmico

Una plataforma completa de trading algorítmico con autenticación avanzada, construida con Django REST Framework y React + Vite.

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

## Características

### 🔐 Sistema de Autenticación
- Autenticación OAuth2 con Django OAuth Toolkit
- Autenticación social (Google, GitHub) con Django Allauth
- Modelo de usuario personalizado con perfiles extendidos
- Gestión de tokens con scopes granulares
- Verificación de email y recuperación de contraseña

### 📊 API y Funcionalidades
- API REST con Django REST Framework
- Sistema de backtesting con Backtrader
- Modelo de tareas (Task) con operaciones CRUD
- Panel de administración personalizado
- Configuración con variables de entorno
- Base de datos SQLite (configurable)

## Instalación

<<<<<<< HEAD
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

### 🎓 Academia de Trading Integrada
- **Programa educativo completo** desde básico hasta avanzado
- **4 módulos estructurados**:
  - Fundamentos del Trading
  - Análisis Técnico
  - Gestión de Riesgo
  - Trading Algorítmico
- **Sistema de evaluación** con quizzes interactivos
- **Progreso gamificado** con desbloqueo progresivo
- **Contenido multimedia** con Markdown, imágenes y videos
- **Certificaciones** al completar módulos
- **Tracking de tiempo** y estadísticas de aprendizaje

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
=======
1. Crear un entorno virtual:
>>>>>>> parent of e3bd815 (actualizacion del README)
```bash
python -m venv venv
```

2. Activar el entorno virtual:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
```

5. Ejecutar migraciones:
```bash
python manage.py makemigrations users
python manage.py makemigrations
python manage.py migrate
```

6. Crear aplicación OAuth2:
```bash
python manage.py create_oauth_app --name "Mi App Frontend"
```

7. Crear superusuario:
```bash
python manage.py createsuperuser
```

<<<<<<< HEAD
9. **Poblar contenido académico**:
```bash
python manage.py populate_lessons
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

3. **Instalar dependencias adicionales**:
```bash
npm install framer-motion react-markdown
```

4. **Configurar variables de entorno**:
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
=======
8. Ejecutar el servidor:
```bash
>>>>>>> parent of e3bd815 (actualizacion del README)
python manage.py runserver
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

### 🎓 Academia de Trading
- `GET /api/lessons/categories/` - Lista de categorías de lecciones
- `GET /api/lessons/categories/{id}/lessons/` - Lecciones por categoría
- `GET /api/lessons/lessons/{id}/` - Detalle de lección específica
- `POST /api/lessons/lessons/{id}/start/` - Iniciar una lección
- `POST /api/lessons/lessons/{id}/progress/` - Actualizar progreso
- `POST /api/lessons/quizzes/{id}/submit/` - Enviar respuestas de quiz
- `GET /api/lessons/progress/summary/` - Resumen de progreso del usuario
- `GET /api/lessons/recommendations/` - Lecciones recomendadas

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

## Estructura del Proyecto

```
<<<<<<< HEAD
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
├── lessons/                  # Sistema académico
│   ├── models.py             # Modelos de lecciones y quizzes
│   ├── views.py              # API de la academia
│   ├── serializers.py        # Serializadores de lecciones
│   ├── admin.py              # Panel de administración
│   └── management/commands/  # Comandos para poblar contenido
├── users/                    # Gestión de usuarios
│   ├── models.py             # Modelo de usuario personalizado
│   └── serializers.py        # Serializadores de usuario
├── frontent_oficial/         # Frontend React + Vite
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Academy.tsx  # Página principal de la academia
│   │   │   ├── CategoryLessons.tsx # Lecciones por categoría
│   │   │   └── LessonDetail.tsx    # Detalle de lección individual
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

- [ ] **Trading con múltiples timeframes** (1m, 5m, 15m, 1h, 4h, 1d)
- [ ] **Alertas y notificaciones** push en tiempo real
- [ ] **Copy trading** y seguimiento de traders exitosos
- [ ] **Análisis técnico avanzado** con más de 50 indicadores
- [ ] **Paper trading competitions** entre usuarios
- [ ] **API para estrategias externas** con webhooks
- [ ] **Mobile app** nativa (React Native)
- [ ] **Integración con más exchanges** (Coinbase, Kraken, etc.)
- [ ] **Machine Learning** para predicción de precios
- [ ] **Social trading** con feed de operaciones

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/trading-simulator/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/trading-simulator/wiki)
- **Email**: soporte@tradingsimulator.com

---

⭐ **¡Dale una estrella al proyecto si te resulta útil!** ⭐
=======
backend/
├── backend/          # Configuración principal del proyecto
├── api/              # App de la API
├── manage.py         # Utilidad de Django
├── requirements.txt  # Dependencias
└── README.md        # Este archivo
```
>>>>>>> parent of e3bd815 (actualizacion del README)
