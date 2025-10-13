# Backend Django Básico

Un backend básico desarrollado con Django y Django REST Framework.

## Características

- API REST con Django REST Framework
- Modelo de tareas (Task) con operaciones CRUD
- Panel de administración de Django
- Configuración con variables de entorno
- Base de datos SQLite (por defecto)

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
python manage.py makemigrations
python manage.py migrate
```

6. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

7. Ejecutar el servidor:
```bash
python manage.py runserver
```

## Endpoints de la API

- `GET /api/health/` - Verificar estado de la API
- `GET /api/tasks/` - Listar todas las tareas
- `POST /api/tasks/` - Crear nueva tarea
- `GET /api/tasks/{id}/` - Obtener tarea específica
- `PUT /api/tasks/{id}/` - Actualizar tarea completa
- `PATCH /api/tasks/{id}/` - Actualizar tarea parcialmente
- `DELETE /api/tasks/{id}/` - Eliminar tarea

## Panel de Administración

Accede al panel de administración en: `http://localhost:8000/admin/`

## Estructura del Proyecto

```
backend/
├── backend/          # Configuración principal del proyecto
├── api/              # App de la API
├── manage.py         # Utilidad de Django
├── requirements.txt  # Dependencias
└── README.md        # Este archivo
```
## 🚀 
Inicio Rápido

### Opción 1: Solo Backend (API)
```bash
# 1. Configurar backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# 2. Base de datos
python manage.py makemigrations users
python manage.py migrate

# 3. OAuth2 y admin
python manage.py create_oauth_app --name "API Client"
python manage.py createsuperuser

# 4. Ejecutar
python manage.py runserver
```

### Opción 2: Fullstack (Django + React)
```bash
# 1. Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations users
python manage.py migrate
python manage.py create_oauth_app --name "React Frontend"
python manage.py createsuperuser

# 2. Frontend (nueva terminal)
cd frontend
npm install
cp .env.example .env
# Editar frontend/.env con las credenciales OAuth2
npm start

# 3. Backend (terminal original)
python manage.py runserver
```

### Acceso
- **React App**: http://localhost:3000
- **Django API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## 🔧 Configuración OAuth2

Después de ejecutar `create_oauth_app`, copia las credenciales:

**Backend (.env):**
```env
SECRET_KEY=tu-clave-secreta
DEBUG=True
```

**Frontend (frontend/.env):**
```env
REACT_APP_OAUTH_CLIENT_ID=tu-client-id-aqui
REACT_APP_OAUTH_CLIENT_SECRET=tu-client-secret-aqui
```