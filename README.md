# Dictale - Tutorial de Desarrollo Web

Este proyecto es un tutorial que muestra la evolución de una aplicación web (Dictale, un juego de palabras en español) a través de cinco versiones, desde lo más simple hasta una arquitectura full-stack correcta.

## Estructura

```
dictale-learn/
├── data/
│   └── word_list.json     # Diccionario compartido por todas las versiones
├── shared/                 # Código compartido (v1, v3, v4)
├── 00-plain-js/           # Versión 0: HTML/CSS/JS sin build
├── 01-client-side-wrong/  # Versión 1: Vite+React, anti-patrones client-side
├── 02-api-but-exposed/    # Versión 2: API pero definiciones expuestas en cliente
├── 03-js-fullstack/       # Versión 3: Next.js, backend autoritativo
├── 04-python-vite/        # Versión 4: Python FastAPI + Vite frontend
└── py/                    # Scripts para descargar diccionarios (Wiktionary)
```

## Cómo ejecutar cada versión

### Versión 0 - Plain JS
```bash
# Desde la raíz del proyecto, sirve archivos estáticos
npx serve .
# Abre http://localhost:3000/00-plain-js/
```

### Versión 1 - Client-side wrong (Vite)
```bash
cd 01-client-side-wrong
npm install
npm run dev
```

### Versión 2 - API pero definiciones expuestas
```bash
cd 02-api-but-exposed
npm install
npm run dev
```

### Versión 3 - JS Full-stack
```bash
cd 03-js-fullstack
npm install
npm run dev
```

### Versión 4 - Python + Vite
```bash
# Terminal 1 - Backend
cd 04-python-vite/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd 04-python-vite/frontend
npm install
npm run dev
```

## Qué demuestra cada versión

| Versión | Propósito |
|---------|-----------|
| **0** | Baseline: sin frameworks, sin build. Abre `index.html` en el navegador. |
| **1** | Anti-patrones: lista de palabras en cliente, respuesta calculada en cliente, fácil de hacer trampa (DevTools). |
| **2** | Anti-patrón intermedio: la API devuelve la palabra del día, pero las definiciones completas siguen visibles en la respuesta (DevTools > Network). |
| **3** | Arquitectura correcta: el backend valida todo, el cliente solo recibe estado enmascarado. Definiciones nunca salen del servidor. |
| **4** | Misma arquitectura que v3, pero con backend en Python (FastAPI) y frontend en Vite. |

## Requisitos

- Node.js 18+
- Python 3.10+ (solo para v4)
- Para v0: un servidor HTTP local (ej. `npx serve .`)
