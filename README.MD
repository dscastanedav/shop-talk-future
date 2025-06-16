# Shop Talk Future - Voice-Assisted Marketplace

Un marketplace experimental que combina **Supabase**, **Lovable**, **Gemini** y (opcionalmente) **LangChain** para crear una experiencia de compra futurista con asistencia por voz e inteligencia artificial.

---

## Estructura del repositorio

shop-talk-future/\
├── frontend-lovable/          # Código clonado y personalizado desde Lovable\
├── backend-supabase-rag/      # Scripts Python para embeddings, RAG, Gemini\
├── diagrams/                  # Diagramas de arquitectura (actual y futura)\
├── README.md                  # Este archivo\
└── .gitignore


---

## ¿Qué construí?

Una app demo donde los usuarios pueden:

- Ver productos almacenados en Supabase (imagen, nombre, descripción, precio).
- Hablar con un asistente IA impulsado por **Gemini Pro**.
- Recibir recomendaciones personalizadas usando **RAG** y vectores semánticos.
- Interactuar mediante texto (entrada por voz planificada, pero deshabilitada por restricciones de crédito).

---

## Tecnologías usadas

| Área        | Herramienta                 | Descripción                                     |
|-------------|-----------------------------|-------------------------------------------------|
| Frontend    | [Lovable](https://lovable.so) | Plataforma visual para construir la UI         |
| Backend     | [Supabase](https://supabase.com) | Base de datos + Edge Functions + vector store  |
| IA          | [Gemini API](https://aistudio.google.com/app/prompts/new_chat) | Generación de respuestas contextualizadas       |
| IA (extra)  | [LangChain](https://www.langchain.com/) | Recommender opcional basado en vectores        |

---

## Carpetas principales

### `/frontend-lovable`

Frontend construido en Lovable:

- Página principal: muestra productos desde Supabase.
- Botón flotante: activa un modal con input de texto o voz.
- `FloatingAdvisorButton.tsx`: lógica de UI + integración con Gemini.
- `lib/gemini.ts`: conexión segura a través de `Edge Function`.

**Nota:** Por restricciones de crédito, el reconocimiento de voz (`speech-to-text`) está parcialmente implementado y deshabilitado.

---

### `/backend-supabase-rag`

Scripts para:

- Generar embeddings de productos (`embeddings_loader.py`)
- Insertarlos en Supabase
- Hacer RAG con Gemini (`rag_retriever.py`)
- Alternativa con LangChain (`langchain_recommender.py`)

Puedes correr estos scripts localmente. Usa `.env.example` como base para configurar tus claves.

---

## Arquitectura

Diagrama actual del sistema (Gemini + Supabase + Frontend):

[`diagrams/arquitectura_actual.png`](diagrams/arquitectura_actual.png)

Y propuesta mejorada con:

- Grabación de voz real
- Middleware de limpieza
- Memoria de corto/largo plazo
- Diccionario de respuestas comunes

[`diagrams/arquitectura_mejorada.png`](diagrams/arquitectura_mejorada.png)

---

## Cómo probar

### 1. Supabase

- Crea un proyecto
- Crea tabla `products` con columnas: `id`, `name`, `description`, `image_url`, `price`, `embedding`
- Agrega la función `match_documents()` (ver `embeddings_loader.py`)
- Guarda tu clave API y URL

### 2. Entorno local (opcional)

cd backend-supabase-rag
cp .env.example .env  # y completa tus claves
pip install -r requirements.txt
python embeddings_loader.py
python rag_retriever.py  # o langchain_recommender.py


## Demo en video 
Enlaces a la demo en Loom.\
Enlace 1:\
https://www.loom.com/share/8132033033634683a66e9e9d025edb20?sid=b57f240a-96da-420f-bc60-4cdbfe3162d7 \

\
Enlace 2:\
https://www.loom.com/share/e64fe957a89044bb99a9b0da19b1c5d4?sid=f293d646-94ff-4e15-bada-8b1d5f171cf6 \

## Créditos y mejoras propuestas
Este MVP demuestra la viabilidad de integrar tecnologías modernas en un marketplace inteligente.

Si se continuara el desarrollo:

Habilitar entrada por voz real con transcripción.

Añadir memoria contextual por usuario.

Aplicar un diccionario de respuestas almacenadas para reducir costes en Gemini.

Panel de administrador para ver preguntas frecuentes y métricas.

## Licencia
MIT — libre para aprender, mejorar y adaptar.
