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