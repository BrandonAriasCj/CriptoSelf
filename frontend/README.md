# Frontend React TypeScript

Frontend desarrollado en React con TypeScript para el sistema Django con autenticación OAuth2.

## Características

- ✅ React 18 con TypeScript
- ✅ React Router para navegación
- ✅ Context API para gestión de estado de autenticación
- ✅ Axios para comunicación con API
- ✅ Proxy integrado (sin problemas de CORS)
- ✅ Componentes reutilizables
- ✅ Diseño responsive

## Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html          # HTML base
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # Context API
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas principales
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── Backtesting.tsx
│   ├── services/          # Servicios API
│   │   └── api.ts
│   ├── types/             # Tipos TypeScript
│   │   ├── auth.ts
│   │   └── backtesting.ts
│   ├── App.tsx            # Componente principal
│   ├── index.tsx          # Punto de entrada
│   └── index.css          # Estilos globales
├── package.json
├── tsconfig.json
└── README.md
```

## Instalación y Uso

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales OAuth2:
```env
REACT_APP_OAUTH_CLIENT_ID=tu-client-id-oauth2
REACT_APP_OAUTH_CLIENT_SECRET=tu-client-secret-oauth2
```

### 3. Desarrollo
```bash
npm start
```
La aplicación se abrirá en `http://localhost:3000` y se conectará automáticamente al backend Django en `http://localhost:8000` usando el proxy.

### 4. Producción
```bash
# Construir para producción
npm run build

# Los archivos se generarán en build/
# Django los servirá automáticamente
```

## Funcionalidades Implementadas

### 🔐 Autenticación
- **Login tradicional**: Email y contraseña
- **Registro de usuarios**: Formulario completo
- **Autenticación social**: Botones para Google y GitHub
- **Gestión de tokens**: Automática con localStorage
- **Rutas protegidas**: Middleware de autenticación

### 📊 Dashboard
- **Estado de la API**: Verificación de conectividad
- **Información del usuario**: Perfil y configuración
- **Navegación**: Enlaces a todas las funcionalidades

### 📈 Backtesting
- **Demo rápido**: Ejecución con parámetros predeterminados
- **Personalizado**: Configuración de parámetros
- **Resultados**: Visualización detallada de métricas
- **Información de estrategia**: Detalles técnicos

### 🎨 UI/UX
- **Diseño responsive**: Funciona en móvil y desktop
- **Componentes reutilizables**: Botones, formularios, cards
- **Estados de carga**: Spinners y feedback visual
- **Manejo de errores**: Alertas y mensajes informativos

## Servicios API

### AuthService
```typescript
// Login
await authService.login(email, password);

// Registro
await authService.register(userData);

// Perfil
const profile = await authService.getProfile();

// Actualizar perfil
await authService.updateProfile(data);

// Cambiar contraseña
await authService.changePassword(data);

// Logout
await authService.logout();
```

### BacktestingService
```typescript
// Demo
const result = await backtestingService.runDemo();

// Personalizado
const result = await backtestingService.runCustom(params);

// Información de estrategia
const info = await backtestingService.getStrategyInfo();
```

## Context de Autenticación

```typescript
const { 
  user, 
  token, 
  isAuthenticated, 
  isLoading, 
  login, 
  register, 
  logout 
} = useAuth();
```

## Proxy Configuration

El `package.json` incluye:
```json
{
  "proxy": "http://localhost:8000"
}
```

Esto permite que todas las requests a `/api/*` se redirijan automáticamente al backend Django, evitando problemas de CORS.

## Rutas Disponibles

- `/` - Redirige al dashboard
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/dashboard` - Dashboard principal (protegida)
- `/backtesting` - Sistema de backtesting (protegida)

## Integración con Django

### Desarrollo
1. **Backend**: `python manage.py runserver` (puerto 8000)
2. **Frontend**: `npm start` (puerto 3000)
3. **Proxy**: React redirige automáticamente las API calls al backend

### Producción
1. **Build**: `npm run build`
2. **Servir**: Django sirve automáticamente los archivos estáticos
3. **Rutas**: Django maneja tanto API como frontend en el mismo puerto

## Comandos Útiles

```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Linting
npm run lint

# Instalar nueva dependencia
npm install package-name

# Instalar dependencia de desarrollo
npm install -D package-name
```

## Próximas Funcionalidades

- [ ] Página de perfil completa
- [ ] Gestión de tareas (CRUD)
- [ ] Gráficos de backtesting
- [ ] Notificaciones en tiempo real
- [ ] Configuración de estrategias
- [ ] Historial de operaciones
- [ ] Exportar resultados

## Troubleshooting

### Error de CORS
Si ves errores de CORS, verifica que:
1. El proxy esté configurado en `package.json`
2. El backend esté corriendo en puerto 8000
3. Las URLs de API empiecen con `/api/`

### Token expirado
El sistema maneja automáticamente tokens expirados:
1. Detecta respuestas 401
2. Limpia localStorage
3. Redirige a login

### Build no funciona
Si el build de producción no funciona:
1. Verifica que `npm run build` complete sin errores
2. Asegúrate de que Django esté configurado para servir archivos estáticos
3. Revisa que las rutas de Django incluyan el ReactAppView