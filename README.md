# Antes de Botar

Proyecto para la **Tarea 7** del curso: desarrollar una solución para una de las cuatro pistas del desafío de innovación, con entregable web desplegado y presentación (PPT).

## Pista elegida

**Futuro de los alimentos** — transformar cómo gestionamos, consumimos y evitamos desperdiciar los alimentos mediante tecnologías emergentes.

## Problema que resuelve

El usuario escribe el inventario de su despensa (productos y fechas de vencimiento) y una IA genera:
1. Orden de prioridad de consumo
2. Recetas sugeridas para aprovechar lo que está por vencer
3. Alertas de productos urgentes

## Stack tecnológico

- **Frontend:** React + Vite, Tailwind CSS v4
- **Backend:** Django + Django REST Framework (API REST)
- **IA:** Google Gemini API (SDK `google-genai`, modelo `gemini-3.8-flash`)
- **Base de datos:** SQLite (desarrollo)
- **Despliegue (pendiente):** Render

## Estructura del repo

```
backend_core/   -> configuración del proyecto Django
desperdicio/    -> app Django: modelo, vista y endpoint /api/sugerencias/
frontend/       -> app React (interfaz de usuario)
```

## Cómo correrlo localmente

### Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Requiere un archivo `.env` con `GEMINI_API_KEY=tu_api_key`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Pendiente

- Despliegue en Render (backend + frontend)
- PPT de la exposición
