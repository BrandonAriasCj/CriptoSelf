# Backend Django con Autenticación Avanzada

Un backend robusto desarrollado con Django, Django REST Framework, OAuth2 y autenticación social.

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

1. Crear un entorno virtual:
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

8. Ejecutar el servidor:
```bash
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
backend/
├── backend/              # Configuración principal del proyecto
├── users/                # Modelo de usuario personalizado y perfiles
├── authentication/       # Sistema de autenticación OAuth2 y social
├── api/                  # App de la API básica (tareas)
├── backtesting/          # Sistema de backtesting con Backtrader
├── docs/                 # Documentación del proyecto
├── manage.py             # Utilidad de Django
├── requirements.txt      # Dependencias
└── README.md            # Este archivo
```

## Autenticación y Uso

### Obtener Token de Acceso
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tu_email@ejemplo.com",
    "password": "tu_contraseña",
    "client_id": "tu_client_id_oauth2",
    "client_secret": "tu_client_secret_oauth2"
  }'
```

### Usar Token en Requests
```bash
curl -H "Authorization: Bearer tu_access_token" \
  http://localhost:8000/api/auth/profile/
```

## Documentación Detallada

- [Sistema de Autenticación](docs/authentication.md) - Guía completa del sistema de autenticación